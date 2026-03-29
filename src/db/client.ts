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
  db = new PGlite('idb://space-clocker-db', { loadDataDir: blob });
  await db.waitReady;
}
