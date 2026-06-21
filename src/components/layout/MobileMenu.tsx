'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';

const MENU_LINKS = [
  { num: '01', label: 'About', target: '#about', section: 'about' },
  { num: '02', label: 'Work', target: '#projects', section: 'projects' },
  { num: '03', label: 'Skills', target: '#skills', section: 'skills' },
  { num: '04', label: 'Experience', target: '#experience', section: 'experience' },
  { num: '05', label: 'Contact', target: '#contact', section: 'contact' },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeSection: string;
  onOpenCommandPalette: () => void;
}

export function MobileMenu({ open, onClose, activeSection, onOpenCommandPalette }: MobileMenuProps) {
  const { scrollTo } = useLenis();

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNavClick = useCallback(
    (target: string) => {
      scrollTo(target);
      // Close after small delay to let scroll start
      setTimeout(onClose, 100);
    },
    [scrollTo, onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex flex-col md:hidden"
          style={{
            background: 'rgba(6,6,10,0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Close button */}
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="relative w-8 h-8 flex items-center justify-center"
              aria-label="Close menu"
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: 45 }}
                className="absolute block w-5 h-px bg-[var(--text-secondary)]"
              />
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: -45 }}
                className="absolute block w-5 h-px bg-[var(--text-secondary)]"
              />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col justify-center px-8 gap-8">
            {MENU_LINKS.map((link, i) => {
              const isActive = activeSection === link.section;
              return (
                <motion.button
                  key={link.section}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => handleNavClick(link.target)}
                  className={`flex items-center gap-4 text-left transition-colors ${
                    isActive ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span className="font-mono text-xs text-[var(--text-muted)]">{link.num}</span>
                  <span className="font-[var(--font-sans)] text-[32px] font-medium">{link.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Bottom */}
          <div className="px-8 pb-10 flex flex-col gap-6">
            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <a
                href="https://linkedin.com/in/lucas-duys"
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="mailto:lucas.duys@gmail.com"
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
              >
                Email
              </a>
            </motion.div>

            {/* Command palette hint */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => {
                onClose();
                setTimeout(onOpenCommandPalette, 200);
              }}
              className="font-mono text-xs text-[var(--text-muted)] text-left hover:text-[var(--text-secondary)] transition-colors"
            >
              {'> press \u2318K to search'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
