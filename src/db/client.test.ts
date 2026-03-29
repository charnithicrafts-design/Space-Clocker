import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import * as DbClient from './client';

// Mock PGlite
vi.mock('@electric-sql/pglite', () => {
  return {
    PGlite: vi.fn().mockImplementation(() => ({
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      dumpDataDir: vi.fn().mockResolvedValue(new Blob(['test-dump'], { type: 'application/octet-stream' })),
      query: vi.fn().mockResolvedValue({ rows: [] }),
    })),
  };
});

describe('DbClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the db instance via getDb', () => {
    const db = DbClient.getDb();
    expect(db).toBeDefined();
    expect(PGlite).toHaveBeenCalled();
  });

  it('should dump the database', async () => {
    const blob = await DbClient.dumpDb();
    const db = DbClient.getDb();
    
    expect(db.dumpDataDir).toHaveBeenCalled();
    expect(blob).toBeInstanceOf(Blob);
    const text = await blob.text();
    expect(text).toBe('test-dump');
  });

  it('should restore the database from a blob', async () => {
    const mockBlob = new Blob(['restored-data'], { type: 'application/octet-stream' });
    const oldDb = DbClient.getDb();
    
    await DbClient.restoreDb(mockBlob);
    
    const newDb = DbClient.getDb();
    
    expect(oldDb.close).toHaveBeenCalled();
    expect(PGlite).toHaveBeenCalledWith('idb://space-clocker-db', { loadDataDir: mockBlob });
    expect(newDb).not.toBe(oldDb);
  });
});
