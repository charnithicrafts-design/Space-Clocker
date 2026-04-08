import { test as base } from '@playwright/test';
import type { DatabaseWorkerAPI } from '../../../src/db/db.worker';

type PGliteFixtures = {
  db: {
    query: (sql: string, params?: any[]) => Promise<any>;
    exec: (sql: string) => Promise<void>;
    purge: () => Promise<void>;
    restore: (blob: Blob) => Promise<void>;
    dump: () => Promise<Blob>;
  };
};

export const test = base.extend<PGliteFixtures>({
  db: async ({ page }, use) => {
    // 1. Initialize DB proxy in browser context
    const db = {
      query: async (sql: string, params?: any[]) => {
        return await page.evaluate(async ({ sql, params }) => {
          return await (window as any).dbProxy.query(sql, params);
        }, { sql, params });
      },
      exec: async (sql: string) => {
        await page.evaluate(async (sql) => {
          await (window as any).dbProxy.exec(sql);
        }, sql);
      },
      purge: async () => {
        await page.evaluate(async () => {
          // Access purgeDatabase from client if exported or implement inline
          // For safety, we'll use the one attached to window by our earlier edit
          await (window as any).dbProxy.close();
          // Complex purge logic as seen in client.ts
          if (typeof indexedDB !== 'undefined') {
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
            for (const name of DB_NAME_VARIATIONS) {
              indexedDB.deleteDatabase(name);
            }
          }
        });
      },
      restore: async (blob: Blob) => {
        // This is complex as Blobs don't easily cross the page boundary via evaluate
        // We'll skip for this simplified fixture or use a different transport
      },
      dump: async () => {
        return await page.evaluate(async () => {
          return await (window as any).dbProxy.dumpDataDir();
        });
      }
    };

    await use(db);
  },
});

export { expect } from '@playwright/test';
