import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncService } from './services/SyncService';
import { useTrackStore } from './store/useTrackStore';
import * as DbClient from './db/client';

// This test simulates a full high-level cycle of the Communication Array
// without hitting real network or IndexedDB.

// Mock fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock DbClient with in-memory state simulation
let mockDbState: any = {};
const mockDb = {
  query: vi.fn().mockImplementation(async (q, params) => {
    if (q.includes('INSERT INTO sync_metadata')) {
      mockDbState.last_synced_at = new Date().toISOString();
      mockDbState.remote_file_id = params[0];
    }
    if (q.includes('SELECT last_synced_at')) {
      return { rows: [{ last_synced_at: mockDbState.last_synced_at || '1970-01-01T00:00:00Z' }] };
    }
    if (q.includes('SELECT remote_file_id')) {
      return { rows: [{ remote_file_id: mockDbState.remote_file_id }] };
    }
    return { rows: [] };
  }),
  waitReady: Promise.resolve(),
  close: vi.fn().mockResolvedValue(undefined),
  dumpDataDir: vi.fn().mockResolvedValue(new Blob(['in-memory-dump'])),
};

vi.mock('./db/client', () => ({
  getDb: () => mockDb,
  dumpDb: () => mockDb.dumpDataDir(),
  restoreDb: vi.fn().mockImplementation(async (blob) => {
    mockDbState.last_synced_at = new Date().toISOString(); // Simulate restore updating metadata
  }),
}));

describe('Communication Array - High-Fidelity Integration Cycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbState = {};
    (syncService as any).provider.setToken('mock-token');
  });

  it('should complete a push -> check -> pull cycle', async () => {
    // 1. PUSH
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ files: [] }) }); // getMetadata
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ id: 'remote-id-123' }) }); // upload
    
    const pushResult = await syncService.pushUpdate();
    expect(pushResult.fileId).toBe('remote-id-123');
    expect(mockDbState.remote_file_id).toBe('remote-id-123');

    // 2. CHECK (No divergence yet)
    fetchMock.mockResolvedValueOnce({ 
      json: () => Promise.resolve({ 
        files: [{ id: 'remote-id-123', modifiedTime: new Date().toISOString() }] 
      }) 
    });
    
    let divergence = await syncService.checkDivergence();
    // Since push just happened, local last_synced_at is roughly same as remote modifiedTime
    // Depending on timing, it might be 'synced' or 'remote_newer'. 
    // Let's force it to 'synced' by mocking the remote date to be older than local.
    fetchMock.mockReset();
    fetchMock.mockResolvedValueOnce({ 
        json: () => Promise.resolve({ 
          files: [{ id: 'remote-id-123', modifiedTime: '2020-01-01T00:00:00Z' }] 
        }) 
    });
    divergence = await syncService.checkDivergence();
    expect(divergence).toBe('synced');

    // 3. REMOTE UPDATED (Divergence detected)
    fetchMock.mockResolvedValueOnce({ 
      json: () => Promise.resolve({ 
        files: [{ id: 'remote-id-123', modifiedTime: '2099-01-01T00:00:00Z' }] 
      }) 
    });
    divergence = await syncService.checkDivergence();
    expect(divergence).toBe('remote_newer');

    // 4. PULL
    fetchMock.mockResolvedValueOnce({
      blob: () => Promise.resolve(new Blob(['remote-data']))
    });
    
    const store = useTrackStore.getState();
    vi.spyOn(store, 'initialize').mockResolvedValue(undefined);
    
    await store.performPull();
    
    expect(DbClient.restoreDb).toHaveBeenCalled();
    expect(store.initialize).toHaveBeenCalled();
  });
});
