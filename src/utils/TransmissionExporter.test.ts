import { describe, it, expect, vi } from 'vitest';
import { generateShareLink, parseShareLink } from './TransmissionExporter';
import { Transmission } from '../store/useTrackStore';

describe('TransmissionExporter Sharing', () => {
  const mockTransmission: Transmission = {
    id: 'TX-2026-DAILY-1',
    timestamp: '2026-03-30T12:00:00Z',
    tier: 'daily',
    title: 'Test Briefing',
    pdaNarrative: 'Test narrative',
    pdaReflections: ['Ref 1'],
    voidAnalysis: [{ voidId: 'v1', text: 'Distraction', count: 2, impact: 'low' }],
    skillsReconciliation: [{ skillId: 's1', name: 'Math', delta: 5, current: 80 }],
    rawLogs: { tasksCompleted: 5, totalTasks: 10, focusHours: 4 },
    metadata: { securityClearance: 'LEVEL-1' }
  };

  it('generates a shareable URL containing the transmission data', () => {
    const url = generateShareLink(mockTransmission);
    expect(url).toContain('/transmission/share#');
    
    // Check if it can be parsed back
    const hash = url.split('#')[1];
    const parsed = parseShareLink(hash);
    expect(parsed.id).toBe(mockTransmission.id);
    expect(parsed.title).toBe(mockTransmission.title);
  });

  it('throws error for invalid hash when parsing', () => {
    expect(() => parseShareLink('invalid-hash')).toThrow();
  });
});
