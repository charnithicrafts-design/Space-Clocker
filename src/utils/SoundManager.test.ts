import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SoundManager } from './SoundManager';

/**
 * SoundManager Test Suite: Auditory HUD Core
 * Aligning with Space-Clocker Engineering Standards (AAA, Isolated State)
 */

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
  state: 'suspended' as AudioContextState,
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
    // Reset internal state if possible - since _context is private, we use a dirty hack or just rely on clearAllMocks
    (SoundManager as any)._context = null;
  });

  describe('Auditory HUD Initialisation', () => {
    it('should initialize the AudioContext when a sound is first played', async () => {
      // Arrange
      // Act
      await SoundManager.playPop();

      // Assert
      expect(mockAudioContextInstance.resume).toHaveBeenCalled();
    });
  });

  describe('Sound Frequency Protocols (AAA)', () => {
    it('should play Nebula Pop (880Hz) when uplink signal is processed', async () => {
      // Arrange
      // (Mocks are already arranged)

      // Act
      await SoundManager.playPop();

      // Assert
      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.frequency.value).toBe(880);
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it('should play Gravity Thud (110Hz) when a heavy event occurs', async () => {
      // Arrange

      // Act
      await SoundManager.playThud();

      // Assert
      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.frequency.value).toBe(110);
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it('should play Stellar Swell when transitioning between horizons', async () => {
      // Arrange

      // Act
      await SoundManager.playSwell();

      // Assert
      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(880, expect.any(Number));
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it('should play Galactic Uplink with dual oscillators for complex signals', async () => {
      // Arrange

      // Act
      await SoundManager.playUplink();

      // Assert
      // Implementations uses 2 oscillators
      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalledTimes(2);
      expect(mockOscillator.start).toHaveBeenCalledTimes(2);
    });

    it('should play Sync Success Arpeggio when data is successfully transmitted', async () => {
      // Arrange

      // Act
      await SoundManager.playSyncSuccess();

      // Assert
      expect(mockAudioContextInstance.createOscillator).toHaveBeenCalled();
      // Verifying arpeggio steps (4 frequencies in implementation)
      expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledTimes(4);
      expect(mockOscillator.start).toHaveBeenCalled();
    });
  });
});
