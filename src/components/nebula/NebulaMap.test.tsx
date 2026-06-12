import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NebulaMap from './NebulaMap';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

// Mock dependencies
vi.mock('../../store/useTrackStore');
vi.mock('../../utils/SoundManager');

const mockAmbitions = [
  {
    id: 'ambition-alpha',
    title: 'Establish Martian Colony',
    progress: 45,
    xp: 250,
    horizon: 'yearly',
    milestones: [
      {
        id: 'milestone-1',
        title: 'Atmospheric Scrubber Installation',
        status: 'active',
        tasks: [
          { id: 'task-1', title: 'Calibrate CO2 sensors', completed: true, weightage: 25 },
          { id: 'task-2', title: 'Verify O2 output', completed: false, weightage: 25 },
        ],
      },
    ],
  },
  {
    id: 'ambition-beta',
    title: 'Jupiter Cloud Mining',
    progress: 10,
    xp: 50,
    horizon: 'yearly',
    milestones: [],
  },
];

describe('NebulaMap', () => {
  const mockAddAmbition = vi.fn();
  const mockAddMilestone = vi.fn();
  const mockToggleMilestoneTask = vi.fn();
  const mockUpdateAmbition = vi.fn();
  const mockUpdateMilestone = vi.fn();
  const mockUpdateMilestoneTask = vi.fn();
  const mockDeleteMilestoneTask = vi.fn();
  const mockDeleteMilestone = vi.fn();
  const mockDeleteAmbition = vi.fn();
  const mockAddMilestoneTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      ambitions: mockAmbitions,
      addAmbition: mockAddAmbition,
      addMilestone: mockAddMilestone,
      toggleMilestoneTask: mockToggleMilestoneTask,
      updateAmbition: mockUpdateAmbition,
      updateMilestone: mockUpdateMilestone,
      deleteMilestone: mockDeleteMilestone,
      updateMilestoneTask: mockUpdateMilestoneTask,
      deleteMilestoneTask: mockDeleteMilestoneTask,
      addMilestoneTask: mockAddMilestoneTask,
      deleteAmbition: mockDeleteAmbition,
      preferences: { confirmDelete: false },
    });
  });

  it('should render the Nebula Map with core ambitions (Arrange/Assert)', () => {
    // Arrange & Act
    render(<NebulaMap />);

    // Assert
    expect(screen.getByText('The Nebula Map')).toBeInTheDocument();
    expect(screen.getByText('Establish Martian Colony')).toBeInTheDocument();
    expect(screen.getByText('Jupiter Cloud Mining')).toBeInTheDocument();
  });

  it('should expand a milestone and display its sub-tasks (Act/Assert)', () => {
    // Arrange
    render(<NebulaMap />);
    const milestoneHeader = screen.getByText('Atmospheric Scrubber Installation');

    // Act
    fireEvent.click(milestoneHeader);

    // Assert
    expect(screen.getByText('Calibrate CO2 sensors')).toBeInTheDocument();
    expect(screen.getByText('Verify O2 output')).toBeInTheDocument();
  });

  it('should toggle a milestone task completion (Act/Assert)', async () => {
    // Arrange
    render(<NebulaMap />);
    fireEvent.click(screen.getByText('Atmospheric Scrubber Installation'));
    const task = screen.getByText('Verify O2 output');

    // Act
    fireEvent.click(task);

    // Assert
    expect(mockToggleMilestoneTask).toHaveBeenCalledWith('ambition-alpha', 'milestone-1', 'task-2');
    expect(SoundManager.playPop).toHaveBeenCalled();
  });

  it('should open the CommandModal and initiate a new trajectory (Act/Assert)', async () => {
    // Arrange
    render(<NebulaMap />);
    const launchButton = screen.getByText('LAUNCH TRAJECTORY');

    // Act
    fireEvent.click(launchButton);

    // Assert
    expect(screen.getByText('Launch New Trajectory')).toBeInTheDocument();
    
    // Interact with CommandModal
    const input = screen.getByPlaceholderText('Name your next macro ambition...');
    fireEvent.change(input, { target: { value: 'Saturn Ring Research' } });
    
    const executeButton = screen.getByText('Execute Uplink');
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(mockAddAmbition).toHaveBeenCalledWith('Saturn Ring Research');
    });
  });

  it('should allow deconstructing an ambition into a new milestone (Act/Assert)', async () => {
    // Arrange
    render(<NebulaMap />);
    // Establish Martian Colony is Priority Zero (expanded by default in component)
    const addMilestoneButton = screen.getByText('Deconstruct into new milestone');

    // Act
    fireEvent.click(addMilestoneButton);
    const input = screen.getByPlaceholderText('Milestone title...');
    fireEvent.change(input, { target: { value: 'Water Extraction Unit' } });
    fireEvent.submit(input.closest('form')!);

    // Assert
    expect(mockAddMilestone).toHaveBeenCalledWith('ambition-alpha', 'Water Extraction Unit');
    expect(SoundManager.playPop).toHaveBeenCalled();
  });

  it('should handle milestone task deletion (Act/Assert)', async () => {
    // Arrange
    render(<NebulaMap />);
    fireEvent.click(screen.getByText('Atmospheric Scrubber Installation'));
    
    // 1. Find and click the Action Menu trigger for the task
    const taskContainer = screen.getByText('Verify O2 output').closest('div');
    const menuTrigger = taskContainer?.querySelector('button[title="Actions"]');
    if (menuTrigger) fireEvent.click(menuTrigger);

    // 2. Click "Extract" in the dropdown (wait for it to render)
    const extractButton = await screen.findByText('Extract');
    fireEvent.click(extractButton);

    // Assert
    expect(mockDeleteMilestoneTask).toHaveBeenCalledWith('ambition-alpha', 'milestone-1', 'task-2');
    expect(SoundManager.playThud).toHaveBeenCalled();
  });

  it('should open ActionMenu and trigger ambition deletion in AmbitionCard', async () => {
    // Arrange
    render(<NebulaMap />);
    const actionMenus = screen.getAllByTitle('Actions');
    
    // Act - Open the first ActionMenu (Martian Colony)
    fireEvent.click(actionMenus[0]);
    
    // Assert - Menu should be visible
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Abort')).toBeInTheDocument();
    
    // Act - Click Abort
    fireEvent.click(screen.getByText('Abort'));
    
    // Assert
    expect(mockDeleteAmbition).toHaveBeenCalledWith('ambition-alpha');
    expect(SoundManager.playThud).toHaveBeenCalled();
  });

  it('should enter edit mode when Edit is clicked in ActionMenu', async () => {
    // Arrange
    render(<NebulaMap />);
    const actionMenus = screen.getAllByTitle('Actions');
    
    // Act
    fireEvent.click(actionMenus[0]);
    fireEvent.click(screen.getByText('Edit'));
    
    // Assert - Input should be visible with current title
    const input = screen.getByDisplayValue('Establish Martian Colony');
    expect(input).toBeInTheDocument();
  });
});
