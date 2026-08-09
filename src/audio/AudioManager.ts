// Simple AudioManager stub for the start screen
export const AudioManager = {
  muted: false,
  setMute(mute: boolean) {
    this.muted = mute;
    // In a real implementation this would call Howler.mute(mute)
    // Here we just store the state and persist to localStorage
    localStorage.setItem('soundMuted', JSON.stringify(mute));
  },
  toggleMute() {
    this.setMute(!this.muted);
  },
  init() {
    const stored = localStorage.getItem('soundMuted');
    if (stored !== null) {
      this.muted = JSON.parse(stored);
    }
  }
};
