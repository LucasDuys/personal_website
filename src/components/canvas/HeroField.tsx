'use client';

import { useEffect, useRef } from 'react';

/*
  The field: a drifting constellation on Canvas 2D. Three parallax layers,
  pre-rendered additive glow sprites, perpetual slow drift. The one animated
  atmosphere on the page; monochrome-blue, never saturated surfaces.
  Reduced motion: a single static frame. Pauses when off screen or hidden.
*/
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 84;
    const LINK = 120;
    const layers = [0.45, 0.7, 1];
    const pts = Array.from({ length: N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0009,
      vy: (Math.random() - 0.5) * 0.0009,
      l: layers[i % 3],
      r: Math.random() * 1.3 + 0.6,
    }));

    // Pre-rendered glow sprite (additive)
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext('2d')!;
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, dark ? 'rgba(130,185,255,0.5)' : 'rgba(50,125,220,0.28)');
    grad.addColorStop(1, 'rgba(130,185,255,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    let px = 0.5;
    let py = 0.35;
    const onMove = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth;
      py = e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const lineBase = dark ? 'rgba(140,180,240,' : 'rgba(70,120,205,';
    const lineMax = dark ? 0.15 : 0.11;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (const p of pts) {
        p.x += p.vx * dt * p.l;
        p.y += p.vy * dt * p.l;
        if (p.x < -0.06) p.x = 1.06;
        if (p.x > 1.06) p.x = -0.06;
        if (p.y < -0.06) p.y = 1.06;
        if (p.y > 1.06) p.y = -0.06;
      }

      const sx = (p: (typeof pts)[number]) => p.x * w + (px - 0.5) * 26 * (1.4 - p.l);
      const sy = (p: (typeof pts)[number]) => p.y * h + (py - 0.5) * 16 * (1.4 - p.l);

      // ponytail: O(N^2) link pass, fine at N=84; spatial hash if N ever grows
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const ax = sx(pts[i]);
          const ay = sy(pts[i]);
          const bx = sx(pts[j]);
          const by = sy(pts[j]);
          const dx = ax - bx;
          const dy = ay - by;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = (1 - Math.sqrt(d2) / LINK) * lineMax;
            ctx.strokeStyle = `${lineBase}${o.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        const s = p.r * 14;
        ctx.drawImage(sprite, sx(p) - s / 2, sy(p) - s / 2, s, s);
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    if (reduce) {
      draw(0);
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
      };
    }

    let raf = 0;
    let last = performance.now();
    let visible = true;

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 16.7, 3);
      last = t;
      if (visible && !document.hidden) draw(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
