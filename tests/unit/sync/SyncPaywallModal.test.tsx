import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SyncPaywallModal from '../../../src/components/settings/SyncPaywallModal';
import { useTrackStore } from '../../../src/store/useTrackStore';
import { useSession } from '../../../src/lib/auth-client';

// Mock the dependencies
vi.mock('../../../src/store/useTrackStore', () => ({
  useTrackStore: vi.fn()
}));
vi.mock('../../../src/lib/auth-client', () => ({
  useSession: vi.fn(),
  signIn: {
    social: vi.fn()
  }
}));
vi.mock('../../../src/utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playSyncSuccess: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn()
  }
}));

describe('SyncPaywallModal (Business Requirements)', () => {
  let updateOracleConfigMock: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    updateOracleConfigMock = vi.fn();
    
    (useTrackStore as any).mockReturnValue({
      oracleConfig: { syncEnabled: false },
      profile: { name: 'Test Pilot' },
      updateOracleConfig: updateOracleConfigMock
    });
    
    (useSession as any).mockReturnValue({
      data: null,
      isPending: false
    });
  });

  it('shows payment options when user is not linked', () => {
    render(<SyncPaywallModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText('Establish Uplink')).toBeInTheDocument();
    expect(screen.getByText('Temporal Burst')).toBeInTheDocument();
    expect(screen.getByText('Quantum Uplink')).toBeInTheDocument();
  });

  it('shows Restore Link button when user is authenticated but device is not synced (Business Goal: Never charge twice)', () => {
    (useSession as any).mockReturnValue({
      data: {
        user: { id: 'usr_123', email: 'test@spaceclocker.io', premiumTier: true }
      },
      isPending: false
    });
    
    render(<SyncPaywallModal isOpen={true} onClose={() => {}} />);
    
    // Payment buttons should NOT be visible 
    expect(screen.queryByText('Temporal Burst')).not.toBeInTheDocument();
    
    // Instead we see Restore Link
    const restoreBtn = screen.getByRole('button', { name: /Restore Link/i });
    expect(restoreBtn).toBeInTheDocument();
    
    // Verify it enables sync
    fireEvent.click(restoreBtn);
    expect(updateOracleConfigMock).toHaveBeenCalledWith(expect.objectContaining({
      syncEnabled: true,
      clientId: 'usr_123'
    }));
  });
});
