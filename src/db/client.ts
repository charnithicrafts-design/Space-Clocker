import { PGlite } from '@electric-sql/pglite';

export let db = new PGlite('idb://space-clocker-db');

export function getDb() {
  return db;
}

export async function dumpDb() {
  await db.waitReady;
  return await db.dumpDataDir();
}

export async function restoreDb(blob: Blob) {
  await db.close();
  
  // Clear the existing IndexedDB database before re-initializing with a tarball
  // as PGlite fails to load from a tarball if the target already exists.
  if (typeof indexedDB !== 'undefined') {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('space-clocker-db');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete existing database for restoration'));
    });
  }

  db = new PGlite('idb://space-clocker-db', { loadDataDir: blob });
  await db.waitReady;
}
