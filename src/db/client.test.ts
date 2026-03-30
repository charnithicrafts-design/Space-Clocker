import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPGliteConstructor } = vi.hoisted(() => {
  const constructorMock = vi.fn().mockImplementation(function() {
    return {
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      dumpDataDir: vi.fn().mockResolvedValue(new Blob(['test-dump'], { type: 'application/octet-stream' })),
      query: vi.fn().mockResolvedValue({ rows: [] }),
    };
  });
  return {
    mockPGliteConstructor: constructorMock,
  };
});

vi.mock('@electric-sql/pglite', () => {
  return {
    PGlite: mockPGliteConstructor,
  };
});

import { PGlite } from '@electric-sql/pglite';
import * as DbClient from './client';

describe('DbClient', () => {
  beforeEach(() => {
    // We don't clear all mocks because we want to track the initial call during module load if possible,
    // but actually it's better to just test the functionality.
  });

  it('should return the db instance via getDb', () => {
    const db = DbClient.getDb();
    expect(db).toBeDefined();
    expect(typeof db.query).toBe('function');
  });

  it('should dump the database', async () => {
    const db = DbClient.getDb();
    // Mock dumpDataDir on the current instance
    vi.mocked(db.dumpDataDir).mockResolvedValue(new Blob(['specific-dump']));
    
    const blob = await DbClient.dumpDb();
    expect(db.dumpDataDir).toHaveBeenCalled();
    expect(await blob.text()).toBe('specific-dump');
  });

  it('should restore the database from a blob', async () => {
    const mockBlob = new Blob(['restored-data'], { type: 'application/octet-stream' });
    const oldDb = DbClient.getDb();
    
    await DbClient.restoreDb(mockBlob);
    
    const newDb = DbClient.getDb();
    
    expect(oldDb.close).toHaveBeenCalled();
    expect(newDb).not.toBe(oldDb);
    // The constructor should have been called at least twice (one initial, one for restore)
    expect(mockPGliteConstructor).toHaveBeenCalledWith('idb://space-clocker-db', { loadDataDir: mockBlob });
  });
});
