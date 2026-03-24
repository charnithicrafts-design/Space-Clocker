export class SoundManager {
  private static context = new AudioContext();

  static async playPop() {
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = 880;
    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.1);
  }
}
