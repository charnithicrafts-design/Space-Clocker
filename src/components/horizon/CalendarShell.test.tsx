import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CalendarShell from './CalendarShell';
import { useTrackStore } from '../../store/useTrackStore';

// Mock useTrackStore
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn(),
}));

describe('CalendarShell', () => {
  const todayStr = '2026-03-31';
  const yesterdayStr = '2026-03-30';

  const mockTasks = [
    { 
      id: '1', 
      title: 'Standalone Task', 
      plannedDate: todayStr, 
      time: '10:00', 
      endTime: '11:00',
      completed: false, 
      horizon: 'daily' 
    },
    {
      id: '2',
      title: 'Backlog Task',
      plannedDate: yesterdayStr,
      completed: false,
      horizon: 'daily'
    }
  ];

  const mockAmbitions = [
    { 
      id: 'a1', 
      title: 'Ambition 1', 
      progress: 50,
      xp: 100,
      milestones: [
        { 
          id: 'm1', 
          title: 'Milestone 1', 
          status: 'active',
          tasks: [
            { 
              id: 'mt1', 
              title: 'Milestone Task', 
              plannedDate: todayStr, 
              time: '14:00', 
              completed: false, 
              horizon: 'daily' 
            },
            {
              id: 'mt2',
              title: 'Completed Task On Time',
              plannedDate: yesterdayStr,
              completed: true,
              deadline: '2026-03-30T15:00:00Z',
              completedAt: '2026-03-30T14:00:00Z',
              horizon: 'daily'
            }
          ]
        }
      ] 
    }
  ];

  const mockInternships = [
    { organization: 'NASA', start: '2026-06-01', end: '2026-08-31' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Use setSystemTime without useFakeTimers to avoid blocking animations
    vi.setSystemTime(new Date('2026-03-31T10:30:00')); 

    (useTrackStore as any).mockReturnValue({
      tasks: mockTasks,
      ambitions: mockAmbitions,
      internships: mockInternships,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders both standalone and milestone tasks in the daily view', () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    expect(screen.getByText('Standalone Task')).toBeInTheDocument();
    expect(screen.getByText('Milestone Task')).toBeInTheDocument();
  });

  it('shows status indicators for tasks', () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    // Use queryAllByText or more specific matching
    expect(screen.getByText(/Live Mission/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Objective/i)).toBeInTheDocument();
  });

  it('shows backlog indicator for past uncompleted tasks', async () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    // Click on yesterday (30th)
    const yesterdayBtn = screen.getByRole('button', { name: '30' });
    fireEvent.click(yesterdayBtn);

    expect(screen.getByText('Backlog Task')).toBeInTheDocument();
    // Check for the indicator specifically
    const backlogIndicators = screen.getAllByText(/Backlog/i);
    expect(backlogIndicators.some(el => el.classList.contains('text-error'))).toBe(true);
  });

  it('shows on-time indicators for completed tasks', async () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    const yesterdayBtn = screen.getByRole('button', { name: '30' });
    fireEvent.click(yesterdayBtn);

    expect(screen.getByText('Completed Task On Time')).toBeInTheDocument();
    const onTimeIndicators = screen.getAllByText(/On Time/i);
    expect(onTimeIndicators.length).toBeGreaterThan(0);
  });

  it('shows all tasks in the weekly view', async () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    const weeklyButton = screen.getByRole('button', { name: /weekly/i });
    fireEvent.click(weeklyButton);

    // Increase timeout or use findBy
    expect(await screen.findByText('Standalone Task', {}, { timeout: 2000 })).toBeInTheDocument();
    expect(await screen.findByText('Milestone Task', {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it('navigates to the yearly horizon and shows roadmap', async () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    const yearlyButton = screen.getByRole('button', { name: /yearly/i });
    fireEvent.click(yearlyButton);

    expect(await screen.findByText(/Stellar Cycle 2026/i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getAllByText('Ambition 1').length).toBeGreaterThan(0);
  });
});
