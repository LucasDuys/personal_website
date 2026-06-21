'use client';
import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registry';

interface Props {
  annotation?: string;
}

export function SynapseBridge({ annotation }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !textRef.current) return;
    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      {
        opacity: 0.6,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div ref={ref} className="h-[150px] flex items-center justify-center relative">
      {annotation && (
        <span
          ref={textRef}
          className="font-mono text-xs text-[var(--text-muted)] opacity-0"
        >
          {annotation}
        </span>
      )}
    </div>
  );
}
