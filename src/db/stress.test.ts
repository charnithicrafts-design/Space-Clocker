
import { describe, it, expect } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

describe('PGlite Stress Test - Dump and Restore', () => {
  it('should handle large dumps without ERRORDATA_STACK_SIZE exceeded', async () => {
    const db = new PGlite();
    await db.waitReady;
    
    // Create a lot of data
    await db.exec(`
      CREATE TABLE IF NOT EXISTS stress_test (
        id SERIAL PRIMARY KEY,
        data TEXT
      );
    `);
    
    console.log('Inserting 5000 rows...');
    // Use a single transaction for speed
    await db.transaction(async (tx) => {
      for (let i = 0; i < 5000; i++) {
        await tx.query('INSERT INTO stress_test (data) VALUES ($1)', [`item-${i}-${'x'.repeat(100)}`]);
      }
    });
    
    console.log('Dumping database...');
    const blob = await db.dumpDataDir();
    await db.close();
    
    console.log(`Dump size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('Restoring database from dump...');
    // This is where the user reports the error
    const db2 = await PGlite.create({
      loadDataDir: blob
    });
    await db2.waitReady;
    
    const res = await db2.query('SELECT count(*) as count FROM stress_test');
    expect(res.rows[0].count).toBe(5000);
    
    await db2.close();
    console.log('Stress test complete.');
  }, 30000); // 30s timeout
});
