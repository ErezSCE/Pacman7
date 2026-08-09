// src/game/BonusFruitSystem.ts
/**
 * BonusFruitSystem manages the appearance of bonus fruit in the Pac‑Man game.
 * It tracks the number of dots eaten, spawns fruit at configured dot thresholds,
 * awards points when the fruit is collected, and removes the fruit after a timeout
 * if it is not collected.
 */

export type Direction = 'up' | 'down' | 'left' | 'right'; // placeholder for shared types

export interface Fruit {
  /** Human readable name of the fruit, e.g. "cherry" */
  type: string;
  /** Points awarded when the fruit is collected */
  points: number;
}

/**
 * Configuration options for the BonusFruitSystem.
 */
export interface BonusFruitSystemOptions {
  /** Dot counts at which a fruit should appear, in ascending order */
  spawnDots: number[];
  /** Points associated with each fruit spawn (same length as spawnDots) */
  fruitPoints: number[];
  /** How long (ms) a fruit stays on the board before disappearing */
  timeoutMs: number;
  /** Optional callbacks for side‑effects (rendering, audio, score updates) */
  onSpawn?: (fruit: Fruit) => void;
  onCollect?: (points: number) => void;
  onRemove?: (fruit: Fruit) => void;
}

/**
 * BonusFruitSystem implements the spawn/collect/timeout lifecycle.
 * It is deliberately framework‑agnostic – the UI layer can subscribe to the
 * callbacks to render the fruit sprite and play sounds.
 */
export class BonusFruitSystem {
  private spawnDots: number[];
  private fruitPoints: number[];
  private timeoutMs: number;
  private onSpawn?: (fruit: Fruit) => void;
  private onCollect?: (points: number) => void;
  private onRemove?: (fruit: Fruit) => void;

  private dotCount = 0;
  private nextSpawnIndex = 0;
  private currentFruit: Fruit | null = null;
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  // Simple deterministic fruit type list – matches classic Pac‑Man order.
  private static readonly fruitTypes = [
    'cherry',
    'strawberry',
    'orange',
    'apple',
    'melon',
    'galaxian',
    'bell',
    'key',
  ];

  constructor(options: BonusFruitSystemOptions) {
    const { spawnDots, fruitPoints, timeoutMs, onSpawn, onCollect, onRemove } = options;
    if (spawnDots.length !== fruitPoints.length) {
      throw new Error('spawnDots and fruitPoints must have the same length');
    }
    this.spawnDots = spawnDots.slice(); // copy to avoid external mutation
    this.fruitPoints = fruitPoints.slice();
    this.timeoutMs = timeoutMs;
    this.onSpawn = onSpawn;
    this.onCollect = onCollect;
    this.onRemove = onRemove;
  }

  /** Increment dot count – call this each time Pac‑Man eats a regular dot. */
  public eatDot(): void {
    this.dotCount++;
    this.maybeSpawnFruit();
  }

  /** Attempt to collect the currently visible fruit. */
  public collectFruit(): void {
    if (!this.currentFruit) return;
    const fruit = this.currentFruit;
    // Award points
    this.onCollect?.(fruit.points);
    // Clean up timeout
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    // Remove fruit from board
    this.currentFruit = null;
  }

  /** Returns the fruit currently on the board, or null if none. */
  public getCurrentFruit(): Fruit | null {
    return this.currentFruit;
  }

  /** Reset internal state – useful for tests or level restarts. */
  public reset(): void {
    this.dotCount = 0;
    this.nextSpawnIndex = 0;
    this.clearTimeout();
    this.currentFruit = null;
  }

  private maybeSpawnFruit(): void {
    if (this.currentFruit) return; // only one fruit at a time
    if (this.nextSpawnIndex >= this.spawnDots.length) return;
    const target = this.spawnDots[this.nextSpawnIndex];
    if (this.dotCount >= target) {
      // Spawn fruit
      const type = BonusFruitSystem.fruitTypes[this.nextSpawnIndex] ?? 'fruit';
      const points = this.fruitPoints[this.nextSpawnIndex];
      const fruit: Fruit = { type, points };
      this.currentFruit = fruit;
      this.onSpawn?.(fruit);
      // Schedule automatic removal
      this.timeoutHandle = setTimeout(() => {
        this.handleTimeout();
      }, this.timeoutMs);
      this.nextSpawnIndex++;
    }
  }

  private handleTimeout(): void {
    if (!this.currentFruit) return;
    const fruit = this.currentFruit;
    this.currentFruit = null;
    this.timeoutHandle = null;
    this.onRemove?.(fruit);
  }

  private clearTimeout(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }
}
