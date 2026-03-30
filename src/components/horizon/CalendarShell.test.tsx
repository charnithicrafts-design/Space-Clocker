import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CalendarShell from './CalendarShell';
import { useTrackStore } from '../../store/useTrackStore';

// Mock useTrackStore
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn(),
}));

describe('CalendarShell', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', plannedDate: new Date().toISOString().split('T')[0], time: '10:00', completed: false, horizon: 'daily' }
  ];
  const mockAmbitions = [
    { id: 'a1', title: 'Ambition 1', milestones: [{ id: 'm1', title: 'Milestone 1', status: 'pending' }] }
  ];
  const mockInternships = [
    { organization: 'ISRO', start: '2025-06-01', end: '2025-08-31' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      tasks: mockTasks,
      ambitions: mockAmbitions,
      internships: mockInternships,
    });
  });

  it('renders the stellar chronometer by default', () => {
    // Arrange
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText(/Stellar Chronometer/i)).toBeInTheDocument();
    expect(screen.getByText(/Temporal Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Mission Parameters/i)).toBeInTheDocument();
  });

  it('transitions to the weekly view', async () => {
    // Arrange
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    // Act
    const weeklyButton = screen.getByRole('button', { name: /weekly/i });
    await act(async () => {
      fireEvent.click(weeklyButton);
    });

    // Assert
    // Use findBy to handle AnimatePresence transitions
    const taskElement = await screen.findByText('Task 1');
    expect(taskElement).toBeInTheDocument();
  });

  it('navigates to the yearly horizon and shows roadmap', async () => {
    // Arrange
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    // Act
    const yearlyButton = screen.getByRole('button', { name: /yearly/i });
    await act(async () => {
      fireEvent.click(yearlyButton);
    });

    // Assert
    // Use findBy to handle AnimatePresence transitions
    const roadmapHeader = await screen.findByText(/Stellar Roadmap/i);
    expect(roadmapHeader).toBeInTheDocument();
    expect(screen.getByText('Ambition 1')).toBeInTheDocument();
    expect(screen.getByText('Orbital Internships')).toBeInTheDocument();
  });
});
