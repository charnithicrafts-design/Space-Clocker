/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SoundManager } from '../src/utils/SoundManager';

describe('SoundManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (SoundManager as any)._context = null;
    
    // Mock AudioContext as a class
    (window as any).AudioContext = vi.fn().mockImplementation(function() {
      return {
        state: 'suspended',
        resume: vi.fn().mockResolvedValue(undefined),
        currentTime: 0,
        createOscillator: vi.fn().mockReturnValue({
          type: '',
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), value: 440 },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        }),
        createGain: vi.fn().mockReturnValue({
          gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
        }),
        destination: {},
      };
    });
  });

  it('should initialize AudioContext when a sound is played', async () => {
    await SoundManager.playPop();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  it('should play thud when called', async () => {
    await SoundManager.playThud();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  it('should play swell when called', async () => {
    await SoundManager.playSwell();
    expect(window.AudioContext).toHaveBeenCalled();
  });
});
