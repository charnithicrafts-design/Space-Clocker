import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrbitScheduler from './OrbitScheduler';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { getTodayLocalISO } from '../../utils/DateTimeUtils';

// Mock DateTimeUtils
vi.mock('../../utils/DateTimeUtils', async () => {
  const actual = await vi.importActual('../../utils/DateTimeUtils');
  return {
    ...actual as any,
    getLocalTimeHHmm: vi.fn().mockReturnValue('00:00'),
  };
});

// Mock SoundManager
vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
    playSyncSuccess: vi.fn(),
    playLevelUp: vi.fn(),
    playMilestoneComplete: vi.fn(),
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

  const today = getTodayLocalISO();

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
      updateMilestoneTask: vi.fn(),
      deleteMilestoneTask: vi.fn(),
      profile: mockProfile,
      preferences: mockPreferences,
      ambitions: [],
      skills: []
    });
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    });
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
    const actionMenus = screen.getAllByTitle('Actions');

    // Act
    await act(async () => {
      fireEvent.click(actionMenus[0]);
    });

    const extractButton = screen.getByText('Extract');
    await act(async () => {
      fireEvent.click(extractButton);
    });

    // Check if modal is open
    expect(screen.getByText(/Eject Task from Orbit/i)).toBeInTheDocument();
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Confirm Extraction/i });
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // Assert
    expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
    expect(SoundManager.playThud).toHaveBeenCalled();
  });

  it('updates task time entry', async () => {
    // Arrange
    render(<OrbitScheduler />);
    const actionMenus = screen.getAllByTitle('Actions');

    // Open ActionMenu
    await act(async () => {
      fireEvent.click(actionMenus[0]);
    });

    // Click Edit
    const editButton = screen.getByText('Edit');
    await act(async () => {
      fireEvent.click(editButton);
    });

    // Find time entry input
    const timeInput = screen.getByDisplayValue('08:00');

    // Act
    await act(async () => {
      fireEvent.change(timeInput, { target: { value: '09:00' } });
      fireEvent.blur(timeInput);
    });

    // Assert
    expect(mockUpdateTask).toHaveBeenCalledWith('task-1', expect.objectContaining({ time: '09:00' }));
  });

  it('recalibrates/carries forward a standalone task to today', async () => {
    const mockUpdateTaskLocal = vi.fn();
    (useTrackStore as any).mockReturnValue({
      tasks: [{
        id: 'backlog-task-1',
        time: '10:00',
        title: 'Overdue Standalone Mission',
        completed: false,
        horizon: 'daily',
        plannedDate: '2026-01-01' // Past date -> decayed
      }],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTask: mockUpdateTaskLocal,
      updateTaskDate: mockUpdateTaskDate,
      updateMilestoneTask: vi.fn(),
      deleteMilestoneTask: vi.fn(),
      profile: mockProfile,
      preferences: mockPreferences,
      ambitions: [],
      skills: []
    });

    render(<OrbitScheduler />);
    
    // Switch to Stasis Backlog tab
    const backlogTab = screen.getByRole('button', { name: /stasis backlog/i });
    await act(async () => {
      fireEvent.click(backlogTab);
    });

    // Click Recalibrate button
    const recalibrateBtn = screen.getByRole('button', { name: /recalibrate/i });
    await act(async () => {
      fireEvent.click(recalibrateBtn);
    });

    expect(mockUpdateTaskLocal).toHaveBeenCalledWith('backlog-task-1', {
      plannedDate: today,
      recalibratedCount: 1,
      recalibrationDates: [today]
    });
  });

  it('recalibrates/carries forward a milestone task with correct ambitionId and milestoneId', async () => {
    const mockUpdateMilestoneTask = vi.fn();
    const mockAmbitions = [{
      id: 'amb-1',
      title: 'AWS Certification',
      milestones: [{
        id: 'ms-100',
        title: 'Practice Exams',
        tasks: [{
          id: 'ms-task-1',
          title: 'Complete Exam 1',
          completed: false,
          plannedDate: '2026-01-01' // Past date -> decayed
        }]
      }]
    }];

    (useTrackStore as any).mockReturnValue({
      tasks: [],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTask: mockUpdateTask,
      updateTaskDate: mockUpdateTaskDate,
      updateMilestoneTask: mockUpdateMilestoneTask,
      deleteMilestoneTask: vi.fn(),
      profile: mockProfile,
      preferences: mockPreferences,
      ambitions: mockAmbitions,
      skills: []
    });

    render(<OrbitScheduler />);
    
    // Switch to Stasis Backlog tab
    const backlogTab = screen.getByRole('button', { name: /stasis backlog/i });
    await act(async () => {
      fireEvent.click(backlogTab);
    });

    // Click Recalibrate button for the milestone task
    const recalibrateBtn = screen.getByRole('button', { name: /recalibrate/i });
    await act(async () => {
      fireEvent.click(recalibrateBtn);
    });

    expect(mockUpdateMilestoneTask).toHaveBeenCalledWith('amb-1', 'ms-100', 'ms-task-1', {
      plannedDate: today,
      recalibratedCount: 1,
      recalibrationDates: [today]
    });
  });

  it('displays WEEKLY badge for weekly tasks in Stasis Backlog', async () => {
    (useTrackStore as any).mockReturnValue({
      tasks: [{
        id: 'backlog-task-weekly',
        time: '14:00',
        title: 'Weekly Backlog Task',
        completed: false,
        horizon: 'weekly',
        plannedDate: '2026-03-30' // Past date
      }],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTask: mockUpdateTask,
      updateTaskDate: mockUpdateTaskDate,
      updateMilestoneTask: vi.fn(),
      deleteMilestoneTask: vi.fn(),
      profile: mockProfile,
      preferences: mockPreferences,
      ambitions: [],
      skills: []
    });

    render(<OrbitScheduler />);
    
    // Switch to Stasis Backlog tab
    const backlogTab = screen.getByRole('button', { name: /stasis backlog/i });
    await act(async () => {
      fireEvent.click(backlogTab);
    });

    expect(screen.getByText('Weekly Backlog Task')).toBeInTheDocument();
    expect(screen.getByText('WEEKLY')).toBeInTheDocument();
  });
});
