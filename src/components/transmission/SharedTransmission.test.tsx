import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SharedTransmission from './SharedTransmission';
import { MemoryRouter } from 'react-router-dom';
import { generateShareLink } from '../../utils/TransmissionExporter';
import { Transmission } from '../../store/useTrackStore';

/**
 * SharedTransmission UI Tests
 * 
 * Aligned with conductor/test-overhaul-plan.md
 * - AAA Pattern
 * - Space-themed Test Data
 * - Robust Error Handling Verification
 */

describe('SharedTransmission', () => {
  // Space-themed mock data for shared briefing
  const mockTransmission: Transmission = {
    id: 'TX-2024-MARS-007',
    timestamp: '2024-03-22T08:30:00Z',
    tier: 'milestone',
    title: 'Martian Surface Expedition',
    pdaNarrative: 'Successfully deployed the rover and established a secure perimeter.',
    pdaReflections: ['Soil samples collected', 'Water ice detected at 2m depth'],
    voidAnalysis: [{ voidId: 'v2', text: 'Dust Storm Delay', count: 1, impact: 'high' }],
    skillsReconciliation: [{ skillId: 's2', name: 'Exo-Geology', delta: 12, current: 92 }],
    rawLogs: { tasksCompleted: 15, totalTasks: 15, focusHours: 48 },
    metadata: { securityClearance: 'TOP-SECRET-EYES-ONLY', targetOrg: 'NASA' }
  };

  it('should render the shared briefing when a valid signal hash is provided', () => {
    // Arrange
    const signalHash = generateShareLink(mockTransmission).split('#')[1];

    // Act
    render(
      <MemoryRouter initialEntries={[`/transmission/share#${signalHash}`]}>
        <SharedTransmission />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Martian Surface Expedition')).toBeDefined();
    expect(screen.getByText(/Successfully deployed the rover/)).toBeDefined();
    expect(screen.getByText('Soil samples collected')).toBeDefined();
    expect(screen.getByText('NASA')).toBeDefined();
    expect(screen.getByText('TOP-SECRET-EYES-ONLY')).toBeDefined();
    expect(screen.getByText('Exo-Geology')).toBeDefined();
    expect(screen.getByText('Dust Storm Delay')).toBeDefined();
    expect(screen.getByText('48 Hours')).toBeDefined();
  });

  it('should display a corruption error when the signal hash is invalid', () => {
    // Arrange
    const corruptHash = 'INVALID_ENCODING_!@#$';

    // Act
    render(
      <MemoryRouter initialEntries={[`/transmission/share#${corruptHash}`]}>
        <SharedTransmission />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Transmission Error')).toBeDefined();
    expect(screen.getByText(/CORRUPT_SIGNAL/i)).toBeDefined();
    expect(screen.getByText('Return to Base')).toBeDefined();
  });

  it('should display an error when no signal hash is provided in the uplink', () => {
     // Arrange & Act
     render(
      <MemoryRouter initialEntries={['/transmission/share']}>
        <SharedTransmission />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Transmission Error')).toBeDefined();
    expect(screen.getByText(/NO_SIGNAL/)).toBeDefined();
  });
});
