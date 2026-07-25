'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SPRING } from '@/lib/motion';

/*
  The command-bar scene: an ask gets typed, the matching build assembles as a
  dashed proposal, then commits solid with the accent edge. The dashed→solid
  grammar, animated. Reduced motion shows the resolved state of scene one.
*/

interface Scene {
  ask: string;
  title: string;
  meta: string;
  pills: string[];
}

const SCENES: Scene[] = [
  {
    ask: 'coach my pitch and grill me like an investor',
    title: 'Pitchr.live',
    meta: 'built in 24h at HackEurope Paris',
    pills: ['record the pitch', 'score 5 dimensions', 'mock investor Q&A'],
  },
  {
    ask: 'turn one sentence into my weekly groceries',
    title: 'Weekly Shop Agent',
    meta: '5 agents, one DAG, built in 6h',
    pills: ['plan the meals', 'negotiate the budget', 'fill the cart'],
  },
  {
    ask: 'let agents act on company data, governed',
    title: 'Stacklink',
    meta: 'in pilot, 60+ companies in pipeline',
    pills: ['permission-aware reads', 'approve-in-inbox writes', 'hash-chained audit'],
  },
];

type Phase = 'typing' | 'assembling' | 'committed' | 'clearing';

export function LiveDemo() {
  const reduce = useReducedMotion();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [pillCount, setPillCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scene = SCENES[sceneIdx];

  useEffect(() => {
    if (reduce) return;
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    if (phase === 'typing') {
      if (typed.length < scene.ask.length) {
        later(() => setTyped(scene.ask.slice(0, typed.length + 1)), 38);
      } else {
        later(() => setPhase('assembling'), 350);
      }
    } else if (phase === 'assembling') {
      if (pillCount < scene.pills.length) {
        later(() => setPillCount(pillCount + 1), 420);
      } else {
        later(() => setPhase('committed'), 550);
      }
    } else if (phase === 'committed') {
      later(() => setPhase('clearing'), 3000);
    } else {
      later(() => {
        setTyped('');
        setPillCount(0);
        setSceneIdx((sceneIdx + 1) % SCENES.length);
        setPhase('typing');
      }, 450);
    }

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reduce, phase, typed, pillCount, sceneIdx, scene.ask, scene.pills.length]);

  // Reduced motion: resolved state of scene one, no loop
  const rTyped = reduce ? SCENES[0].ask : typed;
  const rPills = reduce ? SCENES[0].pills.length : pillCount;
  const rPhase: Phase = reduce ? 'committed' : phase;
  const committed = rPhase === 'committed';

  return (
    <section aria-label="What building with me looks like" className="max-w-6xl mx-auto px-5 md:px-10 pb-28 md:pb-36">
      <div className="max-w-3xl mx-auto">
        {/* Command bar */}
        <div
          className="flex items-center gap-3 rounded-2xl border border-[var(--hairline)] bg-[var(--sheet)] px-5 py-4"
          style={{ boxShadow: 'var(--shadow-raised)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" aria-hidden="true" />
          <p className="font-mono text-sm md:text-[15px] text-[var(--text-1)] min-h-[1.4em]">
            {rTyped}
            {!reduce && rPhase === 'typing' && (
              <motion.span
                className="inline-block w-[8px] h-[1.1em] bg-[var(--accent)] ml-[2px] align-text-bottom"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.05, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </p>
        </div>

        {/* Assembly area */}
        <div className="mt-5 min-h-[210px]">
          <AnimatePresence mode="wait">
            {rPhase !== 'clearing' && (
              <motion.div
                key={sceneIdx}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
              >
                <div className="flex flex-wrap gap-2">
                  {scene.pills.slice(0, rPills).map((pill) => (
                    <motion.span
                      key={pill}
                      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={SPRING}
                      className="px-2.5 py-1 rounded-lg border border-[var(--hairline)] bg-[var(--sheet)] font-mono text-xs text-[var(--text-2)]"
                    >
                      {pill}
                    </motion.span>
                  ))}
                </div>

                {(rPills > 0 || committed) && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: 0.1 }}
                    className={`relative mt-4 rounded-2xl bg-[var(--sheet)] px-5 py-4 transition-shadow duration-500 ${
                      committed
                        ? 'border border-[var(--hairline)]'
                        : 'border border-dashed border-[var(--hairline-strong)]'
                    }`}
                    style={{ boxShadow: committed ? 'var(--shadow-raised)' : undefined }}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute left-[-1px] top-4 bottom-4 w-[2px] rounded-full bg-[var(--accent)] origin-top"
                      initial={false}
                      animate={{ scaleY: committed ? 1 : 0 }}
                      transition={SPRING}
                    />
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-base font-semibold text-[var(--text-1)]">{scene.title}</h3>
                      <span className="font-mono text-[11px] text-[var(--text-3)]">
                        {committed ? 'committed' : 'proposed'}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-[var(--text-3)]">{scene.meta}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-2 text-center text-xs text-[var(--text-3)]">
          Dashed is a proposal. Solid is shipped. Everything above is real work from the last year.
        </p>
      </div>
    </section>
  );
}
