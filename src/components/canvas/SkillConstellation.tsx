'use client';

import { useEffect, useRef, useState } from 'react';
import { SKILL_NODES, CLUSTER_LABELS, type Cluster } from '@/data/constellation';

/*
  The skill constellation: chips drift on slow sine paths, threads connect
  each node to its nearest same-cluster neighbours. Hovering a chip lights
  its cluster's threads in the accent and dims the rest. Same field grammar
  as the hero. Reduced motion: static layout, threads drawn once.
*/

const LABEL_POS: Record<Cluster, { x: number; y: number }> = {
  frontend: { x: 6, y: 4 },
  backend: { x: 60, y: 4 },
  ai: { x: 6, y: 44 },
  leadership: { x: 62, y: 58 },
};

// Precompute per-node links: 2 nearest neighbours within the same cluster
const LINKS: [number, number][] = (() => {
  const links = new Set<string>();
  SKILL_NODES.forEach((a, i) => {
    const dists = SKILL_NODES.map((b, j) => ({
      j,
      d: a.cluster === b.cluster && i !== j ? (a.x - b.x) ** 2 + (a.y - b.y) ** 2 : Infinity,
    }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { j, d } of dists) {
      if (d === Infinity) continue;
      links.add(i < j ? `${i}-${j}` : `${j}-${i}`);
    }
  });
  return [...links].map((k) => k.split('-').map(Number) as [number, number]);
})();

export function SkillConstellation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<Cluster | null>(null);
  const hoveredRef = useRef<Cluster | null>(null);
  hoveredRef.current = hovered;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Per-node drift phase/speed/amplitude
    const drift = SKILL_NODES.map((_, i) => ({
      px: (i * 137.5) % 6.28,
      py: (i * 91.7) % 6.28,
      sx: 0.00021 + (i % 5) * 0.00004,
      sy: 0.00017 + (i % 7) * 0.00004,
      ax: 7 + (i % 3) * 3,
      ay: 6 + (i % 4) * 2.5,
    }));

    const base = dark ? 'rgba(140,180,240,' : 'rgba(70,120,205,';
    const accent = dark ? 'rgba(120,180,255,' : 'rgba(20,110,220,';

    const positions: { x: number; y: number }[] = SKILL_NODES.map((n) => ({
      x: (n.x / 100) * w,
      y: (n.y / 100) * h,
    }));

    const draw = (t: number) => {
      for (let i = 0; i < SKILL_NODES.length; i++) {
        const n = SKILL_NODES[i];
        const d = drift[i];
        const dx = reduce ? 0 : Math.sin(t * d.sx + d.px) * d.ax;
        const dy = reduce ? 0 : Math.sin(t * d.sy + d.py) * d.ay;
        positions[i].x = (n.x / 100) * w + dx;
        positions[i].y = (n.y / 100) * h + dy;
        const chip = chipRefs.current[i];
        if (chip) chip.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
      }

      ctx.clearRect(0, 0, w, h);
      const hov = hoveredRef.current;
      for (const [i, j] of LINKS) {
        const cluster = SKILL_NODES[i].cluster;
        const isHov = hov !== null && cluster === hov;
        const dimmed = hov !== null && !isHov;
        const o = isHov ? 0.7 : dimmed ? 0.04 : dark ? 0.18 : 0.14;
        ctx.strokeStyle = `${isHov ? accent : base}${o})`;
        ctx.lineWidth = isHov ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[j].x, positions[j].y);
        ctx.stroke();
      }
    };

    // First frame synchronously, so threads exist even before the loop ticks
    draw(performance.now());

    if (reduce) {
      return () => window.removeEventListener('resize', resize);
    }

    let raf = 0;
    let visible = true;
    const loop = (t: number) => {
      if (visible && !document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-[440px] rounded-2xl border border-[var(--hairline)] bg-[var(--sheet)] overflow-hidden"
      style={{ boxShadow: 'var(--shadow-rest)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {(Object.keys(LABEL_POS) as Cluster[]).map((cluster) => (
        <span
          key={cluster}
          className="absolute font-mono text-[10px] uppercase tracking-wider text-[var(--text-3)] transition-opacity duration-200"
          style={{
            left: `${LABEL_POS[cluster].x}%`,
            top: `${LABEL_POS[cluster].y}%`,
            opacity: hovered === null || hovered === cluster ? 0.8 : 0.25,
          }}
        >
          {CLUSTER_LABELS[cluster]}
        </span>
      ))}

      {SKILL_NODES.map((node, i) => (
        <div
          key={node.label}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          onMouseEnter={() => setHovered(node.cluster)}
          onMouseLeave={() => setHovered(null)}
          className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--hairline)] bg-[var(--sheet)] whitespace-nowrap cursor-default transition-[opacity,border-color,box-shadow] duration-200"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: hovered === null || hovered === node.cluster ? 1 : 0.3,
            borderColor: hovered === node.cluster ? 'var(--hairline-strong)' : undefined,
            boxShadow: hovered === node.cluster ? 'var(--shadow-rest)' : undefined,
          }}
        >
          {node.icon && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={`/logos/${node.icon}.svg`} alt="" width={14} height={14} className="opacity-80" />
          )}
          <span className="text-xs text-[var(--text-2)]">{node.label}</span>
        </div>
      ))}
    </div>
  );
}
