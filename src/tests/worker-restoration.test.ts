import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { api } from '../db/db.worker';

// Mock PGlite
vi.mock('@electric-sql/pglite', () => ({
  PGlite: {
    create: vi.fn(),
  },
}));

// Mock Comlink
vi.mock('comlink', () => ({
  expose: vi.fn(),
}));

// Mock browser APIs
const mockRemoveEntry = vi.fn();
const mockGetDirectory = vi.fn();

describe('PGlite Web Worker Restoration Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Ensure we start with a fresh state by closing existing db
    api.close();

    // Mock navigator.storage
    global.navigator = {
      storage: {
        getDirectory: mockGetDirectory,
      },
    } as any;

    mockGetDirectory.mockResolvedValue({
      getDirectoryHandle: vi.fn().mockRejectedValue(new Error('Not found')),
      removeEntry: mockRemoveEntry,
    });

    // Mock indexedDB
    global.indexedDB = {
      open: vi.fn().mockImplementation(() => {
        const req = { onsuccess: null, onerror: null, result: { objectStoreNames: [], close: vi.fn() } };
        setTimeout(() => { 
          if (req.onsuccess) (req as any).onsuccess({ target: req }); 
        }, 0);
        return req;
      }),
      deleteDatabase: vi.fn().mockImplementation(() => {
        const req = { onsuccess: null, onerror: null };
        setTimeout(() => { if (req.onsuccess) (req as any).onsuccess(); }, 0);
        return req;
      }),
    } as any;
    
    // Mock console to allow seeing logs during debug
    vi.spyOn(console, 'log').mockImplementation((...args) => {
      process.stdout.write(`[LOG] ${args.join(' ')}\n`);
    });
    vi.spyOn(console, 'warn').mockImplementation((...args) => {
      process.stdout.write(`[WARN] ${args.join(' ')}\n`);
    });
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      process.stdout.write(`[ERROR] ${args.join(' ')}\n`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('[P0] AC-1: should purge existing storage and retry when "Database already exists" error occurs during restoration', async () => {
    const mockDb = {
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({ rows: [{ current: 0 }] }),
      exec: vi.fn().mockResolvedValue(undefined),
      transaction: vi.fn(async (cb) => {
        return await cb({
          exec: vi.fn().mockResolvedValue(undefined),
          query: vi.fn().mockResolvedValue({ rows: [] }),
        });
      }),
    };

    // First call throws "Database already exists", second call succeeds
    (PGlite.create as any)
      .mockRejectedValueOnce(new Error('Database already exists'))
      .mockResolvedValueOnce(mockDb);

    const dump = new Blob(['test-dump'], { type: 'application/octet-stream' });
    
    // Trigger initialization with a blob (restoration)
    await api.init(dump);

    // Verify PGlite.create was called twice
    expect(PGlite.create).toHaveBeenCalledTimes(2);
    
    // Verify purge was attempted (removeEntry is called in OPFS path)
    expect(mockRemoveEntry).toHaveBeenCalled();
  }, 10000);

  it('[P0] AC-2: should retry up to 3 times with backoff when OPFS throws NoModificationAllowedError', async () => {
    const mockDb = {
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({ rows: [{ current: 0 }] }),
      exec: vi.fn().mockResolvedValue(undefined),
      transaction: vi.fn(async (cb) => {
        return await cb({
          exec: vi.fn().mockResolvedValue(undefined),
          query: vi.fn().mockResolvedValue({ rows: [] }),
        });
      }),
    };

    const lockError = new Error('Lock error');
    lockError.name = 'NoModificationAllowedError';

    // Throw lock error twice, then succeed on 3rd attempt
    (PGlite.create as any)
      .mockRejectedValueOnce(lockError)
      .mockRejectedValueOnce(lockError)
      .mockResolvedValueOnce(mockDb);

    await api.init();

    // Verify PGlite.create was called 3 times total
    expect(PGlite.create).toHaveBeenCalledTimes(3);
  }, 10000);

  it('[P0] AC-4: should purge and retry when ErrnoError 20 (ENOTDIR) occurs during initialization', async () => {
    const mockDb = {
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({ rows: [{ current: 0 }] }),
      exec: vi.fn().mockResolvedValue(undefined),
      transaction: vi.fn(async (cb) => {
        return await cb({
          exec: vi.fn().mockResolvedValue(undefined),
          query: vi.fn().mockResolvedValue({ rows: [] }),
        });
      }),
    };

    const structuralError: any = new Error('ENOTDIR');
    structuralError.name = 'ErrnoError';
    structuralError.errno = 20;

    // First call throws structural error, second succeeds after purge
    (PGlite.create as any)
      .mockRejectedValueOnce(structuralError)
      .mockResolvedValueOnce(mockDb);

    await api.init();

    // Verify PGlite.create was called twice
    expect(PGlite.create).toHaveBeenCalledTimes(2);
    
    // Verify purge was attempted
    expect(mockRemoveEntry).toHaveBeenCalled();
  }, 10000);
});
