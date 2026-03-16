'use client';
import { useCallback } from 'react';

export function useLenis() {
  const scrollTo = useCallback((target: string | number, options?: { duration?: number }) => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: options?.duration ?? 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }, []);
  return { scrollTo };
}
