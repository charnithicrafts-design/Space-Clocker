import { PGlite } from '@electric-sql/pglite';

let _db: PGlite | null = null;

export const db = {
  get waitReady() {
    return this.getInstance().waitReady;
  },
  query: (sql: string, params?: any[]) => db.getInstance().query(sql, params) as Promise<any>,
  exec: (sql: string) => db.getInstance().exec(sql) as Promise<any>,
  close: () => db.getInstance().close(),
  dumpDataDir: () => db.getInstance().dumpDataDir(),
  transaction: (callback: (tx: any) => Promise<any>) => db.getInstance().transaction(callback),
  
  getInstance: (): PGlite => {
    if (!_db) {
      console.log('[Database] Initializing PGlite (idb)...');
      
      if (typeof indexedDB === 'undefined') {
        console.error('[Database] IndexedDB not found. Trajectory data cannot be stored.');
        throw new Error('Your browser does not support local database storage (IndexedDB).');
      }

      try {
        _db = new PGlite('idb://space-clocker-db', {
          relaxedDurability: true,
        });
      } catch (err) {
        console.error('[Database] Failed to create PGlite instance:', err);
        throw err;
      }
    }
    return _db;
  },

  // Method to manually replace the instance (used in restoreDb)
  setInstance: (newDb: PGlite | null) => {
    _db = newDb;
  }
};

export function getDb() {
  return db;
}

export async function dumpDb() {
  await db.waitReady;
  return await db.dumpDataDir();
}

/**
 * Common PGlite IndexedDB name variations to target for deletion.
 * PGlite 0.4.x uses 'pglite-' prefix for idb:// driver.
 * Older versions or emscripten IDBFS might use other patterns.
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
  console.log('Initiating temporal purge of all local database fragments...');
  
  if (_db) {
    try {
      await _db.close();
      console.log('Current database connection closed.');
    } catch (e) {
      console.warn('Error closing database during purge:', e);
    }
    _db = null;
  }

  if (typeof indexedDB === 'undefined') {
    console.error('IndexedDB not available for purging.');
    return;
  }

  for (const name of DB_NAME_VARIATIONS) {
    try {
      console.log(`Attempting to delete IndexedDB: "${name}"`);
      await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = () => {
          console.log(`Successfully deleted database: "${name}"`);
          resolve();
        };
        request.onerror = () => {
          console.error(`Error deleting database "${name}":`, request.error);
          resolve(); // Continue with others even on error
        };
        request.onblocked = () => {
          console.warn(`Deletion of database "${name}" is blocked. Close other tabs.`);
          resolve(); // Continue with others
        };
      });
    } catch (e) {
      console.warn(`Failed to process deletion for "${name}":`, e);
    }
  }
  
  console.log('Temporal purge complete.');
}

export async function restoreDb(blob: Blob) {
  console.log('Initiating database restoration from binary snapshot...');
  
  // 1. Close current connection and null it out to prevent use during deletion
  if (_db) {
    try {
      await _db.close();
      console.log('Current database connection closed.');
    } catch (e) {
      console.warn('Error closing database before restoration:', e);
    }
    _db = null;
    // Give browser time to release locks
    await new Promise(r => setTimeout(r, 300));
  }
  
  // 2. Clear all IndexedDB variations to avoid ENOTEMPTY during PGlite.create loadDataDir
  if (typeof indexedDB !== 'undefined') {
    for (const name of DB_NAME_VARIATIONS) {
      console.log(`Clearing DB for restoration: "${name}"`);
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error(`Error deleting database "${name}" during restore:`, request.error);
          resolve(); // Try to continue anyway
        };
        request.onblocked = () => {
          console.warn(`Deletion of database "${name}" is blocked. Restoration likely to fail.`);
          reject(new Error(`Database deletion blocked. Please close other tabs of this application and try again.`));
        };
      });
    }
  }

  // 3. Re-initialize with loadDataDir
  console.log('Re-initializing database from tarball snapshot...');
  try {
    const newDb = await PGlite.create('idb://space-clocker-db', { 
      loadDataDir: blob,
      relaxedDurability: true,
      options: {
        shared_buffers: '4MB'
      }
    });
    
    // Ensure it is ready before proceeding
    await newDb.waitReady;
    db.setInstance(newDb);
    console.log('Database restoration complete and synchronized.');
  } catch (error: any) {
    console.error('PGlite.create failed during restoration:', error);
    // If we get ENOTEMPTY here, it means some directory already existed in the target dir.
    // This happens if PGlite initializes some files before extracting the tarball.
    if (error?.errno === 44 || error?.message?.includes('ENOTEMPTY')) {
      throw new Error(`Restoration failed (ENOTEMPTY). This happens if the database was not fully cleared. Please try "Temporal Purge" first, then restore.`);
    }
    throw error;
  }
}
