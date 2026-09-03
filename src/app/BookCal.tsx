'use client';

import { useEffect } from 'react';

/**
 * The inline Cal.com booking calendar, skinned to the Black Cut world.
 *
 * Loads Cal through its official stub loader (the stub must own the
 * `window.Cal` queue before embed.js runs; a plain script tag is rejected by
 * the embed with "Cal is not defined"). Commands issued here queue until the
 * embed arrives, and the site stays a static export: everything happens on
 * the client.
 *
 * The booker is themed dark: cobalt brand, warm-white ink, hairline borders,
 * sharp corners. The target keeps a loading note behind the iframe, so a slow
 * network or a blocked script degrades to a direct Cal.com link instead of a
 * blank frame. No-JS visitors get the same link through <noscript>.
 */

interface CalFn {
  (...args: unknown[]): void;
  q: unknown[][];
  ns: Record<string, CalFn>;
  loaded: boolean;
}

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

const EMBED_SRC = 'https://app.cal.com/embed/embed.js';
const TARGET = '#cal-book-inline';

/** Black Cut tokens, translated to Cal's cssVarsPerTheme keys (no `--` prefix). */
const DARK_VARS: Record<string, string> = {
  // Brand: one cobalt signal, dark ink on brand surfaces.
  'cal-brand': '#5E8BFF',
  'cal-brand-emphasis': '#8AADFF',
  'cal-brand-text': '#050505',
  'cal-brand-subtle': '#3A4E7E',
  'cal-brand-accent': '#050505',
  // Text: warm white down through stone.
  'cal-text': '#F2F2EE',
  'cal-text-emphasis': '#F2F2EE',
  'cal-text-subtle': '#B0B0A8',
  'cal-text-muted': '#83837B',
  'cal-text-inverted': '#050505',
  'cal-text-info': '#A9BFFF',
  'cal-text-success': '#8FD6A4',
  'cal-text-attention': '#E8B67E',
  'cal-text-error': '#F09696',
  // Background: a half-step up from the page ground so the frame reads.
  'cal-bg': '#0A0A0A',
  'cal-bg-emphasis': '#1C1C1A',
  'cal-bg-subtle': '#141412',
  'cal-bg-muted': '#0E0E0D',
  'cal-bg-inverted': '#F2F2EE',
  // Borders: the same hairline weight as the rest of the page.
  'cal-border': '#2E2E2B',
  'cal-border-emphasis': '#5E8BFF',
  'cal-border-subtle': '#232322',
  'cal-border-muted': '#1B1B1A',
  'cal-border-error': '#7A2A2A',
  'cal-border-booker-width': '0px',
  // Geometry: sharp and cut, like every other container here.
  radius: '0px',
};

/**
 * Cal's published stub loader, ported to TypeScript. It installs the
 * `window.Cal` command queue and fetches embed.js exactly once; every
 * `Cal(...)` call made before the embed arrives is replayed in order.
 */
function installStub() {
  if (window.Cal) return;
  const push = (fn: CalFn, args: unknown[]) => {
    fn.q.push(args);
  };
  const cal = (...args: unknown[]) => {
    const c = window.Cal as CalFn;
    if (!c.loaded) {
      c.ns = {};
      c.q = c.q || [];
      const script = document.createElement('script');
      script.src = EMBED_SRC;
      document.head.appendChild(script);
      c.loaded = true;
    }
    if (args[0] === 'init') {
      const api = (...inner: unknown[]) => {
        push(api as CalFn, inner);
      };
      const namespaced = api as CalFn;
      namespaced.q = [];
      const namespace = args[1];
      if (typeof namespace === 'string') {
        c.ns[namespace] = c.ns[namespace] || namespaced;
        push(c.ns[namespace], args);
        push(c, ['initNamespace', namespace]);
      } else {
        push(c, args);
      }
      return;
    }
    push(c, args);
  };
  const stub = cal as CalFn;
  stub.q = [];
  stub.ns = {};
  stub.loaded = false;
  window.Cal = stub;
}

function configure() {
  const target = document.querySelector<HTMLElement>(TARGET);
  if (!target || target.dataset.calInit || target.querySelector('iframe')) return;
  target.dataset.calInit = '1';
  const cal = window.Cal;
  if (!cal) return;
  cal('init', 'book', { origin: 'https://app.cal.com' });
  cal.ns.book('inline', {
    elementOrSelector: TARGET,
    config: { layout: 'month_view' },
    calLink: 'lucas-duys/30min',
  });
  cal.ns.book('ui', {
    theme: 'dark',
    hideEventTypeDetails: false,
    layout: 'month_view',
    cssVarsPerTheme: { dark: DARK_VARS },
  });
}

export default function BookCal() {
  useEffect(() => {
    installStub();
    configure();
  }, []);

  return (
    <div
      id="cal-book-inline"
      role="region"
      aria-label="Book a 30-minute call with Lucas"
    >
      <noscript>
        <p className="cal-fallback">
          Booking needs JavaScript.{' '}
          <a href="https://cal.com/lucas-duys/30min?overlayCalendar=true">
            Open the booking page on Cal.com
          </a>
        </p>
      </noscript>
    </div>
  );
}
