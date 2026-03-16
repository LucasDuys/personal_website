'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registry';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { CLIPrompt } from '@/components/ui/CLIPrompt';
import { MetricCounter } from '@/components/ui/MetricCounter';
import { EXPERIENCE } from '@/data/experience';

function ProgressBar({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="flex items-center gap-2 mt-3 font-mono text-xs">
      <span className="text-[var(--text-muted)]">[</span>
      <div className="flex-1 max-w-[200px] h-1.5 bg-[var(--surface-1)] rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full"
          style={{
            width: '65%',
            background:
              'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))',
          }}
        />
        <div
          className="absolute top-0 h-full w-2 rounded-full"
          style={{
            left: '63%',
            background: 'var(--accent-green)',
            animation: 'blink 1.5s ease-in-out infinite',
            boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
          }}
        />
      </div>
      <span className="text-[var(--accent-green)]">IN PROGRESS</span>
      <span className="text-[var(--text-muted)]">]</span>
    </div>
  );
}

function MetricsDashboard({
  metrics,
}: {
  metrics: { label: string; value: number; suffix: string }[];
}) {
  return (
    <div className="mt-4 font-mono text-xs">
      <div className="text-[var(--text-muted)]">
        {'┌─────────────────────────────────────┐'}
      </div>
      <div className="text-[var(--text-muted)]">
        {'│'}{' '}
        <span className="text-[var(--text-secondary)]">metrics dashboard</span>
        {'                   │'}
      </div>
      <div className="text-[var(--text-muted)]">
        {'├─────────────────────────────────────┤'}
      </div>
      {metrics.map((metric, i) => (
        <div key={i} className="text-[var(--text-muted)]">
          {'│'}{' '}
          <span className="text-[var(--text-secondary)] inline-block min-w-[140px]">
            {metric.label}
          </span>
          <span className="text-[var(--accent-green)] font-semibold">
            <MetricCounter
              target={metric.value}
              prefix="+"
              suffix={metric.suffix}
            />
          </span>
          {'  │'}
        </div>
      ))}
      <div className="text-[var(--text-muted)]">
        {'└─────────────────────────────────────┘'}
      </div>
    </div>
  );
}

export function Experience() {
  const [cliDone, setCliDone] = useState(false);
  const entriesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cliDone || !entriesRef.current) return;
    const ctx = gsap.context(() => {
      const entries = entriesRef.current!.querySelectorAll('.exp-entry');
      gsap.from(entries, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: entriesRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cliDone]);

  return (
    <SectionWrapper
      config={{ id: 'experience', index: '005', label: 'experience' }}
    >
      <div ref={sectionRef}>
        {/* CLI prompt */}
        <div className="mb-8">
          <CLIPrompt
            command="git log --oneline --experience"
            onComplete={() => setCliDone(true)}
          />
        </div>

        {cliDone && (
          <div ref={entriesRef} className="mt-6 space-y-8">
            {EXPERIENCE.map((entry) => (
              <div
                key={entry.hash}
                className="exp-entry border-l border-[var(--border)] pl-6 py-2"
              >
                {/* Header line */}
                <div className="font-mono text-sm flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[var(--accent-amber)] font-semibold">
                    {entry.hash}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {entry.dateRange}
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {entry.title}{' '}
                    <span className="text-[var(--text-muted)]">@</span>{' '}
                    <span style={{ color: entry.companyColor }}>
                      {entry.company}
                    </span>
                  </span>
                </div>

                {/* Description lines */}
                <div className="mt-3 space-y-1.5">
                  {entry.description.map((line, i) => (
                    <p
                      key={i}
                      className="font-mono text-xs text-[var(--text-secondary)] pl-2"
                    >
                      <span className="text-[var(--text-muted)] mr-2">-</span>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                {entry.tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metrics dashboard (Amplifirm) */}
                {entry.metrics && <MetricsDashboard metrics={entry.metrics} />}

                {/* Progress bar (active entries) */}
                <ProgressBar active={entry.status === 'active'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
