import { PGlite } from '@electric-sql/pglite';

let _db: PGlite | null = null;

export const db = {
  get waitReady() {
    return this.getInstance().waitReady;
  },
  query: (...args: any[]) => (db.getInstance().query as any)(...args),
  exec: (...args: any[]) => (db.getInstance().exec as any)(...args),
  close: (...args: any[]) => (db.getInstance().close as any)(...args),
  dumpDataDir: (...args: any[]) => (db.getInstance().dumpDataDir as any)(...args),
  transaction: (...args: any[]) => (db.getInstance().transaction as any)(...args),
  
  getInstance: (): PGlite => {
    if (!_db) {
      console.log('[Database] Initializing PGlite (idb)...');
      try {
        _db = new PGlite('idb://space-clocker-db', {
          relaxedDurability: true
        });
      } catch (err) {
        console.error('[Database] Failed to create PGlite instance:', err);
        throw err;
      }
    }
    return _db;
  },

  // Method to manually replace the instance (used in restoreDb)
  setInstance: (newDb: PGlite) => {
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

export async function restoreDb(blob: Blob) {
  console.log('Initiating database restoration from binary snapshot...');
  
  // Close the current database connection to release IndexedDB locks.
  // This is critical for successful deletion.
  if (_db) {
    await _db.close();
    console.log('Current database connection closed.');
    // Give a small grace period for the connection to be fully released by the browser/PGlite.
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Clear the existing IndexedDB database before re-initializing with a tarball
  // as PGlite fails to load from a tarball if the target already exists.
  if (typeof indexedDB !== 'undefined') {
    // PGlite uses specific naming conventions for IndexedDB depending on version/config.
    // We attempt to delete all common variations to ensure a clean slate.
    const dbNames = [
      'space-clocker-db', 
      '/pglite/space-clocker-db', 
      'pglite-space-clocker-db',
      'pglite/space-clocker-db',
      'idb://space-clocker-db',
      '/pglite/idb://space-clocker-db'
    ];
    
    for (const name of dbNames) {
      console.log(`Attempting to delete IndexedDB: "${name}"`);
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(name);
        
        request.onsuccess = () => {
          console.log(`Successfully deleted database: "${name}"`);
          resolve();
        };
        
        request.onerror = () => {
          console.error(`Error deleting database "${name}":`, request.error);
          reject(new Error(`Failed to delete database ${name}: ${request.error}`));
        };
        
        request.onblocked = () => {
          console.warn(`Deletion of database "${name}" is blocked by another connection.`);
          // If blocked, we cannot proceed as creation will fail.
          reject(new Error(`Database deletion blocked. Please close other tabs of this application and try again.`));
        };
      });
    }
  }

  // Use the static PGlite.create method for re-initialization with loadDataDir.
  // This is the recommended modern API for loading from a tarball.
  console.log('Re-initializing database from tarball...');
  try {
    const newDb = await PGlite.create('idb://space-clocker-db', { 
      loadDataDir: blob,
      relaxedDurability: true
    });
    db.setInstance(newDb);
    console.log('Database restoration complete and ready.');
  } catch (error: any) {
    console.error('PGlite.create failed during restoration:', error);
    // If it still fails with "already exists", we might want to try one more thing or just re-throw.
    throw error;
  }
}
