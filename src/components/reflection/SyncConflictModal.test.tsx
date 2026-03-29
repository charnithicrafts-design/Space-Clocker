import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SyncConflictModal from './SyncConflictModal';
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

describe('SyncConflictModal', () => {
  const mockOnClose = vi.fn();
  const mockOnResolve = vi.fn();
  const remoteDate = '2023-01-01T10:00:00Z';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    expect(screen.getByText('Rift Detected')).toBeInTheDocument();
    expect(screen.getByText('Adopt Remote Timeline')).toBeInTheDocument();
    expect(screen.getByText('Stay in Local Trajectory')).toBeInTheDocument();
    expect(SoundManager.playSwell).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    render(
      <SyncConflictModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    expect(screen.queryByText('Rift Detected')).not.toBeInTheDocument();
  });

  it('handles remote resolution', () => {
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    fireEvent.click(screen.getByText('Adopt Remote Timeline'));
    
    expect(mockOnResolve).toHaveBeenCalledWith('remote');
    expect(SoundManager.playUplink).toHaveBeenCalled();
  });

  it('handles local resolution', () => {
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    fireEvent.click(screen.getByText('Stay in Local Trajectory'));
    
    expect(mockOnResolve).toHaveBeenCalledWith('local');
    expect(SoundManager.playPop).toHaveBeenCalled();
  });
});
