import { describe, it, expect, vi, beforeEach } from 'vitest';

// Strategic Mocking: Use hoisted to define mock objects for architectural seams (DB and External Services)
const { mockDb, mockSyncService } = vi.hoisted(() => {
  return {
    mockDb: {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      dumpDataDir: vi.fn().mockResolvedValue(new Blob(['void-data-dump'])),
    },
    mockSyncService: {
      checkDivergence: vi.fn(),
      pullUpdate: vi.fn(),
      pushUpdate: vi.fn(),
      authorize: vi.fn(),
    }
  };
});

// Mock External Seams BEFORE any imports to ensure store uses controlled mocks
vi.mock('../db/client', () => ({
  getDb: vi.fn(() => mockDb),
  dumpDb: vi.fn(() => Promise.resolve(new Blob(['void-data-dump']))),
  restoreDb: vi.fn(() => Promise.resolve()),
}));

vi.mock('../services/SyncService', () => ({
  syncService: mockSyncService
}));

import { useTrackStore } from './useTrackStore';
import { getTodayLocalISO } from '../utils/DateTimeUtils';

describe('useTrackStore - Mission Control Store', () => {
  beforeEach(() => {
    // Isolated State: Reset store and mocks before each mission sortie
    vi.restoreAllMocks();
    vi.clearAllMocks();
    
    useTrackStore.setState({
      profile: { name: 'Valentina', level: 42, title: 'Galactic Voyager', xp: 0 },
      syncStatus: { isSyncing: false, lastSyncedAt: undefined },
      oracleConfig: { 
        apiKey: '', 
        model: 'gemini-1.5-pro', 
        providerUrl: 'https://generativelanguage.googleapis.com/v1beta/openai' 
      },
      ambitions: [],
      tasks: [],
      voids: [],
      reflections: [],
      internships: [],
      skills: [],
      transmissions: [],
      stats: { streak: 0, tasksCompleted: 0, totalFocusHours: 0 },
      preferences: { confirmDelete: true, uiMode: 'simple' }
    });
    
    mockDb.query.mockResolvedValue({ rows: [] });
  });

  it('should update telemetry sync status correctly', () => {
    // Arrange: Define an error state telemetry update
    const errorTelemetry = { isSyncing: false, error: 'Communication Array Malfunction' };
    
    // Act: Set the new sync status
    useTrackStore.getState().setSyncStatus(errorTelemetry);
    
    // Assert: Verify store reflects the telemetry update
    const state = useTrackStore.getState();
    expect(state.syncStatus.isSyncing).toBe(false);
    expect(state.syncStatus.error).toBe('Communication Array Malfunction');
  });

  it('should detect divergence via SyncService telemetry', async () => {
    // Arrange: Mock the SyncService to report remote divergence
    vi.mocked(mockSyncService.checkDivergence).mockResolvedValue('remote_newer');
    
    // Act: Check sync status
    const status = await useTrackStore.getState().checkSync();
    
    // Assert: Verify SyncService was engaged and returned the correct signal
    expect(mockSyncService.checkDivergence).toHaveBeenCalled();
    expect(status).toBe('remote_newer');
  });

  it('should pull remote stellar updates and re-initialize local state', async () => {
    // Arrange: Setup mock data for remote file ID and spy on initialize
    const remoteFileId = 'nebula-remote-777';
    mockDb.query.mockResolvedValueOnce({ rows: [{ remote_file_id: remoteFileId }] });
    const initializeSpy = vi.spyOn(useTrackStore.getState(), 'initialize').mockResolvedValue(undefined);

    // Act: Execute pull operation
    await useTrackStore.getState().performPull();
    
    // Assert: Verify DB query for metadata and SyncService pull execution
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('SELECT remote_file_id'));
    expect(mockSyncService.pullUpdate).toHaveBeenCalledWith(remoteFileId);
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should synchronize local state with stellar database records on initialization', async () => {
    // Arrange: Mock comprehensive database response with space-themed data
    mockDb.query.mockImplementation(async (query: string) => {
      if (query.includes('FROM profile')) {
        return { rows: [{ name: 'Commander Shepard', level: 50, xp: 500, title: 'Spectre' }] };
      }
      if (query.includes('FROM oracle_config')) {
        return { rows: [{ apiKey: 'normandy-key', model: 'edi-v1', providerUrl: 'citadel-api' }] };
      }
      if (query.includes('FROM preferences')) {
        return { rows: [{ confirmDelete: false, uiMode: 'professional' }] };
      }
      return { rows: [] };
    });

    // Act: Initialize the store from the database
    await useTrackStore.getState().initialize();
    
    // Assert: Verify all state domains are correctly hydrated
    const state = useTrackStore.getState();
    expect(state.profile.name).toBe('Commander Shepard');
    expect(state.profile.title).toBe('Spectre');
    expect(state.oracleConfig.apiKey).toBe('normandy-key');
    expect(state.preferences.uiMode).toBe('professional');
  });
  
  it('should manifest a new ambition in the stellar database logs', async () => {
    // Arrange
    const missionAmbition = 'Reclaim the Omega Relay';
    
    // Act
    await useTrackStore.getState().addAmbition(missionAmbition);
    
    // Assert: Verify database persistence and local state update
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO ambitions'),
      expect.arrayContaining([expect.any(String), missionAmbition, 0, 0, 'yearly'])
    );
    expect(useTrackStore.getState().ambitions[0].title).toBe(missionAmbition);
  });

  it('should log a historical event in the stellar archives', async () => {
    // Arrange
    const event: any = {
      title: 'India AI Contest',
      date: '2024-08-23',
      type: 'success',
      category: 'hackathon',
      description: 'Victory in AI development.',
      skills: ['AI/ML']
    };
    
    // Act
    await useTrackStore.getState().addHistoricalEvent(event);
    
    // Assert: Verify database persistence and local state update
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO stellar_history'),
      expect.arrayContaining([
        expect.stringContaining('hist-'),
        event.title,
        event.date,
        event.type,
        event.category,
        event.description,
        JSON.stringify(event.skills)
      ])
    );
    expect(useTrackStore.getState().history[0].title).toBe(event.title);
  });

  it('should generate a mission transmission briefing without reference errors', async () => {
    // Arrange: Setup skills and ambitions to trigger the reconciliation logic
    useTrackStore.setState({
      skills: [{ id: 's1', name: 'Cloud Arch', currentProficiency: 50, ambitionId: 'a1', targetProficiency: 100, recommendation: 'Study more', type: 'ambition' }],
      ambitions: [{ id: 'a1', title: 'AWS 2027', progress: 0, xp: 0, horizon: 'yearly', milestones: [] }],
      tasks: [
        { id: 't1', title: 'EC2 Config', completed: true, weightage: 20, horizon: 'daily', time: '10:00', plannedDate: getTodayLocalISO(), ambitionId: 'a1' }
      ]
    });

    // Act: Generate the transmission
    await useTrackStore.getState().generateTransmission(
      'daily',
      'Daily Progress Report',
      'Successful orbit insertion.'
    );

    // Assert: Verify transmission was created and reconciliation calculated correctly
    const state = useTrackStore.getState();
    expect(state.transmissions.length).toBe(1);
    expect(state.transmissions[0].title).toBe('Daily Progress Report');
    expect(state.transmissions[0].skillsReconciliation[0].delta).toBeGreaterThan(0);
    expect(state.transmissions[0].missionMetrics.accomplished.length).toBe(1);
  });
});
