'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

/**
 * ScrollReveal wraps content to fade in + scale up on scroll entry.
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Set initial state
    gsap.set(ref.current, {
      opacity: 0,
      y: 20,
    });

    // Create scroll trigger
    gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
        markers: false,
      },
    });

    return () => {
      // Cleanup scroll trigger
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [delay, duration]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0 }}
    >
      {children}
    </div>
  );
}

/**
 * ScrollRevealList staggers child items on scroll entry.
 */
export function ScrollRevealList({
  children,
  stagger = 0.1,
  className = '',
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const items = ref.current.querySelectorAll('[data-reveal-item]');
    gsap.set(items, { opacity: 0, y: 20 });

    items.forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: false,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
