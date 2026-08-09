/**
 * HighScoreService
 * Provides methods to retrieve, add, and persist the top‑10 high scores using
 * browser LocalStorage. Scores are stored under the key "highScores" as a JSON
 * array of objects with the shape `{ initials: string; score: number }`.
 *
 * The service guarantees that the returned list is always sorted in descending
 * order by score and trimmed to a maximum of ten entries.
 */

export type HighScore = {
  /** Three‑letter player initials */
  initials: string;
  /** Numeric score */
  score: number;
};

const STORAGE_KEY = 'highScores';

/** Utility to load scores from LocalStorage safely */
function loadScores(): HighScore[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Ensure each entry has required shape
      return parsed.filter(
        (s) => typeof s.initials === 'string' && typeof s.score === 'number'
      );
    }
    return [];
  } catch {
    return [];
  }
}

/** Utility to persist scores to LocalStorage */
function saveScores(scores: HighScore[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

/** Sort scores descending and keep only the top 10 */
function trim(scores: HighScore[]): HighScore[] {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  return sorted.slice(0, 10);
}

export const HighScoreService = {
  /** Retrieve the current top‑10 high scores */
  getTopScores(): HighScore[] {
    return loadScores();
  },

  /** Add a new score and persist the updated top‑10 list */
  addScore(initials: string, score: number): void {
    const scores = loadScores();
    scores.push({ initials, score });
    const trimmed = trim(scores);
    saveScores(trimmed);
  },

  /** Clear all stored scores – useful for testing */
  _clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
