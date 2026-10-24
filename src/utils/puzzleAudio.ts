// PIXAL LAB — Sliding Puzzle Synthesized Audio System
// Powered by browser Web Audio API: 100% offline, zero latency, zero external asset downloads.

class PuzzleAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('pixallab_puzzle_sound');
      if (saved !== null) {
        this.isMuted = saved === 'false';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getSoundEnabled(): boolean {
    return !this.isMuted;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isMuted = !enabled;
    try {
      localStorage.setItem('pixallab_puzzle_sound', enabled ? 'true' : 'false');
    } catch {
      // ignore storage limitations
    }
  }

  // Soft wooden / marimba tile click sound
  public playMove(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      // Slight pitch variation for organic tactile feel
      const freq = 420 + Math.random() * 40;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio playback fails gracefully
    }
  }

  // Triumphant victory arpeggio
  public playVictory(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const notes = [261.63, 329.63, 392.0, 523.25, 659.25]; // C4, E4, G4, C5, E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.12;
        const dur = 0.45;

        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Audio playback fails gracefully
    }
  }

  // Level unlock fanfare chime
  public playUnlock(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25]; // A4, C#5, E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.1;
        const dur = 0.35;

        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Audio playback fails gracefully
    }
  }
}

export const puzzleAudio = new PuzzleAudioEngine();
