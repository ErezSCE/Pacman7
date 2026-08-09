import { GameEngine } from '../src/gameEngine';

describe('GameEngine', () => {
  it('should start and report running', () => {
    const engine = new GameEngine();
    expect(engine.isRunning()).toBe(false);
    const started = engine.start();
    expect(started).toBe(true);
    expect(engine.isRunning()).toBe(true);
  });

  it('should stop and report not running', () => {
    const engine = new GameEngine();
    engine.start();
    engine.stop();
    expect(engine.isRunning()).toBe(false);
  });
});
