'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';

const NAV_LINKS = [
  { label: './about', target: '#about', section: 'about' },
  { label: './work', target: '#projects', section: 'projects' },
  { label: './skills', target: '#skills', section: 'skills' },
  { label: './experience', target: '#experience', section: 'experience' },
  { label: './contact', target: '#contact', section: 'contact' },
];

interface NavBarProps {
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
  activeSection: string;
}

export function NavBar({ onOpenCommandPalette, onOpenMobileMenu, activeSection }: NavBarProps) {
  const { scrollTo } = useLenis();
  const [visible, setVisible] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);
  const lastScrollY = useRef(0);
  const [isMac, setIsMac] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Remove pulse after 6 seconds (3 plays x 2s each)
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const threshold = window.innerHeight * 0.8;
      const isPast = currentY > threshold;
      setPastThreshold(isPast);

      if (!isPast) {
        setVisible(false);
      } else {
        // Scrolling up → show, scrolling down → hide
        setVisible(currentY < lastScrollY.current);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (target: string) => {
      scrollTo(target);
    },
    [scrollTo],
  );

  // Show navbar when past threshold AND (scrolling up OR just entered threshold)
  const shouldShow = pastThreshold && visible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.nav
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6"
          style={{
            background: 'rgba(6,6,10,0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(30,30,46,0.5)',
          }}
        >
          {/* Left: Logo */}
          <button
            onClick={() => handleNavClick('#hero')}
            className="group flex items-center gap-1.5 font-mono text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors"
          >
            lucas
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] group-hover:animate-pulse" />
            duys
          </button>

          {/* Center: Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <button
                  key={link.section}
                  onClick={() => handleNavClick(link.target)}
                  className={`relative font-mono text-xs transition-colors ${
                    isActive
                      ? 'text-[var(--accent-green)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--accent-green)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--accent-green)]"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Command palette + resume + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border)] font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-colors"
              style={showPulse ? {
                animation: 'subtlePulse 2s ease-in-out 3',
              } : undefined}
            >
              {isMac ? '\u2318K' : 'Ctrl K'}
            </button>
            <a
              href="/resume.pdf"
              className="hidden sm:inline-flex font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
            >
              r&eacute;sum&eacute; &nearr;
            </a>
            {/* Mobile hamburger — 44x44 tap target per WCAG 2.5.5 */}
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
              aria-label="Open menu"
            >
              <span className="block w-5 h-px bg-[var(--text-secondary)]" />
              <span className="block w-5 h-px bg-[var(--text-secondary)]" />
              <span className="block w-3.5 h-px bg-[var(--text-secondary)] self-end" />
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
