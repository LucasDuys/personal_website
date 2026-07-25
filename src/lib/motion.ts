import type { Variants, Transition } from 'framer-motion';

export const SPRING: Transition = { type: 'spring', stiffness: 130, damping: 22 };

export const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});
