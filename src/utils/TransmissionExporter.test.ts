import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateShareLink, parseShareLink } from './TransmissionExporter';
import { Transmission } from '../store/useTrackStore';

/**
 * TransmissionExporter Test Suite: Voyager Data Encoding
 * Aligning with Space-Clocker Engineering Standards (AAA, Isolated State, Space-Themed)
 */

describe('TransmissionExporter: Signal Modulation Protocol', () => {
  const mockTransmission: Transmission = {
    id: 'TX-2026-ALPHA-01',
    timestamp: '2026-03-30T12:00:00Z',
    tier: 'daily',
    title: 'Andromeda Sector Briefing',
    pdaNarrative: 'Focus levels remained optimal despite solar flare activity.',
    pdaReflections: ['Refracted thought on nebula growth.'],
    voidAnalysis: [{ voidId: 'v1', text: 'Black Hole Distraction', count: 1, impact: 'high' }],
    skillsReconciliation: [{ skillId: 's1', name: 'Astro-Mathematics', delta: 12, current: 450 }],
    missionMetrics: {
      accomplished: [],
      missed: [],
      milestones: []
    },
    rawLogs: { tasksCompleted: 15, totalTasks: 20, focusHours: 8 },
    metadata: { securityClearance: 'LEVEL-9' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateShareLink (Modulation)', () => {
    it('should encode a transmission uplink into a modulated base64 signal', () => {
      // Arrange
      // (Mock data arranged above)

      // Act
      const url = generateShareLink(mockTransmission);

      // Assert
      expect(url).toContain('/transmission/share#');
      expect(typeof url).toBe('string');
      
      // Decrypt to verify integrity
      const hash = url.split('#')[1];
      const decoded = parseShareLink(hash);
      expect(decoded.id).toBe('TX-2026-ALPHA-01');
      expect(decoded.metadata?.securityClearance).toBe('LEVEL-9');
    });
  });

  describe('parseShareLink (Demodulation)', () => {
    it('should accurately demodulate a valid incoming signal', () => {
      // Arrange
      const signal = btoa(encodeURIComponent(JSON.stringify(mockTransmission)));

      // Act
      const result = parseShareLink(signal);

      // Assert
      expect(result.title).toBe('Andromeda Sector Briefing');
      expect(result.skillsReconciliation?.[0].name).toBe('Astro-Mathematics');
    });

    it('should throw CORRUPT_SIGNAL error when processing malformed data', () => {
      // Arrange
      const corruptedSignal = 'invalid-nebula-hash-@@@';

      // Act & Assert
      expect(() => parseShareLink(corruptedSignal))
        .toThrow('CORRUPT_SIGNAL: Unable to decrypt transmission uplink.');
    });

    it('should throw error when signal is missing essential telemetry (ID, Tier, Title)', () => {
      // Arrange
      const incompleteData = { id: 'TX-1', tier: 'daily' }; // Missing title
      const signal = btoa(encodeURIComponent(JSON.stringify(incompleteData)));

      // Act & Assert
      expect(() => parseShareLink(signal))
        .toThrow('CORRUPT_SIGNAL: Unable to decrypt transmission uplink.');
    });
  });
});
