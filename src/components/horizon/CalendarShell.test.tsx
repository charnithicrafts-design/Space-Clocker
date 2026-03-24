import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CalendarShell from './CalendarShell';

// Mocking AudioContext because it is not available in test environments
vi.stubGlobal('AudioContext', vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(),
  createGain: vi.fn(),
  destination: {},
})));

describe('CalendarShell', () => {
  it('renders correctly when yearly horizon is selected', async () => {
    render(
      <MemoryRouter>
        <CalendarShell />
      </MemoryRouter>
    );
    
    // Switch to yearly horizon
    const yearlyButton = screen.getByText('yearly');
    await act(async () => {
      yearlyButton.click();
    });

    // Verify InternshipScheduler content is visible
    expect(screen.getByText('Internship Scheduler')).toBeInTheDocument();
  });
});
