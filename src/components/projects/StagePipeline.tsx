'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import type { PipelineStage } from '@/data/pipelines';

/*
  A stage pipeline in the dashed/solid grammar: upcoming stages are dashed
  (proposed), stages flip solid as the run reaches them. One mono detail line
  narrates the active stage. Reduced motion: all solid, first stage active.
*/
export function StagePipeline({ title, stages }: { title: string; stages: PipelineStage[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % stages.length), 2100);
    return () => clearInterval(t);
  }, [reduce, stages.length]);

  const shown = reduce ? 0 : active;

  return (
    <div>
      <h4 className="text-sm font-medium text-[var(--text-1)]">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {stages.map((stage, i) => {
          const reached = reduce || i <= shown;
          const isActive = i === shown;
          return (
            <motion.div
              key={stage.id}
              animate={reduce ? undefined : { scale: isActive ? 1.03 : 1 }}
              transition={SPRING}
              className={`px-3 py-2 rounded-lg bg-[var(--sheet)] ${
                reached
                  ? 'border border-[var(--hairline-strong)]'
                  : 'border border-dashed border-[var(--hairline)]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isActive && !reduce && (
                  <motion.span
                    layoutId={`pulse-${title}`}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                    transition={SPRING}
                  />
                )}
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-[var(--accent)]' : reached ? 'text-[var(--text-1)]' : 'text-[var(--text-3)]'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-[var(--text-3)]">{stage.sublabel}</div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-xs text-[var(--text-3)] min-h-[2.5em]">
        {stages[shown].detail}
      </p>
    </div>
  );
}
