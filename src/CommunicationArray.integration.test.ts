import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncService } from './services/SyncService';
import { useTrackStore } from './store/useTrackStore';
import * as DbClient from './db/client';

/**
 * HIGH-FIDELITY INTEGRATION TEST: COMMUNICATION ARRAY
 * 
 * Verifies the end-to-end data trajectory:
 * Store <-> DB <-> SyncService <-> Remote Command (Mocked Fetch)
 * 
 * Specifically focuses on "Temporal Rift" (Sync Divergence) detection and resolution.
 */

// Mock Fetch for Remote Command Simulation
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Realistic Database Mock with State Tracking
let mockDbState = {
  sync_metadata: null as any,
  ambitions: [] as any[],
  profile: { name: 'Valentina', level: 1, xp: 0, title: 'Galactic Voyager' }
};

const mockDb = {
  query: vi.fn().mockImplementation(async (q, params) => {
    // Simulate Metadata Ops
    if (q.includes('INSERT INTO sync_metadata')) {
      mockDbState.sync_metadata = {
        last_synced_at: new Date().toISOString(),
        remote_file_id: params[0]
      };
      return { rows: [] };
    }
    if (q.includes('SELECT last_synced_at')) {
      const lastSynced = mockDbState.sync_metadata?.last_synced_at || '1970-01-01T00:00:00Z';
      return { rows: [{ last_synced_at: lastSynced }] };
    }
    if (q.includes('SELECT remote_file_id')) {
      return { rows: [{ remote_file_id: mockDbState.sync_metadata?.remote_file_id }] };
    }
    
    // Simulate Profile Ops
    if (q.includes('SELECT name, level, xp, title FROM profile')) {
      return { rows: [mockDbState.profile] };
    }

    // Default empty rows
    return { rows: [] };
  }),
  waitReady: Promise.resolve(),
  close: vi.fn().mockResolvedValue(undefined),
  dumpDataDir: vi.fn().mockResolvedValue(new Blob(['nebula-db-snapshot'])),
};

vi.mock('./db/client', () => ({
  getDb: () => mockDb,
  dumpDb: () => mockDb.dumpDataDir(),
  restoreDb: vi.fn().mockImplementation(async (blob) => {
    // Simulate restoring state from a remote snapshot
    mockDbState.sync_metadata = {
      last_synced_at: new Date().toISOString(),
      remote_file_id: 'remote-id-nebula-9'
    };
  }),
}));

describe('Communication Array - High-Fidelity Integration Cycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbState = {
      sync_metadata: null,
      ambitions: [],
      profile: { name: 'Commander Shepard', level: 50, xp: 9000, title: 'Spectre' }
    };
    (syncService as any).provider.setToken('ALPHA-NEBULA-TRANSMISSION-KEY');
  });

  it('should detect and resolve a "Temporal Rift" in the data trajectory', async () => {
    // --- ARRANGE ---
    // 1. Initial Local State: Commander is on a mission to Virmire.
    const store = useTrackStore.getState();
    vi.spyOn(store, 'initialize').mockResolvedValue(undefined);

    // 2. Mock Remote: No cloud backup exists yet.
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ files: [] }) }); // getMetadata check
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 'remote-id-virmire-01' }) }); // upload response

    // --- ACT (Phase 1: Uplink Transmission) ---
    // Push the current mission state to the cloud.
    const pushResult = await syncService.pushUpdate();

    // --- ASSERT (Phase 1) ---
    expect(pushResult.fileId).toBe('remote-id-virmire-01');
    expect(mockDbState.sync_metadata.remote_file_id).toBe('remote-id-virmire-01');
    expect(fetchMock).toHaveBeenCalledTimes(2); // 1 check + 1 upload

    // --- ACT (Phase 2: Detect Temporal Rift) ---
    // Simulate a "Temporal Rift": A newer transmission exists on the remote terminal (e.g., from the Citadel).
    fetchMock.mockReset();
    fetchMock.mockResolvedValueOnce({ 
      ok: true, 
      json: () => Promise.resolve({ 
        files: [{ 
          id: 'remote-id-virmire-01', 
          modifiedTime: '2183-11-07T00:00:00Z' // A date far in the future
        }] 
      }) 
    });

    const divergence = await syncService.checkDivergence();

    // --- ASSERT (Phase 2) ---
    expect(divergence).toBe('remote_newer'); // Temporal Rift Detected!

    // --- ACT (Phase 3: Resolve Rift via Downlink) ---
    // Resolve the rift by pulling the newer trajectory from the remote terminal.
    fetchMock.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['citadel-encoded-data']))
    });
    
    await store.performPull();

    // --- ASSERT (Phase 3) ---
    // Verify high-fidelity resolution steps:
    // 1. Remote data was fetched.
    expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('remote-id-virmire-01'), 
        expect.objectContaining({ headers: { Authorization: expect.stringContaining('ALPHA-NEBULA') } })
    );
    // 2. Local Database was re-initialized from the remote blob.
    expect(DbClient.restoreDb).toHaveBeenCalled();
    // 3. Store was refreshed from the new DB state.
    expect(store.initialize).toHaveBeenCalled();
  });

  it('should report "synced" status when local trajectory matches remote terminal', async () => {
    // --- ARRANGE ---
    // Mock local metadata timestamp
    mockDbState.sync_metadata = {
      last_synced_at: '2024-05-20T12:00:00Z',
      remote_file_id: 'remote-id-omega-4'
    };

    // Mock Remote: Remote file is OLDER than local (or same age)
    fetchMock.mockResolvedValueOnce({ 
      ok: true, 
      json: () => Promise.resolve({ 
        files: [{ 
          id: 'remote-id-omega-4', 
          modifiedTime: '2024-05-20T11:59:59Z' // 1 second older
        }] 
      }) 
    });

    // --- ACT ---
    const divergence = await syncService.checkDivergence();

    // --- ASSERT ---
    expect(divergence).toBe('synced');
  });
});
