'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';

const LINKS = [
  { label: 'About', target: '#about', section: 'about' },
  { label: 'Work', target: '#projects', section: 'projects' },
  { label: 'Skills', target: '#skills', section: 'skills' },
  { label: 'Experience', target: '#experience', section: 'experience' },
  { label: 'Contact', target: '#contact', section: 'contact' },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeSection: string;
}

export function MobileMenu({ open, onClose, activeSection }: MobileMenuProps) {
  const { scrollTo } = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col bg-[var(--canvas)] px-6 pt-20 pb-10"
        >
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-3 right-4 w-11 h-11 flex items-center justify-center text-[var(--text-1)] text-xl"
          >
            ×
          </button>
          <nav className="flex flex-col gap-2">
            {LINKS.map((link, i) => (
              <motion.button
                key={link.section}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  onClose();
                  scrollTo(link.target);
                }}
                className={`text-left text-2xl font-medium py-3 border-b border-[var(--hairline)] transition-colors ${
                  activeSection === link.section ? 'text-[var(--accent)]' : 'text-[var(--text-1)]'
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <a href="/resume.pdf" className="text-sm text-[var(--text-2)]">
              Resume
            </a>
            <a href="mailto:lucas.duys@gmail.com" className="font-mono text-sm text-[var(--text-1)]">
              lucas.duys@gmail.com
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
