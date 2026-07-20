import * as Comlink from 'comlink';
import type { DatabaseWorkerAPI } from './db.worker';

// Instantiate the worker
const worker = new Worker(new URL('./db.worker.ts', import.meta.url), {
  type: 'module',
});

// Wrap the worker with Comlink
export const dbProxy = Comlink.wrap<DatabaseWorkerAPI>(worker);

// Track initialization state
let readyPromise: Promise<void> | null = null;

function ensureInit() {
  if (!readyPromise) {
    const forcedStrategy = typeof localStorage !== 'undefined' ? localStorage.getItem('PGlite_FORCED_STRATEGY') : undefined;
    readyPromise = dbProxy.init(forcedStrategy);
  }
  return readyPromise;
}

// Expose to window for debugging and E2E testing
if (typeof window !== 'undefined') {
  (window as any).dbProxy = dbProxy;
  
  // Graceful shutdown on page unload to release OPFS handles
  window.addEventListener('beforeunload', () => {
    dbProxy.close().catch(() => {});
  });
}

// Export a db object that mimics the old API for backward compatibility where possible
export const db = {
  get waitReady() {
    return ensureInit();
  },
  query: async (sql: string, params?: any[]) => {
    await ensureInit();
    const result = await dbProxy.query(sql, params);
    
    // Auto sync on write queries (INSERT, UPDATE, DELETE, etc.)
    const isWrite = /^\s*(insert|update|delete|replace|alter|create|drop)/i.test(sql);
    // Ignore updates to sync_metadata or devices to prevent infinite sync loops
    const isSyncOrDeviceWrite = /sync_metadata|devices/i.test(sql);
    
    if (isWrite && !isSyncOrDeviceWrite && typeof window !== 'undefined') {
      import('../store/useTrackStore').then(({ useTrackStore }) => {
        const store = useTrackStore.getState();
        if (store.triggerBackgroundSync) {
          store.triggerBackgroundSync();
        }
        if (store.recalculateCognitiveSync) {
          store.recalculateCognitiveSync();
        }
      }).catch(() => {});
    }
    return result;
  },
  exec: async (sql: string) => {
    await ensureInit();
    const result = await dbProxy.exec(sql);
    
    // Auto sync on exec writes
    const isWrite = /^\s*(insert|update|delete|replace|alter|create|drop)/i.test(sql);
    const isSyncOrDeviceWrite = /sync_metadata|devices/i.test(sql);
    
    if (isWrite && !isSyncOrDeviceWrite && typeof window !== 'undefined') {
      import('../store/useTrackStore').then(({ useTrackStore }) => {
        const store = useTrackStore.getState();
        if (store.triggerBackgroundSync) {
          store.triggerBackgroundSync();
        }
        if (store.recalculateCognitiveSync) {
          store.recalculateCognitiveSync();
        }
      }).catch(() => {});
    }
    return result;
  },
  close: async () => {
    await dbProxy.close();
    readyPromise = null;
  },

  transaction: async (callback: (tx: any) => Promise<any>) => {
    await ensureInit();
    return dbProxy.transaction(callback);
  },
  
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

  // We skip IndexedDB variations since they were deleted in a previous refactor
}
