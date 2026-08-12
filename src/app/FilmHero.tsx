'use client';

import { useEffect, useRef } from 'react';
import { FilmScene } from '@/lib/film';

/**
 * The scroll wiring for the film.
 *
 * One passive scroll listener, coalesced to a frame, writes CSS custom
 * properties on the stage and a progress uniform into the scene. React renders
 * this tree exactly once; nothing here re-renders on scroll. The words are all
 * real DOM at real type sizes, the canvas carries only light.
 *
 * Reduced motion is decided by CSS, not by JS state: the stylesheet flattens
 * the 300svh journey into a static composition, so the server render and the
 * hydrated render always agree on layout. JS only skips driving the canvas.
 */

const EASE_ARRIVE = [0.16, 1, 0.3, 1] as const;
const EASE_EXIT = [0.4, 0, 1, 1] as const;

/** Numeric cubic-bezier by bisection, the same curves the CSS uses. */
function curve([x1, y1, x2, y2]: readonly [number, number, number, number]) {
  const axis = (t: number, a: number, b: number) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  };
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 18; i++) {
      t = (lo + hi) / 2;
      if (axis(t, x1, x2) < x) lo = t;
      else hi = t;
    }
    return axis(t, y1, y2);
  };
}

const arrive = curve(EASE_ARRIVE);
const depart = curve(EASE_EXIT);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const enter = (a: number, b: number, p: number) => arrive(clamp01((p - a) / (b - a)));
const exit = (a: number, b: number, p: number) => depart(clamp01((p - a) / (b - a)));

/** The three caption windows: figure first, then the words stand alone. */
const CAPS = [
  { in: [0.28, 0.34], out: [0.42, 0.48] },
  { in: [0.52, 0.58], out: [0.66, 0.72] },
  { in: [0.76, 0.82], out: [0.94, 0.99] },
] as const;

/**
 * Each element's window on the 0..1 scroll timeline.
 *
 * Returns how strongly a caption currently holds the stage, so the scene can
 * pour the field downward under it. While a caption is up, the canvas drains
 * to near nothing (the last one keeps a ghost of the mark), and the caption
 * itself arrives from above and departs downward: one continuous fall, the
 * direction the reader is already travelling.
 */
function applyJourney(stage: HTMLElement, p: number): number {
  const title = 1 - exit(0.05, 0.14, p);
  const cue = 1 - exit(0.015, 0.05, p);
  let calm = 0;
  CAPS.forEach((w, i) => {
    const arrive = enter(w.in[0], w.in[1], p);
    const leave = exit(w.out[0], w.out[1], p);
    const cap = arrive * (1 - leave);
    calm = Math.max(calm, i === 2 ? cap * 0.8 : cap);
    stage.style.setProperty(`--fc${i}`, String(cap));
    stage.style.setProperty(`--fc${i}-y`, `${-24 * (1 - arrive) + 20 * leave}px`);
  });
  stage.style.setProperty('--ft', String(title));
  stage.style.setProperty('--ft-y', `${-26 * (1 - title)}px`);
  /* A faded title must also leave the accessibility tree and the hit-test
     plane, or an invisible button keeps focus and clicks mid-film. */
  stage.style.setProperty('--ft-vis', title < 0.02 ? 'hidden' : 'visible');
  stage.style.setProperty('--fcue', String(cue));
  /* The canvas swells through the transits and drains under the words. */
  const swell = 0.55 + enter(0.06, 0.26, p) * 0.35 * (1 - exit(0.9, 1, p) * 0.5);
  stage.style.setProperty('--fcv', String(swell * (1 - 0.9 * calm)));
  stage.style.setProperty('--frail', String(p));
  stage.dataset.progress = p.toFixed(3);
  return calm;
}

export default function FilmHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = section.current;
    const stageNode = stage.current;
    if (!node || !stageNode || !canvas.current) return;
    /* Reduced motion never constructs the scene at all: the stylesheet is
       already showing the static cut and hiding the canvas, so a GL context
       here would render into a display:none buffer for nobody. */
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let scene: FilmScene | null = null;
    try {
      scene = new FilmScene(canvas.current);
      scene.mount(false);
    } catch {
      // No WebGL: the words and the photography carry the page alone.
    }

    let frame = 0;
    const read = () => {
      frame = 0;
      const range = Math.max(1, node.offsetTop + node.offsetHeight - innerHeight);
      const p = clamp01((scrollY - node.offsetTop) / range);
      const calm = applyJourney(stageNode, p);
      scene?.setProgress(p, calm);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      scene?.destroy();
    };
  }, []);

  return (
    <section id="top" ref={section} className="film" aria-label="Introduction">
      <p className="sr-only">
        Scroll to play the opening film. Stage dust gathers into a spotlight ring for the TU/e
        Contest where Stacklink placed second of seventy teams, rises along a trajectory through
        the Cape engineering work, and settles into the LD mark as Lucas is selected for Antler
        ONE. The full record follows below.
      </p>

      <div ref={stage} className="film-stage">
        <canvas ref={canvas} className="film-canvas" aria-hidden="true" />

        <div className="film-title frame">
          <p className="film-kicker">Founder / AI engineer</p>
          <h1>
            <span>Lucas</span> <span>Duys</span>
          </h1>
          <p className="film-summary">
            Building a stealth AI startup. Selected for Antler ONE, September 2026.
          </p>
          <a className="film-action" href="#experience">
            View experience
          </a>
        </div>

        <div className="film-cap film-cap-0">
          <p className="cap-label">Stacklink / TU/e Contest 2026</p>
          <p className="cap-figure">2nd of 70</p>
          <p className="cap-line">€5,500 won across the TU/e Contest prize and The Gate grant.</p>
        </div>

        <div className="film-cap film-cap-1">
          <p className="cap-label">Cape engineering</p>
          <p className="cap-figure">500×</p>
          <p className="cap-line">More inputs, while runtime fell from 55s to about 8s at 98% accuracy.</p>
        </div>

        <div className="film-cap film-cap-2">
          <p className="cap-label">Antler ONE / September 2026</p>
          <p className="cap-figure">1 of ~100</p>
          <p className="cap-line">founders selected from about 10,000 applicants across Europe. Now building in stealth.</p>
        </div>

        <p className="film-cue" aria-hidden="true">
          Scroll
          <svg viewBox="0 0 12 14" width="12" height="14">
            <path d="M6 1v11M1.5 8 6 12.5 10.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </p>

        <div className="film-rail" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
