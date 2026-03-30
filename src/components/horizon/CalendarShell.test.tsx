import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CalendarShell from './CalendarShell';
import { useTrackStore } from '../../store/useTrackStore';

// Mocking AudioContext
vi.stubGlobal('AudioContext', vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(),
  createGain: vi.fn(),
  destination: {},
})));

// Mock useTrackStore
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn(),
}));

describe('CalendarShell', () => {
  const mockAddInternship = vi.fn();
  const mockInternships = [
    { organization: 'ISRO', start: '2025-06-01', end: '2025-08-31' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      addInternship: mockAddInternship,
      internships: mockInternships,
    });
  });

  it('renders the daily focus protocol by default (Arrange/Assert)', () => {
    // Arrange
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText(/Daily Focus Protocol active/i)).toBeInTheDocument();
    expect(screen.getByText('Stellar Timeline Tracker')).toBeInTheDocument();
  });

  it('transitions to the resonance matrix visualization on weekly horizon (Arrange/Act/Assert)', async () => {
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
    expect(screen.getByText(/Resonance Matrix visualization/i)).toBeInTheDocument();
    expect(screen.queryByText(/Daily Focus Protocol active/i)).not.toBeInTheDocument();
  });

  it('navigates to the internship scheduler on yearly horizon (Arrange/Act/Assert)', async () => {
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
    expect(screen.getByText('Internship Scheduler')).toBeInTheDocument();
    expect(screen.getByText('ISRO Internship')).toBeInTheDocument();
  });
});
