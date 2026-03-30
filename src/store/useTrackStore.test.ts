import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use hoisted to define mock objects that vi.mock will use
const { mockDb, mockSyncService } = vi.hoisted(() => {
  return {
    mockDb: {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      dumpDataDir: vi.fn().mockResolvedValue(new Blob(['test-dump'])),
    },
    mockSyncService: {
      checkDivergence: vi.fn(),
      pullUpdate: vi.fn(),
      pushUpdate: vi.fn(),
      authorize: vi.fn(),
    }
  };
});

// Mock DbClient BEFORE any imports
vi.mock('../db/client', () => ({
  getDb: vi.fn(() => mockDb),
  dumpDb: vi.fn(() => Promise.resolve(new Blob(['test-dump']))),
  restoreDb: vi.fn(() => Promise.resolve()),
}));

// Mock SyncService BEFORE any imports
vi.mock('../services/SyncService', () => ({
  syncService: mockSyncService
}));

import { useTrackStore } from './useTrackStore';

describe('useTrackStore - Communication Array', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    // Reset store state
    useTrackStore.setState({
      profile: { name: 'Valentina', level: 42, title: 'Galactic Voyager' },
      syncStatus: { isSyncing: false, lastSyncedAt: undefined },
      oracleConfig: { apiKey: '', model: 'gemini-1.5-pro', providerUrl: '' },
      ambitions: [],
      tasks: [],
      voids: [],
      reflections: [],
      internships: [],
      skills: [],
      stats: { streak: 0, tasksCompleted: 0, totalFocusHours: 0 },
      preferences: { confirmDelete: true }
    });
    
    mockDb.query.mockResolvedValue({ rows: [] });
  });

  it('should update sync status', () => {
    const store = useTrackStore.getState();
    store.setSyncStatus({ isSyncing: true, error: 'Test Error' });
    
    expect(useTrackStore.getState().syncStatus.isSyncing).toBe(true);
    expect(useTrackStore.getState().syncStatus.error).toBe('Test Error');
  });

  it('should check sync via syncService', async () => {
    const store = useTrackStore.getState();
    vi.mocked(mockSyncService.checkDivergence).mockResolvedValue('remote_newer');
    
    const status = await store.checkSync();
    
    expect(mockSyncService.checkDivergence).toHaveBeenCalled();
    expect(status).toBe('remote_newer');
  });

  it('should perform pull and re-initialize', async () => {
    const store = useTrackStore.getState();
    
    mockDb.query.mockResolvedValueOnce({ rows: [{ remote_file_id: 'remote-123' }] });
    
    // Mock initialize
    const initializeSpy = vi.spyOn(store, 'initialize').mockResolvedValue(undefined);

    await store.performPull();
    
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('SELECT remote_file_id'));
    expect(mockSyncService.pullUpdate).toHaveBeenCalledWith('remote-123');
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should initialize state from database', async () => {
    const store = useTrackStore.getState();
    
    mockDb.query.mockImplementation(async (query: string) => {
      if (query.includes('FROM profile')) return { rows: [{ name: 'Test Pilot', level: 10, title: 'Commander' }] };
      if (query.includes('FROM oracle_config')) return { rows: [{ apiKey: 'key', model: 'm', providerUrl: 'u' }] };
      if (query.includes('FROM preferences')) return { rows: [{ confirmDelete: true }] };
      if (query.includes('FROM stats')) return { rows: [{ streak: 5, tasksCompleted: 10, totalFocusHours: 20 }] };
      return { rows: [] };
    });

    await store.initialize();
    
    const finalState = useTrackStore.getState();
    expect(finalState.profile.name).toBe('Test Pilot');
    expect(finalState.oracleConfig.apiKey).toBe('key');
  });
});
