// src/engine/GameEngine.ts
// Core game loop implementation for Pac‑Man.
// It updates the GameStateStore at ~60 fps using requestAnimationFrame,
// handles simple wall collisions, consumes dots/pellets/fruit, and notifies renderers.

import { GameStateStore, Direction, EntityState } from '../store/GameStateStore';

// Minimal renderer interfaces – concrete implementations live elsewhere.
export interface Renderer {
  render(state: ReturnType<GameStateStore['getState']>): void;
}

export class GameEngine {
  private store: GameStateStore;
  private renderers: Renderer[];
  private running = false;
  private lastTimestamp = 0;

  constructor(store: GameStateStore, renderers: Renderer[]) {
    this.store = store;
    this.renderers = renderers;
    // Bind tick so that requestAnimationFrame can call it with correct `this`.
    this.tick = this.tick.bind(this);
  }

  /** Start the main loop. */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.tick);
  }

  /** Stop the main loop. */
  stop() {
    this.running = false;
  }

  /** Main loop callback – can be invoked manually in tests. */
  tick(timestamp: number) {
    if (!this.running) return;
    const deltaMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const deltaSec = deltaMs / 1000;
    this.update(deltaSec);
    this.render();
    // Schedule next frame.
    requestAnimationFrame(this.tick);
  }

  /** Update game state based on elapsed time. */
  private update(deltaSec: number) {
    const state = this.store.getState();
    // Update Pac‑Man position.
    const newPac = this.moveEntity(state.pacMan, state.maze, deltaSec);
    if (newPac) {
      this.store.updatePacMan(newPac);
      // Consume any collectible at the new cell.
      this.store.consumeCell(newPac.x, newPac.y);
    }
    // Update ghosts – simple placeholder moving same speed.
    state.ghosts.forEach((ghost, idx) => {
      const newGhost = this.moveEntity(ghost, state.maze, deltaSec);
      if (newGhost) {
        this.store.updateGhost(idx, newGhost);
      }
    });
  }

  /** Render all registered renderers. */
  private render() {
    const current = this.store.getState();
    this.renderers.forEach(r => r.render(current));
  }

  /** Compute next position for an entity, handling wall collisions. */
  private moveEntity(entity: EntityState, maze: number[][], deltaSec: number): EntityState | null {
    if (entity.dir === 'none') return null;
    const dirVec = this.directionVector(entity.dir);
    const speed = entity.speed; // cells per second
    // Compute tentative new position in grid coordinates (allow fractional for smooth movement).
    const newX = entity.x + dirVec.x * speed * deltaSec;
    const newY = entity.y + dirVec.y * speed * deltaSec;
    // Determine the target cell (rounded) to check for walls.
    const targetCellX = Math.round(newX);
    const targetCellY = Math.round(newY);
    // Bounds check.
    if (
      targetCellY < 0 ||
      targetCellY >= maze.length ||
      targetCellX < 0 ||
      targetCellX >= maze[0].length
    ) {
      // Out of bounds – stop movement.
      return { ...entity, dir: 'none' };
    }
    const cell = maze[targetCellY][targetCellX];
    if (cell === 1) {
      // Wall – stop movement.
      return { ...entity, dir: 'none' };
    }
    // No collision – move entity.
    return { ...entity, x: newX, y: newY };
  }

  private directionVector(dir: Direction) {
    switch (dir) {
      case 'up':
        return { x: 0, y: -1 };
      case 'down':
        return { x: 0, y: 1 };
      case 'left':
        return { x: -1, y: 0 };
      case 'right':
        return { x: 1, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }
}
