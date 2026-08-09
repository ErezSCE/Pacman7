// src/input/InputHandler.ts
// InputHandler module: normalises keyboard, WASD, swipe gestures, and on-screen button events
// into direction commands for the game engine.

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

/**
 * Initialise global input listeners (keyboard and touch) and forward normalized directions
 * to the provided callback. Returns a cleanup function to remove listeners.
 */
export function initGlobalInputHandler(onDirection: (dir: Direction) => void): () => void {
  const keyMap: Record<string, Direction> = {
    ArrowUp: 'up',
    w: 'up',
    W: 'up',
    ArrowDown: 'down',
    s: 'down',
    S: 'down',
    ArrowLeft: 'left',
    a: 'left',
    A: 'left',
    ArrowRight: 'right',
    d: 'right',
    D: 'right',
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const dir = keyMap[e.key];
    if (dir) {
      e.preventDefault();
      onDirection(dir);
    }
  };

  // Simple swipe detection
  let touchStartX = 0;
  let touchStartY = 0;
  const minSwipeDist = 30; // pixels

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < minSwipeDist && Math.abs(dy) < minSwipeDist) return;
    let dir: Direction = 'none';
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }
    onDirection(dir);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Preact component rendering on‑screen directional buttons.
 * Clicking/tapping a button forwards the corresponding direction via onDirection.
 */
import { h } from 'preact';

export interface InputButtonsProps {
  onDirection: (dir: Direction) => void;
}

export function InputButtons({ onDirection }: InputButtonsProps) {
  const btn = (dir: Direction, label: string) => (
    <button
      data-testid={`btn-${dir}`}
      type="button"
      onClick={() => onDirection(dir)}
      style={{ width: '48px', height: '48px', margin: '4px' }}
    >
      {label}
    </button>
  );

  return (
    <div data-testid="input-buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {btn('up', '↑')}
      <div style={{ display: 'flex' }}>
        {btn('left', '←')}
        {btn('down', '↓')}
        {btn('right', '→')}
      </div>
    </div>
  );
}
