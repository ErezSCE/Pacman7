// src/store/GameStateStore.ts
// Simple in‑memory store for the Pac‑Man game state.
// It provides a minimal Redux‑like API (getState, dispatch, subscribe)
// to keep the implementation lightweight for this exercise.

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface EntityState {
  x: number; // column index in the maze grid
  y: number; // row index in the maze grid
  dir: Direction;
  speed: number; // cells per second
}

export interface GameState {
  pacMan: EntityState;
  ghosts: EntityState[];
  // 0 = empty, 1 = wall, 2 = dot, 3 = power pellet, 4 = fruit
  maze: number[][];
  score: number;
}

type Listener = () => void;

export class GameStateStore {
  private state: GameState;
  private listeners: Listener[] = [];

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  getState(): GameState {
    // Return a shallow copy to prevent accidental mutation.
    return { ...this.state, maze: this.state.maze.map(row => [...row]) };
  }

  // Simple dispatch that accepts a partial state update.
  // In a real app this would be a Redux reducer.
  dispatch(partial: Partial<GameState>) {
    this.state = { ...this.state, ...partial } as GameState;
    this.notify();
  }

  // Update nested entities (pacMan or ghosts) safely.
  updatePacMan(partial: Partial<EntityState>) {
    this.state.pacMan = { ...this.state.pacMan, ...partial };
    this.notify();
  }

  updateGhost(index: number, partial: Partial<EntityState>) {
    const ghost = this.state.ghosts[index];
    if (!ghost) return;
    this.state.ghosts[index] = { ...ghost, ...partial };
    this.notify();
  }

  // Consume a dot/pellet/fruit at the given cell.
  consumeCell(x: number, y: number) {
    const cell = this.state.maze[y][x];
    if (cell === 2) {
      // dot
      this.state.maze[y][x] = 0;
      this.state.score += 10;
    } else if (cell === 3) {
      // power pellet
      this.state.maze[y][x] = 0;
      this.state.score += 50;
    } else if (cell === 4) {
      // fruit
      this.state.maze[y][x] = 0;
      this.state.score += 100;
    }
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    // Return an unsubscribe function.
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}
