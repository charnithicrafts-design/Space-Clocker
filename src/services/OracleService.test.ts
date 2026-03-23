import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OracleService } from './OracleService';
import { OracleConfig } from '../store/useTrackStore';

describe('OracleService', () => {
  const mockConfig: OracleConfig = {
    providerUrl: 'http://localhost:8000',
    apiKey: 'sk-test-123',
    model: 'gpt-4',
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should throw error if config is missing', async () => {
    const invalidConfig = { providerUrl: '', apiKey: '', model: '' };
    await expect(OracleService.query(invalidConfig, 'hello', '')).rejects.toThrow('Oracle configuration missing.');
  });

  it('should call fetch with correct parameters', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'hello world' } }] }),
    });

    const result = await OracleService.query(mockConfig, 'prompt', 'context');
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/chat/completions', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Authorization': 'Bearer sk-test-123',
      }),
    }));
    expect(result).toBe('hello world');
  });

  it('should throw error if response is not ok', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      statusText: 'Unauthorized',
    });

    await expect(OracleService.query(mockConfig, 'prompt', 'context')).rejects.toThrow('Oracle query failed: Unauthorized');
  });
});
