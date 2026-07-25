'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { HeroField } from '@/components/canvas/HeroField';
import { useLenis } from '@/hooks/useLenis';
import { SPRING } from '@/lib/motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { scrollTo } = useLenis();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Photo card commits shortly after the page settles: dashed -> solid
  const [committed, setCommitted] = useState(false);
  useEffect(() => {
    if (reduce) {
      setCommitted(true);
      return;
    }
    const t = setTimeout(() => setCommitted(true), 1600);
    return () => clearTimeout(t);
  }, [reduce]);

  // Scroll parallax: content drifts up and fades as the hero leaves
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -30]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="ambient-sky absolute inset-0 pointer-events-none" aria-hidden="true" />
      <HeroField />

      <div className="relative w-full max-w-6xl mx-auto px-5 md:px-10 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.h1
            {...enter(0.05)}
            className="font-[family-name:var(--font-display)] font-semibold text-[var(--text-1)] text-5xl md:text-6xl tracking-tight leading-[1.02]"
          >
            Lucas Duys
          </motion.h1>
          <motion.p
            {...enter(0.16)}
            className="mt-6 text-lg md:text-xl text-[var(--text-2)] leading-relaxed max-w-[46ch]"
          >
            I build AI tooling: agents, dev workflows, and the glue around them.
          </motion.p>
          <motion.p {...enter(0.24)} className="mt-3 text-sm text-[var(--text-3)] max-w-[52ch]">
            CS at TU Eindhoven. Co-founder at Stacklink. AI engineering intern at cape.io.
          </motion.p>
          <motion.div {...enter(0.34)} className="mt-9 flex flex-wrap items-center gap-3">
            <motion.button
              onClick={() => scrollTo('#projects')}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[var(--ink)] text-[var(--on-ink)] text-sm font-medium"
            >
              See the work
            </motion.button>
            <motion.button
              onClick={() => scrollTo('#contact')}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[var(--hairline-strong)] text-sm text-[var(--text-1)] hover:border-[var(--text-3)] transition-colors duration-150"
            >
              Contact
            </motion.button>
          </motion.div>
        </motion.div>

        {/* The proof: a real artifact that commits on arrival (dashed -> solid) */}
        <motion.figure
          {...enter(0.3)}
          style={{ y: yCard, opacity: fade }}
          className={`relative rounded-2xl bg-[var(--sheet)] overflow-hidden transition-shadow duration-700 ${
            committed
              ? 'border border-[var(--hairline)]'
              : 'border border-dashed border-[var(--hairline-strong)]'
          }`}
        >
          <motion.span
            aria-hidden="true"
            className="absolute left-[-1px] top-6 bottom-6 w-[2px] rounded-full bg-[var(--accent)] origin-top z-10"
            initial={false}
            animate={{ scaleY: committed ? 1 : 0 }}
            transition={SPRING}
          />
          {committed && (
            <span className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'var(--shadow-raised)' }} aria-hidden="true" />
          )}
          <img
            src="/images/me/stage-pitch.jpg"
            alt="Lucas presenting Stacklink on stage at the TU/e Contest finals"
            className="block w-full"
            fetchPriority="high"
          />
          <figcaption className="px-4 py-3 border-t border-[var(--hairline)] text-[13px] text-[var(--text-2)] flex items-baseline justify-between gap-4">
            <span>TU/e Contest finals, pitching Stacklink</span>
            <span className="font-mono text-xs text-[var(--text-3)] whitespace-nowrap">
              First runner-up · 2026
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
