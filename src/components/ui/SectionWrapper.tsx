'use client';

import { ReactNode } from 'react';
import type { SectionConfig } from '@/types';

interface Props {
  config: SectionConfig;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ config, children, className = '' }: Props) {
  return (
    <section
      id={config.id}
      className={`relative min-h-screen py-[120px] px-6 md:px-12 lg:px-20 ${className}`}
    >
      <div className="absolute top-8 left-6 md:left-12 font-mono text-xs text-[var(--text-muted)]">
        <span className="text-[var(--text-secondary)]">// {config.index}</span>
        {' - '}
        <span className="text-[var(--accent-green)]">{config.label}</span>
      </div>
      <div className="max-w-[1200px] mx-auto">
        {children}
      </div>
    </section>
  );
}
