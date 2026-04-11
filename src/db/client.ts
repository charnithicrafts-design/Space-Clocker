import * as Comlink from 'comlink';
import type { DatabaseWorkerAPI } from './db.worker';

// Instantiate the worker
const worker = new Worker(new URL('./db.worker.ts', import.meta.url), {
  type: 'module',
});

// Wrap the worker with Comlink
export const dbProxy = Comlink.wrap<DatabaseWorkerAPI>(worker);

// Expose to window for debugging and E2E testing
if (typeof window !== 'undefined') {
  (window as any).dbProxy = dbProxy;
}

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

if (typeof window !== 'undefined') {
  (window as any).db = db;
}

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
  'pglite-idb-space-clocker-db',
  'opfs-ahp://space-clocker-db'
];

export async function purgeDatabase() {
  console.log('[Client] Initiating temporal purge via worker...');
  
  try {
    await dbProxy.close();
  } catch (e) {
    console.warn('[Client] Error closing database during purge:', e);
  }

  // 1. Purge OPFS if supported
  if (typeof navigator !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage) {
    try {
      console.log('[Client] Attempting to purge OPFS directory: "space-clocker-db"');
      const root = await navigator.storage.getDirectory();
      await root.removeEntry('space-clocker-db', { recursive: true });
      console.log('[Client] Successfully purged OPFS directory.');
    } catch (e) {
      console.warn('[Client] OPFS purge failed (directory might not exist):', e);
    }
  }

  // 2. Purge IndexedDB variations
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
  
  // 1. Perform a thorough temporal purge to clear all existing database fragments
  try {
    await purgeDatabase();
  } catch (e) {
    console.warn('[Client] Warning: Purge encountered minor issues, proceeding with restoration:', e);
  }
  
  // Give browser time to release locks and for the file system to settle
  // Increased from 500 to 1200ms for safety during heavy I/O
  await new Promise(r => setTimeout(r, 1200));

  // 2. Re-initialize worker with blob
  console.log('[Client] Re-initializing database in worker from snapshot...');
  try {
    await dbProxy.init(blob);
    console.log('[Client] Database restoration complete.');
    
    // 3. Close to ensure all data is flushed from memory to persistent storage
    await dbProxy.close();
  } catch (error: any) {
    console.error('[Client] dbProxy.init failed during restoration:', error);
    throw error;
  }
}
