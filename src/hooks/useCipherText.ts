'use client';
import { useState, useCallback, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useCipherText(originalText: string) {
  const [text, setText] = useState(originalText);
  const animating = useRef(false);
  const reducedMotion = useReducedMotion();
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-!#$%';

  const scramble = useCallback(() => {
    if (animating.current) return;
    if (reducedMotion) {
      // Skip the scramble flourish entirely; the text is already correct.
      setText(originalText);
      return;
    }
    animating.current = true;
    let resolved = 0;

    const interval = setInterval(() => {
      setText(() => {
        return originalText
          .split('')
          .map((char, i) => {
            if (i < resolved) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });
    }, 40);

    const resolveInterval = setInterval(() => {
      resolved++;
      if (resolved >= originalText.length) {
        clearInterval(interval);
        clearInterval(resolveInterval);
        setText(originalText);
        animating.current = false;
      }
    }, 35);
  }, [originalText, chars, reducedMotion]);

  return { text, scramble };
}
