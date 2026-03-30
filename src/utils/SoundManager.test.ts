import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SoundManager } from './SoundManager';

// Mock the Web Audio API globally
const mockOscillator = {
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  type: 'sine',
  frequency: {
    value: 440,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
};

const mockGainNode = {
  connect: vi.fn(),
  gain: {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
};

const mockAudioContextInstance = {
  createBufferSource: vi.fn(),
  createGain: vi.fn().mockReturnValue(mockGainNode),
  destination: {},
  decodeAudioData: vi.fn(),
  close: vi.fn(),
  createOscillator: vi.fn().mockReturnValue(mockOscillator),
  state: 'suspended',
  resume: vi.fn().mockResolvedValue(undefined),
  currentTime: 10,
};

// Use a class for the stub to properly handle 'new AudioContext()'
class MockAudioContext {
  constructor() {
    Object.assign(this, mockAudioContextInstance);
  }
}

vi.stubGlobal('AudioContext', MockAudioContext);

describe('SoundManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have static methods defined', () => {
    expect(typeof SoundManager.playUplink).toBe('function');
    expect(typeof SoundManager.playSyncSuccess).toBe('function');
    expect(typeof SoundManager.playThud).toBe('function');
    expect(typeof SoundManager.playSwell).toBe('function');
    expect(typeof SoundManager.playPop).toBe('function');
  });

  describe('playUplink', () => {
    it('should create and play oscillators when uplink sound is requested', async () => {
      await SoundManager.playUplink();

      // We expect 2 oscillators based on implementation
      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalledTimes(2);
      expect(mockOscillator.start).toHaveBeenCalled();
      expect(mockOscillator.stop).toHaveBeenCalled();
    });
  });

  describe('playSyncSuccess', () => {
    it('should play oscillators for sync success', async () => {
      await SoundManager.playSyncSuccess();

      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });
  });

  describe('playThud', () => {
    it('should play thud tone', async () => {
      await SoundManager.playThud();

      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.frequency.value).toBe(110);
    });
  });

  describe('playPop', () => {
    it('should play pop tone', async () => {
      await SoundManager.playPop();

      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.frequency.value).toBe(880);
    });
  });
});
