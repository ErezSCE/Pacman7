import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Initialize global input listeners (keyboard and touch) and forward direction events.
 * Returns a cleanup function that removes the listeners.
 */
export function initGlobalInputHandler(
  onDirection: (dir: Direction) => void
): () => void {
  // Keyboard handler
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    let dir: Direction | undefined;
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        dir = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        dir = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        dir = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        dir = 'right';
        break;
    }
    if (dir) {
      onDirection(dir);
    }
  };

  // Touch handling – simple swipe detection
  let touchStartX = 0;
  let touchStartY = 0;
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  };
  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    // Determine dominant direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0) {
        onDirection('right');
      } else if (dx < 0) {
        onDirection('left');
      }
    } else {
      // Vertical swipe
      if (dy > 0) {
        onDirection('down');
      } else if (dy < 0) {
        onDirection('up');
      }
    }
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
 * On‑screen directional buttons for touch devices or accessibility.
 */
export const InputButtons: FunctionComponent<{ onDirection: (dir: Direction) => void }> = ({ onDirection }) => {
  // Simple wrapper to avoid re‑creating handlers on each render
  const makeHandler = (dir: Direction) => () => onDirection(dir);

  return (
    <div>
      <button data-testid="btn-up" onClick={makeHandler('up')}>↑</button>
      <button data-testid="btn-down" onClick={makeHandler('down')}>↓</button>
      <button data-testid="btn-left" onClick={makeHandler('left')}>←</button>
      <button data-testid="btn-right" onClick={makeHandler('right')}>→</button>
    </div>
  );
};

// Export a default component that registers global listeners when mounted – optional convenience.
export const GlobalInputProvider: FunctionComponent<{ onDirection: (dir: Direction) => void }> = ({ onDirection }) => {
  useEffect(() => {
    const cleanup = initGlobalInputHandler(onDirection);
    return cleanup;
  }, [onDirection]);
  return null;
};
