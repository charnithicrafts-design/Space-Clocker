import * as Comlink from 'comlink';
import type { DatabaseWorkerAPI } from './db.worker';

// Instantiate the worker
const worker = new Worker(new URL('./db.worker.ts', import.meta.url), {
  type: 'module',
});

// Wrap the worker with Comlink
export const dbProxy = Comlink.wrap<DatabaseWorkerAPI>(worker);

// Export a db object that mimics the old API for backward compatibility where possible
export const db = {
  get waitReady() {
    // We can't easily wait for the worker to be ready here without making it an async getter
    // which JS doesn't support. We'll return the init promise instead.
    return dbProxy.init();
  },
  query: (sql: string, params?: any[]) => dbProxy.query(sql, params) as Promise<any>,
  exec: (sql: string) => dbProxy.exec(sql),
  close: () => dbProxy.close(),
  dumpDataDir: () => dbProxy.dumpDataDir(),
  transaction: (callback: (tx: any) => Promise<any>) => dbProxy.transaction(callback),
  
  // These are specific to the old PGlite instance and might need refactoring in the UI
  getInstance: () => {
    throw new Error('getInstance() is not supported with the Web Worker proxy. Use dbProxy directly.');
  },
  setInstance: () => {
    throw new Error('setInstance() is not supported with the Web Worker proxy.');
  }
};

export function getDb() {
  return db;
}

export async function dumpDb() {
  return await dbProxy.dumpDataDir();
}

/**
 * Common PGlite IndexedDB name variations to target for deletion.
 */
const DB_NAME_VARIATIONS = [
  'space-clocker-db', 
  'pglite-space-clocker-db',
  '/pglite/space-clocker-db', 
  'pglite/space-clocker-db',
  'idb://space-clocker-db',
  '/pglite/idb://space-clocker-db',
  'pglite-idb://space-clocker-db',
  'pglite-idb-space-clocker-db'
];

export async function purgeDatabase() {
  console.log('[Client] Initiating temporal purge via worker...');
  
  try {
    await dbProxy.close();
  } catch (e) {
    console.warn('[Client] Error closing database during purge:', e);
  }

  if (typeof indexedDB === 'undefined') {
    console.error('IndexedDB not available for purging.');
    return;
  }

  for (const name of DB_NAME_VARIATIONS) {
    try {
      console.log(`[Client] Attempting to delete IndexedDB: "${name}"`);
      await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = () => {
          console.log(`[Client] Successfully deleted database: "${name}"`);
          resolve();
        };
        request.onerror = () => {
          console.error(`[Client] Error deleting database "${name}":`, request.error);
          resolve();
        };
        request.onblocked = () => {
          console.warn(`[Client] Deletion of database "${name}" is blocked. Close other tabs.`);
          resolve();
        };
      });
    } catch (e) {
      console.warn(`[Client] Failed to process deletion for "${name}":`, e);
    }
  }
  
  console.log('[Client] Temporal purge complete.');
}

export async function restoreDb(blob: Blob) {
  console.log('[Client] Initiating database restoration via worker...');
  
  // 1. Close current connection via worker
  try {
    await dbProxy.close();
  } catch (e) {
    console.warn('[Client] Error closing database before restoration:', e);
  }
  
  // Give browser time to release locks
  await new Promise(r => setTimeout(r, 300));
  
  // 2. Clear all IndexedDB variations
  if (typeof indexedDB !== 'undefined') {
    for (const name of DB_NAME_VARIATIONS) {
      console.log(`[Client] Clearing DB for restoration: "${name}"`);
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error(`[Client] Error deleting database "${name}" during restore:`, request.error);
          resolve();
        };
        request.onblocked = () => {
          console.warn(`[Client] Deletion of database "${name}" is blocked.`);
          reject(new Error(`Database deletion blocked. Please close other tabs of this application and try again.`));
        };
      });
    }
  }

  // 3. Re-initialize worker with blob
  console.log('[Client] Re-initializing database in worker from snapshot...');
  try {
    await dbProxy.init(blob);
    console.log('[Client] Database restoration complete.');
  } catch (error: any) {
    console.error('[Client] dbProxy.init failed during restoration:', error);
    throw error;
  }
}
