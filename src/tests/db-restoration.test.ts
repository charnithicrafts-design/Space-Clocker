
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

describe('PGlite Database Restoration Reliability', () => {
  it('should restore a database from a blob snapshot correctly', async () => {
    console.log('[Test] Starting restoration test');
    // 1. Setup Source DB
    const db1 = new PGlite();
    await db1.waitReady;
    console.log('[Test] Source DB ready');
    await db1.exec(`
      CREATE TABLE test (id SERIAL PRIMARY KEY, val TEXT);
      INSERT INTO test (val) VALUES ('nebula');
    `);
    
    // 2. Create Snapshot
    const dump = await db1.dumpDataDir();
    await db1.close();
    console.log('[Test] Snapshot created');
    
    expect(dump).toBeInstanceOf(Blob);
    expect(dump.size).toBeGreaterThan(0);
    
    // 3. Setup Target DB from Snapshot
    const db2 = await PGlite.create({
      loadDataDir: dump
    });
    console.log('[Test] Target DB creation initiated');
    await db2.waitReady;
    console.log('[Test] Target DB ready');
    
    const res = await db2.query('SELECT val FROM test');
    expect(res.rows[0].val).toBe('nebula');
    
    await db2.close();
    console.log('[Test] Restoration test complete');
  }, 20000);

  it('should handle "Temporal Rift" scenarios (consecutive restoration)', async () => {
    // This simulates rapid restoreDb calls which might cause race conditions
    const db1 = new PGlite('memory://db1');
    await db1.waitReady;
    await db1.exec('CREATE TABLE rifts (id SERIAL PRIMARY KEY, code TEXT)');
    await db1.query('INSERT INTO rifts (code) VALUES ($1)', ['ALPHA']);
    const dumpA = await db1.dumpDataDir();
    
    await db1.query('UPDATE rifts SET code = $1 WHERE id = 1', ['BETA']);
    const dumpB = await db1.dumpDataDir();
    await db1.close();

    // Restoration 1
    const dbR1 = await PGlite.create('memory://db-r1', { loadDataDir: dumpA });
    await dbR1.waitReady;
    const res1 = await dbR1.query('SELECT code FROM rifts');
    expect(res1.rows[0].code).toBe('ALPHA');
    await dbR1.close();

    // Restoration 2
    const dbR2 = await PGlite.create('memory://db-r2', { loadDataDir: dumpB });
    await dbR2.waitReady;
    const res2 = await dbR2.query('SELECT code FROM rifts');
    expect(res2.rows[0].code).toBe('BETA');
    await dbR2.close();
  }, 20000);
});
