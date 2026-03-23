class SoundManager {
  private ctx: AudioContext | null = null;
  public isSoundEnabled: boolean = true;
  public navSoundType: 'smooth' | 'pop' | 'none' = 'smooth';

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('isSoundEnabled');
      if (savedSound !== null) this.isSoundEnabled = savedSound === 'true';
      
      const savedNav = localStorage.getItem('navSoundType');
      if (savedNav === 'smooth' || savedNav === 'pop' || savedNav === 'none') {
        this.navSoundType = savedNav;
      }
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('isSoundEnabled', String(enabled));
    }
  }

  public setNavSoundType(type: 'smooth' | 'pop' | 'none') {
    this.navSoundType = type;
    if (typeof window !== 'undefined') {
      localStorage.setItem('navSoundType', type);
    }
  }

  private init() {
    if (typeof window === 'undefined' || !this.isSoundEnabled) return false;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  public playNav() {
    if (this.navSoundType === 'none') return;
    if (this.navSoundType === 'pop') {
      this.playPop();
      return;
    }
    
    // Smooth transition sound
    if (!this.init()) return;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // Very soft, low frequency sweep
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.3);
    
    // Soft attack and release
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playPop() {
    if (!this.init()) return;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
    
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playThud() {
    if (!this.init()) return;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);
    
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.2);
  }

  public playLevelUp() {
    if (!this.init()) return;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    
    // A4, C#5, E5, A5 arpeggio
    const notes = [440, 554.37, 659.25, 880]; 
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = t + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  public playSwell() {
    if (!this.init()) return;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    
    // A3, C#4, E4 ambient chord
    const freqs = [220, 277.18, 329.63]; 
    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 3);
    });
  }
}

export const soundManager = new SoundManager();
