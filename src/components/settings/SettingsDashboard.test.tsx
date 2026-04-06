import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsDashboard from './SettingsDashboard';
import { useTrackStore } from '../../store/useTrackStore';
import { syncService } from '../../services/SyncService';
import { dumpDb, restoreDb } from '../../db/client';
import { SoundManager } from '../../utils/SoundManager';

// Mock Dependencies
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn()
}));

vi.mock('../../constants', () => ({
  CURRENT_APP_VERSION: '1.4.1',
  XP_PER_LEVEL: 1000
}));

vi.mock('../../services/SyncService', () => ({
  syncService: {
    pushUpdate: vi.fn(),
    authorize: vi.fn()
  }
}));

vi.mock('../../db/client', () => ({
  dumpDb: vi.fn(),
  restoreDb: vi.fn()
}));

vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playUplink: vi.fn(),
    playSyncSuccess: vi.fn(),
    playThud: vi.fn(),
    playPop: vi.fn(),
    playSwell: vi.fn()
  }
}));

// Mock URL methods for blob handling
global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('SettingsDashboard', () => {
  const mockUpdateProfile = vi.fn();
  const mockUpdateOracleConfig = vi.fn();
  const mockUpdatePreferences = vi.fn();
  const mockSetSyncStatus = vi.fn();

  const mockInitialState = {
    profile: {
      name: 'Commander Valentina',
      title: 'Galactic Voyager',
      level: 42,
      xp: 8500
    },
    oracleConfig: {
      apiKey: 'sk-nebula-123',
      clientId: 'google-client-id-456',
      providerUrl: 'https://nebula.api',
      syncEnabled: false
    },
    preferences: {
      uiMode: 'simple',
      confirmDelete: true
    },
    syncStatus: {
      isSyncing: false,
      lastSyncedAt: undefined,
      error: undefined
    },
    updateProfile: mockUpdateProfile,
    updateOracleConfig: mockUpdateOracleConfig,
    updatePreferences: mockUpdatePreferences,
    setSyncStatus: mockSetSyncStatus
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue(mockInitialState);
  });

  it('renders pilot profile and system settings with space-themed data', () => {
    // Arrange
    render(<SettingsDashboard />);

    // Assert
    expect(screen.getByDisplayValue('Commander Valentina')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Galactic Voyager')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Communication Array/i })).toBeInTheDocument();
  });

  it('saves updated system protocol changes', async () => {
    // Arrange
    render(<SettingsDashboard />);
    const nameInput = screen.getByDisplayValue('Commander Valentina');
    const saveButton = screen.getByText(/Sync Changes/i);

    // Act
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Admiral Shepard' } });
      fireEvent.click(saveButton);
    });

    // Assert
    expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ name: 'Admiral Shepard' }));
    expect(screen.getByText(/Sync Successful/i)).toBeInTheDocument();
  });

  it('triggers stellar sync uplink flow', async () => {
    // Arrange
    (useTrackStore as any).mockReturnValue({
      ...mockInitialState,
      oracleConfig: { ...mockInitialState.oracleConfig, syncEnabled: true }
    });
    (syncService.pushUpdate as any).mockResolvedValue({ syncedAt: '2024-01-01T12:00:00Z' });
    render(<SettingsDashboard />);
    const syncButton = screen.getByRole('button', { name: /Sync Now/i });

    // Act
    await act(async () => {
      fireEvent.click(syncButton);
    });

    // Assert
    expect(mockSetSyncStatus).toHaveBeenCalledWith({ isSyncing: true, error: undefined });
    expect(syncService.pushUpdate).toHaveBeenCalled();
    expect(SoundManager.playUplink).toHaveBeenCalled();
    expect(SoundManager.playSyncSuccess).toHaveBeenCalled();
  });

  it('handles neural link authorization (Establish Link)', async () => {
    // Arrange
    render(<SettingsDashboard />);
    const linkButton = screen.getByRole('button', { name: /Establish Link/i });

    // Act
    await act(async () => {
      fireEvent.click(linkButton);
    });

    // Assert
    expect(syncService.authorize).toHaveBeenCalledWith('google-client-id-456');
    expect(mockUpdateOracleConfig).toHaveBeenCalledWith({ syncEnabled: true });
    expect(SoundManager.playSyncSuccess).toHaveBeenCalled();
  });

  it('creates a chronos backup snapshot', async () => {
    // Arrange
    const mockBlob = new Blob(['mock-data'], { type: 'application/octet-stream' });
    (dumpDb as any).mockResolvedValue(mockBlob);
    render(<SettingsDashboard />);
    const snapshotButton = screen.getByText(/Create Snapshot/i);

    // Act
    await act(async () => {
      fireEvent.click(snapshotButton);
    });

    // Assert
    await waitFor(() => {
      expect(dumpDb).toHaveBeenCalled();
      expect(SoundManager.playPop).toHaveBeenCalled();
      expect(SoundManager.playSyncSuccess).toHaveBeenCalled();
    });
  });

  it('toggles UI strategy between Simple and Pro modes', async () => {
    // Arrange
    render(<SettingsDashboard />);
    const proButton = screen.getByRole('button', { name: /Pro/i });

    // Act
    await act(async () => {
      fireEvent.click(proButton);
    });

    // Assert
    // Note: Local state change within the component, but we check if SoundManager played
    expect(SoundManager.playPop).toHaveBeenCalled();
    // We can also verify that the button gets the active class if we want to be thorough
    expect(proButton).toHaveClass('bg-secondary');
  });
});
