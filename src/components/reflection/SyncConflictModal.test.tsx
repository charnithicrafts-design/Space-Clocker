import { render, screen, fireEvent, act } from '@testing-library/react';
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
  const remoteDate = '2025-05-20T14:30:00Z'; // Space-themed future date

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the temporal divergence warning when open (Arrange/Assert)', () => {
    // Arrange
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    // Assert
    expect(screen.getByText('Temporal Divergence')).toBeInTheDocument();
    expect(screen.getByText('Rift Detected')).toBeInTheDocument();
    expect(screen.getByText(/A newer version of your trajectory was found in the Nebula/i)).toBeInTheDocument();
    expect(SoundManager.playSwell).toHaveBeenCalled();
  });

  it('remains invisible when the rift is not detected (Arrange/Assert)', () => {
    // Arrange
    render(
      <SyncConflictModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    // Assert
    expect(screen.queryByText('Rift Detected')).not.toBeInTheDocument();
  });

  it('adopts the remote timeline when triggered (Arrange/Act/Assert)', async () => {
    // Arrange
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    // Act
    const adoptButton = screen.getByRole('button', { name: /Adopt Remote Timeline/i });
    await act(async () => {
      fireEvent.click(adoptButton);
    });
    
    // Assert
    expect(mockOnResolve).toHaveBeenCalledWith('remote');
    expect(SoundManager.playUplink).toHaveBeenCalled();
  });

  it('maintains the local trajectory when requested (Arrange/Act/Assert)', async () => {
    // Arrange
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    // Act
    const stayButton = screen.getByRole('button', { name: /Stay in Local Trajectory/i });
    await act(async () => {
      fireEvent.click(stayButton);
    });
    
    // Assert
    expect(mockOnResolve).toHaveBeenCalledWith('local');
    expect(SoundManager.playPop).toHaveBeenCalled();
  });

  it('closes the rift interface when the exit button is engaged (Arrange/Act/Assert)', async () => {
    // Arrange
    render(
      <SyncConflictModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onResolve={mockOnResolve} 
        remoteDate={remoteDate} 
      />
    );
    
    // Act
    const closeButton = screen.getByRole('button', { name: /Close/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });
    
    // Assert
    expect(mockOnClose).toHaveBeenCalled();
  });
});
