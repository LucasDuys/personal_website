'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/registry';
import { cursorState, initCursorTracking } from '@/hooks/useCursorState';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ReturnType<typeof Object> | null>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanupCursor: (() => void) | undefined;
    let resizeTimer: number;

    // Dynamic import to avoid SSR issues with WebGL
    import('./particleSystem').then(({ ParticleSystem }) => {
      if (cancelled) return;

      const count = reducedMotion ? 150 : isMobile ? 300 : isTablet ? 500 : 800;
      const system = new ParticleSystem();

      try {
        system.init(canvas, count);
      } catch (e) {
        console.warn('WebGL not available, skipping particles');
        return;
      }

      systemRef.current = system;

      // Resize handler
      const handleResize = () => {
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        system.resize(canvas.width, canvas.height);
      };

      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(handleResize, 150);
      };

      handleResize();
      window.addEventListener('resize', debouncedResize);

      // FPS monitoring for adaptive quality
      let frameCount = 0;
      let lastFpsCheck = performance.now();
      let currentQuality = 0;

      // GSAP ticker callback (runs every frame)
      const tickerCallback = (time: number) => {
        if (document.hidden || !systemRef.current) return;

        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        system.update(
          time,
          scrollY,
          vh,
          cursorState.x,
          cursorState.y + scrollY, // Convert to document coords
          cursorState.isPressed,
        );
        system.render();

        // FPS check every 60 frames
        frameCount++;
        if (frameCount >= 60) {
          const now = performance.now();
          const elapsed = now - lastFpsCheck;
          const fps = (frameCount / elapsed) * 1000;

          if (fps < 50 && currentQuality < 4) {
            currentQuality++;
            system.setQuality(currentQuality);
          } else if (fps > 55 && currentQuality > 0) {
            currentQuality--;
            system.setQuality(currentQuality);
          }

          frameCount = 0;
          lastFpsCheck = now;
        }
      };

      gsap.ticker.add(tickerCallback);

      // Init cursor tracking
      cleanupCursor = initCursorTracking();

      // Visibility change - pause when tab hidden
      const handleVisibility = () => {
        if (document.hidden) {
          gsap.ticker.sleep();
        } else {
          gsap.ticker.wake();
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);

      // Store cleanup in a way the outer effect can call it
      canvas.dataset.cleanup = 'ready';
      (canvas as any).__cleanup = () => {
        gsap.ticker.remove(tickerCallback);
        window.removeEventListener('resize', debouncedResize);
        document.removeEventListener('visibilitychange', handleVisibility);
        cleanupCursor?.();
        system.destroy();
        systemRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      if ((canvas as any).__cleanup) {
        (canvas as any).__cleanup();
        delete (canvas as any).__cleanup;
      }
    };
  }, [reducedMotion, isMobile, isTablet]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
