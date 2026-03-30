import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsDashboard from './SettingsDashboard';
import { useTrackStore } from '../../store/useTrackStore';
import { syncService } from '../../services/SyncService';
import * as DbClient from '../../db/client';
import { SoundManager } from '../../utils/SoundManager';

// Mock SoundManager
vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playUplink: vi.fn(),
    playSyncSuccess: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
    playPop: vi.fn(),
  }
}));

// Mock URL methods
global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock DbClient
vi.mock('../../db/client', () => ({
  dumpDb: vi.fn().mockResolvedValue(new Blob(['test-dump'])),
  restoreDb: vi.fn().mockResolvedValue(undefined),
  getDb: vi.fn().mockReturnValue({
    query: vi.fn().mockResolvedValue({ rows: [] }),
  }),
}));

// Mock SyncService
vi.mock('../../services/SyncService', () => ({
  syncService: {
    pushUpdate: vi.fn().mockResolvedValue({ syncedAt: '2023-01-01T00:00:00Z' }),
    authorize: vi.fn().mockResolvedValue('token'),
  }
}));

describe('SettingsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTrackStore.setState({
      profile: { name: 'Valentina', level: 42, title: 'Galactic Voyager' },
      oracleConfig: { apiKey: '', model: 'm', providerUrl: '', syncEnabled: false, clientId: '' },
      syncStatus: { isSyncing: false }
    });
  });

  it('renders correctly', () => {
    render(<SettingsDashboard />);
    expect(screen.getByText('System Protocol')).toBeInTheDocument();
    expect(screen.getByText('Communication Array')).toBeInTheDocument();
  });

  it('triggers create snapshot flow', async () => {
    render(<SettingsDashboard />);
    
    // Mock anchor click
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    
    const snapshotBtn = screen.getByText('Create Snapshot');
    fireEvent.click(snapshotBtn);
    
    await waitFor(() => {
      expect(DbClient.dumpDb).toHaveBeenCalled();
      expect(SoundManager.playPop).toHaveBeenCalled();
    });
  });

  it('triggers sync now flow', async () => {
    useTrackStore.setState({
      oracleConfig: { ...useTrackStore.getState().oracleConfig, syncEnabled: true }
    });
    
    render(<SettingsDashboard />);
    
    const syncButtons = screen.getAllByText(/Sync Now/);
    fireEvent.click(syncButtons[0]);
    
    await waitFor(() => {
      expect(syncService.pushUpdate).toHaveBeenCalled();
      expect(SoundManager.playUplink).toHaveBeenCalled();
    });
  });

  it('handles Neural Link establishment', async () => {
    useTrackStore.setState({
      oracleConfig: { ...useTrackStore.getState().oracleConfig, clientId: 'test-client-id', syncEnabled: false }
    });
    
    render(<SettingsDashboard />);
    
    const linkBtn = screen.getByText('Establish Link');
    fireEvent.click(linkBtn);
    
    await waitFor(() => {
      expect(syncService.authorize).toHaveBeenCalledWith('test-client-id');
    });
  });
});
