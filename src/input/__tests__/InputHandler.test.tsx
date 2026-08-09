// src/input/__tests__/InputHandler.test.tsx
import { h } from 'preact';
import { render, fireEvent, cleanup } from '@testing-library/preact';
import { initGlobalInputHandler, InputButtons, Direction } from '../InputHandler';

describe('InputHandler', () => {
  afterEach(() => {
    cleanup();
  });

  test('keyboard arrow keys produce correct directions', () => {
    const onDirection = jest.fn();
    const cleanupHandler = initGlobalInputHandler(onDirection);

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(onDirection).toHaveBeenCalledTimes(4);
    expect(onDirection.mock.calls[0][0]).toBe('up');
    expect(onDirection.mock.calls[1][0]).toBe('down');
    expect(onDirection.mock.calls[2][0]).toBe('left');
    expect(onDirection.mock.calls[3][0]).toBe('right');

    cleanupHandler();
  });

  test('WASD keys produce correct directions', () => {
    const onDirection = jest.fn();
    const cleanupHandler = initGlobalInputHandler(onDirection);

    fireEvent.keyDown(window, { key: 'w' });
    fireEvent.keyDown(window, { key: 's' });
    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'd' });

    expect(onDirection).toHaveBeenCalledTimes(4);
    expect(onDirection.mock.calls[0][0]).toBe('up');
    expect(onDirection.mock.calls[1][0]).toBe('down');
    expect(onDirection.mock.calls[2][0]).toBe('left');
    expect(onDirection.mock.calls[3][0]).toBe('right');

    cleanupHandler();
  });

  test('swipe gestures produce correct directions', () => {
    const onDirection = jest.fn();
    const cleanupHandler = initGlobalInputHandler(onDirection);

    // Swipe right
    fireEvent.touchStart(window, {
      changedTouches: [{ clientX: 10, clientY: 50 } as any],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 100, clientY: 55 } as any],
    });

    // Swipe left
    fireEvent.touchStart(window, {
      changedTouches: [{ clientX: 100, clientY: 50 } as any],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 20, clientY: 45 } as any],
    });

    // Swipe up
    fireEvent.touchStart(window, {
      changedTouches: [{ clientX: 50, clientY: 100 } as any],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 55, clientY: 20 } as any],
    });

    // Swipe down
    fireEvent.touchStart(window, {
      changedTouches: [{ clientX: 50, clientY: 20 } as any],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 45, clientY: 120 } as any],
    });

    expect(onDirection).toHaveBeenCalledTimes(4);
    expect(onDirection.mock.calls[0][0]).toBe('right');
    expect(onDirection.mock.calls[1][0]).toBe('left');
    expect(onDirection.mock.calls[2][0]).toBe('up');
    expect(onDirection.mock.calls[3][0]).toBe('down');

    cleanupHandler();
  });

  test('on‑screen buttons emit correct directions', () => {
    const onDirection = jest.fn();
    const { getByTestId } = render(<InputButtons onDirection={onDirection} />);

    fireEvent.click(getByTestId('btn-up'));
    fireEvent.click(getByTestId('btn-down'));
    fireEvent.click(getByTestId('btn-left'));
    fireEvent.click(getByTestId('btn-right'));

    expect(onDirection).toHaveBeenCalledTimes(4);
    expect(onDirection.mock.calls[0][0]).toBe('up');
    expect(onDirection.mock.calls[1][0]).toBe('down');
    expect(onDirection.mock.calls[2][0]).toBe('left');
    expect(onDirection.mock.calls[3][0]).toBe('right');
  });

  test('cleanup removes listeners', () => {
    const onDirection = jest.fn();
    const cleanupHandler = initGlobalInputHandler(onDirection);
    cleanupHandler();

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(onDirection).not.toHaveBeenCalled();
  });
});
