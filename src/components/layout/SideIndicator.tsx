'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

interface SideIndicatorProps {
  activeSection: string;
}

export function SideIndicator({ activeSection }: SideIndicatorProps) {
  const { scrollTo } = useLenis();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      scrollTo(`#${id}`);
    },
    [scrollTo],
  );

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const totalGap = (SECTIONS.length - 1) * 24; // gap between dots
  const filledHeight = totalGap > 0 ? (scrollProgress * 100) : 0;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
      {/* Track */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Background line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{ background: 'var(--border)' }}
        />
        {/* Filled line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px origin-top transition-all duration-300"
          style={{
            height: `${filledHeight}%`,
            background: 'linear-gradient(to bottom, var(--accent-green), rgba(74,222,128,0.3))',
          }}
        />

        {/* Dots */}
        {SECTIONS.map((section, i) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative z-10 flex items-center justify-center w-4 h-4 group"
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Dot */}
              <span
                className="block w-2.5 h-2.5 rounded-full border transition-all duration-300"
                style={{
                  borderColor: isActive ? 'var(--accent-green)' : 'var(--border)',
                  background: isActive ? 'var(--accent-green)' : 'transparent',
                  boxShadow: isActive ? '0 0 8px rgba(74,222,128,0.5), 0 0 16px rgba(74,222,128,0.2)' : 'none',
                }}
              />

              {/* Hover label */}
              {hoveredIndex === i && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-6 whitespace-nowrap font-mono text-[10px] text-[var(--text-muted)] bg-[var(--surface-1)] px-2 py-1 rounded border border-[var(--border)]"
                >
                  {section.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
