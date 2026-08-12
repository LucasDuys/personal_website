'use client';

import { useEffect } from 'react';

/**
 * One observer for every scroll reveal on the page.
 *
 * Elements opt in with data-reveal and get .is-in once, the first time they
 * cross 85% of the viewport. The hiding style is gated on html.rv, set by an
 * inline script before paint, so a visitor without JavaScript sees everything
 * and a visitor with it never sees a flash. Reduced motion never hides content
 * at all: the stylesheet handles that, not this file.
 */
export default function Reveals() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      /* The huge top margin means anything the visitor has already scrolled
         past counts as seen: an anchor jump must never leave a section
         permanently invisible above the viewport. */
      { rootMargin: '20000px 0px -12% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return null;
}
