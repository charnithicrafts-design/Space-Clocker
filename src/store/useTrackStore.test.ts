import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTrackStore } from './useTrackStore';
import * as DbClient from '../db/client';
import { syncService } from '../services/SyncService';

// Mock DbClient
vi.mock('../db/client', () => ({
  getDb: vi.fn().mockReturnValue({
    query: vi.fn().mockResolvedValue({ rows: [] }),
  }),
  dumpDb: vi.fn().mockResolvedValue(new Blob(['test-dump'])),
  restoreDb: vi.fn().mockResolvedValue(undefined),
}));

// Mock SyncService
vi.mock('../services/SyncService', () => ({
  syncService: {
    checkDivergence: vi.fn(),
    pullUpdate: vi.fn(),
    pushUpdate: vi.fn(),
    authorize: vi.fn(),
  }
}));

describe('useTrackStore - Communication Array', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state if needed, though zustand store persists in memory during tests
    useTrackStore.setState({
      syncStatus: { isSyncing: false, lastSyncedAt: undefined },
      oracleConfig: { apiKey: '', model: 'gemini-1.5-pro', providerUrl: '' }
    });
  });

  it('should update sync status', () => {
    const store = useTrackStore.getState();
    store.setSyncStatus({ isSyncing: true, error: 'Test Error' });
    
    expect(useTrackStore.getState().syncStatus.isSyncing).toBe(true);
    expect(useTrackStore.getState().syncStatus.error).toBe('Test Error');
  });

  it('should check sync via syncService', async () => {
    const store = useTrackStore.getState();
    vi.mocked(syncService.checkDivergence).mockResolvedValue('remote_newer');
    
    const status = await store.checkSync();
    
    expect(syncService.checkDivergence).toHaveBeenCalled();
    expect(status).toBe('remote_newer');
  });

  it('should perform pull and re-initialize', async () => {
    const store = useTrackStore.getState();
    const db = DbClient.getDb();
    vi.mocked(db.query).mockResolvedValueOnce({ rows: [{ remote_file_id: 'remote-123' }] });
    
    // Mock initialize to verify it's called
    const initializeSpy = vi.spyOn(store, 'initialize').mockResolvedValue(undefined);

    await store.performPull();
    
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT remote_file_id'));
    expect(syncService.pullUpdate).toHaveBeenCalledWith('remote-123');
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should initialize state from database', async () => {
    const store = useTrackStore.getState();
    const db = DbClient.getDb();
    
    vi.mocked(db.query).mockImplementation(async (query: string) => {
      if (query.includes('FROM profile')) return { rows: [{ name: 'Test Pilot', level: 10, title: 'Commander' }] };
      if (query.includes('FROM oracle_config')) return { rows: [{ api_key: 'key', model: 'm', provider_url: 'u' }] };
      return { rows: [] };
    });

    await store.initialize();
    
    expect(useTrackStore.getState().profile.name).toBe('Test Pilot');
    expect(useTrackStore.getState().oracleConfig.apiKey).toBe('key');
  });
});
