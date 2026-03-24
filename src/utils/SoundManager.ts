export class SoundManager {
  private static context = new AudioContext();

  static async playPop() {
    this.playTone(880, 0.1);
  }

  static async playThud() {
    this.playTone(110, 0.3);
  }

  static async playSwell() {
    const oscillator = this.context.createOscillator();
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

  private static playTone(freq: number, duration: number) {
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
