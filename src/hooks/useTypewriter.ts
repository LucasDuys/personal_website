'use client';
import { useState, useRef, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TypewriterOptions {
  speed?: number;
  jitter?: number;
  onComplete?: () => void;
}

export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const { speed = 45, jitter = 15, onComplete } = options;
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const start = useCallback(() => {
    indexRef.current = 0;
    setDisplayText('');
    setIsComplete(false);

    // With reduced motion, jump straight to the final text and skip
    // the per-character animation. The information is conveyed; the
    // typewriter flourish is not.
    if (reducedMotion) {
      setDisplayText(text);
      setIsComplete(true);
      onComplete?.();
      return () => {};
    }

    const typeNext = () => {
      if (indexRef.current >= text.length) {
        setIsComplete(true);
        onComplete?.();
        return;
      }
      indexRef.current++;
      setDisplayText(text.slice(0, indexRef.current));
      const delay = speed + (Math.random() * 2 - 1) * jitter;
      timeoutRef.current = setTimeout(typeNext, Math.max(10, delay));
    };

    timeoutRef.current = setTimeout(typeNext, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, jitter, onComplete, reducedMotion]);

  return { displayText, isComplete, start };
}
