'use client';
import { useCallback } from 'react';

export function useLenis() {
  const scrollTo = useCallback((target: string | number, options?: { duration?: number }) => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: options?.duration ?? 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    }
  }, []);
  return { scrollTo };
}
