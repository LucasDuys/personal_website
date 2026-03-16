# The Neural Terminal — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Lucas Duys's personal portfolio — a CLI-meets-neural-network website with scroll animations, particle system, and interactive visualizations. Deploy to Vercel as a fully static site.

**Architecture:** Next.js 15 App Router with `output: 'export'` for static deployment. MVC-inspired structure: `data/` (Model — content/config), `components/` (View — UI rendering), `hooks/` + `lib/` (Controller — logic/animation orchestration). Single-page scroll with CLI-styled sections, WebGL 2 particle background, GSAP scroll animations, and a cmdk command palette.

**Tech Stack:** Next.js 15, TypeScript 5, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, Framer Motion, cmdk, simplex-noise, WebGL 2 (custom shaders)

**Spec:** `docs/PORTFOLIO-MASTER-SPEC.md` (copied from `~/docs/`) + `concepts/spec-tech-stack-and-implementation.md`

**Skills & MCP Servers:**
- `@context7` — fetch latest docs for Next.js, GSAP, Framer Motion, Lenis, cmdk, Tailwind
- `@playwright` — visual testing, interaction testing, screenshot comparison
- `@frontend-design` — component creation with design quality
- `@cinematic-scroll-frontends` — GSAP ScrollTrigger + scroll-driven animation guidance
- `@gsap-scrolltrigger` — ScrollTrigger-specific patterns
- `@webapp-testing` — test deployed site with Playwright
- `@vercel-deploy` — deployment to Vercel

**Progress Tracking:** After each task, update `docs/progress/CHANGELOG.md` with what changed.

---

## File Structure (MVC-Inspired)

```
C:\dev\personal_website\
├── docs/
│   ├── PORTFOLIO-MASTER-SPEC.md          # Design spec (reference)
│   ├── progress/
│   │   └── CHANGELOG.md                  # Running log of all changes
│   └── superpowers/plans/
│       └── 2026-03-16-neural-terminal-portfolio.md  # This plan
├── concepts/                              # Existing concept docs
├── src/
│   ├── app/                               # Next.js App Router (routing + layout)
│   │   ├── layout.tsx                     # Root layout, fonts, providers, metadata
│   │   ├── page.tsx                       # Main page — composes all sections
│   │   └── globals.css                    # CSS variables, base styles, keyframes
│   │
│   ├── data/                              # MODEL — content & configuration
│   │   ├── projects.ts                    # Project content, metadata, tags
│   │   ├── skills.ts                      # Skill definitions, clusters, positions
│   │   ├── skillQueries.ts                # Pre-computed search relevance scores
│   │   ├── experience.ts                  # Experience entries
│   │   ├── commands.ts                    # Command palette command definitions
│   │   └── constants.ts                   # Colors, timing tokens, breakpoints
│   │
│   ├── components/                        # VIEW — UI rendering
│   │   ├── layout/                        # Page-level structure
│   │   │   ├── Providers.tsx              # Lenis + scroll context provider
│   │   │   ├── Preloader.tsx              # Boot sequence + particle genesis
│   │   │   ├── NavBar.tsx                 # Sticky top navigation
│   │   │   ├── CommandPalette.tsx         # Cmd+K modal
│   │   │   ├── SideIndicator.tsx          # Section dots (desktop)
│   │   │   ├── MobileMenu.tsx             # Full-screen mobile nav
│   │   │   ├── CustomCursor.tsx           # Dot + ring + label cursor
│   │   │   └── SynapseBridge.tsx          # Transition zone between sections
│   │   │
│   │   ├── canvas/                        # WebGL particle system
│   │   │   ├── ParticleCanvas.tsx         # React wrapper for WebGL canvas
│   │   │   ├── particleSystem.ts          # Core physics + connection logic
│   │   │   ├── shaders.ts                # GLSL vertex/fragment shaders as strings
│   │   │   └── spatialHash.ts            # Grid-based spatial partitioning
│   │   │
│   │   ├── sections/                      # Content sections (one per section)
│   │   │   ├── Hero.tsx                   # Hero section (name, roles, CTAs)
│   │   │   ├── About.tsx                  # cat about.md (frontmatter + body)
│   │   │   ├── Projects.tsx               # ls projects/ (grid + cards)
│   │   │   ├── Skills.tsx                 # Embedding space scatter plot
│   │   │   ├── Experience.tsx             # git log (entries + counters)
│   │   │   └── Contact.tsx                # curl contact (links + cipher)
│   │   │
│   │   ├── projects/                      # Project-specific components
│   │   │   ├── ProjectCard.tsx            # Shared card component
│   │   │   ├── CaseStudyPanel.tsx         # Expanded project overlay
│   │   │   └── RAGPipeline.tsx            # Crown jewel visualization
│   │   │
│   │   └── ui/                            # Shared UI primitives
│   │       ├── CLIPrompt.tsx              # Reusable CLI command with typing
│   │       ├── SectionWrapper.tsx         # Section container + scroll triggers
│   │       ├── MetricCounter.tsx          # Animated counting numbers
│   │       ├── CipherText.tsx             # Scramble/decrypt text effect
│   │       ├── TypewriterText.tsx         # Character-by-character typing
│   │       └── SecretTerminal.tsx         # Konami code easter egg
│   │
│   ├── hooks/                             # CONTROLLER — logic & orchestration
│   │   ├── useLenis.ts                    # Lenis scroll instance access
│   │   ├── useScrollReveal.ts             # GSAP ScrollTrigger text reveal
│   │   ├── useTypewriter.ts              # Typing animation logic
│   │   ├── useCipherText.ts              # Scramble effect logic
│   │   ├── useCountUp.ts                 # Number counter animation
│   │   ├── useMediaQuery.ts              # Responsive breakpoint detection
│   │   ├── useReducedMotion.ts           # prefers-reduced-motion detection
│   │   └── useCursorState.ts             # Shared cursor position/state
│   │
│   ├── lib/                               # CONTROLLER — utilities
│   │   ├── animations.ts                  # GSAP animation presets + easing tokens
│   │   ├── noise.ts                       # Simplex noise wrapper
│   │   └── registry.ts                    # GSAP plugin registration
│   │
│   ├── types/
│   │   └── index.ts                       # Shared TypeScript interfaces
│   │
│   └── styles/
│       └── fonts.ts                       # next/font configurations
│
├── public/
│   ├── fonts/                             # Self-hosted woff2 files
│   ├── images/projects/                   # Project screenshots
│   ├── videos/                            # Pitchr demo video
│   ├── resume.pdf                         # Downloadable CV
│   └── og-image.png                       # Open Graph preview
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## Chunk 1: Foundation (Tasks 1-4)

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/styles/fonts.ts`
- Create: `src/data/constants.ts`
- Create: `docs/progress/CHANGELOG.md`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:\dev\personal_website
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --no-turbopack
```

When prompted, accept defaults. This creates the base Next.js 15 project.

- [ ] **Step 2: Clean scaffolded files**

Remove default content from `src/app/page.tsx` and `src/app/globals.css`. Replace with minimal shells.

- [ ] **Step 3: Configure next.config.ts for static export**

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
```

- [ ] **Step 4: Configure path aliases in tsconfig.json**

Ensure `paths` has `"@/*": ["./src/*"]`.

- [ ] **Step 5: Create constants file with design tokens**

```typescript
// src/data/constants.ts
export const COLORS = {
  bg: '#06060A',
  surface1: '#0E0E14',
  surface2: '#16161F',
  border: '#1E1E2E',
  textPrimary: '#E8E6E3',
  textSecondary: '#8B8B9E',
  textMuted: '#555566',
  accentGreen: '#4ADE80',
  accentCyan: '#22D3EE',
  accentPurple: '#8B5CF6',
  accentAmber: '#FBBF24',
  synapseBlue: '#2E7DFF',
  particleDim: '#1A3A5C',
  particleMid: '#3B6EA8',
  particleActive: '#5FA8FF',
  particleHot: '#A5D8FF',
} as const;

export const TIMING = {
  cursorBlink: 530,
  typingSpeed: 45,
  typingSpeedFast: 30,
  scrollDuration: 1.2,
  revealStagger: 0.08,
  counterDuration: 1800,
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const EASING = {
  expoOut: [0.22, 1, 0.36, 1] as const,
  expoInOut: [0.87, 0, 0.13, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
} as const;
```

- [ ] **Step 6: Configure fonts**

```typescript
// src/styles/fonts.ts
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'block',
  weight: ['400', '500', '600', '700'],
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});
```

- [ ] **Step 7: Set up globals.css with design tokens**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #06060A;
  --surface-1: #0E0E14;
  --surface-2: #16161F;
  --border: #1E1E2E;
  --text-primary: #E8E6E3;
  --text-secondary: #8B8B9E;
  --text-muted: #555566;
  --accent-green: #4ADE80;
  --accent-cyan: #22D3EE;
  --accent-purple: #8B5CF6;
  --accent-amber: #FBBF24;
  --synapse-blue: #2E7DFF;
}

html {
  scroll-behavior: auto; /* Lenis handles smooth scroll */
  background: var(--bg);
  color: var(--text-primary);
}

body {
  font-family: var(--font-sans), system-ui, sans-serif;
  background: var(--bg);
  overflow-x: hidden;
}

::selection {
  background: rgba(74, 222, 128, 0.2);
  color: var(--text-primary);
}

/* Cursor blink animation */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Glow utility */
.glow-green {
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.3), 0 0 40px rgba(74, 222, 128, 0.1);
}
```

- [ ] **Step 8: Set up root layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { jetbrainsMono, spaceGrotesk } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lucas Duys — CS & AI Developer',
  description: 'CS & Engineering student at TU Eindhoven building AI tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Create minimal page.tsx**

```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="flex items-center justify-center h-screen">
        <p className="font-mono text-[var(--accent-green)]">$ initializing...</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 10: Create CHANGELOG.md**

```markdown
<!-- docs/progress/CHANGELOG.md -->
# Build Progress

## Phase 1: Foundation
- [ ] Task 1: Project scaffolding
- [ ] Task 2: Install animation dependencies
- [ ] Task 3: Lenis + GSAP integration
- [ ] Task 4: Section wrapper + scroll reveal system
```

- [ ] **Step 11: Verify build and deploy skeleton**

```bash
cd C:\dev\personal_website
npm run build
npm run start
```

Verify: page loads at `localhost:3000` with green `$ initializing...` text on dark background.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: project scaffolding — Next.js 15, Tailwind 4, fonts, design tokens"
```

---

### Task 2: Install Animation Dependencies

**Files:**
- Modify: `package.json`
- Create: `src/lib/registry.ts`

- [ ] **Step 1: Install all production dependencies**

```bash
cd C:\dev\personal_website
npm install gsap lenis framer-motion split-type cmdk simplex-noise
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D @types/node prettier prettier-plugin-tailwindcss
```

- [ ] **Step 3: Create GSAP plugin registration**

```typescript
// src/lib/registry.ts
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 4: Verify imports work**

```bash
npm run build
```

No errors expected.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: install animation deps — GSAP, Lenis, Framer Motion, cmdk, simplex-noise"
```

---

### Task 3: Lenis + GSAP Scroll Integration

**Files:**
- Create: `src/components/layout/Providers.tsx`
- Create: `src/hooks/useLenis.ts`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useMediaQuery.ts`
- Modify: `src/app/layout.tsx` (wrap with Providers)

- [ ] **Step 1: Create useReducedMotion hook**

```typescript
// src/hooks/useReducedMotion.ts
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Create useMediaQuery hook**

```typescript
// src/hooks/useMediaQuery.ts
'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

- [ ] **Step 3: Create Providers with Lenis + GSAP ticker sync**

Use `@context7` to fetch latest Lenis docs before implementing.

```typescript
// src/components/layout/Providers.tsx
'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from '@/lib/registry';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0.5 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker as the single RAF loop
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
```

- [ ] **Step 4: Create useLenis hook for child access**

```typescript
// src/hooks/useLenis.ts
'use client';

import { useCallback } from 'react';

export function useLenis() {
  const scrollTo = useCallback((target: string | number, options?: { duration?: number }) => {
    // Access the global Lenis instance
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: options?.duration ?? 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }, []);

  return { scrollTo };
}
```

- [ ] **Step 5: Update Providers to expose Lenis globally**

Add `(window as any).__lenis = lenis;` after creating the Lenis instance.

- [ ] **Step 6: Wrap layout.tsx with Providers**

```typescript
// src/app/layout.tsx — update body to:
<body>
  <Providers>{children}</Providers>
</body>
```

- [ ] **Step 7: Verify smooth scroll works**

Update `page.tsx` to have multiple full-height sections. Verify scroll is smooth in browser.

```bash
npm run dev
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: Lenis + GSAP scroll integration — single RAF loop, smooth scroll"
```

---

### Task 4: Section Wrapper + Scroll Reveal System

**Files:**
- Create: `src/components/ui/SectionWrapper.tsx`
- Create: `src/hooks/useScrollReveal.ts`
- Create: `src/lib/animations.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create TypeScript interfaces**

```typescript
// src/types/index.ts
export interface SectionConfig {
  id: string;
  index: string; // "001", "002", etc.
  label: string;
  command?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  command: string;
  accentColor: string;
  tags: string[];
  links: { label: string; url: string; icon: 'external' | 'github' | 'video' }[];
  status?: 'live' | 'in-progress';
}

export interface Skill {
  name: string;
  cluster: 'frontend' | 'backend' | 'ai' | 'soft';
  x: number;
  y: number;
  size: number;
  connections: string[];
}

export interface ExperienceEntry {
  hash: string;
  dateRange: string;
  title: string;
  company: string;
  companyColor: string;
  description: string[];
  tags?: string[];
  metrics?: { label: string; value: number; suffix: string }[];
  status?: 'active' | 'completed';
}
```

- [ ] **Step 2: Create animation presets**

```typescript
// src/lib/animations.ts
export const EASE = {
  expoOut: 'expo.out',
  expoInOut: 'expo.inOut',
  backOut: 'back.out(2.5)',
  smooth: 'power3.out',
} as const;

export const REVEAL = {
  heading: {
    yPercent: 110,
    rotationZ: 3,
    opacity: 0,
    duration: 1.0,
    ease: EASE.expoOut,
    stagger: 0.08,
  },
  paragraph: {
    yPercent: 100,
    opacity: 0,
    duration: 0.8,
    ease: EASE.expoOut,
    stagger: 0.04,
  },
  card: {
    y: 60,
    opacity: 0,
    scale: 0.97,
    duration: 0.9,
    ease: EASE.expoOut,
    stagger: 0.12,
  },
  tag: {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: EASE.backOut,
    stagger: 0.03,
  },
} as const;
```

- [ ] **Step 3: Create useScrollReveal hook**

Use `@context7` to fetch latest GSAP ScrollTrigger docs before implementing.

```typescript
// src/hooks/useScrollReveal.ts
'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registry';
import SplitType from 'split-type';
import { useReducedMotion } from './useReducedMotion';

export function useScrollReveal(
  type: 'heading' | 'paragraph' | 'card' | 'tag' = 'paragraph'
) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reducedMotion) return;

    const el = ref.current;
    let split: SplitType | null = null;

    if (type === 'heading' || type === 'paragraph') {
      split = new SplitType(el, { types: 'lines' });
      // Wrap each line in overflow-hidden container
      split.lines?.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    }

    const targets = split?.lines ?? el;
    const preset = type === 'heading'
      ? { yPercent: 110, rotationZ: 3, opacity: 0, duration: 1.0, ease: 'expo.out', stagger: 0.08 }
      : type === 'paragraph'
      ? { yPercent: 100, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 }
      : type === 'card'
      ? { y: 60, opacity: 0, scale: 0.97, duration: 0.9, ease: 'expo.out' }
      : { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.03 };

    gsap.from(targets, {
      ...preset,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      split?.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [type, reducedMotion]);

  return ref;
}
```

- [ ] **Step 4: Create SectionWrapper component**

```typescript
// src/components/ui/SectionWrapper.tsx
'use client';

import { ReactNode } from 'react';
import type { SectionConfig } from '@/types';

interface Props {
  config: SectionConfig;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ config, children, className = '' }: Props) {
  return (
    <section
      id={config.id}
      className={`relative min-h-screen py-[120px] px-6 md:px-12 lg:px-20 ${className}`}
    >
      {/* Section index label */}
      <div className="absolute top-8 left-6 md:left-12 font-mono text-xs text-[var(--text-muted)]">
        <span className="text-[var(--text-secondary)]">// {config.index}</span>
        {' — '}
        <span className="text-[var(--accent-green)]">{config.label}</span>
      </div>

      <div className="max-w-[1200px] mx-auto">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Test with a sample section on the page**

Update `page.tsx` to use `SectionWrapper` with a heading that uses `useScrollReveal`. Verify the scroll-triggered text reveal animation works in the browser.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: section wrapper + scroll reveal system — SplitType, GSAP ScrollTrigger, animation presets"
```

- [ ] **Step 7: Update CHANGELOG.md**

Add entries for Tasks 1-4 completion with summary of what was built.

---

## Chunk 2: Particle System + Cursor (Tasks 5-7)

### Task 5: WebGL Particle System — Core

**Files:**
- Create: `src/components/canvas/shaders.ts`
- Create: `src/components/canvas/spatialHash.ts`
- Create: `src/components/canvas/particleSystem.ts`
- Create: `src/lib/noise.ts`

- [ ] **Step 1: Create simplex noise wrapper**

```typescript
// src/lib/noise.ts
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

export function simplex2D(x: number, y: number): number {
  return noise2D(x, y);
}
```

- [ ] **Step 2: Create WebGL shaders**

Write vertex + fragment shaders for particles (GL_POINTS with soft circle) and connections (GL_LINES with alpha). Store as template literal strings in `shaders.ts`.

Particle fragment shader: radial gradient soft circle with color lookup from 4-color palette. Connection fragment shader: simple color with per-vertex alpha interpolation.

- [ ] **Step 3: Create spatial hash for O(n) connection detection**

Implement `SpatialHash` class with `CELL_SIZE = 150`, `insert(index, x, y)`, `query(x, y)` methods using flat `Int32Array` with max 16 particles per cell.

- [ ] **Step 4: Create particle system core**

Implement `ParticleSystem` class with:
- Struct-of-arrays (`Float32Array` for posX, posY, velX, velY, radius, opacity, etc.)
- `init(canvas, particleCount)` — WebGL 2 context, shader compilation, buffer allocation
- `update(time, scrollY, mouseX, mouseY)` — Perlin noise flow field + spring return + damping
- `render()` — 2 draw calls (connections then particles)
- Viewport culling (only process particles within viewport ± 200px)
- Constants: `NOISE_SCALE: 0.0008`, `BASE_SPEED: 0.15`, `SPRING_K: 0.0003`, `DAMPING: 0.97`

- [ ] **Step 5: Verify particle system runs standalone**

Create a test HTML file or use the Next.js page to mount the canvas and verify particles render and move.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: WebGL particle system core — noise flow field, spatial hash, 2 draw calls"
```

---

### Task 6: Particle Canvas React Component + Mouse Interaction

**Files:**
- Create: `src/components/canvas/ParticleCanvas.tsx`
- Create: `src/hooks/useCursorState.ts`
- Modify: `src/app/page.tsx` (mount ParticleCanvas)

- [ ] **Step 1: Create shared cursor state**

```typescript
// src/hooks/useCursorState.ts
'use client';

// Global mutable state (not React state — updated every frame)
export const cursorState = {
  x: 0,
  y: 0,
  isPressed: false,
  isOverInteractive: false,
};
```

- [ ] **Step 2: Create ParticleCanvas component**

React wrapper that:
- Creates a `<canvas>` with `position: fixed`, `inset: 0`, `z-index: 0`, `pointer-events: none`
- Initializes `ParticleSystem` on mount
- Connects to GSAP ticker for updates (reads scroll position, cursor state)
- Handles resize (debounced 150ms)
- Implements adaptive quality (FPS monitor, 5 quality levels)
- Respects `prefers-reduced-motion`

- [ ] **Step 3: Add mouse interaction to particle system**

Implement in `particleSystem.ts`:
- Attraction force within 200px radius (force `0.08 * (1 - normalizedDist)^2`)
- Connection intensification near cursor (2.5x opacity, extended range)
- Click ripple (expanding ring wavefront at 8px/frame, particle impulse)

- [ ] **Step 4: Mount ParticleCanvas in page.tsx**

```tsx
<main>
  <ParticleCanvas />
  {/* sections will go here */}
</main>
```

- [ ] **Step 5: Verify in browser**

Particles render, move with noise field, attract to cursor, ripple on click.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: particle canvas component — mouse attraction, click ripple, adaptive quality"
```

---

### Task 7: Custom Cursor

**Files:**
- Create: `src/components/layout/CustomCursor.tsx`
- Modify: `src/app/globals.css` (hide default cursor)
- Modify: `src/app/layout.tsx` (mount cursor)

- [ ] **Step 1: Create CustomCursor component**

DOM-based cursor with three layers:
- Dot (8px, white, 0.25 lerp)
- Ring (36px, 1px border, 0.12 lerp — trailing effect)
- Label (hidden by default, shows on interactive hover)

Uses `requestAnimationFrame` via GSAP ticker. `mix-blend-mode: difference`.

Hover states:
- Interactive elements → ring expands to 64px, shows label ("VIEW", "OPEN", etc.)
- Text → ring morphs to vertical bar (terminal caret), blinks green
- Click → ring scales 0.75 with elastic bounce-back

- [ ] **Step 2: Add cursor glow aura**

CSS div following cursor at 0.12 lerp. Radial gradient `rgba(46,125,255,0.06)`. 600px diameter.

- [ ] **Step 3: Hide default cursor on desktop**

```css
@media (hover: hover) {
  * { cursor: none !important; }
}
```

- [ ] **Step 4: Disable cursor on touch devices**

`@media (hover: none)` → `display: none` on cursor elements. Restore default cursor.

- [ ] **Step 5: Mount in layout.tsx**

- [ ] **Step 6: Verify all cursor states work**

Test hover on links, text, buttons. Test click animation. Test mobile (no cursor).

- [ ] **Step 7: Commit + update CHANGELOG**

```bash
git add -A
git commit -m "feat: custom cursor — dot/ring/label states, glow aura, mobile disabled"
```

---

## Chunk 3: Preloader + Hero + Navigation (Tasks 8-11)

### Task 8: CLI Prompt Component + Typewriter Hook

**Files:**
- Create: `src/hooks/useTypewriter.ts`
- Create: `src/components/ui/CLIPrompt.tsx`
- Create: `src/components/ui/TypewriterText.tsx`

- [ ] **Step 1: Create useTypewriter hook**

Accepts text string + speed. Returns `{ displayText, isTyping, isComplete }`. Uses `requestAnimationFrame` for timing. Supports random jitter (±15ms).

- [ ] **Step 2: Create CLIPrompt component**

Renders `visitor@lucas.dev:~$` prefix (green) + command text (typed) + blinking block cursor. Accepts `command` prop, `onComplete` callback, and optional `delay` before typing starts.

- [ ] **Step 3: Create TypewriterText component**

Simpler version: just types text without the prompt prefix. For role cycling and system messages.

- [ ] **Step 4: Test components in isolation on the page**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: CLI prompt + typewriter components — typing animation, cursor blink"
```

---

### Task 9: Preloader

**Files:**
- Create: `src/components/layout/Preloader.tsx`
- Modify: `src/app/layout.tsx` (mount Preloader)

- [ ] **Step 1: Create Preloader component**

Full-viewport overlay (`z-index: 9999`). Contains:
- Terminal window chrome (3 dots + `lucas@portfolio:~`)
- Boot sequence (6 lines: systemctl → OK lines → Welcome)
- CRT scanline overlay (CSS repeating-linear-gradient)
- Progress bar (gradient fill, 0-100%)
- State machine: `booting | ready | exiting | done`

Use CLIPrompt for the first typed line. Remaining lines appear instantly with stagger.

- [ ] **Step 2: Implement particle genesis**

Coordinate with ParticleCanvas: emit particles as each `[OK]` line appears (via callback). Particles spawn with scale-in animation.

- [ ] **Step 3: Implement exit transition (800ms)**

Terminal dissolves (opacity + blur). Overlay fades. Particles persist. Hero content begins entering at T+400ms of exit.

- [ ] **Step 4: Add sessionStorage skip for repeat visits**

```typescript
if (sessionStorage.getItem('visited')) {
  // Show shortened "Welcome back" version (600ms)
} else {
  sessionStorage.setItem('visited', 'true');
}
```

- [ ] **Step 5: Mount in layout.tsx, verify full sequence**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: preloader — boot sequence, particle genesis, CRT scanlines, session skip"
```

---

### Task 10: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx` (mount Hero)

- [ ] **Step 1: Create Hero component**

Full viewport section with:
- Corner HUD: location (top-left with pulsing green dot), live clock (top-right with digit roll), section index (bottom-left), scroll indicator (bottom-right)
- Greeting: `> Hello, I'm` (mono, green >)
- Name: `Lucas Duys` (Space Grotesk bold, clamp size, cyan gradient)
- Role cycler: `$ title: [cycling role]` with typewriter delete/retype
- CTA buttons: `$ cd ./projects ↵` (primary green) + `$ contact --open ↵` (ghost)

- [ ] **Step 2: Implement particle-to-text name formation**

On hero entrance (post-preloader):
1. Sample 80-100 points from "Lucas Duys" rendered to offscreen canvas
2. Assign existing particles to these targets
3. Animate convergence (800ms spring physics)
4. Hold 200ms, then scatter back (500ms)
5. Crisp text fades in during convergence

- [ ] **Step 3: Implement role cycling**

5 roles, each displayed 2.5s. Delete at 25ms/char, pause 200ms, type new at 40ms/char. Infinite loop.

- [ ] **Step 4: Implement scroll-away parallax**

GSAP ScrollTrigger scrubbed: each element exits at different speed with opacity fade. Particle density multiplier drops from 1.0 to 0.6.

- [ ] **Step 5: Implement entrance choreography**

Staggered entrance after preloader exit: corners → greeting → name (particle formation) → role typing → CTAs → scroll indicator. Total ~2400ms.

- [ ] **Step 6: Verify full hero experience**

Preloader → particle genesis → hero entrance → name formation → role cycling → scroll away.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: hero section — particle name formation, role cycling, HUD corners, scroll parallax"
```

---

### Task 11: Navigation System

**Files:**
- Create: `src/components/layout/NavBar.tsx`
- Create: `src/components/layout/CommandPalette.tsx`
- Create: `src/components/layout/SideIndicator.tsx`
- Create: `src/components/layout/MobileMenu.tsx`
- Create: `src/data/commands.ts`
- Modify: `src/app/layout.tsx` (mount nav components)

- [ ] **Step 1: Create command definitions**

```typescript
// src/data/commands.ts — all command palette commands
// Groups: Navigation, Actions, Projects, Easter Eggs
// Each: { id, group, icon, label, description, shortcut?, action }
```

- [ ] **Step 2: Create NavBar**

Fixed top bar, appears after 80vh scroll. Glassmorphism background. Left: `lucas.duys` (green dot). Center: section links (mono 12px). Right: ⌘K trigger + résumé download. Auto-hide on scroll down, show on scroll up.

Use `@context7` to check latest cmdk docs.

- [ ] **Step 3: Create CommandPalette**

cmdk-based modal. Green `>` prompt, fuzzy search, grouped commands, keyboard navigation. Easter eggs (party mode, matrix rain, brew coffee). Backdrop blur overlay.

- [ ] **Step 4: Create SideIndicator (desktop)**

Vertical line with dots, fixed right edge. Active dot = green + glow. Scroll progress fill. Hover shows section label.

- [ ] **Step 5: Create MobileMenu**

Hamburger → full-screen overlay. Numbered section links (Space Grotesk 32px). Social links. Staggered entrance animation.

- [ ] **Step 6: Mount all nav components in layout.tsx**

- [ ] **Step 7: Verify all navigation paths work**

Test: nav links scroll to sections, command palette opens/closes, mobile menu, keyboard shortcuts.

- [ ] **Step 8: Commit + update CHANGELOG**

```bash
git add -A
git commit -m "feat: navigation — nav bar, command palette (cmdk), side indicator, mobile menu"
```

---

## Chunk 4: Content Sections (Tasks 12-16)

### Task 12: About Section

**Files:**
- Create: `src/components/sections/About.tsx`
- Create: `src/components/ui/SynapseBridge.tsx`

- [ ] **Step 1: Create SynapseBridge component**

150px transition zone between sections. Particles flow downward (directional noise bias). CLI annotation fades in center (e.g., `> loading profile...`). Reusable for all section gaps.

- [ ] **Step 2: Create About section**

CLI intro: `cat ~/about.md`. YAML frontmatter (styled keys/values with accent colors). Comment line (no photo). Body text (175 words, Space Grotesk 17px, inline code highlights). Line numbers in left gutter. Sticky file tab `about.md ×`.

- [ ] **Step 3: Add scroll reveal animations**

Frontmatter key-value pairs stagger in. Body paragraphs reveal line-by-line.

- [ ] **Step 4: Mount in page.tsx with SynapseBridge before it**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: about section — YAML frontmatter, body text, synapse bridges"
```

---

### Task 13: Experience Section

**Files:**
- Create: `src/components/sections/Experience.tsx`
- Create: `src/components/ui/MetricCounter.tsx`
- Create: `src/data/experience.ts`

- [ ] **Step 1: Create experience data**

5 entries: cape.io, HackEurope, Amplifirm, LLM Workshops, TU Eindhoven. Each with hash, date, title, description, optional metrics.

- [ ] **Step 2: Create MetricCounter component**

Animated count-up from 0 to target. Duration 1800ms, ease-out-expo. Triggered by IntersectionObserver. Formats as `+XX%`.

- [ ] **Step 3: Create Experience section**

CLI intro: `git log --oneline --experience`. Git-log styled entries with colored hashes. Amplifirm entry gets metrics dashboard (box-drawing chars + animated bars). cape.io and TU/e get IN PROGRESS indicators with pulsing bar edge.

- [ ] **Step 4: Add scroll reveal animations per entry**

Each entry independently triggered. Staggered: hash → date → title → description → metrics.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: experience section — git log style, metric counters, progress bars"
```

---

### Task 14: Contact Section

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Create: `src/components/ui/CipherText.tsx`
- Create: `src/hooks/useCipherText.ts`
- Create: `src/components/ui/SecretTerminal.tsx`

- [ ] **Step 1: Create useCipherText hook**

On hover: each character cycles through random chars, resolves left-to-right at 35ms/char stagger. Returns `{ text, onMouseEnter, onMouseLeave }`.

- [ ] **Step 2: Create CipherText component**

Wraps text, applies cipher effect on hover. Green flash as each char resolves.

- [ ] **Step 3: Create Contact section**

CLI intro: `curl -X POST .../contact`. HTTP response with JSON syntax highlighting. Contact links (email with copy + cipher, LinkedIn with open). Final empty prompt `visitor@lucas.dev:~$ █`. Footer with version string.

- [ ] **Step 4: Create SecretTerminal (Konami code)**

Listens for ↑↑↓↓←→←→BA. Opens modal terminal with working commands: `help`, `whoami`, `neofetch` (ASCII art), `sudo rm -rf /` (denied), `exit`, `clear`.

- [ ] **Step 5: Implement copy-to-clipboard for email**

`navigator.clipboard.writeText()` with `[copied!]` feedback and typed confirmation line.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: contact section — HTTP response, cipher text, secret terminal easter egg"
```

---

### Task 15: Projects Section + Cards

**Files:**
- Create: `src/components/sections/Projects.tsx`
- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/data/projects.ts`

- [ ] **Step 1: Create projects data**

4 projects: Pitchr, Stacklink, cape.io, LLM Workshops. Each with slug, title, description, command, accent color, tags, links, status.

- [ ] **Step 2: Create ProjectCard component**

Terminal chrome header (3 dots + CLI command). Visual area (per-project treatment). Content area (title, description, tags, links). Shared hover state (lift, border glow, cursor "VIEW").

Per-project visuals:
- Pitchr: WINNER badge + hackathon timer (scroll-driven countdown)
- Stacklink: mini RAG pipeline preview (auto-looping particle traversal)
- cape.io: gradient mesh + IN PROGRESS indicator
- Workshops: module tiles + scanline overlay

- [ ] **Step 3: Create Projects section**

CLI intro: `ls -la ~/projects/` with colored directory listing. 2×2 grid layout. Cards with staggered scroll-triggered entrance.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: projects section — 4 cards with per-project visual treatments"
```

---

### Task 16: Project Case Study Expansion

**Files:**
- Create: `src/components/projects/CaseStudyPanel.tsx`
- Modify: `src/components/projects/ProjectCard.tsx` (add click handler)

- [ ] **Step 1: Create CaseStudyPanel component**

Framer Motion `layoutId` for FLIP expansion. Full-screen overlay with:
- Header bar (close button + title + links)
- Hero area (screenshot/video for Pitchr, RAG pipeline for Stacklink)
- Content sections: Problem → Approach → Solution → Outcome (each with CLI command heading)
- Scroll lock while open
- URL update via `history.pushState`

- [ ] **Step 2: Add click handler to ProjectCard**

Opens CaseStudyPanel with FLIP animation (500ms, Material Design curve).

- [ ] **Step 3: Implement close behavior**

Close on: X button, backdrop click, Escape key. Reverse FLIP animation. Restore scroll position.

- [ ] **Step 4: Verify deep-linking works**

Load page with `#project/pitchr` → auto-expands the correct project.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: case study expansion — FLIP animation, deep linking, Problem/Approach/Solution/Outcome"
```

---

## Chunk 5: Interactive Visualizations (Tasks 17-18)

### Task 17: RAG Pipeline Animation (Crown Jewel)

**Files:**
- Create: `src/components/projects/RAGPipeline.tsx`

This is the most important visual on the site. Use `@cinematic-scroll-frontends` and `@gsap-scrolltrigger` for implementation guidance.

- [ ] **Step 1: Create RAG pipeline base layout**

6 stage nodes (80×80 rounded rects) arranged horizontally. Connection lines between them (SVG paths with slight curves). Labels below each node. Technical sub-labels.

- [ ] **Step 2: Implement node state machine**

States: dormant, active, hover. Dormant: dim border, gray icon. Active: accent border + glow, colored icon, scale pulse. Hover: same as active + tooltip.

- [ ] **Step 3: Implement data particle system**

Canvas overlay for particles. 10px glowing circles with 8-dot fading trail. Travel along SVG paths at 120px/s with ease-in-out. Color interpolation between stages.

Particle transformations:
- Chunk: particle splits into 3
- Retrieve: particle forks into 2 (vector + BM25 paths)
- Fuse: 2 particles merge with starburst

- [ ] **Step 4: Implement per-stage animations**

Ingest: floating documents absorbed. Chunk: rectangle splits. Embed: dots snap to grid. Retrieve: radar ping + dual path. Fuse: ranked bars. Generate: typewriter output + answer card.

- [ ] **Step 5: Implement tooltips**

Hover/click each stage: tooltip with implementation details (RPC queries, RRF formula, throughput stats). Styled as terminal windows.

- [ ] **Step 6: Implement continuous flow**

New particle every 3s. Multiple in flight simultaneously. Auto-loops. Pauses on hover.

- [ ] **Step 7: Add mobile adaptation**

<768px: 2-row layout (3+3) with curved connector. Simplified animations.

- [ ] **Step 8: Mount in Stacklink CaseStudyPanel**

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: RAG pipeline animation — 6-stage data flow, particles, tooltips, dual-path retrieval"
```

---

### Task 18: Skills Embedding Space

**Files:**
- Create: `src/components/sections/Skills.tsx`
- Create: `src/data/skills.ts`
- Create: `src/data/skillQueries.ts`

- [ ] **Step 1: Create skills data**

23 skills with cluster assignment, x/y positions (pre-computed), dot sizes, connection lists.

- [ ] **Step 2: Create skill query relevance scores**

Pre-computed maps for ~15 queries (AI, full-stack, data pipeline, leadership, etc.) + keyword fallback.

- [ ] **Step 3: Create embedding space visualization**

SVG-based scatter plot (1000×600px desktop). Dots colored by cluster. Connection lines (dashed, low opacity). Grid background. Axis labels.

- [ ] **Step 4: Implement "Big Bang" entry animation**

All dots at center → spring-explode outward to positions (700ms, overshoot easing). Connection lines draw from midpoints. Labels fade in last.

- [ ] **Step 5: Implement search interaction**

Terminal input: `query skills --similarity "[query]"`. Debounced lookup. Dots scale/dim by relevance. Results line shows closest match.

- [ ] **Step 6: Implement auto-demo cycling**

If no interaction within 5s, cycle through 4 queries with typing animation. Stops on user interaction.

- [ ] **Step 7: Implement hover behaviors**

Dot hover: scale 1.4, glow doubles, connections brighten, non-connected dim. Cluster hover: convex hull boundary draws.

- [ ] **Step 8: Add mobile adaptation**

Compressed layout, labels on tap only, connections hidden (show on tap).

- [ ] **Step 9: Commit + update CHANGELOG**

```bash
git add -A
git commit -m "feat: skills embedding space — scatter plot, search interaction, Big Bang animation"
```

---

## Chunk 6: Polish, Mobile, Performance, Deploy (Tasks 19-22)

### Task 19: Mobile Responsive Pass

**Files:**
- Modify: all section components
- Modify: `src/components/canvas/ParticleCanvas.tsx`
- Modify: `src/components/layout/CustomCursor.tsx`

- [ ] **Step 1: Verify all breakpoints**

Test at 375px (iPhone), 768px (iPad), 1024px, 1280px, 1920px. Fix layout issues.

- [ ] **Step 2: Reduce particle count on mobile/tablet**

Mobile: 300, connections OFF. Tablet: 500, connections max 3.

- [ ] **Step 3: Disable custom cursor on touch**

- [ ] **Step 4: Simplify text animations on mobile**

Line-level only (no char/word split). Reduced stagger.

- [ ] **Step 5: Convert project expansion to bottom sheet on mobile**

Slide up from bottom instead of FLIP.

- [ ] **Step 6: Test command palette as bottom sheet on mobile**

- [ ] **Step 7: Verify RAG pipeline 2-row mobile layout**

- [ ] **Step 8: Use `@playwright` to screenshot test all breakpoints**

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: mobile responsive — all breakpoints, reduced particles, touch adaptations"
```

---

### Task 20: Performance Optimization

**Files:**
- Modify: various (optimizations across codebase)

- [ ] **Step 1: Run Lighthouse audit**

Target: 90+ Performance, 90+ Accessibility, 90+ Best Practices, 90+ SEO.

- [ ] **Step 2: Implement lazy loading for below-fold sections**

Use `next/dynamic` for Skills, Experience, Contact, CaseStudyPanel. Load when 2vh away.

- [ ] **Step 3: Optimize images**

All project screenshots through `next/image` with blur placeholders. OG image optimized.

- [ ] **Step 4: Verify canvas frame budget**

Target < 4ms per frame on desktop. Profile with Chrome DevTools Performance tab.

- [ ] **Step 5: Test adaptive quality system**

Throttle CPU in DevTools. Verify particle count reduces automatically.

- [ ] **Step 6: Verify prefers-reduced-motion**

Enable in OS settings. Verify: minimal particles, no typing effects, simple fades only.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "perf: lazy loading, image optimization, canvas profiling, reduced motion"
```

---

### Task 21: SEO & Metadata

**Files:**
- Modify: `src/app/layout.tsx` (metadata)
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `public/og-image.png`

- [ ] **Step 1: Complete metadata in layout.tsx**

Title, description, Open Graph (title, description, image, type), Twitter Card, JSON-LD Person schema.

- [ ] **Step 2: Create sitemap.ts**

```typescript
export default function sitemap() {
  return [{ url: 'https://lucas-duys.vercel.app', lastModified: new Date() }];
}
```

- [ ] **Step 3: Create robots.ts**

Allow all crawlers.

- [ ] **Step 4: Create OG image**

Dark background with "Lucas Duys — CS & AI Developer" in Space Grotesk + particle-like dots. 1200×630px.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: SEO — metadata, OG image, sitemap, robots, JSON-LD"
```

---

### Task 22: Deploy to Vercel

**Files:**
- Modify: `package.json` (build script verification)

- [ ] **Step 1: Verify static export builds cleanly**

```bash
npm run build
```

Check `out/` directory is generated with all static assets.

- [ ] **Step 2: Deploy to Vercel**

Use `@vercel-deploy` skill.

```bash
npx vercel --prod
```

- [ ] **Step 3: Verify deployed site**

Use `@webapp-testing` and `@playwright` to:
- Load the deployed URL
- Verify preloader plays
- Verify hero renders with particles
- Verify scroll animations fire
- Verify command palette opens
- Verify all section content renders
- Screenshot all sections at desktop + mobile widths

- [ ] **Step 4: Run Lighthouse on deployed URL**

Verify 90+ scores.

- [ ] **Step 5: Final commit + update CHANGELOG**

```bash
git add -A
git commit -m "feat: deploy to Vercel — static export, all sections live"
```

- [ ] **Step 6: Update CHANGELOG with final status**

Document: deployment URL, Lighthouse scores, known issues, future improvements.

---

## Post-Launch Improvements (Not in Initial Build)

These are stretch goals for after the initial launch:

1. **Blog section** — MDX-based writing (when Lucas has content)
2. **Spotify "Now Playing"** integration (requires API key)
3. **3D skills visualization** — React Three Fiber isolated scene (if 2D feels flat)
4. **Sound design** — ambient audio toggle (via Vibe Mode command)
5. **Analytics dashboard** — Vercel Analytics or Plausible
6. **Custom domain** — when Lucas decides on one
7. **Cape.io project details** — update when internship work matures
8. **Demo video embed** — Pitchr demo video in case study

---

## Summary

| Chunk | Tasks | Focus | Est. Days |
|-------|-------|-------|-----------|
| 1 | 1-4 | Foundation, scroll system, section wrapper | 2-3 |
| 2 | 5-7 | Particle system, cursor | 3-4 |
| 3 | 8-11 | Preloader, hero, navigation | 3-4 |
| 4 | 12-16 | All content sections + project cards | 4-5 |
| 5 | 17-18 | RAG pipeline + skills viz | 3-4 |
| 6 | 19-22 | Mobile, performance, SEO, deploy | 3-4 |
| **Total** | **22 tasks** | | **~20-24 days** |
