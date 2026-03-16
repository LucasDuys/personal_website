# Lucas Duys — Personal Portfolio Website
# MASTER DESIGN & IMPLEMENTATION SPECIFICATION

**Concept:** "The Neural Terminal" — CLI design language meets living neural network particle system
**Deploy Target:** Vercel (static, no backend)
**Date:** 2026-03-16

---

## TABLE OF CONTENTS

1. [Design Identity](#1-design-identity)
2. [Preloader](#2-preloader)
3. [Hero Section](#3-hero-section)
4. [Navigation System](#4-navigation-system)
5. [About Section](#5-about-section)
6. [Projects Showcase](#6-projects-showcase)
7. [RAG Pipeline Animation](#7-rag-pipeline-animation)
8. [Skills Embedding Space](#8-skills-embedding-space)
9. [Experience Section](#9-experience-section)
10. [Contact Section](#10-contact-section)
11. [Global Particle System](#11-global-particle-system)
12. [Scroll Animation System](#12-scroll-animation-system)
13. [Custom Cursor](#13-custom-cursor)
14. [Tech Stack & Dependencies](#14-tech-stack--dependencies)
15. [File Structure](#15-file-structure)
16. [Mobile Strategy](#16-mobile-strategy)
17. [Performance Budget](#17-performance-budget)
18. [Accessibility](#18-accessibility)
19. [SEO & Metadata](#19-seo--metadata)
20. [Deployment](#20-deployment)
21. [Implementation Phases](#21-implementation-phases)

---

## 1. DESIGN IDENTITY

### Concept
Two layers working in harmony:
- **Interface Layer (CLI):** Every section is introduced as a terminal command. Navigation uses CLI metaphors. Typography splits between "machine voice" (JetBrains Mono) and "human voice" (Space Grotesk).
- **Atmosphere Layer (Neural Network):** A living particle system with synaptic connections covers the full page background. Particles respond to cursor, scroll, and section context. Data flows between sections via "synapse bridges."

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#06060A` | Page background (void black) |
| Surface 1 | `#0E0E14` | Cards, terminal windows |
| Surface 2 | `#16161F` | Elevated elements, code blocks |
| Border | `#1E1E2E` | Subtle structure |
| Text Primary | `#E8E6E3` | Headlines, body (bone) |
| Text Secondary | `#8B8B9E` | Captions, metadata (ash) |
| Text Muted | `#555566` | Disabled, decorative (slate) |
| Accent Green | `#4ADE80` | CLI prompts, cursor, primary interactive |
| Accent Cyan | `#22D3EE` | Links, data streams, secondary |
| Accent Purple | `#8B5CF6` | AI-related elements |
| Accent Amber | `#FBBF24` | Highlights, warnings, achievements |
| Synapse Blue | `#2E7DFF` | Particle connections |
| Particle Dim | `#1A3A5C` | Background particles |
| Particle Mid | `#3B6EA8` | Standard particles |
| Particle Active | `#5FA8FF` | Near-cursor particles |
| Particle Hot | `#A5D8FF` | Direct interaction particles |

All accents have glow: `text-shadow: 0 0 20px rgba(color, 0.3), 0 0 40px rgba(color, 0.1)`

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Machine voice | JetBrains Mono | 400, 500, 600 | 11-16px |
| Human voice (display) | Space Grotesk | 500, 700 | `clamp(40px, 5vw, 120px)` |
| Human voice (body) | Space Grotesk | 400, 500 | 16-18px |

### Personal Details
- **Name:** Lucas Duys
- **Email:** lucas.duys@gmail.com
- **LinkedIn:** linkedin.com/in/lucas-duys
- **Location:** Veldhoven/Eindhoven, NL
- **No photo** — design uses particle-based visuals instead
- **No domain yet** — deploy to Vercel default URL

---

## 2. PRELOADER (2.5-3s)

CLI boot sequence + particle genesis on a full-viewport overlay.

### Terminal Window
- Centered, `max-width: 620px`, with minimal window chrome (3 dots + `lucas@portfolio:~`)
- Background: `#0E0E14`, border: `1px solid #1E1E2E`, `border-radius: 6px`

### Boot Sequence (line by line)

| Time | Line | Color |
|------|------|-------|
| T+0ms | `$ systemctl start lucas-portfolio.service` | Green `$`, white command, typed at 35ms/char |
| T+1670ms | `[  OK  ] Loading neural-interface v2.4.1...` | Green OK, gray text, instant |
| T+1850ms | `[  OK  ] Mounting /projects/2024...` | Same, instant |
| T+2030ms | `[  OK  ] Injecting skills: react, next.js, typescript, AI/RAG` | Skills in cyan |
| T+2210ms | `[  OK  ] Syncing neural-network particles...` | Instant |
| T+2860ms | `✓ Portfolio loaded. Welcome.` | Green checkmark, spinner resolves to ✓ |

### Particle Genesis
Particles spawn as each `[OK]` line appears (15→20→30→25→60-80), linking the boot to the neural network coming alive.

### Progress Bar
Below terminal: 2px gradient bar (`#4ADE80` → `#22D3EE`), fills from 0-100% over the full 2860ms.

### Exit Transition (800ms)
Terminal dissolves (opacity + blur + scale), overlay fades, particles persist into hero (same canvas).

### Repeat Visits
`sessionStorage` flag — show shortened 600ms version: `"> Welcome back."`

---

## 3. HERO SECTION (100vh)

### Layout
Full viewport with particle field background. Content centered vertically.

### Corner HUD Elements
- **Top-left:** Location `Eindhoven, NL` + coordinates `51.4416°N, 5.4697°E` with pulsing green status dot
- **Top-right:** Live clock `21:34:07 CET` + date, seconds animate with digit roll
- **Bottom-left:** Section index `// 001 — hero` (updates on scroll)
- **Bottom-right:** Scroll indicator (animated line + chevron)

### Main Content
1. **Greeting:** `> Hello, I'm` (JetBrains Mono 14px, green `>`)
2. **Name:** `Lucas Duys` (Space Grotesk 700, `clamp(64px, 8vw, 120px)`, subtle cyan gradient)
   - **Particle formation effect:** 80-100 particles converge to letter shapes over 800ms, hold, then scatter — leaving crisp text behind
3. **Role cycling:** `$ title: [cycling role]` — types/deletes roles every 2.5s:
   - "CS & Engineering @ TU Eindhoven"
   - "AI Intern @ cape.io"
   - "Building Pitchr.live"
   - "Full-Stack Developer"
4. **CTA Buttons:**
   - Primary: `$ cd ./projects ↵` (green bg, dark text)
   - Secondary: `$ contact --open ↵` (ghost/border style)

### Scroll-Away
Content elements parallax out at different speeds with opacity fade. Particle density reduces to 60%.

---

## 4. NAVIGATION SYSTEM

### Top Nav Bar (appears after 80vh scroll)
- Fixed, `height: 56px`, glassmorphism (`rgba(6,6,10,0.8)`, `blur(12px)`)
- Left: `lucas.duys` (green dot pulses on hover)
- Center: `./about` `./work` `./skills` `./experience` `./contact` (JetBrains Mono 12px)
- Right: `⌘K` trigger + `résumé ↗` download
- Auto-hide on scroll down, show on scroll up

### Command Palette (⌘K / Ctrl+K) — THE KILLER FEATURE
- Centered modal, `max-width: 640px`, dark surface + border
- Green prompt `>` with fuzzy search input
- **Command groups:**
  - Navigation: Go to About, Work, Skills, Experience, Contact, Top
  - Actions: Download Resume, Copy Link, Send Email, View LinkedIn
  - Projects: Quick-jump to Pitchr, Stacklink, cape.io
  - Easter Eggs: Party Mode (rainbow particles 5s), Matrix Rain (5s), Brew Coffee (ASCII art toast), Vibe Mode (ambient sound toggle)
- Keyboard: arrows navigate, Enter selects, Escape closes
- Fuzzy match highlights in green

### Side Section Indicator (desktop)
- Fixed right edge, vertical line with dots per section
- Active dot: green + glow, progress fill tracks scroll
- Hover: section label appears

### Mobile Nav
- Hamburger → full-screen overlay with numbered section links (Space Grotesk 32px)
- Bottom bar version of the command palette trigger

---

## 5. ABOUT SECTION

### CLI Introduction
`visitor@lucas.dev:~$ cat ~/about.md` (typed at 45ms/char)

### Content: YAML Frontmatter + Markdown Body

**Frontmatter** (styled as actual YAML):
```yaml
---
name: Lucas Duys
location: Veldhoven, NL → Eindhoven, NL
university: TU Eindhoven — CS & Engineering
graduation: May 2027
current_role: AI Intern @ cape.io
status: building things that matter
availability: open to opportunities
---
```
Keys in gray, values in white, special values get accent colors.

**No Photo** — instead a cheeky comment:
`<!-- profile_photo: redacted — you'll have to meet me in person -->`

**Body text** (Space Grotesk 17px, max-width 680px):
A 175-word bio emphasizing: hackathon win, RAG systems, business metrics, Dutch directness. Key phrases get inline code-style accent highlights. Final line in green as soft CTA.

### Decorative
Line numbers in left gutter, faint vertical separator, sticky `about.md ×` tab indicator.

---

## 6. PROJECTS SHOWCASE

### Section Entry
`visitor@lucas:~$ ls -la ~/projects/` → table output with colored directory names per project.

### Layout
2×2 grid on desktop, single column on mobile. Each card: terminal chrome header + visual area + content.

### Project 1: Pitchr.live (Accent: `#ff5941`)
- **CLI:** `cat pitchr.live/README.md`
- **Visual:** Dashboard screenshot/video with WINNER badge (gradient coral, pulsing glow) and scroll-driven hackathon timer counting 30:00:00 → 00:00:00
- **Tags:** Next.js, React 19, TypeScript, Tailwind 4, Supabase, Claude API, AssemblyAI, ElevenLabs
- Left border gradient strip on hover

### Project 2: Stacklink.nl (Accent: `#22D3EE`)
- **CLI:** `./stacklink.nl/pipeline --visualize`
- **Visual:** Mini RAG pipeline animation (6 nodes, particle traveling through, auto-looping)
- **Tags:** Next.js 14, React, TypeScript, Tailwind, Supabase, pgvector, OpenRouter, Google Drive API
- Animated conic-gradient border ("scanning" effect)

### Project 3: cape.io (Accent: `#8B5CF6`)
- **CLI:** `cd cape.io && git log --oneline -1`
- **Visual:** Gradient mesh + animated terminal with cycling status messages
- **IN PROGRESS** badge with pulsing purple dot
- Dashed border (marching on hover)

### Project 4: LLM Workshops (Accent: `#FBBF24`)
- **CLI:** `ls llm-workshops/modules/`
- **Visual:** 3 module tiles (Market Research, Project Scoping, Sentiment Analysis)
- Warm scanline overlay effect

### Hover States
All cards: lift (`translateY(-3px)`), border glow, CLI command brightens. Custom cursor shows "VIEW".

---

## 7. RAG PIPELINE ANIMATION (Crown Jewel)

Lives in expanded Stacklink case study. The most important visual on the site.

### 6 Stages (horizontal flow, `max-width: 1000px`, `height: 400px`)

| Stage | Color | Icon | Sub-label | Unique Animation |
|-------|-------|------|-----------|------------------|
| INGEST | `#4ADE80` | Document+arrow | Google Drive OAuth | Floating document icons absorbed into node |
| CHUNK | `#FBBF24` | Split document | Semantic + Overlap | Document rectangle splits into 3 segments |
| EMBED | `#8B5CF6` | Vector arrows | OpenRouter Batched | Dots snap from random to grid pattern (chaos→order) |
| RETRIEVE | `#2E7DFF` | Magnifying glass | Vector + BM25 | Dual-path fork (vector top, BM25 bottom), radar ping |
| FUSE | `#22D3EE` | Converging arrows | Reciprocal Rank Fusion | Ranked bars appear, top 3 brighten, bottom 2 fade |
| GENERATE | `#E8E6E3` | Chat bubble | LLM + Sources | Typewriter text output + answer card slides out |

### Data Particles
- 10px glowing circles with 8-dot fading trail
- Color interpolates between stages
- Travel speed: 120px/s with ease-in-out
- Splitting at Chunk, forking at Retrieve, merging at Fuse
- New particle dispatched every 3s → 2-3 particles in flight simultaneously

### Full Cycle: ~11 seconds
Stages activate sequentially with 200ms stagger. Hovering pauses flow, shows technical tooltip.

### Tooltips
Each stage has a detailed tooltip with implementation specifics (RPC queries, batch sizes, RRF formula with k=60).

### Mobile
Switches to 2-row layout (3 per row) with vertical connectors.

---

## 8. SKILLS EMBEDDING SPACE

### CLI Introduction
`visitor@lucas.dev:~$ query skills --visualize --method embedding_space`

### Scatter Plot (1000px × 600px)
23 skills plotted as dots, clustered by semantic similarity:
- **Frontend** (cyan): React, Next.js, TypeScript, Tailwind, HTML/CSS, Responsive Design, Framer Motion
- **Backend** (purple): Node.js, Supabase, PostgreSQL, REST APIs, OAuth, Git, Maven, Gradle, Google Drive API, Slack API
- **AI/ML** (amber): LLM/RAG Systems, Embeddings & pgvector, Hybrid Retrieval, Chunking Strategies, Prompt Engineering
- **Soft Skills** (green): Agile/Scrum, Operations Leadership, Workshop Facilitation, Vitest/Testing

Connection lines between related skills (20 pre-defined connections), visible on hover.

### Search Interaction
Terminal input: `query skills --similarity "[user query]"`
Pre-computed relevance scores for ~15 queries. Dots scale/dim by relevance. Results line shows closest match.

### Auto-Demo
If no interaction within 5s, cycles through "AI agent development" → "full-stack web" → "data pipeline" → "leadership" with typing animation.

### Entry Animation: "The Big Bang"
All dots start at center, explode outward to cluster positions with spring physics (700ms, overshoot easing).

---

## 9. EXPERIENCE SECTION

### CLI Introduction
`visitor@lucas.dev:~$ git log --oneline --experience`

### Git Log Style Entries

**cape.io** (Mar 2026 — Present): `hash a3f7c2d`, IN PROGRESS bar with pulsing edge
**HackEurope Paris** (Feb 2026): `hash b8e1f4a`, "Winner" with gold shimmer on reveal
**Amplifirm** (May 2024 — Nov 2025): `hash c4a2d9e`, metrics dashboard box:
- CLOSING RATE +40% with animated counter + bar
- OUTREACH +60% with animated counter + bar
- REVENUE +35% with animated counter + bar
- Counters: 1800ms duration, `ease-out-expo`, 200ms stagger
**LLM Workshops** (2025): `hash d7f3b1c`
**TU Eindhoven** (Sep 2023 — May 2027): `hash e2c8a5f`, progress bar showing year 3/4

---

## 10. CONTACT SECTION

### CLI Introduction
`visitor@lucas.dev:~$ curl -X POST https://lucas.dev/contact --data '{"intent": "connect"}'`

### HTTP Response
`HTTP/1.1 200 OK` (green flash), JSON body with syntax highlighting:
- `"message": "Let's build something."` (white, bold — the CTA)
- `X-Powered-By: coffee-and-curiosity` (amber)

### Contact Links
```
→ email     lucas.duys@gmail.com    [copy]
→ linkedin  /in/lucas-duys          [open]
```
Each row: hover changes value color to platform color.

### Email Cipher Effect
On hover: characters cycle through random chars, resolving left-to-right at 35ms/char stagger. Click copies to clipboard with `→ Email copied to clipboard. Ping sent.` confirmation.

### Closing Prompt
Empty terminal prompt `visitor@lucas.dev:~$ █` with blinking cursor. Below: "The terminal is yours. What will you build?"

### Footer
`© 2026 Lucas Duys | Built with Next.js + obsession | v1.0.0`

### Easter Egg: Konami Code
↑↑↓↓←→←→BA opens a functional mini-terminal with commands: `help`, `whoami`, `neofetch` (ASCII art with Lucas's "specs"), `sudo rm -rf /` (permission denied joke), `exit`.

---

## 11. GLOBAL PARTICLE SYSTEM

### Architecture: Custom WebGL 2 (NOT Three.js)
Single full-viewport `<canvas>`, `position: fixed`, `z-index: 0`. Two draw calls per frame (connections + particles).

**Recommendation: 2D (not 3D).** The CLI metaphor is inherently flat. Simulated depth via opacity/size variation is convincing. 3D adds 230KB+ bundle and GPU cost for minimal payoff. Can add isolated 3D elements later if desired.

### Particle Count
- Desktop: 800 (220 hero, 80/section, 60/bridge)
- Tablet: 500
- Mobile: 300 (connections disabled)
- Only particles within viewport ± 200px are actively computed

### Movement: Perlin Noise Flow Field + Spring Return
- `NOISE_SCALE: 0.0008`, `NOISE_SPEED: 0.00012`, `BASE_SPEED: 0.15`
- Weak spring to home position (`SPRING_K: 0.0003`)
- `DAMPING: 0.97`, opacity shimmer via sine wave

### Connections
- Spatial hash grid for O(n) neighbor lookup
- Max distance: 150px, max 4 per particle
- Opacity: `(1 - dist/maxDist)^1.5 * 0.15`
- Color: Synapse Blue `#2E7DFF`

### Mouse Interaction
- Attraction within 200px radius (force `0.08`)
- Connection intensification near cursor (2.5x opacity, extended range)
- Click ripple: expanding ring + particle impulse
- CSS glow aura follows cursor with 0.12 lerp

### Adaptive Quality
5 levels (Ultra → Minimal), auto-downgrade if avgFPS < 50 for 2s. Respects `prefers-reduced-motion`.

---

## 12. SCROLL ANIMATION SYSTEM

### Lenis Config
```js
duration: 1.2, easing: expo-out, wheelMultiplier: 0.8, touchMultiplier: 1.5
```
Integrated with GSAP ticker (single RAF loop).

### Section Entry Animations (GSAP ScrollTrigger)
- **Headings:** Line-split, `yPercent: 110`, `rotationZ: 3`, stagger 0.08s, `expo.out`
- **Paragraphs:** Line-split, `yPercent: 100`, stagger 0.04s
- **Cards:** `y: 60, scale: 0.97`, stagger 0.12s
- **Tags:** `scale: 0`, `back.out(2.5)`, stagger 0.03s (pop effect)
- **Images:** `clipPath: inset(100% 0 0 0)` reveal + counter-scale from 1.3

### Parallax
Decorative elements at 0.85x, project images at 0.92x, section numbers at 0.80x.

### Synapse Bridges (150px between sections)
- Particles flow downward with directional noise bias
- 2x speed, brighter colors, fading trails
- 5 bezier path connections with traveling dots
- CLI annotations fade in: `> loading profile...`, `> cd ~/projects`, etc.

---

## 13. CUSTOM CURSOR

DOM-based (not canvas). Three layers:
- **Dot:** 8px, white, follows at 0.25 lerp
- **Ring:** 36px, 1px border, follows at 0.12 lerp (trailing effect)
- **Label:** Hidden by default, shows on interactive hover

### States
- **Default:** Dot + ring, `mix-blend-mode: difference`
- **Interactive hover:** Ring expands to 64px, label shows ("VIEW", "OPEN", "EXECUTE", "PING", "COPY")
- **Text hover:** Ring morphs to vertical bar (terminal caret), blinks green
- **Click:** Ring scales 0.75 → elastic bounce back

Disabled on touch devices.

---

## 14. TECH STACK & DEPENDENCIES

### Core

| Layer | Package | Version | Purpose |
|-------|---------|---------|---------|
| Framework | `next` | 14.x | App Router, SSG, image optimization |
| Language | `typescript` | 5.x | Strict mode |
| Styling | `tailwindcss` | 4.x | Utility-first CSS |
| Smooth Scroll | `lenis` | 1.x | Dennis Snellenberg-style scroll |
| Scroll Animations | `gsap` | 3.12+ | ScrollTrigger, timelines, tweens |
| UI Animations | `framer-motion` | 11.x | FLIP expansions, layout animations, AnimatePresence |
| Text Splitting | `split-type` | 0.3.x | Char/word/line splitting for reveals |
| Command Palette | `cmdk` | 1.x | Fuzzy search command menu (by Paco Coursey) |
| Noise | `simplex-noise` | 4.x | Perlin noise for particle flow field |
| Fonts | `next/font` | built-in | Self-hosted JetBrains Mono + Space Grotesk |
| Deployment | Vercel | - | Zero-config, CDN, analytics |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `eslint` + `eslint-config-next` | Linting |
| `prettier` + `prettier-plugin-tailwindcss` | Formatting |
| `@types/react`, `@types/node` | TypeScript types |

### GSAP vs Framer Motion Division of Labor
- **GSAP:** All scroll-triggered animations, parallax, scrubbed effects, text split reveals, counter animations
- **Framer Motion:** Component mount/unmount (AnimatePresence), layout animations (FLIP for project expansion), spring physics on interactive elements, `layoutId` for shared element transitions

No overlap. GSAP handles scroll. Framer Motion handles React component lifecycle.

### package.json (production deps)
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "gsap": "^3.12.0",
    "lenis": "^1.1.0",
    "framer-motion": "^11.0.0",
    "split-type": "^0.3.4",
    "cmdk": "^1.0.0",
    "simplex-noise": "^4.0.0"
  }
}
```

**6 animation/interaction dependencies. Everything else is custom code.**

---

## 15. FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, Lenis provider, metadata
│   ├── page.tsx                # Main page, section composition
│   └── globals.css             # CSS variables, base styles, keyframes
├── components/
│   ├── preloader/
│   │   └── Preloader.tsx       # Boot sequence + particle genesis
│   ├── hero/
│   │   ├── Hero.tsx            # Hero section container
│   │   ├── HeroContent.tsx     # Name, subtitle, CTAs
│   │   ├── CornerHUD.tsx       # Location, clock, section index, scroll indicator
│   │   └── RoleCycler.tsx      # Typewriter role cycling
│   ├── navigation/
│   │   ├── NavBar.tsx          # Sticky top nav
│   │   ├── CommandPalette.tsx  # ⌘K modal
│   │   ├── SideIndicator.tsx   # Section dots (desktop)
│   │   └── MobileMenu.tsx      # Full-screen mobile nav
│   ├── about/
│   │   ├── About.tsx           # Section container
│   │   ├── Frontmatter.tsx     # YAML metadata block
│   │   └── AboutBody.tsx       # Bio text with inline highlights
│   ├── projects/
│   │   ├── ProjectsSection.tsx # Grid container + CLI intro
│   │   ├── ProjectCard.tsx     # Shared card component
│   │   ├── CaseStudyPanel.tsx  # Expanded project overlay
│   │   └── RAGPipeline.tsx     # The crown jewel animation
│   ├── skills/
│   │   ├── Skills.tsx          # Section container
│   │   ├── EmbeddingSpace.tsx  # Scatter plot visualization
│   │   └── SkillSearch.tsx     # Terminal search input
│   ├── experience/
│   │   ├── Experience.tsx      # Section container
│   │   ├── ExperienceEntry.tsx # Git-log styled entry
│   │   └── MetricCounter.tsx   # Animated counting numbers
│   ├── contact/
│   │   ├── Contact.tsx         # Section container
│   │   ├── ContactLinks.tsx    # Email, LinkedIn links
│   │   ├── CipherText.tsx      # Scramble effect component
│   │   └── SecretTerminal.tsx  # Konami code easter egg
│   ├── particles/
│   │   ├── ParticleCanvas.tsx  # WebGL canvas + render loop
│   │   ├── particleSystem.ts   # Core particle physics + connections
│   │   ├── shaders.ts          # GLSL vertex/fragment shaders
│   │   └── spatialHash.ts      # Grid-based spatial partitioning
│   ├── cursor/
│   │   └── CustomCursor.tsx    # Dot + ring + label cursor
│   └── shared/
│       ├── CLIPrompt.tsx       # Reusable CLI command component
│       ├── SectionWrapper.tsx  # Section container with scroll triggers
│       └── SynapseBridge.tsx   # Transition zone between sections
├── hooks/
│   ├── useLenis.ts             # Lenis scroll instance
│   ├── useScrollTrigger.ts     # GSAP ScrollTrigger wrapper
│   ├── useTextReveal.ts        # SplitType + GSAP animation
│   ├── useMagnetic.ts          # Magnetic hover effect
│   ├── useCountUp.ts           # Number counter animation
│   ├── useCipherText.ts        # Scramble/decrypt text effect
│   ├── useTypewriter.ts        # Character-by-character typing
│   └── useMediaQuery.ts        # Responsive breakpoint detection
├── lib/
│   ├── animations.ts           # GSAP animation presets + easing tokens
│   ├── constants.ts            # Colors, timing, breakpoints
│   ├── noise.ts                # Simplex noise wrapper
│   └── commands.ts             # Command palette command definitions
├── data/
│   ├── projects.ts             # Project content + metadata
│   ├── skills.ts               # Skill definitions + cluster assignments + positions
│   ├── experience.ts           # Experience entries
│   └── skillQueries.ts         # Pre-computed search relevance scores
├── types/
│   └── index.ts                # Shared TypeScript interfaces
├── styles/
│   └── fonts.ts                # next/font configurations
└── public/
    ├── fonts/
    │   ├── JetBrainsMono-*.woff2
    │   └── SpaceGrotesk-*.woff2
    ├── images/
    │   ├── projects/           # Project screenshots
    │   └── og-image.png        # Open Graph preview image
    ├── videos/
    │   └── pitchr-demo.mp4     # Pitchr demo video
    └── resume.pdf              # Downloadable CV
```

---

## 16. MOBILE STRATEGY

### Breakpoints
- Desktop: ≥1024px (full experience)
- Tablet: 768–1023px (reduced particles, simplified layout)
- Mobile: <768px (minimal particles, single column, touch interactions)

### Feature Degradation Matrix

| Feature | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Particles | 800 | 500 | 300 |
| Connections | ON | ON (max 3) | OFF |
| Custom cursor | Full | Full | OFF |
| Cursor glow | ON | ON | OFF |
| Click ripples | ON | ON | Touch ripple |
| Text split | char/word/line | word/line | line only |
| Parallax | Full | 50% values | OFF |
| Bridge trails | ON | OFF | OFF |
| Scroll duration | 1.2s | 1.2s | 1.0s |
| Command palette | Centered modal | Centered | Bottom sheet |
| Project grid | 2×2 | 1 column | 1 column |
| RAG pipeline | Horizontal 6-stage | Horizontal | 2-row (3+3) |
| Project expansion | FLIP from grid | FLIP | Bottom sheet slide-up |
| Skills scatter | Full + search | Full | Compressed, labels on tap |
| Nav | Top bar + side dots | Top bar | Hamburger + bottom dots |

---

## 17. PERFORMANCE BUDGET

### Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Blocking Time | < 200ms |
| Cumulative Layout Shift | < 0.1 |
| Lighthouse Performance | 90+ |
| Desktop FPS | 60fps (P95 < 18ms) |
| Mobile FPS | 30fps minimum |

### Bundle Size (gzipped)

| Chunk | Max Size |
|-------|----------|
| Critical (initial) | 45KB |
| Particle system | 8KB |
| GSAP + ScrollTrigger | 12KB |
| Section content (each) | 10-20KB |
| **Total JS** | **< 120KB** |

### Canvas Budget: 4ms per frame
- Noise + velocity: ~1.0ms
- Grid hash: ~0.3ms
- Connection search: ~0.8ms
- Buffer upload: ~0.5ms
- GPU draws: ~0.4ms
- Overhead: ~0.5ms

### Font Strategy
- `font-display: block` for JetBrains Mono (preloader needs it)
- `font-display: swap` for Space Grotesk
- Preload critical weights via `<link rel="preload">`

### Image Strategy
- All images: `next/image` with WebP/AVIF, lazy loading
- Blur-up placeholders (20px base64 inline)
- Project screenshots: max 800px wide, optimized

---

## 18. ACCESSIBILITY

### Semantic HTML
- `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` throughout
- Heading hierarchy: single `<h1>` (name), `<h2>` per section

### ARIA
- Command palette: `role="dialog"`, `aria-label="Command palette"`
- Project panels: `role="dialog"`, focus trap
- Section dots: `role="navigation"`, each dot `role="link"`
- RAG pipeline: `aria-label` describing all 6 stages

### Keyboard
- All interactive elements focusable with visible focus rings (`2px solid #4ADE80`)
- Tab order follows visual order
- Escape closes modals/panels
- Command palette: arrow keys navigate, Enter selects

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* All durations → 0-50ms */
  /* Particles → 150 count, static (no movement) */
  /* No typewriter effects (show final state) */
  /* No parallax */
  /* Scroll-linked effects → simple opacity fades */
}
```

### Color Contrast
- `#E8E6E3` on `#06060A`: 15.2:1 (passes AAA)
- `#8B8B9E` on `#0E0E14`: 5.8:1 (passes AA)
- All accents on dark surfaces: >4.5:1 (passes AA)

---

## 19. SEO & METADATA

### Page Meta
```html
<title>Lucas Duys — CS & AI Developer</title>
<meta name="description" content="CS & Engineering student at TU Eindhoven building AI tools. Creator of Pitchr.live (HackEurope winner) and Stacklink.nl (RAG system)." />
```

### Open Graph
```html
<meta property="og:title" content="Lucas Duys — CS & AI Developer" />
<meta property="og:description" content="Building at the intersection of engineering and AI." />
<meta property="og:image" content="/images/og-image.png" />
<meta property="og:type" content="website" />
```

### JSON-LD (Person schema)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Lucas Duys",
  "jobTitle": "CS & Engineering Student",
  "affiliation": { "@type": "Organization", "name": "TU Eindhoven" },
  "email": "lucas.duys@gmail.com",
  "url": "[vercel-url]",
  "sameAs": ["https://www.linkedin.com/in/lucas-duys/"]
}
```

### Additional
- `sitemap.xml` (auto-generated by Next.js)
- `robots.txt`: allow all
- Canonical URL on all pages

---

## 20. DEPLOYMENT

### Vercel Setup
- Connect GitHub repo
- Framework preset: Next.js (auto-detected)
- Build command: `next build`
- Output: `.next`
- No environment variables needed (fully static)
- Preview deployments on every PR

### Domain (future)
When ready: add custom domain in Vercel dashboard → update DNS records.

---

## 21. IMPLEMENTATION PHASES

### Phase 1: Foundation (Days 1-2)
- Next.js project setup with TypeScript + Tailwind
- Font loading (JetBrains Mono + Space Grotesk)
- Global CSS variables (colors, animation tokens)
- Layout component with section structure
- Deploy skeleton to Vercel
- **Key files:** `layout.tsx`, `page.tsx`, `globals.css`, `constants.ts`, `fonts.ts`

### Phase 2: Scroll System (Days 3-4)
- Lenis smooth scroll integration
- GSAP + ScrollTrigger setup
- Section wrapper with scroll-triggered reveals
- Text split animations (useTextReveal hook)
- Synapse bridge components
- **Key files:** `useLenis.ts`, `useScrollTrigger.ts`, `useTextReveal.ts`, `SectionWrapper.tsx`, `SynapseBridge.tsx`

### Phase 3: Particle System (Days 5-7)
- WebGL 2 canvas setup
- Particle struct-of-arrays data structure
- Simplex noise flow field
- Connection drawing with spatial hash
- Mouse interaction (attraction, click ripple)
- Cursor glow aura
- Adaptive quality system
- **Key files:** `ParticleCanvas.tsx`, `particleSystem.ts`, `shaders.ts`, `spatialHash.ts`, `noise.ts`

### Phase 4: Hero + Preloader + Nav (Days 8-10)
- Preloader boot sequence + particle genesis
- Hero section with corner HUD elements
- Particle-to-text name formation
- Role cycling typewriter
- Nav bar with glassmorphism
- Command palette (cmdk integration)
- Side section indicator
- Custom cursor
- **Key files:** `Preloader.tsx`, `Hero.tsx`, `NavBar.tsx`, `CommandPalette.tsx`, `CustomCursor.tsx`

### Phase 5: Content Sections (Days 11-13)
- About section (frontmatter + body)
- Experience section (git log entries + metric counters)
- Contact section (HTTP response + links + cipher effect)
- Easter egg terminal (Konami code)
- **Key files:** `About.tsx`, `Experience.tsx`, `Contact.tsx`, `SecretTerminal.tsx`, `CipherText.tsx`

### Phase 6: Projects + RAG Pipeline (Days 14-17)
- Project cards with per-project visual treatments
- Case study expansion (FLIP animation)
- **RAG Pipeline animation** (the crown jewel — Canvas + SVG + Framer Motion)
- Mini pipeline preview on Stacklink card
- **Key files:** `ProjectCard.tsx`, `CaseStudyPanel.tsx`, `RAGPipeline.tsx`

### Phase 7: Skills Visualization (Days 18-19)
- Embedding space scatter plot
- Cluster positioning + connection lines
- Search interaction with pre-computed scores
- Auto-demo cycling
- Big bang entry animation
- **Key files:** `EmbeddingSpace.tsx`, `SkillSearch.tsx`, `skills.ts`, `skillQueries.ts`

### Phase 8: Polish + Mobile + Performance (Days 20-23)
- Mobile responsive pass (all breakpoints)
- Mobile navigation
- Performance audit (Lighthouse, frame timing)
- Reduce motion support
- SEO metadata
- OG image creation
- Final deploy
- **Key files:** Various touch-ups across all files

### Total Estimated: ~23 working days

---

## TOOLS & MCP SERVERS FOR IMPLEMENTATION

During implementation, use:
- **context7 MCP:** Fetch latest docs for Next.js, GSAP, Framer Motion, Lenis, cmdk, Tailwind
- **playwright MCP:** Visual regression testing, screenshot comparison, interaction testing
- **frontend-design skill:** For creating the actual UI components with design quality
- **webapp-testing skill:** For testing the deployed site with Playwright
- **vercel-deploy skill:** For deployment
- **cinematic-scroll-frontends skill:** For GSAP ScrollTrigger + scroll-driven animation guidance
- **gsap-scrolltrigger skill:** For ScrollTrigger-specific patterns (pinning, scrubbing, snap)

---

*This specification is implementation-ready. Every animation has exact timing, every color has a hex value, every font has a size and weight, every interaction has defined states and transitions. The detailed sub-specs for each section are available in the agent output files.*
