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
    calm = Math.max(calm, cap);
    stage.style.setProperty(`--fc${i}`, String(cap));
    stage.style.setProperty(`--fc${i}-y`, `${-24 * (1 - arrive) + 20 * leave}px`);
    /* Each caption carries a live link; while invisible it must leave the
       accessibility tree and the hit-test plane. */
    stage.style.setProperty(`--fc${i}-vis`, cap < 0.02 ? 'hidden' : 'visible');
  });
  stage.style.setProperty('--ft', String(title));
  stage.style.setProperty('--ft-y', `${-26 * (1 - title)}px`);
  /* A faded title must also leave the accessibility tree and the hit-test
     plane, or an invisible button keeps focus and clicks mid-film. */
  stage.style.setProperty('--ft-vis', title < 0.02 ? 'hidden' : 'visible');
  stage.style.setProperty('--fcue', String(cue));
  /* The canvas swells through the transits and only settles slightly under
     the words: the field stays present, parted around them. */
  const swell = 0.55 + enter(0.06, 0.26, p) * 0.35 * (1 - exit(0.9, 1, p) * 0.5);
  stage.style.setProperty('--fcv', String(swell * (1 - 0.25 * calm)));
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
        ONE. What he is building now, and the full record, follow below.
      </p>

      <div ref={stage} className="film-stage">
        <canvas ref={canvas} className="film-canvas" aria-hidden="true" />

        <div className="film-title frame">
          <p className="film-kicker">Founder / AI engineer</p>
          <h1>
            <span>Lucas</span> <span>Duys</span>
          </h1>
          <p className="film-summary">
            Building Athren, autonomous conversion experimentation for growth teams. Antler ONE,
            September 2026.
          </p>
          <a className="film-action" href="#now">
            What I&apos;m building
          </a>
        </div>

        <div className="film-cap film-cap-0">
          <a className="cap-brand" href="https://stacklink.nl">
            <svg viewBox="0 0 374 274" width="30" height="22" aria-hidden="true">
              <path
                fill="currentColor"
                d="M152 238.355 187.355 203l35.356 35.355-35.356 35.355zm50-50L237.355 153l35.356 35.355-35.356 35.355zm-151-53L86.355 100l35.356 35.355-35.356 35.355zm100-100L186.355 0l35.356 35.355-35.356 35.356L151 35.355Zm-50 50L136.355 50l35.356 35.355-35.356 35.355zm0 103L136.355 153l35.356 35.355-35.356 35.355zm-101-105L35.355 48l35.356 35.355-35.356 35.355zm0 103L35.355 151l35.356 35.355-35.356 35.355zm253-48L288.355 103l35.356 35.355-35.356 35.355zm50-50L338.355 53l35.356 35.355-35.356 35.355zm0 103L338.355 156l35.356 35.355-35.356 35.355zm-102-103L236.355 53l35.356 35.355-35.356 35.356L201 88.355Z"
              />
            </svg>
            <span>Stacklink</span>
            <span aria-hidden="true" className="cap-brand-arrow">↗</span>
          </a>
          <p className="cap-label">TU/e Contest 2026</p>
          <p className="cap-figure">2nd of 70</p>
          <p className="cap-line">€5,500 won across the TU/e Contest prize and The Gate grant.</p>
        </div>

        <div className="film-cap film-cap-1">
          <a className="cap-brand" href="https://cape.io">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8.187 15.162a6.5 6.5 0 0 1 1.767-.953A6 6 0 0 1 12 13.86q1.07 0 2.046.349a6.5 6.5 0 0 1 1.767.953 4.8 4.8 0 0 0 .845-1.442A4.9 4.9 0 0 0 16.96 12q0-2.062-1.45-3.51Q14.062 7.04 12 7.04T8.49 8.49Q7.04 9.937 7.04 12q0 .915.302 1.72a4.8 4.8 0 0 0 .845 1.442m2.27-3.17a2.1 2.1 0 0 1-.627-1.542q0-.915.628-1.542A2.1 2.1 0 0 1 12 8.28q.915 0 1.542.628.628.627.628 1.542t-.628 1.542A2.1 2.1 0 0 1 12 12.62q-.915 0-1.542-.628M12 18.2a6 6 0 0 1-2.418-.488 6.3 6.3 0 0 1-1.969-1.325 6.3 6.3 0 0 1-1.325-1.969A6 6 0 0 1 5.8 12q0-1.287.488-2.418a6.3 6.3 0 0 1 1.325-1.968q.837-.837 1.969-1.326A6 6 0 0 1 12 5.8q1.286 0 2.418.488 1.131.489 1.968 1.326t1.326 1.968Q18.2 10.713 18.2 12t-.488 2.418a6.3 6.3 0 0 1-1.326 1.969q-.837.837-1.968 1.325A6 6 0 0 1 12 18.2m1.55-1.48q.729-.24 1.333-.69a4.7 4.7 0 0 0-1.333-.69A4.9 4.9 0 0 0 12 15.1q-.822 0-1.55.24t-1.333.69q.604.45 1.333.69t1.55.24 1.55-.24m-.884-5.603a.9.9 0 0 0 .264-.667.9.9 0 0 0-.264-.666A.9.9 0 0 0 12 9.52a.9.9 0 0 0-.667.264.9.9 0 0 0-.263.666q0 .402.263.667a.9.9 0 0 0 .667.263q.402 0 .666-.264"
              />
            </svg>
            <span>Cape.io</span>
            <span aria-hidden="true" className="cap-brand-arrow">↗</span>
          </a>
          <p className="cap-label">Agent engineering</p>
          <p className="cap-figure">500×</p>
          <p className="cap-line">More inputs, while runtime fell from 55s to about 8s at 98% accuracy.</p>
        </div>

        <div className="film-cap film-cap-2">
          <a className="cap-brand" href="https://www.antler.co/continental-europe">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <rect width="24" height="24" rx="5.5" fill="currentColor" />
              <path
                d="M7.2 17.4 12 6.9l4.8 10.5"
                fill="none"
                stroke="var(--ground)"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Antler ONE</span>
            <span aria-hidden="true" className="cap-brand-arrow">↗</span>
          </a>
          <p className="cap-label">September 2026</p>
          <p className="cap-figure">1 of ~100</p>
          <p className="cap-line">founders selected from about 10,000 applicants across Europe.</p>
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
