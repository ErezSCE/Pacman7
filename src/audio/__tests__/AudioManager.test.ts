// src/audio/__tests__/AudioManager.test.ts
import { AudioManager, SoundKey } from '../AudioManager';

// Mock Howler.js
jest.mock('howler', () => {
  const mockPlay = jest.fn();
  const mockStop = jest.fn();
  const mockVolume = jest.fn();
  const mockRate = jest.fn();
  class Howl {
    opts: any;
    constructor(opts: any) {
      this.opts = opts;
    }
    play = mockPlay;
    stop = mockStop;
    volume = mockVolume;
    rate = mockRate;
  }
  const Howler = {
    mute: jest.fn(),
  };
  return { Howl, Howler };
});

describe('AudioManager', () => {
  beforeEach(() => {
    // Reset mocks and state before each test
    (AudioManager as any)._sounds = {} as Record<SoundKey, any>;
    (AudioManager as any).muted = false;
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('init creates Howl instances for each sound', () => {
    AudioManager.init();
    const sounds = (AudioManager as any)._sounds as Record<SoundKey, any>;
    const expectedKeys: SoundKey[] = [
      'siren',
      'dot',
      'powerPellet',
      'ghostEat',
      'death',
      'fruit',
      'extraLife',
    ];
    expectedKeys.forEach((key) => {
      expect(sounds[key]).toBeDefined();
      // The mock Howl stores the config in opts
      expect(sounds[key].opts.src).toContain(`${key}`);
    });
  });

  test('play invokes Howl.play when not muted', () => {
    AudioManager.init();
    const playSpy = (AudioManager as any)._sounds['dot'].play as jest.Mock;
    AudioManager.play('dot');
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  test('play does nothing when muted', () => {
    AudioManager.init();
    AudioManager.setMute(true);
    const playSpy = (AudioManager as any)._sounds['dot'].play as jest.Mock;
    AudioManager.play('dot');
    expect(playSpy).not.toHaveBeenCalled();
  });

  test('setMute updates state, Howler and persists to localStorage', () => {
    const howler = require('howler').Howler as any;
    AudioManager.setMute(true);
    expect((AudioManager as any).muted).toBe(true);
    expect(howler.mute).toHaveBeenCalledWith(true);
    expect(localStorage.getItem('soundMuted')).toBe('true');

    AudioManager.setMute(false);
    expect((AudioManager as any).muted).toBe(false);
    expect(howler.mute).toHaveBeenCalledWith(false);
    expect(localStorage.getItem('soundMuted')).toBe('false');
  });

  test('toggleMute flips the mute flag', () => {
    AudioManager.toggleMute();
    expect((AudioManager as any).muted).toBe(true);
    AudioManager.toggleMute();
    expect((AudioManager as any).muted).toBe(false);
  });

  test('updateSirenPitch sets correct playback rate', () => {
    AudioManager.init();
    const siren = (AudioManager as any)._sounds['siren'];
    const rateSpy = siren.rate as jest.Mock;

    // All dots remaining -> rate 1.0
    AudioManager.updateSirenPitch(100, 100);
    expect(rateSpy).toHaveBeenCalledWith(1.0);

    // No dots remaining -> rate 1.5
    rateSpy.mockClear();
    AudioManager.updateSirenPitch(0, 100);
    expect(rateSpy).toHaveBeenCalledWith(1.5);

    // Halfway -> rate 1.25
    rateSpy.mockClear();
    AudioManager.updateSirenPitch(50, 100);
    expect(rateSpy).toHaveBeenCalledWith(1.25);
  });
});
