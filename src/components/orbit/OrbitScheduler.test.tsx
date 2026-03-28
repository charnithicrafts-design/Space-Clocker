import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrbitScheduler from './OrbitScheduler';
import { useTrackStore } from '../../store/useTrackStore';

vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
  }
}));

// Mocking AudioContext
// Mocking AudioContext properly
class MockAudioContext {
  createOscillator = vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: 'sine',
  });
  createGain = vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
  });
  destination = {};
  state = 'suspended';
  resume = vi.fn().mockResolvedValue(undefined);
  currentTime = 0;
}

vi.stubGlobal('AudioContext', MockAudioContext);
vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));

describe('OrbitScheduler', () => {
  it('allows adding a new task', async () => {
    render(<OrbitScheduler />);
    const input = screen.getByPlaceholderText('What is the next mission step?...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'New Test Task' } });
      fireEvent.click(addButton);
    });

    expect(screen.getByText('New Test Task')).toBeInTheDocument();
  });

  it('allows deleting a task', async () => {
    render(<OrbitScheduler />);
    
    // Add a task first
    const input = screen.getByPlaceholderText('What is the next mission step?...');
    const addButton = screen.getByRole('button', { name: /add task/i });
    await act(async () => {
        fireEvent.change(input, { target: { value: 'Task to delete' } });
        fireEvent.click(addButton);
    });

    // Delete it - find all delete buttons and pick the one corresponding to "Task to delete"
    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
    
    await act(async () => {
        fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    });

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
  });
});
