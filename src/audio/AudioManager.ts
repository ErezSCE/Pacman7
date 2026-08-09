// src/audio/AudioManager.ts
// AudioManager wrapper around Howler.js providing playback, mute, volume and pitch control.
// It is a singleton object used throughout the game.

import { Howl, Howler } from 'howler';

// Types for the sound keys used in the game.
export type SoundKey =
  | 'siren'
  | 'dot'
  | 'powerPellet'
  | 'ghostEat'
  | 'death'
  | 'fruit'
  | 'extraLife';

// Configuration for each sound – source files are assumed to be placed in the public/assets/audio folder.
const soundConfig: Record<SoundKey, { src: string; loop?: boolean }> = {
  siren: { src: '/assets/audio/siren.mp3', loop: true },
  dot: { src: '/assets/audio/dot.wav' },
  powerPellet: { src: '/assets/audio/power.wav' },
  ghostEat: { src: '/assets/audio/ghost_eat.wav' },
  death: { src: '/assets/audio/death.wav' },
  fruit: { src: '/assets/audio/fruit.wav' },
  extraLife: { src: '/assets/audio/extra_life.wav' },
};

/**
 * AudioManager is a thin wrapper around Howler.js. It lazily creates Howl instances for each
 * sound key on `init`. All public methods are safe‑guards – they catch errors that may arise on
 * browsers without Web Audio support and simply no‑op, ensuring the game never crashes because of
 * audio.
 */
export const AudioManager = {
  muted: false as boolean,
  // Holds instantiated Howl objects keyed by SoundKey.
  _sounds: {} as Record<SoundKey, Howl>,

  /** Initialise the manager – create Howl instances and restore mute state from localStorage. */
  init() {
    try {
      // Create Howl objects for each configured sound.
      (Object.keys(soundConfig) as SoundKey[]).forEach((key) => {
        const cfg = soundConfig[key];
        this._sounds[key] = new Howl({ src: [cfg.src], loop: !!cfg.loop, volume: 1.0 });
      });
    } catch (e) {
      // If Howler fails (e.g., missing Web Audio), we keep _sounds empty and continue.
      console.warn('AudioManager init failed:', e);
    }

    // Restore mute state from localStorage if present.
    const stored = localStorage.getItem('soundMuted');
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      this.setMute(!!parsed);
    }
  },

  /** Play a sound identified by its key. No‑op if muted or sound not loaded. */
  play(key: SoundKey) {
    if (this.muted) return;
    const sound = this._sounds[key];
    if (!sound) return;
    try {
      sound.play();
    } catch (e) {
      console.warn('AudioManager play failed for', key, e);
    }
  },

  /** Stop a looping sound (e.g., siren). */
  stop(key: SoundKey) {
    const sound = this._sounds[key];
    if (!sound) return;
    try {
      sound.stop();
    } catch (e) {
      console.warn('AudioManager stop failed for', key, e);
    }
  },

  /** Set mute state – updates Howler global mute and persists to localStorage. */
  setMute(mute: boolean) {
    this.muted = mute;
    try {
      Howler.mute(mute);
    } catch (e) {
      console.warn('AudioManager mute failed:', e);
    }
    // Persist the setting.
    try {
      localStorage.setItem('soundMuted', JSON.stringify(mute));
    } catch (_) {
      // ignore storage errors (e.g., private mode)
    }
  },

  /** Toggle mute flag. */
  toggleMute() {
    this.setMute(!this.muted);
  },

  /** Set volume for a specific sound (0.0 – 1.0). */
  setVolume(key: SoundKey, volume: number) {
    const sound = this._sounds[key];
    if (!sound) return;
    try {
      sound.volume(volume);
    } catch (e) {
      console.warn('AudioManager setVolume failed for', key, e);
    }
  },

  /** Adjust the siren pitch based on remaining dots.
   *  The pitch (playback rate) increases as the number of remaining dots decreases.
   */
  updateSirenPitch(remainingDots: number, totalDots: number) {
    const siren = this._sounds['siren'];
    if (!siren) return;
    // Simple linear mapping: when all dots remain, rate = 1.0; when none remain, rate = 1.5.
    const minRate = 1.0;
    const maxRate = 1.5;
    const ratio = 1 - remainingDots / totalDots; // 0 -> 1
    const rate = minRate + ratio * (maxRate - minRate);
    try {
      siren.rate(rate);
    } catch (e) {
      console.warn('AudioManager updateSirenPitch failed:', e);
    }
  },
};
