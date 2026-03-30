import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OracleService } from './OracleService';
import { OracleConfig } from '../store/useTrackStore';

/**
 * OracleService Test Suite: Deep Space Insight
 * Aligning with Space-Clocker Engineering Standards (AAA, Isolated State, Space-Themed)
 */

describe('OracleService: Deep Space Wisdom Protocol', () => {
  const mockConfig: OracleConfig = {
    providerUrl: 'https://oracle.nebula.ai/v1',
    apiKey: 'nebula-secret-key-111',
    model: 'quantum-vision-v4',
  };

  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.clearAllMocks();
  });

  describe('query (Prophecy Uplink)', () => {
    it('should consult the Oracle and return stellar guidance', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          choices: [{ message: { content: 'The stars align for your productivity, Commander.' } }] 
        }),
      });

      // Act
      const result = await OracleService.query(
        mockConfig, 
        'What is my trajectory?', 
        'Sector 7 logs: Focus high.'
      );
      
      // Assert
      expect(fetchMock).toHaveBeenCalledWith(
        'https://oracle.nebula.ai/v1/chat/completions', 
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer nebula-secret-key-111',
          }),
        })
      );
      expect(result).toBe('The stars align for your productivity, Commander.');
    });

    it('should throw error if configuration is lost in the void', async () => {
      // Arrange
      const missingConfig = { providerUrl: '', apiKey: '', model: '' } as OracleConfig;

      // Act & Assert
      await expect(OracleService.query(missingConfig, 'hello', ''))
        .rejects.toThrow('Oracle configuration missing.');
    });

    it('should throw error if the Oracle signal is corrupted (Response Not OK)', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Cosmic Interference',
      });

      // Act & Assert
      await expect(OracleService.query(mockConfig, 'prompt', 'context'))
        .rejects.toThrow('Oracle query failed: Cosmic Interference');
    });
  });

  describe('getDailyDebrief (Log Analysis)', () => {
    it('should synthesize a debrief from daily logs and reflections', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          choices: [{ message: { content: 'Daily mission report: 90% efficiency.' } }] 
        }),
      });

      const tasks = [{ id: 1, title: 'Calibrate Warp Drive', completed: true }];
      const reflections = ['Focused well during the meteor shower.'];
      const stats = { focusTime: 3600 };

      // Act
      const debrief = await OracleService.getDailyDebrief(mockConfig, tasks, reflections, stats);

      // Assert
      expect(fetchMock).toHaveBeenCalled();
      expect(debrief).toBe('Daily mission report: 90% efficiency.');
    });
  });
});
