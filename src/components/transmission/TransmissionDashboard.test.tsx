import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TransmissionDashboard from './TransmissionDashboard';
import { useTrackStore } from '../../store/useTrackStore';
import { MemoryRouter } from 'react-router-dom';

/**
 * TransmissionDashboard UI Tests
 * 
 * Aligned with conductor/test-overhaul-plan.md
 * - AAA Pattern
 * - Isolated State (Mocked Store)
 * - Space-themed Test Data
 * - Meaningful User Interactions
 */

// Mock useTrackStore
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn()
}));

// Mock SoundManager
vi.mock('../../utils/SoundManager', () => ({
  SoundManager: {
    playPop: vi.fn(),
    playThud: vi.fn(),
    playSwell: vi.fn(),
    playBleep: vi.fn(),
    playHiss: vi.fn(),
  }
}));

describe('TransmissionDashboard', () => {
  const mockGenerateTransmission = vi.fn();
  const mockDeleteTransmission = vi.fn();
  
  // Space-themed mock data
  const mockTransmissions = [
    {
      id: 'TX-2024-DAILY-001',
      timestamp: '2024-03-20T10:00:00Z',
      tier: 'daily',
      title: 'Orion Nebula Survey',
      pdaNarrative: 'Successful scan of the stellar nursery.',
      pdaReflections: ['Refined sensor calibration', 'Identified 3 protostars'],
      voidAnalysis: [{ voidId: 'v1', text: 'Stellar Interference', count: 2, impact: 'medium' }],
      skillsReconciliation: [{ skillId: 's1', name: 'Astrogation', delta: 5, current: 85 }],
      missionMetrics: { accomplished: [], missed: [], milestones: [] },
      rawLogs: { tasksCompleted: 8, totalTasks: 10, focusHours: 6 },
      metadata: { securityClearance: 'LEVEL-2-SECRET', targetOrg: 'AWS' }
    },
    {
      id: 'TX-2024-WEEKLY-002',
      timestamp: '2024-03-21T15:00:00Z',
      tier: 'weekly',
      title: 'Andromeda Transit Log',
      pdaNarrative: 'Maintained warp stability through the void.',
      pdaReflections: ['Engine efficiency optimized'],
      voidAnalysis: [],
      skillsReconciliation: [],
      missionMetrics: { accomplished: [], missed: [], milestones: [] },
      rawLogs: { tasksCompleted: 45, totalTasks: 50, focusHours: 40 },
      metadata: { securityClearance: 'LEVEL-1-UNCLASSIFIED' }
    }
  ];

  const mockAmbitions = [
    {
      id: 'a1',
      title: 'Deep Space Explorer',
      progress: 45,
      xp: 1200,
      milestones: [
        { id: 'm1', title: 'Propulsion Mastery', tasks: [], status: 'active' }
      ],
      horizon: 'yearly'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      transmissions: mockTransmissions,
      ambitions: mockAmbitions,
      generateTransmission: mockGenerateTransmission,
      deleteTransmission: mockDeleteTransmission
    });
    
    // Mock window.confirm for deletion
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('should render the dashboard with a list of recent mission uplinks', () => {
    // Arrange
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    // Act & Assert
    expect(screen.getByText('The Transmission')).toBeDefined();
    expect(screen.getByText('Orion Nebula Survey')).toBeDefined();
    expect(screen.getByText('Andromeda Transit Log')).toBeDefined();
    expect(screen.getByText('8/10')).toBeDefined(); // Task progress for first tx
  });

  it('should open the initiation modal and uplink a new mission briefing', async () => {
    // Arrange
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    // Act
    const initiateBtn = screen.getByText('Initiate Briefing');
    fireEvent.click(initiateBtn);

    const titleInput = screen.getByLabelText('Briefing Title');
    const narrativeInput = screen.getByLabelText('PD&A Narrative');
    const tierSelect = screen.getByLabelText('Transmission Tier');
    const targetSelect = screen.getByLabelText('Target Career Track');
    
    fireEvent.change(titleInput, { target: { value: 'Alpha Centauri Arrival' } });
    fireEvent.change(narrativeInput, { 
      target: { value: 'Atmosphere entry successful. No anomalies detected.' } 
    });
    fireEvent.change(tierSelect, { target: { value: 'milestone' } });
    fireEvent.change(targetSelect, { target: { value: 'INDIA_AI' } });

    const uplinkBtn = screen.getByText('Uplink Transmission');
    fireEvent.click(uplinkBtn);

    // Assert
    await waitFor(() => {
      expect(mockGenerateTransmission).toHaveBeenCalledWith(
        'milestone',
        'Alpha Centauri Arrival',
        'Atmosphere entry successful. No anomalies detected.',
        'INDIA_AI',
        expect.any(Object), // dateRange
        undefined, // targetAmbitionId
        undefined  // targetMilestoneId
      );
    });
  });

  it('should display full transmission details in the Holo-Viewer when a briefing is selected', () => {
    // Arrange
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    // Act
    const briefingLink = screen.getByText('Orion Nebula Survey');
    fireEvent.click(briefingLink);

    // Assert
    // Check for title in the detail view (it will appear twice, once in list and once in detail)
    const titles = screen.getAllByText('Orion Nebula Survey');
    expect(titles.length).toBeGreaterThan(1);
    
    expect(screen.getByText("Pilot's Discussion & Analysis")).toBeDefined();
    expect(screen.getByText(/"Successful scan of the stellar nursery."/)).toBeDefined();
    expect(screen.getByText('Astrogation')).toBeDefined();
    expect(screen.getByText('Stellar Interference')).toBeDefined();
    expect(screen.getAllByText('AWS').length).toBeGreaterThan(1);
  });

  it('should copy the shareable signal to the clipboard for external agencies', async () => {
    // Arrange
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    vi.stubGlobal('navigator', { clipboard: mockClipboard });

    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    // Select a transmission first
    fireEvent.click(screen.getByText('Orion Nebula Survey'));

    // Act
    const shareBtn = screen.getByText('Share Signal');
    fireEvent.click(shareBtn);

    // Assert
    expect(mockClipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText('Signal Copied')).toBeDefined();
  });

  it('should declassify and delete a transmission after pilot confirmation', async () => {
    // Arrange
    const { container } = render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );
    
    // Select a transmission
    fireEvent.click(screen.getByText('Orion Nebula Survey'));

    // Act
    // Find the delete button by its container or icon since it lacks a text label
    const deleteBtn = screen.getByLabelText(/Declassify and delete this transmission/i);
    
    fireEvent.click(deleteBtn);

    // Check if modal is open
    expect(screen.getByText(/Declassify Transmission/i)).toBeInTheDocument();

    // Confirm purge
    const confirmButton = screen.getByRole('button', { name: /Confirm Purge/i });
    fireEvent.click(confirmButton);

    // Assert
    expect(mockDeleteTransmission).toHaveBeenCalledWith('TX-2024-DAILY-001');
  });

  it('should toggle between Glossy and Raw Data views in the Holo-Viewer', () => {
    // Arrange
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Orion Nebula Survey'));

    // Act
    const rawBtn = screen.getByText('Raw Data');
    fireEvent.click(rawBtn);

    // Assert
    expect(screen.getByText('SYSTEM_AUDIT_LOG v4.2')).toBeDefined();
    
    // Act back to Glossy
    const glossyBtn = screen.getByText('Glossy');
    fireEvent.click(glossyBtn);
    
    // Assert
    expect(screen.queryByText('SYSTEM_AUDIT_LOG v4.2')).toBeNull();
    expect(screen.getByText("Pilot's Discussion & Analysis")).toBeDefined();
  });
});
