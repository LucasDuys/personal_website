# Technical Specification: Tech Stack, File Structure, Dependencies, Mobile, Performance & Deployment

> Section of the design spec for lucasduys.dev — "The Command Line" concept.
> This document is implementation-ready. Every decision is justified. Every file is mapped.

---

## 1. COMPLETE TECH STACK

### 1.1 Framework: Next.js 15.1 (App Router)

```
Package: next@15.1.0
```

**Why Next.js 15.1 specifically:**
- App Router is stable and provides React Server Components (RSC), which lets us render all static text content on the server and ship zero JS for non-interactive sections.
- `next/font` gives automatic font optimization — critical for JetBrains Mono + Inter subsetting.
- `generateStaticParams` + `output: 'export'` gives us a fully static export. Zero server at runtime. Pure HTML/CSS/JS on Vercel's edge CDN.
- Built-in image optimization with `next/image` for the OG image and any project screenshots.
- Metadata API (introduced in 13.2, matured by 15) replaces `next-seo` entirely — native, typed, co-located with route segments.

**Alternatives rejected:**
- **Astro** — better for pure static sites but Lucas already knows Next.js deeply, and the interactive elements (command palette, canvas animations, RAG visualization) benefit from React's component model. Astro's island architecture would make the global particle canvas and Lenis integration awkward.
- **Remix** — server-first model is overkill for a static site. No SSG story as clean as Next.js.
- **Vite + React** — no file-based routing, no built-in SSG, no metadata API. Would require assembling what Next.js gives for free.

**Configuration (`next.config.ts`):**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',           // Static export — no server needed
  images: {
    unoptimized: true,        // Required for static export
  },
  reactStrictMode: true,
  poweredByHeader: false,     // Remove X-Powered-By header
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
```

**Key detail:** We use `output: 'export'` to generate a fully static site. This means:
- No API routes (we don't need any)
- No server-side rendering at request time (all pages pre-rendered at build)
- The `out/` directory contains the complete site
- Vercel deploys this as static assets on its edge CDN — fastest possible delivery

---

### 1.2 Language: TypeScript 5.7

```
Package: typescript@5.7.0
```

**`tsconfig.json`:**
```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Key decisions:**
- `strict: true` — non-negotiable. Every type is explicit.
- `paths: { "@/*": ["./src/*"] }` — import aliases. `@/components/...` instead of `../../../components/...`.
- `target: ES2022` — modern browsers only. We are not supporting IE11. This keeps the bundle lean.
- `noUnusedLocals` + `noUnusedParameters` — keeps the codebase clean as Lucas iterates.

---

### 1.3 Styling: Tailwind CSS v4.0

```
Package: tailwindcss@4.0.0
```

**Why v4 specifically:**
- CSS-first configuration — no `tailwind.config.js` needed. All customization lives in `globals.css` via `@theme`.
- Faster build times (Oxide engine).
- Native CSS cascade layers for better specificity control — critical when mixing Tailwind with custom animation CSS.
- `@starting-style` support for entry animations (useful for the command palette modal).

**Alternatives rejected:**
- **Tailwind v3** — works fine, but v4's CSS-first config is cleaner for a new project. No migration needed since this is greenfield.
- **CSS Modules** — Lucas knows Tailwind and it's faster for iteration. CSS Modules would slow development.
- **styled-components / Emotion** — runtime CSS-in-JS has a performance cost. Not acceptable for a 90+ Lighthouse target.
- **Vanilla Extract** — great but unnecessary complexity for a single-developer static site.

**Global CSS (`src/styles/globals.css`):**
```css
@import "tailwindcss";

/* ─── Theme Tokens ─── */
@theme {
  /* Colors — from the design spec */
  --color-void: #0A0A0F;
  --color-ink: #12121A;
  --color-graphite: #1A1A26;
  --color-smoke: #2A2A3A;
  --color-bone: #E8E6E3;
  --color-ash: #8B8B9E;
  --color-slate: #555566;

  --color-phosphor: #4ADE80;
  --color-amber: #FBBF24;
  --color-cyan: #22D3EE;
  --color-violet: #A78BFA;
  --color-red: #F87171;

  /* Typography scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-hero: clamp(2.5rem, 5vw, 4.5rem);

  /* Spacing */
  --section-gap: clamp(80px, 10vh, 160px);

  /* Border radius — sharp, terminal-like */
  --radius-sm: 2px;
  --radius-md: 2px;
  --radius-lg: 2px;

  /* Fonts (applied via next/font CSS variables) */
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
  --font-sans: var(--font-inter), system-ui, sans-serif;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* ─── Base Styles ─── */
@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    background-color: var(--color-void);
    color: var(--color-bone);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: auto; /* Lenis handles smooth scroll */
  }

  body {
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Custom selection colors */
  ::selection {
    background-color: rgba(74, 222, 128, 0.3);
    color: var(--color-bone);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-graphite);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-phosphor);
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-phosphor);
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
  }
}

/* ─── Glow Utilities ─── */
@utility glow-green {
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.3), 0 0 40px rgba(74, 222, 128, 0.1);
}

@utility glow-amber {
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1);
}

@utility glow-cyan {
  text-shadow: 0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(34, 211, 238, 0.1);
}

@utility glow-violet {
  text-shadow: 0 0 20px rgba(167, 139, 250, 0.3), 0 0 40px rgba(167, 139, 250, 0.1);
}

/* ─── Animation Keyframes ─── */
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(74, 222, 128, 0.6); }
  50% { box-shadow: 0 0 16px rgba(74, 222, 128, 0.8); }
}

/* ─── Reduced Motion ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 1.4 Smooth Scroll: Lenis

```
Package: lenis@1.1.18
```

**Why Lenis (not `@studio-freight/lenis`):**
- The package was renamed from `@studio-freight/lenis` to just `lenis` in 2024. Use the new name.
- Provides the exact buttery-smooth scroll feel seen on Dennis Snellenberg's site.
- Lightweight (~4KB gzipped).
- Integrates cleanly with GSAP ScrollTrigger via the `lenis.on('scroll', ScrollTrigger.update)` pattern.

**Alternatives rejected:**
- **Locomotive Scroll** — heavier, more opinionated layout requirements, has had compatibility issues with React 18+.
- **Native CSS `scroll-behavior: smooth`** — no control over easing, no lerp, no scroll normalization across browsers. Feels cheap.
- **React Smooth Scroll libraries (react-scroll, etc.)** — these handle anchor scrolling, not the actual scroll physics. Different problem.

**Configuration:**
```typescript
// In the useLenis hook
const lenis = new Lenis({
  duration: 1.2,             // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easeOut
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  syncTouch: false,          // Don't smooth touch scrolling — feels unnatural on mobile
  touchMultiplier: 2,
});
```

**Critical integration point:** Lenis must be initialized in a client component that wraps the entire app, and it must call `ScrollTrigger.update()` on every frame to keep GSAP in sync.

---

### 1.5 Animation: GSAP + Framer Motion (Clear Boundaries)

This is the most important architectural decision in the animation stack. Both libraries are included, but they have **strictly separated responsibilities** with zero overlap.

#### GSAP + ScrollTrigger

```
Package: gsap@3.12.7 (includes ScrollTrigger as plugin)
```

**GSAP handles everything that is scroll-linked:**
1. The progress bar at the top of the viewport (width tied to scroll percentage)
2. The top bar file tab text update (section detection via ScrollTrigger markers)
3. Parallax offsets on section backgrounds (scroll-speed-linked transforms)
4. The RAG pipeline progressive activation (nodes light up as you scroll through the section, not just on enter)
5. Line number incrementing in the left margin
6. Metric counter countup animations (triggered by scroll position)
7. The hackathon timer countup (triggered by scroll position)

**Why GSAP for scroll-linked work:**
- ScrollTrigger's `scrub` parameter ties animation progress directly to scroll position with sub-pixel precision. Framer Motion's `useScroll` + `useTransform` can do simple cases, but complex staggered timelines with pinning and scrubbing are GSAP's domain.
- GSAP's timeline concept lets us orchestrate multi-step sequences (e.g., RAG pipeline: node 1 lights up at 20% scroll, node 2 at 35%, particles start at 50%) in a single declarative timeline.
- Performance: GSAP animates off the main thread where possible and batch-updates transforms.

**GSAP Registration (must happen once, client-side):**
```typescript
// src/lib/gsap.ts
'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

**GSAP License Note:** GSAP is free for sites that don't charge users. A personal portfolio qualifies. No license purchase needed.

#### Framer Motion

```
Package: framer-motion@11.15.0
```

**Framer Motion handles everything that is event-driven or layout-driven:**
1. Command palette open/close (AnimatePresence + layout animation)
2. Project card expansion to case study panel (layout animation)
3. Hover state animations (whileHover, whileTap)
4. Text split animations on section enter (staggerChildren + variants)
5. Preloader animation sequence (sequential orchestration with `animate`)
6. Easter egg overlay animations (matrix rain, neofetch card)
7. Mobile nav bottom sheet (drag + spring physics)
8. Tooltip/popover enter/exit animations

**Why Framer Motion for event-driven work:**
- `AnimatePresence` for mount/unmount animations is the single best reason to use it. GSAP requires manual DOM management for exit animations. Framer Motion handles it declaratively.
- `layout` animations for the project card expansion are trivial in Framer Motion, extremely painful in GSAP.
- React integration: Framer Motion's `motion.div` is a React component. GSAP requires refs and `useEffect` cleanup. For event-driven animations, Framer Motion's API is cleaner.
- The `whileHover`/`whileTap` props are the fastest way to build interaction states.

**Why both instead of just one:**
- GSAP without Framer Motion: you lose `AnimatePresence`, `layout` animations, and the declarative React API for event-driven work. You'd be writing imperative animation code inside `useEffect` for everything.
- Framer Motion without GSAP: you lose precise scroll-scrubbed timelines. Framer's `useScroll` can handle simple parallax but not orchestrated multi-step scroll sequences. The RAG pipeline scroll animation would be extremely complex without GSAP timelines.

**The rule is simple:** If it responds to scroll position, use GSAP. If it responds to user interaction or component lifecycle, use Framer Motion.

---

### 1.6 Text Splitting: split-type

```
Package: split-type@0.3.4
```

**What it does:** Splits text DOM nodes into individual `<span>` elements for each character, word, and/or line. This is required for:
- Character-by-character reveal animations on section headers
- Word-level stagger on paragraph reveals
- Line-level animations on the about section markdown rendering

**Why split-type:**
- Lightweight (~2KB gzipped)
- Works with any DOM element — not React-specific, so it works with GSAP refs
- Handles line splitting (requires layout measurement) correctly, including on resize
- Used widely in the award-winning portfolio community (Dennis Snellenberg, etc.)

**Alternatives rejected:**
- **GSAP SplitText** — GSAP Club GreenSock plugin, requires paid license. split-type is free and functionally identical for our use case.
- **Custom implementation** — character/word splitting is trivial, but LINE splitting requires layout measurement (knowing where text wraps). split-type handles this correctly, including re-splitting on resize.
- **Framer Motion `motion.span` mapping** — works for characters/words but cannot do line splitting.

**Usage pattern:**
```typescript
// Inside a useEffect, after the element has rendered
const text = new SplitType(elementRef.current, {
  types: 'lines, words, chars',
  tagName: 'span',
});

// Then animate with GSAP
gsap.from(text.chars, {
  opacity: 0,
  y: 20,
  stagger: 0.02,
  duration: 0.5,
  ease: 'power3.out',
  scrollTrigger: { trigger: elementRef.current, start: 'top 80%' },
});
```

---

### 1.7 Fonts: next/font

```
Packages: @next/font (built into next@15) — no separate install
Fonts: JetBrains Mono (Google Fonts), Inter (Google Fonts)
```

**Setup in `src/app/layout.tsx`:**
```typescript
import { JetBrains_Mono, Inter } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
```

**Why `next/font` instead of Google Fonts CDN:**
- Self-hosts the fonts — no external request to `fonts.googleapis.com`, no privacy concerns, no render-blocking.
- Automatic subsetting — only ships the characters actually used.
- Automatic `font-display: swap` and preload headers.
- CSS variable injection for Tailwind integration.

**Why Inter instead of Geist Sans:**
- Inter is the proven default. Geist Sans is Vercel's custom font and looks great, but Inter has better kerning tables for body text at small sizes, wider language support, and more weight granularity.
- If Lucas later wants Geist Sans, it's a one-line swap.

---

### 1.8 Command Palette: cmdk

```
Package: cmdk@1.0.4
```

**What it does:** Provides the unstyled, accessible command palette primitives (the `<Command>` compound component). We style it entirely ourselves to match the CLI aesthetic.

**Why cmdk:**
- Created by Paco Coursey (Rauno Kolberg design). It's the exact library used by Linear, Vercel, and Raycast.
- Fully unstyled — we own every pixel.
- Built-in fuzzy search matching.
- Keyboard navigation (arrow keys, enter, escape) works out of the box.
- Accessible by default (ARIA roles, focus management).
- Tiny bundle (~3KB gzipped).

**Alternatives rejected:**
- **kbar** — heavier, more opinionated styling, less community adoption.
- **Custom implementation** — fuzzy search, keyboard navigation, focus trapping, and accessibility are genuinely hard to get right. cmdk is battle-tested.
- **Ninja Keys** — web component based, doesn't integrate as cleanly with React's component model.

**Configuration:** The `<Command>` component will be wrapped in our own `<CommandPalette>` component with Framer Motion's `AnimatePresence` for the enter/exit animation. The modal backdrop, the monospace input styling, the green cursor, and the command list are all custom styled with Tailwind.

---

### 1.9 Syntax Highlighting: Shiki

```
Package: shiki@1.24.0
```

**What it does:** Server-side syntax highlighting with VS Code's TextMate grammar engine. Used for the about section's markdown rendering and any code blocks in project descriptions.

**Why Shiki:**
- Same highlighting engine as VS Code — pixel-perfect accuracy.
- Server-side rendering — highlighted HTML is generated at build time, zero client-side JS.
- Custom themes — we create a theme matching our exact color palette (violet for keywords, green for strings, ash for comments, cyan for functions, bone for variables).
- Tree-shakeable — only loads grammars for languages we actually use (markdown, typescript, json).

**Alternatives rejected:**
- **Prism.js** — client-side only (or requires a separate build step), limited theme customization compared to Shiki's TextMate grammars.
- **highlight.js** — similar limitations, less accurate highlighting.
- **Sugar High** — ultralight (~1KB) but only supports a handful of languages and can't do custom themes at the level we need.

**Custom theme (`src/lib/shiki-theme.ts`):**
```typescript
export const commandLineTheme = {
  name: 'command-line',
  type: 'dark',
  colors: {
    'editor.background': '#0A0A0F',
    'editor.foreground': '#E8E6E3',
  },
  tokenColors: [
    { scope: 'keyword', settings: { foreground: '#A78BFA' } },       // Soft Violet
    { scope: 'string', settings: { foreground: '#4ADE80' } },        // Phosphor Green
    { scope: 'comment', settings: { foreground: '#8B8B9E' } },       // Ash
    { scope: 'entity.name.function', settings: { foreground: '#22D3EE' } }, // Link Cyan
    { scope: 'variable', settings: { foreground: '#E8E6E3' } },      // Bone
    { scope: 'constant.numeric', settings: { foreground: '#FBBF24' } }, // Signal Amber
    { scope: 'punctuation.definition.heading.markdown', settings: { foreground: '#A78BFA' } },
    { scope: 'markup.bold', settings: { foreground: '#E8E6E3', fontStyle: 'bold' } },
    { scope: 'markup.italic', settings: { foreground: '#E8E6E3', fontStyle: 'italic' } },
    { scope: 'markup.quote', settings: { foreground: '#8B8B9E', fontStyle: 'italic' } },
  ],
};
```

---

### 1.10 Noise Generation: simplex-noise

```
Package: simplex-noise@4.0.3
```

**What it does:** Generates coherent noise values for the particle/neural network background system. Used to create organic-feeling movement patterns for the canvas particles instead of purely random motion.

**Why simplex-noise:**
- Pure math, zero dependencies, ~1KB gzipped.
- 2D, 3D, and 4D noise — we use 3D (x, y, time) for smooth particle field movement.
- Deterministic — same seed produces same noise, useful for consistent behavior across loads.

**Alternatives rejected:**
- **Perlin noise manual implementation** — simplex noise is faster (O(n) vs O(2^n) per dimension) and has fewer directional artifacts.
- **p5.js noise()** — requires importing all of p5.js (~800KB). Absurd.

---

### 1.11 Deployment & Analytics

#### Vercel

```
Platform: Vercel (free tier is sufficient)
```

No `vercel.json` needed for basic deployment. Next.js static export is auto-detected.

#### Vercel Analytics

```
Package: @vercel/analytics@1.4.1
```

**Why:** Zero-config with Vercel, privacy-respecting (no cookies), tiny (~1KB), gives page views and Web Vitals without any GDPR concerns. Free tier covers more than enough traffic for a personal portfolio.

**Alternatives rejected:**
- **Plausible** — excellent but costs $9/month. Vercel Analytics is free.
- **Google Analytics** — heavy, requires cookie consent, overkill for a portfolio.
- **Umami** — requires self-hosting, unnecessary operational overhead.

#### Vercel Speed Insights

```
Package: @vercel/speed-insights@1.1.0
```

**Why:** Real User Monitoring (RUM) for Core Web Vitals. Reports actual LCP, FID, CLS from real visitors. Free on Vercel.

---

### 1.12 Development Tooling

```
Packages:
  eslint@9.17.0
  eslint-config-next@15.1.0
  prettier@3.4.2
  prettier-plugin-tailwindcss@0.6.9
```

**ESLint config (`.eslintrc.json`):**
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

**Prettier config (`.prettierrc`):**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

The `prettier-plugin-tailwindcss` automatically sorts Tailwind classes in the recommended order. Saves mental overhead.

---

## 2. COMPLETE FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, Lenis provider, analytics
│   ├── page.tsx                # Home page: assembles all sections in order
│   ├── globals.css             # → imports from src/styles/globals.css (Next.js convention)
│   ├── icon.svg                # Favicon: >_ in phosphor green on void black
│   ├── opengraph-image.png     # OG image: hero boot sequence render (1200x630)
│   ├── robots.ts               # Generates robots.txt via Next.js metadata API
│   └── sitemap.ts              # Generates sitemap.xml via Next.js metadata API
│
├── components/
│   ├── layout/
│   │   ├── Preloader.tsx       # Boot sequence animation (phases 1-5). Shows on first load.
│   │   │                       #   Exports: <Preloader onComplete={() => void} />
│   │   │                       #   Uses: Framer Motion for sequencing, custom typewriter
│   │   │                       #   Manages its own state, calls onComplete when done
│   │   │
│   │   ├── TopBar.tsx          # Sticky top bar: file tab + nav links + scroll progress
│   │   │                       #   Exports: <TopBar />
│   │   │                       #   Uses: GSAP ScrollTrigger for progress bar + active section
│   │   │                       #   Props: none (reads scroll position internally)
│   │   │
│   │   ├── LineNumbers.tsx     # Left-margin line numbers (decorative, hidden on mobile)
│   │   │                       #   Exports: <LineNumbers />
│   │   │                       #   Uses: GSAP scroll-linked incrementing
│   │   │
│   │   ├── MobileNav.tsx       # Full-screen mobile navigation overlay
│   │   │                       #   Exports: <MobileNav isOpen onClose />
│   │   │                       #   Uses: Framer Motion AnimatePresence
│   │   │
│   │   └── Footer.tsx          # Minimal footer: copyright, source code link
│   │                           #   Exports: <Footer />
│   │
│   ├── canvas/
│   │   ├── ParticleCanvas.tsx  # Full-page background canvas: data stream / neural net
│   │   │                       #   Exports: <ParticleCanvas />
│   │   │                       #   Uses: Canvas 2D API, simplex-noise, requestAnimationFrame
│   │   │                       #   Props: none (reads viewport size + device tier internally)
│   │   │                       #   Adapts: reduced particles on mobile, disabled on low-end
│   │   │
│   │   └── particle-system.ts  # Pure logic: particle creation, physics, rendering
│   │                           #   Exports: createParticleSystem(), updateParticles(), renderParticles()
│   │                           #   No React dependency — pure functions operating on typed state
│   │
│   ├── sections/
│   │   ├── Hero.tsx            # Boot sequence + name + tagline + cycling prompt
│   │   │                       #   Exports: <Hero />
│   │   │                       #   Uses: useTypewriter hook, Framer Motion for fade-in
│   │   │
│   │   ├── About.tsx           # cat about.md — markdown-rendered about text
│   │   │                       #   Exports: <About />
│   │   │                       #   Uses: Shiki for syntax highlighting, split-type + GSAP for reveals
│   │   │
│   │   ├── Status.tsx          # systemctl status lucas — current role/education/location
│   │   │                       #   Exports: <Status />
│   │   │                       #   Uses: GSAP staggered line reveal
│   │   │
│   │   ├── Experience.tsx      # git log — timeline as commit history
│   │   │                       #   Exports: <Experience />
│   │   │                       #   Uses: GSAP scroll-triggered reveals, Framer Motion hover states
│   │   │
│   │   ├── Projects.tsx        # ls -la projects/ — file listing + project cards
│   │   │                       #   Exports: <Projects />
│   │   │                       #   Uses: Framer Motion layout animation for card expansion
│   │   │
│   │   ├── Skills.tsx          # query lucas --capabilities — skill table + visualization
│   │   │                       #   Exports: <Skills />
│   │   │                       #   Uses: GSAP for bar animations, Canvas for scatter plot
│   │   │
│   │   ├── Hackathons.tsx      # time ./hackathon.sh — timer + progress bar
│   │   │                       #   Exports: <Hackathons />
│   │   │                       #   Uses: GSAP scroll-triggered countup
│   │   │
│   │   └── Contact.tsx         # ssh lucas@connect — contact links styled as SSH session
│   │                           #   Exports: <Contact />
│   │                           #   Uses: useTypewriter hook
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx     # Single project card with expand/collapse
│   │   │                       #   Exports: <ProjectCard project={ProjectData} />
│   │   │                       #   Props: { project: ProjectData; isExpanded: boolean; onToggle: () => void }
│   │   │                       #   Uses: Framer Motion layout + AnimatePresence for expansion
│   │   │
│   │   ├── RAGPipeline.tsx     # Interactive RAG pipeline SVG visualization
│   │   │                       #   Exports: <RAGPipeline />
│   │   │                       #   Uses: SVG + Framer Motion for node animations, GSAP ScrollTrigger for scroll-linked activation
│   │   │                       #   Contains: PipelineNode, PipelineEdge, DataParticle sub-components
│   │   │
│   │   ├── ProcessLog.tsx      # Staggered process log animation (Pitchr timeline)
│   │   │                       #   Exports: <ProcessLog entries={LogEntry[]} />
│   │   │                       #   Uses: GSAP stagger animation
│   │   │
│   │   └── MetricBar.tsx       # Animated metric bar (Amplifirm metrics)
│   │                           #   Exports: <MetricBar label value max color />
│   │                           #   Uses: GSAP scroll-triggered width animation
│   │
│   ├── interactive/
│   │   ├── CommandPalette.tsx   # Full command palette modal
│   │   │                       #   Exports: <CommandPalette />
│   │   │                       #   Uses: cmdk, Framer Motion AnimatePresence
│   │   │                       #   Handles: fuzzy search, keyboard nav, section jumping, easter eggs
│   │   │
│   │   ├── CustomCursor.tsx    # Custom cursor with multiple states
│   │   │                       #   Exports: <CustomCursor />
│   │   │                       #   Uses: Framer Motion spring animation for cursor follow
│   │   │                       #   States: default (small dot), hover-link (ring), hover-project (expand), text (i-beam)
│   │   │                       #   Hidden on touch devices
│   │   │
│   │   ├── CipherText.tsx      # Scramble/cipher text effect on hover
│   │   │                       #   Exports: <CipherText text={string} />
│   │   │                       #   Uses: requestAnimationFrame, random character cycling before resolving to real text
│   │   │
│   │   ├── TypedCommand.tsx    # Section command header with typing animation
│   │   │                       #   Exports: <TypedCommand command={string} prefix="$" />
│   │   │                       #   Uses: useTypewriter hook, triggered by IntersectionObserver
│   │   │
│   │   └── CountUpNumber.tsx   # Animated number counter
│   │                           #   Exports: <CountUpNumber end={number} duration={number} suffix={string} />
│   │                           #   Uses: GSAP scroll-triggered animation
│   │
│   └── ui/
│       ├── TerminalBlock.tsx   # Styled terminal output container
│       │                       #   Exports: <TerminalBlock title={string}>{children}</TerminalBlock>
│       │                       #   Provides the bordered box with monospace styling
│       │
│       ├── GlowButton.tsx      # Button with phosphor glow hover effect
│       │                       #   Exports: <GlowButton href label icon />
│       │                       #   Uses: Framer Motion whileHover
│       │
│       ├── SkillTag.tsx        # Individual skill badge with category color
│       │                       #   Exports: <SkillTag name category level />
│       │
│       ├── StatusDot.tsx       # Pulsing green dot for "deployed" status
│       │                       #   Exports: <StatusDot status="active" | "archived" />
│       │                       #   Uses: CSS animation (pure CSS, no JS needed)
│       │
│       └── SectionWrapper.tsx  # Wrapper for each section: handles scroll detection + command header
│                               #   Exports: <SectionWrapper id command>{children}</SectionWrapper>
│                               #   Uses: GSAP ScrollTrigger for section entry detection
│                               #   Passes section ID to TopBar for active tab update
│
├── hooks/
│   ├── useTypewriter.ts        # Typewriter animation hook
│   │                           #   Exports: useTypewriter(texts: string[], config: TypewriterConfig)
│   │                           #   Returns: { displayText: string; isTyping: boolean; cursorVisible: boolean }
│   │                           #   Uses: requestAnimationFrame for timing
│   │
│   ├── useLenis.ts             # Lenis smooth scroll hook
│   │                           #   Exports: useLenis(callback?: (lenis: Lenis) => void)
│   │                           #   Returns: Lenis instance
│   │                           #   Integrates with GSAP ScrollTrigger.update()
│   │
│   ├── useReducedMotion.ts     # Detects prefers-reduced-motion
│   │                           #   Exports: useReducedMotion()
│   │                           #   Returns: boolean
│   │                           #   Uses: window.matchMedia
│   │
│   ├── useDeviceTier.ts        # Detects device capability tier
│   │                           #   Exports: useDeviceTier()
│   │                           #   Returns: 'high' | 'medium' | 'low'
│   │                           #   Uses: navigator.hardwareConcurrency, deviceMemory, connection.effectiveType
│   │                           #   Determines particle count, animation complexity
│   │
│   ├── useMediaQuery.ts        # Responsive breakpoint hook
│   │                           #   Exports: useMediaQuery(query: string)
│   │                           #   Returns: boolean
│   │
│   ├── useCommandPalette.ts    # Command palette state management
│   │                           #   Exports: useCommandPalette()
│   │                           #   Returns: { isOpen, open, close, toggle }
│   │                           #   Handles: Ctrl+K / Cmd+K / "/" keyboard shortcuts
│   │
│   ├── useSectionInView.ts     # Tracks which section is currently in the viewport
│   │                           #   Exports: useSectionInView(sectionId: string, threshold: number)
│   │                           #   Returns: boolean
│   │
│   └── useScrollDirection.ts   # Tracks scroll direction (for TopBar show/hide on mobile)
│                               #   Exports: useScrollDirection()
│                               #   Returns: 'up' | 'down'
│
├── lib/
│   ├── gsap.ts                 # GSAP + ScrollTrigger registration (client-only)
│   ├── shiki.ts                # Shiki highlighter setup with custom theme
│   ├── commands.ts             # Command palette command definitions + easter eggs
│   │                           #   Exports: commands: Command[]
│   │                           #   Each command: { id, label, description, action, keywords, icon }
│   │
│   ├── constants.ts            # Animation timing constants, breakpoints, particle config
│   │                           #   Exports: TIMING, BREAKPOINTS, PARTICLES, COLORS
│   │
│   ├── utils.ts                # Generic utilities: cn() classname merger, clamp(), lerp()
│   │                           #   Uses: clsx + tailwind-merge
│   │
│   └── metadata.ts             # SEO metadata constants (title, description, OG, JSON-LD)
│
├── data/
│   ├── projects.ts             # Project data: Pitchr, Stacklink, LLM Workshops, Amplifirm
│   │                           #   Exports: projects: ProjectData[]
│   │                           #   Each project: { slug, name, status, builtIn, event, description,
│   │                           #                   techStack, links, processLog?, metrics? }
│   │
│   ├── experience.ts           # Experience entries as git log entries
│   │                           #   Exports: experiences: ExperienceData[]
│   │                           #   Each: { hash, branch, author, date, message, body, tags }
│   │
│   ├── skills.ts               # Skills data with categories and levels
│   │                           #   Exports: skills: SkillData[]
│   │                           #   Each: { name, category, level (1-5), lastUsed, description }
│   │
│   ├── about.ts                # About section markdown text
│   │                           #   Exports: aboutMarkdown: string
│   │
│   └── hackathons.ts           # Hackathon data
│                               #   Exports: hackathons: HackathonData[]
│
├── types/
│   ├── index.ts                # Barrel export for all types
│   ├── project.ts              # ProjectData, LogEntry, ProjectLink interfaces
│   ├── experience.ts           # ExperienceData interface
│   ├── skill.ts                # SkillData, SkillCategory type
│   ├── hackathon.ts            # HackathonData interface
│   ├── command.ts              # Command interface (for command palette)
│   ├── particle.ts             # Particle, ParticleConfig, ParticleSystemState interfaces
│   └── animation.ts            # TypewriterConfig, AnimationTiming interfaces
│
├── styles/
│   └── globals.css             # Full CSS file (as shown in section 1.3 above)
│
└── providers/
    ├── LenisProvider.tsx       # Wraps app in Lenis smooth scroll context
    │                           #   Exports: <LenisProvider>{children}</LenisProvider>
    │                           #   Initializes Lenis, connects to GSAP ScrollTrigger
    │                           #   Cleans up on unmount
    │
    └── MotionProvider.tsx      # Wraps app with LazyMotion for reduced bundle
                                #   Exports: <MotionProvider>{children}</MotionProvider>
                                #   Uses: LazyMotion + domAnimation feature bundle
                                #   Reduces Framer Motion bundle by ~60%

public/
├── og-image.png                # Pre-rendered OG image (1200x630, boot sequence screenshot)
├── resume.pdf                  # Lucas's CV for download
└── fonts/                      # (empty — next/font self-hosts automatically)
```

**Total files: ~55 source files.** This is intentionally granular. Every component has a single responsibility. No file exceeds ~200 lines. Lucas can find and modify anything by name.

---

## 3. DEPENDENCIES (`package.json`)

```jsonc
{
  "name": "lucas-duys-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true next build"
  },

  "dependencies": {
    // ─── Framework ───
    "next":                     "15.1.0",
    "react":                    "19.0.0",
    "react-dom":                "19.0.0",

    // ─── Animation & Scroll ───
    "framer-motion":            "11.15.0",
    "gsap":                     "3.12.7",
    "lenis":                    "1.1.18",
    "split-type":               "0.3.4",

    // ─── Command Palette ───
    "cmdk":                     "1.0.4",

    // ─── Syntax Highlighting ───
    "shiki":                    "1.24.0",

    // ─── Noise Generation ───
    "simplex-noise":            "4.0.3",

    // ─── Utilities ───
    "clsx":                     "2.1.1",
    "tailwind-merge":           "2.6.0",

    // ─── Analytics ───
    "@vercel/analytics":        "1.4.1",
    "@vercel/speed-insights":   "1.1.0"
  },

  "devDependencies": {
    // ─── Language ───
    "typescript":               "5.7.0",
    "@types/react":             "19.0.0",
    "@types/react-dom":         "19.0.0",
    "@types/node":              "22.10.0",

    // ─── Styling ───
    "tailwindcss":              "4.0.0",
    "@tailwindcss/postcss":     "4.0.0",
    "postcss":                  "8.4.49",

    // ─── Linting & Formatting ───
    "eslint":                   "9.17.0",
    "eslint-config-next":       "15.1.0",
    "prettier":                 "3.4.2",
    "prettier-plugin-tailwindcss": "0.6.9",

    // ─── Bundle Analysis (optional) ───
    "@next/bundle-analyzer":    "15.1.0"
  }
}
```

**Dependency count:** 14 production, 11 dev. Lean.

**Total production JS shipped (estimated):**
| Package | Gzipped size | Notes |
|---|---|---|
| React + React DOM | ~42KB | Baseline, unavoidable |
| Next.js runtime | ~28KB | App Router client runtime |
| Framer Motion (LazyMotion) | ~18KB | Using `domAnimation` feature bundle, not full |
| GSAP + ScrollTrigger | ~28KB | Tree-shaken, only ScrollTrigger plugin |
| Lenis | ~4KB | Minimal |
| cmdk | ~3KB | Only loaded when command palette opens (dynamic import) |
| split-type | ~2KB | |
| Shiki | ~0KB client | Server-rendered, outputs static HTML |
| simplex-noise | ~1KB | |
| clsx + tailwind-merge | ~3KB | |
| Vercel Analytics + Speed Insights | ~2KB | |
| **Total** | **~131KB gzipped** | Before custom code |

Custom code estimate: ~15-25KB gzipped. **Total: ~150-155KB gzipped.** Well under the 200KB budget.

---

## 4. MOBILE STRATEGY (Detailed)

### 4.1 Breakpoints

```
sm:  640px   — Large phones (iPhone Pro Max landscape)
md:  768px   — Tablets portrait, small laptops
lg:  1024px  — Tablets landscape, standard laptops
xl:  1280px  — Desktop
2xl: 1536px  — Large desktop
```

**The critical breakpoint is `md: 768px`.** Below this, the site is in "mobile mode." Above, it's "desktop mode." There is no in-between layout — it's one or the other. This keeps the CSS simple and avoids half-broken intermediate states.

### 4.2 Feature-by-Feature Mobile Adaptation

| # | Feature | Desktop | Mobile (< 768px) | Reason |
|---|---------|---------|-------------------|--------|
| 1 | **Preloader boot sequence** | Full 5-phase animation, 2.5s | Shortened to 3 phases (skip module loading lines), 1.5s | Mobile users have less patience. The boot sequence on a phone feels like a loading screen, not a narrative moment |
| 2 | **Particle canvas** | 80-120 particles, neural network connections, simplex noise field | **15-25 particles, no connections, no noise field**. Just slowly drifting dots at 3% opacity | GPU constraints. Connections require O(n^2) distance checks. On mobile, the canvas is decorative texture only |
| 3 | **Smooth scroll (Lenis)** | Full smooth scroll with lerp 0.1 | **Disabled.** Native scroll only. `syncTouch: false` and `smoothWheel: false` on mobile | Smooth-scrolling on touch devices feels wrong — it fights the user's finger. Every premium mobile site uses native scroll |
| 4 | **Scroll-triggered animations** | Full GSAP ScrollTrigger with staggered reveals, parallax, scrub | Simplified: **fade-in only** (no translateY, no stagger, no parallax). Trigger threshold raised to 0.3 (triggers later, closer to viewport center) | Performance. Complex staggered animations cause jank on mid-tier phones. Fade-in is GPU-composited (opacity only) |
| 5 | **Custom cursor** | Full custom cursor with multiple states | **Completely disabled.** Standard system cursor | Touch devices don't have cursors. The `CustomCursor` component checks `window.matchMedia('(hover: hover)')` and renders nothing on touch devices |
| 6 | **Command palette** | Centered modal, Ctrl+K trigger | **Bottom sheet** sliding up from bottom of screen. Triggered by the `>_` FAB button (no keyboard shortcut on mobile). Input field at top, results below, dismiss by swipe-down or tap outside | Bottom sheets are the native mobile pattern. A centered modal on mobile wastes space and feels foreign |
| 7 | **Text split animations** | Character-level stagger on headings, word-level on paragraphs | **Line-level only** on headings. No character/word stagger on body text | split-type creates hundreds of `<span>` elements. On mobile, this DOM bloat hurts scroll performance. Line-level is enough |
| 8 | **RAG pipeline visualization** | Full SVG with animated particles flowing along paths, hover tooltips on nodes | **Vertical step list.** Each pipeline stage is a card stacked vertically: Query -> Embed -> Vector Search -> BM25 -> Fusion -> Results. Each card has the node name + brief description. Animated data particles replaced with a simple sequential glow (each card lights up in turn on scroll) | The branching SVG diagram doesn't fit on a 375px screen. Even scaled down it would be unreadable. The vertical format actually reads better on mobile |
| 9 | **Skills embedding scatter plot** | Full interactive canvas scatter plot with hover/click | **Skill cards in a scrollable grid (2 columns).** Each card shows skill name + level bar + category color. Tap a card to see details | Interactive scatter plots require hover precision that touch lacks. A card grid is more usable |
| 10 | **Metric counter animations** | Animated countup from 0 triggered by scroll | **Same behavior, kept as-is.** Number animations are lightweight and compelling on any device | Countups are cheap (single DOM element, requestAnimationFrame) and add delight |
| 11 | **Project expansion panels** | Click to expand card in-place with layout animation | **Full-screen slide-in panel** from the right. Close with back arrow or swipe right. Uses Framer Motion `AnimatePresence` + translateX | In-place expansion on mobile creates layout shift and makes content hard to read in a constrained space. Full-screen is cleaner |
| 12 | **Cipher/scramble text on hover** | Text scrambles on mouse hover | **Text scrambles on scroll-into-view** (plays once). No interaction needed | No hover on touch. Playing on scroll-in preserves the effect |
| 13 | **Left margin line numbers** | Visible in left margin (48px wide), incrementing with scroll | **Hidden.** `display: none` below 768px | Line numbers eat 48px of horizontal space. On a 375px screen that's 13% of the width — too much |
| 14 | **Top bar navigation** | Horizontal nav links: `about experience projects skills contact` | **Hamburger icon** opening full-screen overlay. Current section shown as file tab text. The scroll progress bar remains | Five text links don't fit in a 375px top bar. The hamburger overlay gives each item large touch targets (48px+ height) |
| 15 | **Parallax backgrounds** | Section backgrounds scroll at 0.95x speed | **Disabled.** All elements scroll at 1.0x (normal) speed | Parallax on mobile causes paint/composite overhead and can trigger jank during fast scrolling |
| 16 | **Background data stream** | 50 columns of falling characters, opacity 0.03-0.06 | **Completely disabled.** The background is pure `#0A0A0F` | The data stream canvas is the most expensive rendering operation. On mobile it's invisible at 3% opacity anyway — not worth the GPU cost |
| 17 | **Section command headers** | Full typed command (e.g., `$ systemctl status lucas`) | **Pre-rendered, no typing animation.** The command text appears instantly with the section, styled identically | Typing animations block content visibility. On mobile, users scroll faster and don't wait for typing to complete |
| 18 | **Scan-line hover on project cards** | CSS pseudo-element sweeps top-to-bottom on hover | **Disabled.** Cards use a subtle border-left color change on tap instead | No hover on touch |
| 19 | **Interactive skill query** | Users can type `--category=ai`, `--sort=level`, `--verbose` | **Pre-populated filter buttons:** `All`, `Frontend`, `AI/ML`, `Backend`, `Ops`. Tap to filter. No text input | Typing queries on a phone keyboard is hostile UX. Buttons are instant |
| 20 | **AI conversation element** | Types out on scroll with variable speed | **Simplified:** appears as a static block quote, no typing animation. Styled as a chat bubble | The typing animation is charming on desktop but on mobile it delays content. Show it immediately |

### 4.3 Touch Interaction Replacements

| Desktop Interaction | Mobile Replacement |
|---|---|
| Hover to preview | Tap to toggle |
| Hover for tooltip | Long-press (300ms) for tooltip, or inline text |
| Custom cursor state change | Border/background color change on tap target |
| Mouse-follow particle attraction | Disabled — particles drift autonomously |
| Scroll wheel smooth physics (Lenis) | Native touch scroll (momentum built into iOS/Android) |
| Keyboard shortcut hints (Ctrl+K, /) | Hidden — replaced by the visible `>_` FAB |
| Drag to reorder (if any) | Swipe gestures with snap points |

### 4.4 Mobile Nav Design

**Closed state:**
- Top bar: 56px height, `backdrop-blur(12px)`, `background: rgba(10, 10, 15, 0.9)`
- Left: current section as file tab (e.g., `~/projects.ts`) in JetBrains Mono `text-xs`
- Center: scroll progress bar (thin green line, full width)
- Right: hamburger icon (3 horizontal lines, 24x24, Bone color)

**Open state (full-screen overlay):**
- Background: `#0A0A0F` at 98% opacity with `backdrop-blur(20px)`
- Centered vertically: list of section commands, each 56px tall, with the `$` prefix in Phosphor Green
- Each item is a full-width touch target
- At the bottom: social links (GitHub, LinkedIn) + "Download CV" button
- Close by tapping the X (top-right) or tapping a section link (auto-closes after navigation)
- Framer Motion: slides in from right with spring physics, overlay fades in

**The `>_` FAB (floating action button):**
- Fixed position: bottom 24px, right 24px
- Size: 56px diameter circle
- Background: `#1A1A26` with 1px `#2A2A3A` border
- Icon: `>_` in JetBrains Mono, Phosphor Green
- Touch target: 56px (exceeds the 48px accessibility minimum)
- On tap: opens command palette as bottom sheet
- Z-index: above everything except the command palette itself

### 4.5 Performance Targets by Device Tier

The `useDeviceTier` hook classifies the device:

**High tier** (4+ CPU cores, 4GB+ RAM, 4G/WiFi):
- Full particle system (80 particles, connections enabled)
- All animations at full complexity
- Targets: LCP < 2.0s, TBT < 150ms, 60fps

**Medium tier** (2-3 cores, 2-4GB RAM, 4G):
- Reduced particles (30 particles, no connections)
- Simplified text animations (no character-level splitting)
- Targets: LCP < 2.5s, TBT < 200ms, 45fps minimum

**Low tier** (below medium thresholds, slow 3G):
- Particles disabled
- All scroll animations are instant (no transitions)
- No canvas rendering at all
- No Lenis (native scroll only, which is already true on mobile)
- Targets: LCP < 3.0s, TBT < 300ms

Detection logic:
```typescript
export function useDeviceTier(): 'high' | 'medium' | 'low' {
  const [tier, setTier] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4; // Chrome-only API
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || '4g';

    if (cores <= 2 || memory <= 2 || effectiveType === 'slow-2g' || effectiveType === '2g') {
      setTier('low');
    } else if (cores <= 4 || memory <= 4 || effectiveType === '3g') {
      setTier('medium');
    } else {
      setTier('high');
    }
  }, []);

  return tier;
}
```

---

## 5. PERFORMANCE BUDGET

### 5.1 Core Web Vitals Targets

| Metric | Target (Desktop) | Target (Mobile) | What affects it |
|---|---|---|---|
| **First Contentful Paint (FCP)** | < 0.8s | < 1.5s | Font loading, CSS delivery, server response time |
| **Largest Contentful Paint (LCP)** | < 1.2s | < 2.5s | Hero text rendering (the LCP element). No large images above the fold |
| **Total Blocking Time (TBT)** | < 100ms | < 200ms | JS bundle parse time, GSAP initialization, Lenis setup |
| **Cumulative Layout Shift (CLS)** | < 0.05 | < 0.1 | Font swap, preloader -> content transition, dynamic content |
| **Interaction to Next Paint (INP)** | < 100ms | < 200ms | Command palette open/close, project expansion |
| **Time to Interactive (TTI)** | < 2.0s | < 3.5s | All JS loaded and interactive |

### 5.2 JS Bundle Size Breakdown

**Route: `/` (the only route)**

| Chunk | Contents | Size (gzipped) | Loading |
|---|---|---|---|
| `framework.js` | React, React DOM, Next.js runtime | ~70KB | Immediate — needed for hydration |
| `main.js` | Lenis, GSAP + ScrollTrigger, custom hooks, layout components | ~40KB | Immediate — needed for scroll system |
| `motion.js` | Framer Motion (LazyMotion domAnimation bundle) | ~18KB | Immediate — needed for preloader animation |
| `sections.js` | All section components (Hero through Contact) | ~12KB | Immediate — single-page site |
| `particle-canvas.js` | ParticleCanvas, simplex-noise, particle-system logic | ~5KB | **Lazy loaded** — `dynamic(() => import(...), { ssr: false })`. Not needed until after preloader completes |
| `command-palette.js` | cmdk, CommandPalette component, commands data | ~8KB | **Lazy loaded** — `dynamic(() => import(...), { ssr: false })`. Only loaded when user triggers Ctrl+K or taps FAB |
| `rag-pipeline.js` | RAGPipeline SVG component | ~4KB | **Lazy loaded** — only loaded when Projects section enters viewport |
| `shiki-output` | Pre-rendered HTML (no client JS) | 0KB client | Server-rendered at build time |
| `analytics.js` | Vercel Analytics + Speed Insights | ~2KB | **Deferred** — `<Script strategy="lazyOnload">` |
| **Total initial load** | | **~140KB** | |
| **Total with lazy chunks** | | **~159KB** | Loaded on demand |

### 5.3 Image Optimization Strategy

This site has almost no images. The CLI aesthetic is text and canvas — no hero images, no project screenshots in the main view. The only images are:

| Image | Format | Size | Loading |
|---|---|---|---|
| `og-image.png` | PNG | ~80KB | Never loaded by the site itself — only by social media crawlers |
| `favicon.svg` | SVG | ~1KB | Inline SVG, no network request |
| Project screenshots (inside expanded cards) | WebP | < 100KB each | `loading="lazy"`, only loaded when project card is expanded |
| `resume.pdf` | PDF | < 500KB | Only downloaded on user click |

**No image optimization pipeline needed.** The OG image is pre-created and placed in `public/`. `next/image` is not needed since we use `output: 'export'` (which requires `unoptimized: true` anyway). Any future images should be pre-optimized to WebP using Squoosh or Sharp before adding to the repo.

### 5.4 Font Loading Strategy

**Method:** `next/font` with `display: 'swap'` and `preload: true`.

**What happens:**
1. Next.js generates `<link rel="preload" as="font" type="font/woff2" crossorigin>` headers for both JetBrains Mono and Inter at build time.
2. The fonts are self-hosted (bundled in `_next/static/media/`), so there's no DNS lookup or connection to an external font server.
3. `display: 'swap'` means the browser renders text immediately in the system fallback font, then swaps to the web font when loaded. The swap happens within ~50-100ms since the font is preloaded.
4. Only the Latin subset is included. JetBrains Mono 400/500/700 + Inter 400/500/600/700 = approximately 200KB total WOFF2 (loaded in parallel, cached after first visit).

**CLS prevention:** Since both JetBrains Mono and Inter have metrics close to their system fallback fonts (monospace and sans-serif respectively), the layout shift on swap is minimal. Next.js also applies size-adjust CSS automatically to match metrics.

### 5.5 Canvas Rendering Budget

The particle canvas runs on `requestAnimationFrame`. Frame budget at 60fps = **16.67ms per frame**.

| Operation | Budget | Notes |
|---|---|---|
| Particle position update (simplex noise sample + velocity) | < 2ms for 80 particles | Each particle: 1 noise sample (~0.01ms) + vector math. 80 * 0.025ms = 2ms |
| Connection distance checks | < 3ms for 80 particles | O(n^2/2) = 3,160 comparisons. Each is a distance calc + comparison. ~0.001ms each = 3.2ms |
| Canvas clear + draw | < 4ms | `clearRect` + `beginPath` + `arc` for each particle + `moveTo`/`lineTo` for connections |
| **Total** | **< 9ms** | Leaves 7.5ms headroom for browser compositing + main thread work |

**Adaptive quality:**
- If `requestAnimationFrame` callback receives a timestamp delta > 20ms (meaning we're dropping below 50fps), automatically reduce particle count by 20%.
- If delta > 33ms (below 30fps), disable connections entirely.
- If delta > 50ms (below 20fps), disable the canvas.
- This is implemented in the `particle-system.ts` render loop:

```typescript
let consecutiveSlowFrames = 0;

function onFrame(timestamp: number) {
  const delta = timestamp - lastTimestamp;

  if (delta > 20) consecutiveSlowFrames++;
  else consecutiveSlowFrames = Math.max(0, consecutiveSlowFrames - 1);

  if (consecutiveSlowFrames > 10) {
    reduceQuality(); // Fewer particles or disable connections
    consecutiveSlowFrames = 0;
  }
  // ... render
}
```

### 5.6 Tab Visibility Optimization

When the browser tab is not visible:
- Cancel the `requestAnimationFrame` loop for the particle canvas
- Pause all GSAP animations (GSAP does this automatically via its ticker)
- Pause Lenis

```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId);
    lenis.stop();
  } else {
    rafId = requestAnimationFrame(renderLoop);
    lenis.start();
  }
});
```

---

## 6. ACCESSIBILITY

### 6.1 Semantic HTML Structure

```html
<body>
  <!-- Skip link (visually hidden, first focusable element) -->
  <a href="#main-content" class="sr-only focus:not-sr-only ...">
    Skip to main content
  </a>

  <!-- Preloader (aria-live region) -->
  <div role="status" aria-live="polite" aria-label="Loading site">
    <!-- Boot sequence text announced by screen readers -->
  </div>

  <!-- Top bar navigation -->
  <header role="banner">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#about" aria-current="false">about</a></li>
        <li><a href="#experience" aria-current="false">experience</a></li>
        <!-- ... -->
      </ul>
    </nav>
    <!-- Scroll progress -->
    <div role="progressbar" aria-label="Page scroll progress"
         aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
    </div>
  </header>

  <!-- Main content -->
  <main id="main-content">
    <section id="hero" aria-label="Introduction">...</section>
    <section id="about" aria-label="About Lucas Duys">...</section>
    <section id="experience" aria-label="Work experience">...</section>
    <section id="projects" aria-label="Projects">...</section>
    <section id="skills" aria-label="Technical skills">...</section>
    <section id="hackathons" aria-label="Hackathon achievements">...</section>
    <section id="contact" aria-label="Contact information">...</section>
  </main>

  <!-- Footer -->
  <footer role="contentinfo">
    <p>&copy; 2026 Lucas Duys</p>
  </footer>

  <!-- Decorative canvas (hidden from assistive technology) -->
  <canvas aria-hidden="true" role="presentation"></canvas>

  <!-- Custom cursor (hidden from assistive technology) -->
  <div aria-hidden="true" role="presentation" class="custom-cursor"></div>
</body>
```

### 6.2 ARIA Attributes for Custom Elements

**Command Palette:**
```html
<div role="dialog" aria-modal="true" aria-label="Command palette">
  <div role="combobox" aria-expanded="true" aria-haspopup="listbox"
       aria-controls="command-list">
    <input role="searchbox" aria-autocomplete="list"
           aria-activedescendant="command-item-3"
           placeholder="Type a command..." />
  </div>
  <ul id="command-list" role="listbox" aria-label="Available commands">
    <li id="command-item-1" role="option" aria-selected="false">
      about — Jump to About section
    </li>
    <li id="command-item-2" role="option" aria-selected="false">
      experience — View experience timeline
    </li>
    <!-- cmdk provides these roles automatically, but we verify them -->
  </ul>
</div>
```

**Custom Cursor:**
```html
<!-- Fully hidden — decorative only -->
<div aria-hidden="true" role="presentation" style="pointer-events: none;">
  <!-- cursor visuals -->
</div>
```

**Project Expansion Panels:**
```html
<article aria-label="Pitchr.live project">
  <button aria-expanded="false" aria-controls="pitchr-detail"
          aria-label="Expand Pitchr.live project details">
    <!-- collapsed card content -->
  </button>
  <div id="pitchr-detail" role="region" aria-label="Pitchr.live details"
       hidden>
    <!-- expanded content, hidden until aria-expanded is true -->
  </div>
</article>
```

**Metric Bars:**
```html
<div role="meter" aria-label="Closing rate improvement"
     aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"
     aria-valuetext="Closing rate increased by 40 percent">
  <!-- visual bar -->
</div>
```

**Status Dots:**
```html
<span aria-label="Status: deployed and active" class="status-dot">
  <span aria-hidden="true">●</span> deployed
</span>
```

### 6.3 Keyboard Navigation Flow

**Tab order (natural document flow):**
1. Skip to main content link (first)
2. Top bar navigation links (about, experience, projects, skills, contact)
3. Within each section (top to bottom):
   - Project cards (focusable, Enter to expand)
   - Links (GitHub, LinkedIn, live site links)
   - Buttons (Download CV, Watch Demo, etc.)
4. `>_` command palette trigger button
5. Footer links

**Keyboard shortcuts:**
| Key | Action | Context |
|---|---|---|
| `Tab` | Move focus to next interactive element | Global |
| `Shift+Tab` | Move focus to previous interactive element | Global |
| `Ctrl+K` / `Cmd+K` | Open command palette | Global |
| `/` | Open command palette | Global (only when no input is focused) |
| `Escape` | Close command palette / close expanded project | When modal/panel is open |
| `Enter` | Activate focused command / expand project | When focused on interactive element |
| `Arrow Up/Down` | Navigate command palette list | When command palette is open |
| `Home/End` | Jump to first/last section | Global |

**Focus trapping:**
When the command palette or a project detail panel is open, focus is trapped inside the modal. Tab cycles through the modal's interactive elements. Escape closes and returns focus to the trigger element.

Implementation: Use a `useFocusTrap` hook or the `inert` attribute on the rest of the page when a modal is open.

### 6.4 `prefers-reduced-motion` Handling

When the user has `prefers-reduced-motion: reduce` enabled, the site transforms into a **fully static, instant-render experience**:

| Feature | Normal | Reduced Motion |
|---|---|---|
| Preloader boot sequence | Animated typing over 2.5s | **Skipped entirely.** Site loads directly to hero |
| Particle canvas | Animated, continuous | **Disabled.** Canvas is empty / hidden |
| Smooth scroll (Lenis) | Lerped smooth scroll | **Disabled.** Native instant scroll. `html { scroll-behavior: auto }` |
| Scroll-triggered reveals | Fade + translate + stagger | **All content visible immediately.** No opacity: 0, no transforms. Content is in its final state on load |
| Text split animations | Character-by-character stagger | **Disabled.** Text renders as a normal block |
| Cursor blink | CSS animation | **Static cursor** (no blink) |
| Typing animation (hero) | Character-by-character | **Full text shown immediately.** No typing effect |
| Metric countups | Animated from 0 to value | **Static value shown immediately** |
| Hackathon timer | Counts up from 0 to 24:00 | **Shows final value immediately** |
| Project card expansion | Layout animation with spring | **Instant show/hide** with no transition |
| RAG pipeline activation | Sequential node lighting | **All nodes visible at once** |
| Scan-line hover effects | CSS animation on hover | **Simple color change** |
| Glow pulse animation | Looping shadow pulse | **Static glow** (single-frame shadow) |
| Command palette open/close | Slide + fade | **Instant appear/disappear** |

**Implementation:**
```typescript
// useReducedMotion.ts
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

This hook is checked at the top level of every animation component. When `true`, the component renders its final state immediately without any animation library calls.

Framer Motion also respects `prefers-reduced-motion` automatically when using `useReducedMotion()` from `framer-motion` — but we implement our own for GSAP and custom canvas animations.

### 6.5 Screen Reader Considerations

- **Decorative elements are hidden:** The particle canvas, custom cursor, line numbers, scan-line effects, and glow shadows are all `aria-hidden="true"`.
- **Section command headers have semantic alternatives:** The `$ ls -la projects/` header is decorative. The actual section heading is an `<h2>` with readable text: `<h2 class="sr-only">Projects</h2>` alongside the decorative command.
- **Animated text has final-state alternatives:** The typing animation in the hero shows text character by character visually. For screen readers, the full text is present in the DOM from the start with `aria-label` on the container. The visual animation is decorative only.
- **Progress bars and metrics are announced:** All metric bars have `role="meter"` with `aria-valuetext` providing the human-readable interpretation.
- **Live regions for dynamic content:** The preloader uses `aria-live="polite"` so screen readers announce the boot sequence steps. The command palette search results use `aria-live="assertive"` to announce the number of results as the user types.

### 6.6 Color Contrast Verification

| Text | Background | Contrast Ratio | WCAG Level |
|---|---|---|---|
| Bone `#E8E6E3` on Void `#0A0A0F` | Dark bg | **16.7:1** | AAA |
| Ash `#8B8B9E` on Void `#0A0A0F` | Dark bg | **6.8:1** | AA (large text AAA) |
| Slate `#555566` on Void `#0A0A0F` | Dark bg | **3.6:1** | AA for large text only. This is used exclusively for decorative line numbers and disabled text — never for content |
| Phosphor Green `#4ADE80` on Void `#0A0A0F` | Dark bg | **10.2:1** | AAA |
| Signal Amber `#FBBF24` on Void `#0A0A0F` | Dark bg | **11.5:1** | AAA |
| Link Cyan `#22D3EE` on Void `#0A0A0F` | Dark bg | **10.8:1** | AAA |
| Soft Violet `#A78BFA` on Void `#0A0A0F` | Dark bg | **6.5:1** | AA |
| Bone `#E8E6E3` on Ink `#12121A` | Elevated bg | **15.1:1** | AAA |
| Bone `#E8E6E3` on Graphite `#1A1A26` | Surface bg | **13.1:1** | AAA |

All content text passes WCAG AA. Primary text (Bone) passes AAA everywhere. The only sub-AA contrast is Slate, which is intentionally decorative.

---

## 7. SEO & METADATA

### 7.1 Metadata (via Next.js Metadata API)

**`src/app/layout.tsx`:**
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://lucasduys.dev'),

  title: {
    default: 'Lucas Duys — CS & Engineering @ TU Eindhoven',
    template: '%s | Lucas Duys',
  },

  description:
    'CS & Engineering student at TU Eindhoven building AI agents, RAG pipelines, and developer tools. Currently at cape.io. Winner of HackEurope Paris 2025.',

  keywords: [
    'Lucas Duys', 'portfolio', 'developer', 'AI agents', 'RAG pipeline',
    'Next.js', 'TypeScript', 'TU Eindhoven', 'cape.io', 'HackEurope',
  ],

  authors: [{ name: 'Lucas Duys', url: 'https://lucasduys.dev' }],
  creator: 'Lucas Duys',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lucasduys.dev',
    siteName: 'Lucas Duys',
    title: 'Lucas Duys — CS & Engineering @ TU Eindhoven',
    description:
      'Building AI agents, RAG pipelines, and developer tools. Winner of HackEurope Paris 2025.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lucas Duys — Building things that think.',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Duys — CS & Engineering @ TU Eindhoven',
    description:
      'Building AI agents, RAG pipelines, and developer tools. Winner of HackEurope Paris 2025.',
    images: ['/og-image.png'],
    // creator: '@lucasduys', // Add if Lucas has a Twitter handle
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },

  alternates: {
    canonical: 'https://lucasduys.dev',
  },
};
```

### 7.2 JSON-LD Structured Data

**Added in `src/app/layout.tsx` as a `<script type="application/ld+json">`:**

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Duys',
  url: 'https://lucasduys.dev',
  jobTitle: 'CS & Engineering Student',
  affiliation: {
    '@type': 'EducationalOrganization',
    name: 'Eindhoven University of Technology',
    url: 'https://www.tue.nl',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'cape.io',
    url: 'https://cape.io',
  },
  knowsAbout: [
    'Artificial Intelligence',
    'RAG Pipelines',
    'AI Agents',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
  ],
  sameAs: [
    'https://github.com/lucasduys',      // Replace with actual URL
    'https://linkedin.com/in/lucasduys',  // Replace with actual URL
  ],
  award: 'First Place, HackEurope Paris 2025',
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Eindhoven University of Technology',
  },
};
```

Rendered as:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### 7.3 Sitemap Generation

**`src/app/sitemap.ts`:**
```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://lucasduys.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
```

Single-page site = single sitemap entry. If project detail pages are added later as separate routes, add them here.

### 7.4 robots.txt

**`src/app/robots.ts`:**
```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://lucasduys.dev/sitemap.xml',
  };
}
```

---

## 8. DEPLOYMENT & CI

### 8.1 Vercel Configuration

**No `vercel.json` is needed.** Vercel auto-detects Next.js and applies optimal settings. The `output: 'export'` in `next.config.ts` is the only configuration needed.

However, if custom headers are desired (security hardening), add:

**`vercel.json` (optional):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 8.2 Build & Output

| Setting | Value |
|---|---|
| Build command | `next build` (auto-detected by Vercel) |
| Output directory | `out/` (generated by `output: 'export'`) |
| Node.js version | 20.x (Vercel default) |
| Install command | `npm install` (auto-detected) |

### 8.3 Environment Variables

**None required for the static site.** There is no backend, no API keys, no database. This is one of the strongest selling points — zero secrets management.

If Vercel Analytics is enabled via the Vercel dashboard (rather than the npm package), it requires no environment variable — it's injected automatically.

### 8.4 Domain Setup

1. Purchase `lucasduys.dev` from a registrar (Namecheap, Cloudflare Registrar, Google Domains).
2. In Vercel dashboard: Project Settings -> Domains -> Add `lucasduys.dev`.
3. Vercel provides two DNS records to add at the registrar:
   - `A` record: `76.76.21.21` (Vercel's anycast IP)
   - `CNAME` for `www`: `cname.vercel-dns.com`
4. Vercel automatically provisions an SSL certificate via Let's Encrypt.
5. Enable "Redirect www to non-www" in Vercel domain settings.
6. DNS propagation: 5 minutes to 48 hours (usually < 1 hour).

### 8.5 Preview Deployments Workflow

Vercel provides automatic preview deployments for every git push to a non-production branch. The workflow:

1. Lucas works on a feature branch: `git checkout -b feat/rag-pipeline`
2. Pushes to GitHub: `git push -u origin feat/rag-pipeline`
3. Vercel auto-deploys to a preview URL: `lucas-portfolio-feat-rag-pipeline-abc123.vercel.app`
4. Lucas reviews on his phone and desktop.
5. When satisfied, merges to `main` via GitHub PR.
6. Vercel auto-deploys `main` to `lucasduys.dev`.

**GitHub integration:** Connect the repository to Vercel once (Vercel dashboard -> New Project -> Import Git Repository). After that, everything is automatic.

### 8.6 Post-Deploy Verification Checklist

After each production deploy, verify:
- [ ] `https://lucasduys.dev` loads correctly
- [ ] OG image works (test with https://www.opengraph.xyz/)
- [ ] Lighthouse score: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100
- [ ] Mobile responsive: test on iPhone SE (375px) and iPad (768px)
- [ ] `prefers-reduced-motion` works: enable in OS, verify no animations
- [ ] Command palette opens on Ctrl+K
- [ ] All section links work (smooth scroll to correct section)
- [ ] Console is clean (no errors, no warnings)
- [ ] `robots.txt` and `sitemap.xml` are accessible

---

## 9. IMPLEMENTATION PHASES

### Phase 1: Foundation (Days 1-2)

**What:** Project scaffold, routing, layout shell, fonts, global styles, dark theme.

**Key files created:**
- `src/app/layout.tsx` — root layout with fonts, metadata, providers
- `src/app/page.tsx` — basic page with placeholder sections
- `src/styles/globals.css` — complete Tailwind v4 theme
- `src/lib/utils.ts` — `cn()` helper
- `src/lib/constants.ts` — color tokens, timing, breakpoints
- `src/components/layout/TopBar.tsx` — static version (no scroll tracking yet)
- `src/components/layout/Footer.tsx`
- `src/components/ui/SectionWrapper.tsx` — basic wrapper
- `src/types/index.ts` — initial type definitions
- `next.config.ts`, `tsconfig.json`, `.eslintrc.json`, `.prettierrc`
- `package.json` with all dependencies

**Complexity:** Low. Mostly boilerplate and configuration.
**Dependencies:** None.
**Milestone:** The site runs on `localhost:3000`, shows all section placeholders in the correct order, has the correct fonts and colors, and the dark theme is applied.

---

### Phase 2: Scroll System + Core Animation Infrastructure (Days 3-4)

**What:** Lenis smooth scroll, GSAP ScrollTrigger integration, Framer Motion setup, basic scroll-triggered reveals.

**Key files created:**
- `src/providers/LenisProvider.tsx` — Lenis initialization + GSAP sync
- `src/providers/MotionProvider.tsx` — LazyMotion wrapper
- `src/lib/gsap.ts` — GSAP + ScrollTrigger registration
- `src/hooks/useLenis.ts`
- `src/hooks/useReducedMotion.ts`
- `src/hooks/useDeviceTier.ts`
- `src/hooks/useMediaQuery.ts`
- `src/hooks/useSectionInView.ts`

**Updated files:**
- `src/app/layout.tsx` — wrap with LenisProvider + MotionProvider
- `src/components/layout/TopBar.tsx` — add scroll progress bar + active section detection
- `src/components/ui/SectionWrapper.tsx` — add GSAP ScrollTrigger for section entry animations

**Complexity:** Medium. The Lenis + GSAP integration is the trickiest part — getting them to sync requires careful `requestAnimationFrame` coordination.
**Dependencies:** Phase 1 (layout must exist).
**Milestone:** Smooth scrolling works. Sections fade in on scroll. The progress bar in TopBar tracks scroll position. The active section is highlighted in the nav.

---

### Phase 3: Particle System (Days 5-6)

**What:** Full-screen background canvas with particles, neural network connections, simplex noise movement.

**Key files created:**
- `src/components/canvas/particle-system.ts` — pure particle logic (no React)
- `src/components/canvas/ParticleCanvas.tsx` — React wrapper, handles resize/visibility
- `src/types/particle.ts` — Particle, ParticleConfig interfaces

**Complexity:** Medium-high. The particle system is performance-critical and requires the adaptive quality system (frame budget monitoring, automatic quality reduction).
**Dependencies:** Phase 2 (useDeviceTier and useReducedMotion must exist).
**Milestone:** Particles drift across the background with organic noise-driven movement. Connections draw between nearby particles. The system auto-degrades on weak devices. `prefers-reduced-motion` disables it entirely.

---

### Phase 4: Content Sections (Days 7-10)

**What:** All eight content sections with real data, styling, and scroll-triggered reveals.

**Key files created:**
- `src/data/projects.ts`, `experience.ts`, `skills.ts`, `about.ts`, `hackathons.ts` — all content data
- `src/components/sections/Hero.tsx` — with boot sequence + cycling prompt
- `src/components/sections/About.tsx` — with Shiki syntax highlighting
- `src/components/sections/Status.tsx`
- `src/components/sections/Experience.tsx` — git log timeline
- `src/components/sections/Projects.tsx` — file listing + cards
- `src/components/sections/Skills.tsx` — skill table with bar animations
- `src/components/sections/Hackathons.tsx` — timer + progress bar
- `src/components/sections/Contact.tsx` — SSH session styling
- `src/hooks/useTypewriter.ts` — typewriter animation hook
- `src/components/interactive/TypedCommand.tsx` — section headers
- `src/components/interactive/CountUpNumber.tsx` — metric countups
- `src/components/interactive/CipherText.tsx` — scramble text effect
- `src/components/ui/TerminalBlock.tsx`, `GlowButton.tsx`, `SkillTag.tsx`, `StatusDot.tsx`
- `src/lib/shiki.ts` — Shiki highlighter with custom theme

**Complexity:** High (most files, most content, most varied animation work).
**Dependencies:** Phase 2 (scroll system must work). Phase 3 can run in parallel.
**Milestone:** All eight sections render with real content. Scroll reveals work. Typing animations play. Metric bars animate. The site "feels" complete in terms of content, even if some interactive elements are missing.

---

### Phase 5: Project Expansion + RAG Pipeline (Days 11-13)

**What:** Project cards expand to detailed case study panels. The Stacklink RAG pipeline is an interactive SVG visualization.

**Key files created:**
- `src/components/projects/ProjectCard.tsx` — expandable card with Framer Motion layout
- `src/components/projects/RAGPipeline.tsx` — SVG pipeline with animated data particles
- `src/components/projects/ProcessLog.tsx` — staggered log animation (Pitchr)
- `src/components/projects/MetricBar.tsx` — animated metric bars (Amplifirm)
- `src/types/project.ts` — complete project type definitions

**Complexity:** High. The RAG pipeline SVG is the most complex single component. It requires:
1. SVG layout for the branching node graph
2. Framer Motion animations for individual node activation
3. GSAP ScrollTrigger for scroll-linked progressive activation
4. Animated "data particles" flowing along SVG paths (small circles following `<path>` elements using `getPointAtLength()`)
5. Hover tooltips on nodes

**Dependencies:** Phase 4 (Projects section must exist).
**Milestone:** Clicking a project card expands it smoothly. The RAG pipeline activates on scroll with particles flowing. The Pitchr process log staggers in. Amplifirm metrics animate.

---

### Phase 6: Interactive Elements (Days 14-16)

**What:** Command palette, custom cursor, skills visualization, easter eggs, keyboard navigation.

**Key files created:**
- `src/components/interactive/CommandPalette.tsx` — cmdk + custom styling + easter eggs
- `src/components/interactive/CustomCursor.tsx` — multi-state cursor
- `src/hooks/useCommandPalette.ts` — keyboard shortcut management
- `src/hooks/useScrollDirection.ts` — for TopBar auto-hide on mobile
- `src/lib/commands.ts` — command definitions with actions

**Updated files:**
- `src/components/sections/Skills.tsx` — add interactive query filter buttons
- `src/components/layout/TopBar.tsx` — add keyboard shortcut hint display

**Complexity:** Medium. cmdk handles the hard parts (fuzzy search, keyboard nav). The custom cursor is straightforward Framer Motion spring animation. Easter eggs are fun to implement.
**Dependencies:** Phase 4 (all sections must exist for command palette navigation targets).
**Milestone:** Ctrl+K opens the command palette. Typing "projects" fuzzy-matches and scrolls to the Projects section. The custom cursor changes state on different elements. `sudo hire lucas` triggers the easter egg. Skills can be filtered by category.

---

### Phase 7: Mobile, Polish, Performance (Days 17-20)

**What:** Full mobile responsive implementation, performance optimization, accessibility audit, edge case fixes.

**Key files created:**
- `src/components/layout/MobileNav.tsx` — full-screen mobile nav overlay
- `src/components/layout/LineNumbers.tsx` — desktop-only decorative line numbers

**Updated files (every component gets a mobile pass):**
- All section components: responsive breakpoint adjustments
- `ParticleCanvas.tsx`: mobile particle reduction / disable logic
- `CommandPalette.tsx`: bottom sheet variant for mobile
- `RAGPipeline.tsx`: vertical step list variant for mobile
- `Skills.tsx`: card grid variant for mobile
- `ProjectCard.tsx`: full-screen panel variant for mobile
- `TopBar.tsx`: hamburger menu on mobile, auto-hide on scroll down

**Performance work:**
- Run Lighthouse, identify bottlenecks
- Lazy-load: ParticleCanvas, CommandPalette, RAGPipeline as `next/dynamic` with `ssr: false`
- Verify font subsetting and preloading
- Test `prefers-reduced-motion` end-to-end
- Verify tab visibility optimization (pause canvas when hidden)
- Test on real devices (iPhone SE, Pixel 6a, iPad)

**Accessibility audit:**
- Run axe DevTools, fix all critical/serious issues
- Keyboard navigate the entire site end-to-end
- Test with VoiceOver (macOS) and NVDA (Windows)
- Verify all ARIA attributes
- Verify focus management for command palette and project panels
- Check color contrast with a contrast checker tool

**Complexity:** Medium-high. Mobile is a lot of conditional rendering and responsive adjustments. Performance optimization is iterative.
**Dependencies:** All prior phases.
**Milestone:** The site works on iPhone SE (375px). Lighthouse Performance 90+, Accessibility 95+. No console errors. Reduced motion mode works.

---

### Phase 8: Deploy, SEO, Final QA (Days 21-22)

**What:** Production deployment, SEO metadata verification, OG image creation, domain setup, final QA.

**Key files created/updated:**
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/metadata.ts` — finalize all metadata
- `public/og-image.png` — create the OG image (screenshot of hero boot sequence, styled)
- `public/resume.pdf` — add Lucas's CV
- `vercel.json` — security headers (optional)

**Steps:**
1. Create the OG image: screenshot the hero section at 1200x630, add subtle branded border
2. Deploy to Vercel: connect GitHub repo, trigger first production build
3. Set up custom domain (`lucasduys.dev`)
4. Verify OG tags with https://www.opengraph.xyz/
5. Submit sitemap to Google Search Console
6. Run the post-deploy verification checklist (section 8.6)
7. Test social sharing on Twitter, LinkedIn, Slack (all should show rich preview)

**Complexity:** Low. Mostly verification and configuration.
**Dependencies:** Phase 7 (site must be fully functional and polished).
**Milestone:** `lucasduys.dev` is live, looks perfect, scores 90+ on Lighthouse, shows rich previews on social media.

---

### Phase Summary

| Phase | Days | Key Deliverable | Est. Effort |
|---|---|---|---|
| 1. Foundation | 1-2 | Project running with correct theme | Low |
| 2. Scroll System | 3-4 | Smooth scroll + scroll-triggered reveals | Medium |
| 3. Particle System | 5-6 | Background particle canvas with adaptive quality | Medium-high |
| 4. Content Sections | 7-10 | All 8 sections with real data and animations | High |
| 5. Projects + RAG | 11-13 | Expandable cards + interactive RAG pipeline SVG | High |
| 6. Interactive | 14-16 | Command palette + custom cursor + easter eggs | Medium |
| 7. Mobile + Polish | 17-20 | Full responsive, accessible, performant | Medium-high |
| 8. Deploy + SEO | 21-22 | Live on lucasduys.dev | Low |

**Total estimated build time: 22 working days** (approximately 4.5 weeks at a comfortable pace, or 3 weeks pushing hard).

Phases 3 and 4 can run in parallel (particle system is independent of content sections). This could compress the timeline by 2 days.

---

*This specification is implementation-ready. Every package is named and versioned. Every file is mapped with its purpose and dependencies. Every mobile adaptation is specified. Every accessibility requirement is documented. Lucas can open his editor and start building Phase 1 immediately.*
