'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registry';
import SplitType from 'split-type';
import { REVEAL } from '@/lib/animations';

type RevealType = keyof typeof REVEAL;

export function useScrollReveal(type: RevealType = 'paragraph') {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const el = ref.current;
    let split: SplitType | null = null;

    // Text-based reveals use SplitType
    if (type === 'heading' || type === 'paragraph') {
      split = new SplitType(el, { types: 'lines' });
      split.lines?.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block';
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    }

    const targets = split?.lines ?? (el.children.length > 0 ? el.children : el);
    const preset = REVEAL[type];

    const tween = gsap.from(targets, {
      ...preset,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      tween.kill();
      split?.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [type]);

  return ref;
}
