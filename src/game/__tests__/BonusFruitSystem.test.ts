// src/game/__tests__/BonusFruitSystem.test.ts
import { BonusFruitSystem, Fruit } from '../BonusFruitSystem';

describe('BonusFruitSystem', () => {
  const spawnDots = [70, 170];
  const fruitPoints = [100, 300];
  const timeoutMs = 1000; // 1 second for test speed

  let spawned: Fruit[] = [];
  let collectedPoints: number[] = [];
  let removed: Fruit[] = [];
  let system: BonusFruitSystem;

  beforeEach(() => {
    spawned = [];
    collectedPoints = [];
    removed = [];
    system = new BonusFruitSystem({
      spawnDots,
      fruitPoints,
      timeoutMs,
      onSpawn: (fruit) => spawned.push(fruit),
      onCollect: (points) => collectedPoints.push(points),
      onRemove: (fruit) => removed.push(fruit),
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('spawns first fruit after 70 dots', () => {
    for (let i = 0; i < 70; i++) {
      system.eatDot();
    }
    expect(spawned.length).toBe(1);
    expect(spawned[0].type).toBe('cherry');
    expect(spawned[0].points).toBe(100);
    expect(system.getCurrentFruit()).not.toBeNull();
  });

  test('collecting fruit awards points and clears fruit', () => {
    // spawn first fruit
    for (let i = 0; i < 70; i++) system.eatDot();
    const fruit = system.getCurrentFruit();
    expect(fruit).not.toBeNull();
    system.collectFruit();
    expect(collectedPoints).toEqual([fruit!.points]);
    expect(system.getCurrentFruit()).toBeNull();
  });

  test('fruit disappears after timeout if not collected', () => {
    for (let i = 0; i < 70; i++) system.eatDot();
    const fruit = system.getCurrentFruit();
    expect(fruit).not.toBeNull();
    // advance timers beyond timeout
    jest.advanceTimersByTime(timeoutMs + 10);
    expect(removed).toHaveLength(1);
    expect(removed[0].type).toBe('cherry');
    expect(system.getCurrentFruit()).toBeNull();
  });

  test('spawns second fruit after 170 dots', () => {
    // eat 170 dots total
    for (let i = 0; i < 170; i++) system.eatDot();
    // first fruit should have spawned at 70, second at 170
    expect(spawned.length).toBe(2);
    expect(spawned[0].type).toBe('cherry');
    expect(spawned[1].type).toBe('strawberry');
    expect(system.getCurrentFruit()).not.toBeNull();
    expect(system.getCurrentFruit()!.type).toBe('strawberry');
  });
});
