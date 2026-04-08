import { db } from './client';

export async function initDb() {
  console.log('[System] Initializing database via worker proxy...');
  // This calls dbProxy.init() via the getter in client.ts
  await db.waitReady;
  console.log('[System] Stellar database online (Worker).');
}
