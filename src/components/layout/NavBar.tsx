'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLenis } from '@/hooks/useLenis';

const NAV_LINKS = [
  { label: 'About', target: '#about', section: 'about' },
  { label: 'Work', target: '#projects', section: 'projects' },
  { label: 'Skills', target: '#skills', section: 'skills' },
  { label: 'Experience', target: '#experience', section: 'experience' },
  { label: 'Contact', target: '#contact', section: 'contact' },
];

interface NavBarProps {
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
  activeSection: string;
}

export function NavBar({ onOpenCommandPalette, onOpenMobileMenu, activeSection }: NavBarProps) {
  const { scrollTo } = useLenis();
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleNavClick = useCallback(
    (target: string) => {
      scrollTo(target);
    },
    [scrollTo],
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-5 md:px-10 border-b border-[var(--hairline)]"
      style={{
        background: 'color-mix(in srgb, var(--canvas) 82%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <button
        onClick={() => handleNavClick('#hero')}
        className="font-sans text-sm font-semibold text-[var(--text-1)] hover:text-[var(--accent)] transition-colors duration-200"
      >
        Lucas Duys
      </button>

      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.section;
          return (
            <button
              key={link.section}
              onClick={() => handleNavClick(link.target)}
              className={`text-[13px] transition-colors duration-200 ${
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--hairline)] bg-[var(--sheet)] font-mono text-xs text-[var(--text-2)] hover:border-[var(--hairline-strong)] hover:text-[var(--text-1)] transition-colors duration-200"
          aria-label="Open command palette"
        >
          {isMac ? '⌘K' : 'Ctrl K'}
        </button>
        <a
          href="/resume.pdf"
          className="hidden sm:inline-flex text-[13px] text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-200"
        >
          Resume
        </a>
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-[var(--text-1)]" />
          <span className="block w-5 h-px bg-[var(--text-1)]" />
        </button>
      </div>
    </nav>
  );
}
