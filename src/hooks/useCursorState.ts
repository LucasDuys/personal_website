// Global cursor state, updated by mouse events, read by particle system
export const cursorState = {
  x: 0,
  y: 0,
  isPressed: false,
  isOverInteractive: false,
};

// Initialize mouse tracking (call once from a client component)
export function initCursorTracking() {
  if (typeof window === 'undefined') return;

  const handleMove = (e: MouseEvent) => {
    cursorState.x = e.clientX;
    cursorState.y = e.clientY;
  };
  const handleDown = () => {
    cursorState.isPressed = true;
  };
  const handleUp = () => {
    cursorState.isPressed = false;
  };

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mousedown', handleDown);
  window.addEventListener('mouseup', handleUp);

  return () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mousedown', handleDown);
    window.removeEventListener('mouseup', handleUp);
  };
}
