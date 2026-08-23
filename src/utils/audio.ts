// Web Audio API sound synthesizer for Duolingo-style audio feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isMuted = !enabled;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play click / select pop
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // AudioContext unavailable
    }
  }

  public playClick() {
    this.playPop();
  }

  // Duolingo Correct Answer: Upward happy melodic chime
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const start = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start + index * 0.06);

        gain.gain.setValueAtTime(0.18, start + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, start + index * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start + index * 0.06);
        osc.stop(start + index * 0.06 + 0.23);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Duolingo Incorrect Answer: Low dual boop
  public playIncorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [293.66, 220]; // D4, A3
      const start = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start + index * 0.12);

        gain.gain.setValueAtTime(0.14, start + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, start + index * 0.12 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start + index * 0.12);
        osc.stop(start + index * 0.12 + 0.22);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Streak combo sound
  public playCombo() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      const start = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start + index * 0.05);

        gain.gain.setValueAtTime(0.2, start + index * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + index * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start + index * 0.05);
        osc.stop(start + index * 0.05 + 0.32);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Celebration fanfare on lesson completion
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C major triumph
      const start = this.ctx.currentTime;

      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start + i * 0.08);

        gain.gain.setValueAtTime(0.18, start + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start + i * 0.08);
        osc.stop(start + i * 0.08 + 0.65);
      });
    } catch {
      // AudioContext unavailable
    }
  }
}

export const sound = new SoundEngine();
export const SoundEffects = sound;
