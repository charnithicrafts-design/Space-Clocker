/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { soundManager } from '../src/utils/SoundManager';

describe('SoundManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (soundManager as any).ctx = null;
    
    // Mock AudioContext as a class
    (window as any).AudioContext = vi.fn().mockImplementation(function() {
      return {
        state: 'suspended',
        resume: vi.fn().mockResolvedValue(undefined),
        currentTime: 0,
        createOscillator: vi.fn().mockReturnValue({
          type: '',
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
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

  it('should initialize AudioContext when sound is enabled', () => {
    soundManager.setSoundEnabled(true);
    soundManager.playPop();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  it('should play thud when called', () => {
    soundManager.setSoundEnabled(true);
    vi.clearAllMocks();
    soundManager.playThud();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  it('should play swell when called', () => {
    soundManager.setSoundEnabled(true);
    vi.clearAllMocks();
    soundManager.playSwell();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  it('should not initialize AudioContext when sound is disabled', () => {
    soundManager.setSoundEnabled(false);
    vi.clearAllMocks();
    soundManager.playPop();
    expect(window.AudioContext).not.toHaveBeenCalled();
  });
});
