import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SharedTransmission from './SharedTransmission';
import { MemoryRouter } from 'react-router-dom';
import { generateShareLink } from '../../utils/TransmissionExporter';
import { Transmission } from '../../store/useTrackStore';

describe('SharedTransmission', () => {
  const mockTransmission: Transmission = {
    id: 'TX-SHARED-123',
    timestamp: new Date().toISOString(),
    tier: 'milestone',
    title: 'Milestone Briefing',
    pdaNarrative: 'Shared success',
    pdaReflections: [],
    voidAnalysis: [],
    skillsReconciliation: [],
    rawLogs: { tasksCompleted: 10, totalTasks: 10, focusHours: 20 },
    metadata: { securityClearance: 'TOP-SECRET', targetOrg: 'NASA' }
  };

  it('renders correctly when a valid hash is provided', () => {
    const link = generateShareLink(mockTransmission);
    const hash = link.split('#')[1];

    render(
      <MemoryRouter initialEntries={[`/transmission/share#${hash}`]}>
        <SharedTransmission />
      </MemoryRouter>
    );

    expect(screen.getByText('Milestone Briefing')).toBeDefined();
    expect(screen.getByText(/Shared success/)).toBeDefined();
    expect(screen.getByText('NASA')).toBeDefined();
    expect(screen.getByText('TOP-SECRET')).toBeDefined();
  });

  it('shows error message for invalid hash', () => {
    render(
      <MemoryRouter initialEntries={['/transmission/share#invalid']}>
        <SharedTransmission />
      </MemoryRouter>
    );

    expect(screen.getByText('Transmission Error')).toBeDefined();
    expect(screen.getByText(/CORRUPT_SIGNAL/)).toBeDefined();
  });
});
