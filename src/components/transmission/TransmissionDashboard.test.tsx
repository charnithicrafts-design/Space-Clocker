import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TransmissionDashboard from './TransmissionDashboard';
import { useTrackStore } from '../../store/useTrackStore';
import { MemoryRouter } from 'react-router-dom';

// Mock useTrackStore
vi.mock('../../store/useTrackStore', () => ({
  useTrackStore: vi.fn()
}));

describe('TransmissionDashboard', () => {
  const mockGenerateTransmission = vi.fn();
  const mockDeleteTransmission = vi.fn();
  const mockTransmissions = [
    {
      id: 'TX-1',
      timestamp: new Date().toISOString(),
      tier: 'daily',
      title: 'Daily Briefing',
      pdaNarrative: 'Test narrative',
      pdaReflections: ['Reflection 1'],
      voidAnalysis: [],
      skillsReconciliation: [],
      rawLogs: { tasksCompleted: 5, totalTasks: 10, focusHours: 8 },
      metadata: { securityClearance: 'LEVEL-1' }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useTrackStore as any).mockReturnValue({
      transmissions: mockTransmissions,
      generateTransmission: mockGenerateTransmission,
      deleteTransmission: mockDeleteTransmission
    });
  });

  it('renders the dashboard with transmissions list', () => {
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('The Transmission')).toBeDefined();
    expect(screen.getByText('Daily Briefing')).toBeDefined();
  });

  it('opens the initiation modal when clicking Initiate Briefing', () => {
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    const btn = screen.getByText('Initiate Briefing');
    fireEvent.click(btn);

    expect(screen.getByText('Initiate New Transmission')).toBeDefined();
    expect(screen.getByLabelText('Briefing Title')).toBeDefined();
  });

  it('calls generateTransmission when submitting the form', async () => {
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Initiate Briefing'));
    
    const titleInput = screen.getByLabelText('Briefing Title');
    fireEvent.change(titleInput, { target: { value: 'New Test Briefing' } });
    
    const narrativeInput = screen.getByPlaceholderText('Reflect on your performance, challenges, and mission realignment...');
    fireEvent.change(narrativeInput, { target: { value: 'Everything went well.' } });

    fireEvent.click(screen.getByText('Uplink Transmission'));

    await waitFor(() => {
      expect(mockGenerateTransmission).toHaveBeenCalledWith(
        'daily',
        'New Test Briefing',
        'Everything went well.',
        undefined
      );
    });
  });

  it('displays transmission details when selected', () => {
    render(
      <MemoryRouter>
        <TransmissionDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Daily Briefing'));

    expect(screen.getAllByText('Daily Briefing').length).toBeGreaterThan(1); // List and Detail
    expect(screen.getByText('Pilot\'s Discussion & Analysis')).toBeDefined();
    expect(screen.getByText('"Test narrative"')).toBeDefined();
  });
});
