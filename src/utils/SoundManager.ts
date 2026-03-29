export class SoundManager {
  private static _context: AudioContext | null = null;

  private static get context() {
    if (!this._context && typeof window !== 'undefined') {
      this._context = new AudioContext();
    }
    return this._context;
  }

  static async playPop() {
    await this.ensureContext();
    this.playTone(880, 0.1);
  }

  static async playThud() {
    await this.ensureContext();
    this.playTone(110, 0.3);
  }

  static async playSwell() {
    await this.ensureContext();
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    // ... (rest of method remains same, but now preceded by ensureContext)
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 1.0);
    
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.context.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1.0);

    oscillator.start();
    oscillator.stop(this.context.currentTime + 1.0);
  }

  static async playUplink() {
    await this.ensureContext();
    if (!this.context) return;
    const osc1 = this.context.createOscillator();
    const osc2 = this.context.createOscillator();
    const gain = this.context.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.context.destination);

    osc1.type = 'sine';
    osc2.type = 'square';
    
    osc1.frequency.setValueAtTime(440, this.context.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1760, this.context.currentTime + 0.5);
    
    osc2.frequency.setValueAtTime(220, this.context.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.5);

    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);

    osc1.start();
    osc2.start();
    osc1.stop(this.context.currentTime + 0.5);
    osc2.stop(this.context.currentTime + 0.5);
  }

  static async playSyncSuccess() {
    await this.ensureContext();
    if (!this.context) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.type = 'sine';
    const now = this.context.currentTime;
    
    // Arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
    });

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.start();
    osc.stop(now + 0.6);
  }

  private static async ensureContext() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  private static playTone(freq: number, duration: number) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = freq;
    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }
}
