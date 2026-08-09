import { h } from 'preact';
import './StartScreen.css';
import { useEffect, useState } from 'preact/hooks';
import { AudioManager } from '@/audio/AudioManager';

import { HighScoreService } from '@/highscore/HighScoreService';

export const StartScreen = () => {
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [colorBlind, setColorBlind] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<Array<{ initials: string; score: number }>>([]);

  useEffect(() => {
    AudioManager.init();
    setSoundMuted(AudioManager.muted);
    const stored = localStorage.getItem('colorBlindMode');
    const cb = stored ? JSON.parse(stored) : false;
    setColorBlind(cb);
    applyColorBlindMode(cb);
    setHighScores(HighScoreService.getTopScores());
  }, []);

  const toggleSound = () => {
    AudioManager.toggleMute();
    setSoundMuted(AudioManager.muted);
  };

  const toggleColorBlind = () => {
    const newVal = !colorBlind;
    localStorage.setItem('colorBlindMode', JSON.stringify(newVal));
    setColorBlind(newVal);
    applyColorBlindMode(newVal);
  };

  const applyColorBlindMode = (enabled: boolean) => {
    const root = document.documentElement;
    if (enabled) {
      root.style.setProperty('--palette', 'colorblind');
    } else {
      root.style.removeProperty('--palette');
    }
  };

  const startGame = () => {
    // Placeholder: In real app, would navigate to game screen
    const event = new CustomEvent('start-game');
    window.dispatchEvent(event);
  };

  return (
    <div class="start-screen" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Pac‑Man 7</h1>
      <section aria-label="high scores">
        <h2>High Scores</h2>
        {highScores.length === 0 ? (
          <p>No scores yet.</p>
        ) : (
          <ol>
            {highScores.slice(0, 10).map((s, i) => (
              <li key={i}>
                {s.initials} — {s.score}
              </li>
            ))}
          </ol>
        )}
      </section>
      <button onClick={startGame} class="start-button" aria-label="Start Game">
        Start Game
      </button>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={toggleSound} aria-label="Toggle Sound" class="sound-toggle">
          Sound: {soundMuted ? 'Off' : 'On'}
        </button>
        <button onClick={toggleColorBlind} aria-label="Toggle Color‑Blind Mode" class="colorblind-toggle" style={{ marginLeft: '0.5rem' }}>
          Color‑Blind: {colorBlind ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
