import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrbitScheduler from './OrbitScheduler';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

// Mock SoundManager
vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
  }
}));

// Mock useTrackStore
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn()
}));

describe('OrbitScheduler', () => {
  const mockAddTask = vi.fn();
  const mockToggleTask = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockUpdateTaskDate = vi.fn();

  const today = new Date().toISOString().split('T')[0];

  const mockTasks = [
    {
      id: 'task-1',
      time: '08:00',
      title: 'Initialize Life Support Systems',
      completed: false,
      horizon: 'daily',
      plannedDate: today
    },
    {
      id: 'task-2',
      time: '12:00',
      title: 'Calibrate Quantum Array',
      completed: true,
      horizon: 'daily',
      plannedDate: today
    }
  ];

  const mockProfile = {
    name: 'Commander Valentina',
    level: 42,
    xp: 8500,
    title: 'Galactic Voyager'
  };

  const mockPreferences = {
    confirmDelete: true,
    uiMode: 'simple'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      tasks: mockTasks,
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTask: mockUpdateTask,
      updateTaskDate: mockUpdateTaskDate,
      profile: mockProfile,
      preferences: mockPreferences
    });
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
  });

  it('renders daily mission log with active tasks', () => {
    // Arrange
    render(<OrbitScheduler />);

    // Assert
    expect(screen.getByText(/Mission Control/i)).toBeInTheDocument();
    expect(screen.getByText('Initialize Life Support Systems')).toBeInTheDocument();
    expect(screen.getByText('Calibrate Quantum Array')).toBeInTheDocument();
  });

  it('allows adding a new orbital task', async () => {
    // Arrange
    render(<OrbitScheduler />);
    const input = screen.getByPlaceholderText(/Define the next mission parameter/i);
    const uplinkButton = screen.getByRole('button', { name: /add task/i });

    // Act
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Deploy Voyager Probe' } });
      fireEvent.click(uplinkButton);
    });

    // Assert
    expect(mockAddTask).toHaveBeenCalledWith(
      expect.any(String),
      'Deploy Voyager Probe',
      undefined,
      expect.objectContaining({ weightage: 10, plannedDate: today })
    );
    expect(SoundManager.playPop).toHaveBeenCalled();
  });

  it('triggers task toggle when clicking on a mission entry', async () => {
    // Arrange
    render(<OrbitScheduler />);
    const taskTitle = screen.getByText('Initialize Life Support Systems');

    // Act
    await act(async () => {
      fireEvent.click(taskTitle);
    });

    // Assert
    expect(mockToggleTask).toHaveBeenCalledWith('task-1');
  });

  it('ejects a task from orbit after confirmation', async () => {
    // Arrange
    render(<OrbitScheduler />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });

    // Act
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    // Assert
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
    expect(SoundManager.playThud).toHaveBeenCalled();
  });

  it('updates task time entry', async () => {
    // Arrange
    render(<OrbitScheduler />);
    const timeInputs = screen.getAllByDisplayValue('08:00');

    // Act
    await act(async () => {
      fireEvent.change(timeInputs[0], { target: { value: '09:00' } });
    });

    // Assert
    expect(mockUpdateTask).toHaveBeenCalledWith('task-1', { time: '09:00' });
  });
});
