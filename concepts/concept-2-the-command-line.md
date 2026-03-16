# Concept 2: The Command Line

> A premium, award-worthy portfolio that uses CLI as its design *language* — not as a gimmick.
> Think: what if a developer's brain had a UI. Dark, precise, alive with data.

---

## 1. Overall Vibe & Theme

**Emotional feel:** Peering into the workspace of someone who *thinks* in systems. The site should feel like a living, breathing developer environment — but one designed by a world-class creative director. Every element has purpose. Every animation carries meaning.

**Key tensions that make this work:**
- **Precision vs. warmth** — monospace type and grid layouts, but with organic scroll physics and eased animations that feel human
- **Technical depth vs. accessibility** — CLI metaphors that *anyone* can understand, not gatekeeping jargon
- **Dark & focused vs. alive** — deep backgrounds, but punctuated by luminous accent colors that pulse, trail, and respond to interaction
- **Minimal vs. information-dense** — clean negative space, but sections that unfold into rich data visualizations

**Reference blend:** The scroll craft and smooth transitions of Dennis Snellenberg, the dark precision of Linear's marketing site, the data-alive feel of Vercel's dashboard, the typographic confidence of Paco Coursey's site.

**Not this:** A literal bash emulator. A green-on-black novelty. A "hacker" aesthetic that feels dated. We're borrowing the *language* of the terminal, not cosplaying it.

---

## 2. Color Palette

### Primary Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background (deep) | Void Black | `#0A0A0F` | Page background, deepest layer |
| Background (elevated) | Ink | `#12121A` | Cards, panels, elevated surfaces |
| Background (surface) | Graphite | `#1A1A26` | Hover states, active surfaces, code blocks |
| Border / subtle | Smoke | `#2A2A3A` | Dividers, card borders, subtle structure |
| Text (primary) | Bone | `#E8E6E3` | Headings, body copy, primary content |
| Text (secondary) | Ash | `#8B8B9E` | Timestamps, labels, secondary info |
| Text (muted) | Slate | `#555566` | Disabled, decorative line numbers |

### Accent Palette — "Phosphor"

The accents are inspired by phosphor monitor colors but modernized — not the flat green of a 1980s terminal, but luminous, slightly desaturated tones that feel premium.

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary accent | Phosphor Green | `#4ADE80` | Primary interactive elements, success states, the "cursor" |
| Secondary accent | Signal Amber | `#FBBF24` | Warnings, highlights, attention markers |
| Tertiary accent | Link Cyan | `#22D3EE` | Links, secondary interactive, data streams |
| Quaternary | Soft Violet | `#A78BFA` | AI/LLM-related elements, decorative |
| Error / hot | Terminal Red | `#F87171` | Errors, destructive actions |

### Glow System

Accent colors are never flat. They carry a subtle glow effect via `box-shadow` and `text-shadow`:

```css
/* Phosphor glow — used on active/hover states */
.glow-green {
  color: #4ADE80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.3), 0 0 40px rgba(74, 222, 128, 0.1);
}

/* Cursor blink — the signature interaction */
.cursor {
  background: #4ADE80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
  animation: blink 1s step-end infinite;
}
```

### Gradient Accents

For section transitions and hero backgrounds, use radial gradients of the accent colors at very low opacity (3-8%) bleeding into the void black. This creates "zones" of color that feel like different terminal sessions or processes running.

---

## 3. Typography

### Monospace — The Voice of the Machine

**Font:** `JetBrains Mono` (Google Fonts)
- Why: designed specifically for developers, excellent ligature support, distinct character shapes (the `0` vs `O`, `1` vs `l` are beautifully clear), and it has *personality* without sacrificing readability
- Weights used: 400 (body code), 500 (labels), 700 (headings in mono)
- Used for: section labels, command prompts, code snippets, navigation items, skill tags, dates/timestamps, the typing animation

**Alternative consideration:** `Berkeley Mono` if licensing allows — slightly more refined, premium feel.

### Sans-Serif — The Human Layer

**Font:** `Inter` (Google Fonts) or `Geist Sans` (Vercel)
- Why: Inter is the gold standard for UI. If going more distinctive, Geist Sans has that modern, slightly technical feel that pairs beautifully with JetBrains Mono
- Weights used: 400 (body), 500 (subheadings), 600 (emphasis), 700 (headings)
- Used for: body paragraphs, project descriptions, longer-form content, the "human" voice of Lucas

### Type Scale

```
--text-xs:    0.75rem / 12px   (timestamps, line numbers)
--text-sm:    0.875rem / 14px  (labels, captions, mono body)
--text-base:  1rem / 16px      (body copy)
--text-lg:    1.125rem / 18px  (lead paragraphs)
--text-xl:    1.25rem / 20px   (section subheads)
--text-2xl:   1.5rem / 24px    (section titles)
--text-3xl:   2rem / 32px      (page titles)
--text-hero:  clamp(2.5rem, 5vw, 4.5rem)  (hero text)
```

### Interplay Rules

1. **Section labels** are always monospace, uppercase, with letter-spacing `0.15em`, in the muted Ash color: `// PROJECTS` or `$ ls experience/`
2. **Headings** use Inter/Geist at bold weight — the human voice asserting itself
3. **Descriptions** use Inter/Geist at regular weight — warm, readable, approachable
4. **Data points** (dates, stats, tech stack tags) revert to JetBrains Mono — precision matters here
5. **The prompt character** `>` or `$` is always Phosphor Green, always JetBrains Mono

---

## 4. Page Structure

The site is a single long scroll, but each section is framed as a "command" that has been executed, with its output flowing below. The left margin carries persistent line numbers (very faint, in Slate `#555566`) that increment as you scroll — the entire page is one long "output."

### Section Order

```
┌─────────────────────────────────────────────┐
│  1. HERO — The Boot Sequence                │
│     $ lucas.init()                          │
├─────────────────────────────────────────────┤
│  2. ABOUT — cat about.md                    │
│     Who Lucas is, rendered as markdown      │
├─────────────────────────────────────────────┤
│  3. STATUS — systemctl status lucas         │
│     Current role, education, location       │
├─────────────────────────────────────────────┤
│  4. EXPERIENCE — git log --oneline          │
│     Timeline as git commit history          │
├─────────────────────────────────────────────┤
│  5. PROJECTS — ls -la projects/             │
│     Project cards with file-listing style   │
├─────────────────────────────────────────────┤
│  6. SKILLS — query lucas --capabilities     │
│     Interactive skill visualization         │
├─────────────────────────────────────────────┤
│  7. HACKATHONS — time ./hackathon.sh        │
│     Hackathon wins with timer aesthetic     │
├─────────────────────────────────────────────┤
│  8. CONTACT — ssh lucas@connect             │
│     Contact form styled as SSH session      │
└─────────────────────────────────────────────┘
```

### Persistent Elements

- **Left margin line numbers** — faint, incrementing, creating the "code editor" frame
- **Top bar** — a minimal "tab bar" showing the current section as a file tab: `lucas.dev — ~/about.md`
- **Scroll progress** — a thin Phosphor Green line at the very top of the viewport, like a build progress bar
- **Floating command palette trigger** — small `>_` icon in bottom-right, opens the interactive command palette (see Navigation)

---

## 5. Hero Section — "The Boot Sequence"

### Layout

Full viewport height. Center-aligned content with generous breathing room.

### The Sequence (animated on load)

The hero plays out as a boot sequence — fast, confident, with precise timing:

```
Phase 1 (0-400ms): Screen is pure #0A0A0F black. A single cursor blinks.

Phase 2 (400-1200ms): Boot text appears line by line, fast (40ms per character):
    > Initializing lucas.dev...
    > Loading modules: [react, next.js, typescript, tailwind]
    > Connecting to experience database... done.
    > Mounting projects... 4 found.
    > System ready.

Phase 3 (1200-1800ms): Boot text fades to 20% opacity and slides up.

Phase 4 (1800-2800ms): The main hero content fades in with a subtle scale
  from 0.97 to 1.0:

    LUCAS DUYS
    CS & Engineering @ TU Eindhoven
    Building things that think.

Phase 5 (2800ms+): Below the name, a live "prompt" appears and cycles
  through typed commands:
    $ currently mass-building AI agents @ cape.io_
    $ previously won HackEurope Paris with Pitchr.live_
    $ exploring RAG pipelines, LLM orchestration & more_
```

### Design Details

- "LUCAS DUYS" is in Inter/Geist, `text-hero` size, weight 700, color Bone, with very slight letter-spacing (`0.02em`)
- The subtitle is Inter, `text-lg`, color Ash
- The tagline "Building things that think." is Inter, `text-xl`, weight 500, color Bone — this is the human moment
- The cycling prompt uses JetBrains Mono, `text-base`, with the `$` in Phosphor Green and the text in Bone
- The cursor is a solid rectangle (block cursor, not line cursor) in Phosphor Green with the glow effect, blinking at 1s intervals
- Behind everything: a very subtle radial gradient from `rgba(74, 222, 128, 0.04)` at center to transparent, creating a faint green "glow" that suggests a screen

### Scroll Cue

At the bottom of the hero, a subtle downward chevron pulses gently, with the text `scroll to explore` in JetBrains Mono, `text-xs`, color Slate. It fades out as soon as the user scrolls.

---

## 6. Navigation

### Primary: The Command Palette

Triggered by:
- Clicking the `>_` floating button (bottom-right)
- Pressing `Ctrl+K` / `Cmd+K` (keyboard shortcut, shown as hint on desktop)
- Pressing `/` anywhere on the page

**The palette** is a centered modal with:
- A monospace input field with blinking cursor: `> type a command...`
- Below it, a list of "commands" that filter as you type:

```
  > about          Jump to About section
  > experience     View experience timeline
  > projects       Browse projects
  > skills         View skill matrix
  > pitchr         Open Pitchr project detail
  > stacklink      Open Stacklink project detail
  > contact        Get in touch
  > resume         Download CV (PDF)
  > github         Open GitHub profile
  > linkedin       Open LinkedIn profile
  > theme amber    Switch to amber color scheme
  > theme green    Switch to green color scheme (default)
  > theme cyan     Switch to cyan color scheme
```

The palette uses fuzzy matching (like VS Code's command palette). Pressing Enter navigates. The transition is a smooth scroll to the target section.

**Easter eggs in the palette:**
- Typing `sudo hire lucas` triggers a fun animation and scrolls to contact
- Typing `rm -rf /` shows "Nice try." with a wink
- Typing `neofetch` shows a compact ASCII art + system info card about Lucas
- Typing `matrix` triggers a brief matrix rain animation overlay

### Secondary: Visual Navigation

A minimal horizontal nav in the top bar (appears after scrolling past hero):

```
about   experience   projects   skills   contact
```

Each item is JetBrains Mono, `text-sm`, color Ash, with Phosphor Green on hover/active. Active section has a green underline (2px, with glow). The nav bar background is `#0A0A0F` with `backdrop-filter: blur(12px)` at 90% opacity.

### Mobile Navigation

- The command palette becomes a bottom sheet (slides up from bottom, feels native on mobile)
- The top nav collapses into a hamburger that opens a full-screen overlay with the same command list
- The `>_` button is always visible, thumb-reachable in the bottom-right

---

## 7. Project Showcase

### Section Header

```
$ ls -la projects/
total 4
drwxr-xr-x  lucas  staff  4096  Mar 16  ./
-rwxr-xr-x  lucas  staff  2.1M  Nov 24  pitchr.live
-rwxr-xr-x  lucas  staff  1.8M  Oct 15  stacklink.nl
-rwxr-xr-x  lucas  staff  960K  Sep 01  llm-workshops
-rwxr-xr-x  lucas  staff  640K  Aug 20  amplifirm-ops
```

This file listing is rendered in JetBrains Mono with appropriate column alignment, in Ash color, and each filename is a clickable link in Phosphor Green that smooth-scrolls to the project detail below.

### Project Cards

Each project is a "panel" — a full-width card with a thick left border in an accent color (different per project). Inside:

#### Project: Pitchr.live

```
┌── pitchr.live ─────────────────────────────────────────────┐
│                                                            │
│  STATUS: ● deployed    BUILT IN: 24h    EVENT: HackEurope  │
│                                                            │
│  AI-powered pitch coaching platform. Real-time feedback    │
│  on delivery, content, and persuasion. Won 1st place at    │
│  HackEurope Paris 2025.                                    │
│                                                            │
│  ┌─ TECH STACK ────────────────────────────────────────┐   │
│  │ next.js  typescript  tailwind  supabase  openai     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─ PROCESS LOG ───────────────────────────────────────┐   │
│  │ 00:00  Team formed, problem identified              │   │
│  │ 02:30  Architecture locked: Next.js + Supabase      │   │
│  │ 06:00  Core pitch analysis pipeline working         │   │
│  │ 12:00  Real-time feedback loop integrated           │   │
│  │ 18:00  UI polish, demo prep                         │   │
│  │ 23:30  Final deploy, presentation ready             │   │
│  │ 24:00  >> WON FIRST PLACE                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  [▶ Watch Demo]    [→ Visit Site]    [< > Source Code]     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key design details:**
- The `STATUS: ● deployed` uses a pulsing green dot (CSS animation, subtle)
- The `BUILT IN: 24h` uses Signal Amber for the time value
- The process log animates in on scroll — each line appears with a slight delay (80ms stagger), simulating real-time output
- The `>> WON FIRST PLACE` line is in Phosphor Green, bold, with the glow effect
- Buttons have monospace text, bordered style, with green glow on hover

#### Project: Stacklink.nl — RAG Pipeline Visualization

This project gets a special treatment: an interactive visualization of the RAG retrieval pipeline.

```
┌── stacklink.nl ─────────────────────────────────────────────┐
│                                                             │
│  STATUS: ● production    TYPE: RAG System                   │
│                                                             │
│  Hybrid retrieval system combining vector search (pgvector) │
│  and BM25 keyword matching for precise document retrieval.  │
│                                                             │
│  ┌─ RETRIEVAL PIPELINE ────────────────────────────────┐    │
│  │                                                     │    │
│  │  [User Query] ─────┬──────────────────┐             │    │
│  │        │            │                  │             │    │
│  │        ▼            ▼                  ▼             │    │
│  │   ┌─────────┐ ┌──────────┐   ┌──────────────┐      │    │
│  │   │ Embed   │ │ Tokenize │   │ Query        │      │    │
│  │   │ (1536d) │ │ (BM25)   │   │ Rewriting    │      │    │
│  │   └────┬────┘ └────┬─────┘   └──────┬───────┘      │    │
│  │        │            │                │              │    │
│  │        ▼            ▼                ▼              │    │
│  │   ┌─────────┐ ┌──────────┐   ┌──────────────┐      │    │
│  │   │ Vector  │ │ Keyword  │   │ Semantic     │      │    │
│  │   │ Search  │ │ Search   │   │ Reranking    │      │    │
│  │   └────┬────┘ └────┬─────┘   └──────┬───────┘      │    │
│  │        │            │                │              │    │
│  │        └────────────┼────────────────┘              │    │
│  │                     ▼                               │    │
│  │              ┌─────────────┐                        │    │
│  │              │ Fusion &    │                        │    │
│  │              │ Rank Merge  │                        │    │
│  │              └──────┬──────┘                        │    │
│  │                     ▼                               │    │
│  │              ┌─────────────┐                        │    │
│  │              │ Top-K       │                        │    │
│  │              │ Results     │                        │    │
│  │              └─────────────┘                        │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**The pipeline is NOT static ASCII art.** It's rendered as an actual SVG/canvas visualization with:
- Animated data particles flowing along the paths (small green dots traveling the connections)
- Each node lights up on hover, showing a tooltip with details
- When the section scrolls into view, the pipeline "activates" — nodes light up sequentially from top to bottom, particles begin flowing
- The color coding: vector path in Phosphor Green, BM25 path in Signal Amber, reranking in Soft Violet
- A subtle "data processed" counter ticks up in the corner

#### Project: LLM Workshops

Presented with an "audience participation" metaphor:

```
  $ ./workshop --topic "LLM Integration" --audience "businesses"

  [████████████████████████████████████████] 100% delivered

  Participants:  32 professionals
  Satisfaction:  4.8/5.0
  Topics:        prompt engineering, RAG, fine-tuning, deployment
```

The progress bar animates on scroll-in.

#### Project: Amplifirm Operations

Presented as a system monitoring dashboard:

```
  $ systemctl status amplifirm-ops

  ● amplifirm-ops.service — Head of Operations
    Active: active (running) since 2024
    Role:   Remote, London

  METRICS:
  ┌──────────────────────────────────────────┐
  │  Closing Rate    ▲ 40%  [████████░░] ↑   │
  │  Outreach        ▲ 60%  [██████████] ↑   │
  │  Revenue         ▲ 35%  [███████░░░] ↑   │
  └──────────────────────────────────────────┘
```

The metric bars animate from 0 to their values on scroll-in, with a satisfying easing curve. The arrows pulse green.

---

## 8. Animations & Interactions — DETAILED

### 8.1 Typing / Typewriter Effects

**Where:** Hero boot sequence, hero cycling prompt, section command headers, command palette input.

**Implementation:**
- Character reveal speed: 40ms per character for boot text, 60ms for the cycling hero prompt (slightly slower = more readable)
- Cursor: block cursor (`█`), Phosphor Green with glow, blinks via `step-end` animation at 530ms intervals (matches real terminal blink rate)
- The cursor remains visible for 1.5s after typing completes before the next line begins
- Deletion animation (for cycling prompt): 25ms per character (faster than typing, feels natural)
- Pause between cycles: 3s dwell time on completed text

**Library:** Custom implementation with `requestAnimationFrame` — no library needed. The logic is simple enough and custom code avoids bundle bloat.

```typescript
// Pseudocode for the typing engine
const useTypewriter = (texts: string[], config: {
  typeSpeed: number;      // 40-60ms
  deleteSpeed: number;    // 25ms
  dwellTime: number;      // 3000ms
  cursorBlink: number;    // 530ms
}) => { ... }
```

### 8.2 Scroll-Triggered Terminal Output Reveals

**Where:** Every section header command, process logs, metric bars, the RAG pipeline.

**How it works:**
- As a section scrolls into view (Intersection Observer, threshold 0.2), the "command" at the top types out first
- Then the "output" below it reveals line by line, staggered at 60-100ms per line
- Each line slides in from `opacity: 0, translateY(8px)` to `opacity: 1, translateY(0)` with a `cubic-bezier(0.16, 1, 0.3, 1)` easing (Framer Motion spring-like)
- Lines that are "data" (metrics, stats) count up from 0 to their final value using `countUp` style animation

**Critical:** The animations only play once. On scroll-back, the content stays visible. No re-triggering. This respects the user's time and feels polished rather than gimmicky.

### 8.3 Code Syntax Highlighting as Design Element

**Where:** The "about" section (rendered as a markdown file), skill tags, project tech stacks.

**Implementation:**
- Use Shiki for syntax highlighting (same engine as VS Code)
- Custom theme that matches the site palette exactly
- Keywords in Soft Violet, strings in Phosphor Green, comments in Ash, functions in Link Cyan, variables in Bone
- The about section renders `about.md` as if it's a markdown file being previewed — with actual markdown syntax visible but beautifully styled:

```markdown
  1  # Lucas Duys
  2
  3  **CS & Engineering** student at TU Eindhoven,
  4  graduating May 2027. I build systems that
  5  make information *accessible* and decisions
  6  *intelligent*.
  7
  8  > "The best interface is one that understands
  9  > what you need before you ask."
  10
  11 Currently exploring the intersection of
  12 **retrieval-augmented generation**, real-time
  13 AI coaching, and **developer tooling**.
```

Line numbers in Slate. Markdown syntax characters (`#`, `**`, `>`) in Soft Violet. The actual text in Bone. This creates a uniquely beautiful presentation that doubles as a flex of the CLI aesthetic.

### 8.4 Data Stream / Matrix-Rain Subtle Background

**Where:** Full page background, very subtle.

**Implementation:**
- A `<canvas>` element covering the full page, behind all content, at very low opacity (0.03-0.05)
- Instead of matrix rain (which is cliche), use a "data stream" effect: columns of slowly descending characters, but they're *real* characters from Lucas's work — snippets of code, function names, variable names, tech stack words
- Characters fall at different speeds (2-8px/s), different sizes (10-14px), different opacities (0.02-0.06)
- Colors: mix of Phosphor Green, Link Cyan, and Soft Violet at very low opacity
- The effect is so subtle that most users will only notice it subconsciously — it adds texture without distraction
- Performance: limit to 50 columns max, use `requestAnimationFrame`, skip rendering when tab is not visible
- On mobile: reduce to 20 columns or disable entirely for performance

### 8.5 Hover Effects

**Terminal-style hover interactions:**

- **Links:** On hover, text gets the Phosphor Green glow (`text-shadow`), and a block cursor appears at the end of the text, blinking
- **Project cards:** On hover, the left border brightens (opacity 0.6 to 1.0), and a subtle scan-line effect sweeps from top to bottom once (a 1px horizontal line of lighter color descends, 400ms, ease-out)
- **Skill tags:** On hover, they "activate" — background shifts from Graphite to a 10% opacity version of their category color, with a tiny glow
- **Navigation items:** On hover, a `> ` prefix animates in from the left (slides in, 150ms) before the text
- **Buttons:** On hover, border color transitions to Phosphor Green, background gets a 5% green tint, and the glow activates

### 8.6 Smooth Scroll with Parallax (Dennis Snellenberg Influence)

**Implementation with Lenis:**

- Use `@studio-freight/lenis` for smooth scroll — the same library Dennis Snellenberg uses
- Scroll speed: `lerp: 0.1` (smooth but not sluggish)
- Duration: `1.2` seconds
- Each section has a subtle parallax offset: section backgrounds move at 0.95x scroll speed, creating a gentle depth effect
- Section transitions: as one section exits and the next enters, there's a crossfade zone (about 100px of overlap) where the exiting section's opacity decreases and the entering section's command begins typing
- The line numbers in the left margin scroll at 1.0x (normal) speed — they're the "anchor" that everything else is layered against

**Scroll-linked animations (GSAP ScrollTrigger):**
- The progress bar at the top (Phosphor Green line) is directly linked to scroll position
- The top bar's current file tab updates based on scroll position
- The RAG pipeline nodes light up based on scroll position within that section (not just in/out, but progressive activation as you scroll through it)

### 8.7 Loading States — "Build Process"

**Initial page load:**
```
[1/4] Resolving dependencies...
[2/4] Fetching packages...
[3/4] Linking modules...
[4/4] Building lucas.dev...

✓ Done in 1.2s
```

This plays in the center of the screen for 1.5-2s (or until content is actually loaded, whichever is longer), then wipes away to reveal the hero. It's fast enough to feel intentional, not annoying.

**Section lazy loading (if applicable):**
When heavy content (like the RAG visualization) lazy-loads:
```
Compiling section... ██████░░░░ 60%
```

A thin progress bar inside the section boundary, JetBrains Mono text, Phosphor Green bar.

### 8.8 Page Transitions (if multi-page)

If project detail pages exist as separate routes:
- Exit: current content collapses upward like terminal `clear`
- Enter: new content types in from a fresh prompt
- Duration: 400ms total, `cubic-bezier(0.76, 0, 0.24, 1)`

---

## 9. Personal Touches — Lucas-Specific

### 9.1 Interactive RAG Pipeline

Beyond the static visualization in the project section, offer an interactive demo:

```
  > Try a query against the Stacklink pipeline:

  [Enter your question about a topic...]

  ┌─ RETRIEVAL TRACE ──────────────────────────────────┐
  │ Query: "How does vector search work?"              │
  │                                                    │
  │ Step 1: Embedding generated (1536 dimensions)      │
  │ Step 2: Vector search → 12 candidates (cosine)     │
  │ Step 3: BM25 search → 8 candidates (keyword)       │
  │ Step 4: Fusion → 6 unique documents                │
  │ Step 5: Reranking → top 3 selected                 │
  │                                                    │
  │ Result: [Document excerpt shown here]              │
  │ Relevance: 0.94                                    │
  │ Retrieval time: 120ms                              │
  └────────────────────────────────────────────────────┘
```

This doesn't need to be a real backend — it can be a pre-scripted simulation that triggers on a few example queries, with animated steps that show each pipeline stage lighting up in sequence.

### 9.2 `query lucas --capabilities`

The skills section is styled as a query result:

```
$ query lucas --capabilities --format=table

CATEGORY        SKILL              LEVEL    LAST_USED
────────────────────────────────────────────────────────
frontend        React              ████░    active
frontend        Next.js            ████░    active
frontend        TypeScript         ████░    active
frontend        Tailwind CSS       █████    active
backend         Node.js            ████░    active
backend         Supabase           ████░    active
ai/ml           LLM Integration    ████░    active
ai/ml           RAG Pipelines      ███░░    active
ai/ml           AI Agents          ███░░    learning
ops             Process Design     ████░    active
ops             Sales Ops          ████░    active

Total: 11 capabilities | Active: 10 | Learning: 1
```

**Interactive element:** Users can type their own `query` with flags:
- `--category=ai` filters to only AI skills
- `--sort=level` sorts by proficiency
- `--verbose` shows additional details per skill (where it was used, etc.)

The level bars animate from empty to full when the section scrolls in. The bars use the Phosphor Green color with the glow.

### 9.3 Hackathon Countdown Timer Aesthetic

The HackEurope section features a "timer" element:

```
  ┌─ HACKEUROPE PARIS 2025 ──────────────────┐
  │                                           │
  │  TIME ELAPSED:  23:59:59 / 24:00:00       │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 99.9%  │
  │                                           │
  │  STATUS: >> WINNER <<                     │
  │  TEAM:   Lucas Duys + team                │
  │  BUILD:  Pitchr.live                      │
  │                                           │
  └───────────────────────────────────────────┘
```

On scroll-in, the timer rapidly counts up from `00:00:00` to `23:59:59` over 3 seconds, the progress bar fills, and then "WINNER" flashes in Phosphor Green with an emphatic glow pulse.

### 9.4 AI Conversation Element

In the about section or as a floating element, show a simulated AI conversation that reveals Lucas's personality:

```
  lucas.ai > What drives you?

  I'm fascinated by the gap between what AI can do and
  what people actually use it for. I want to build the
  bridges — tools that make AI feel natural, not foreign.

  lucas.ai > What's next?

  Finishing my degree at TU/e, going deeper on AI agents
  at cape.io, and shipping things that matter.
```

This types out on scroll with slightly variable speed (faster on short words, slower on longer ones) to feel organic.

### 9.5 The cape.io Element

Since Lucas just started at cape.io (2 weeks ago), this is fresh and exciting. In the experience section:

```
  commit a3f7b2c (HEAD -> main)
  Author: Lucas Duys <lucas@cape.io>
  Date:   2 weeks ago

    feat: started AI agent integration research @ cape.io

    Currently exploring:
    - AI agent architectures
    - Integration patterns
    - Production deployment strategies

    Status: learning fast ▸▸▸
```

The `HEAD -> main` tag pulses gently in green — it's the current thing.

---

## 10. Tech Stack

### Core

| Tool | Purpose | Why |
|------|---------|-----|
| **Next.js 15** (App Router) | Framework | SSR for SEO, file-based routing, React Server Components for performance. Lucas already knows it deeply |
| **TypeScript** | Language | Type safety, better DX, matches Lucas's skill set |
| **Tailwind CSS v4** | Styling | Utility-first, consistent with Lucas's workflow. v4 for CSS-first config |
| **Framer Motion** | Animations | The most capable React animation library. Handles scroll-triggered reveals, layout animations, typing effects |

### Animation & Scroll

| Tool | Purpose |
|------|---------|
| **Lenis** (`@studio-freight/lenis`) | Smooth scroll engine — the Dennis Snellenberg secret sauce |
| **GSAP + ScrollTrigger** | Scroll-linked animations (progress bar, section transitions, parallax). More precise than Framer Motion for scroll-linked work |
| **Shiki** | Syntax highlighting with VS Code-quality themes |

### Visualization

| Tool | Purpose |
|------|---------|
| **React Flow** or **Custom SVG** | RAG pipeline interactive visualization. React Flow if interactivity is key; custom SVG if pure aesthetic |
| **Canvas API** | The subtle background data stream effect. Raw canvas for max performance |
| **CountUp.js** or custom | Animated number counting for metrics |

### Infrastructure

| Tool | Purpose |
|------|---------|
| **Vercel** | Hosting — zero-config for Next.js, edge functions, analytics |
| **Vercel Analytics** | Lightweight, privacy-respecting analytics |
| **next-seo** | SEO meta tags, Open Graph |

### Fonts

| Font | Source | Subset |
|------|--------|--------|
| **JetBrains Mono** | Google Fonts | Latin, 400/500/700 |
| **Inter** or **Geist Sans** | Google Fonts / Vercel | Latin, 400/500/600/700 |

### Development

| Tool | Purpose |
|------|---------|
| **ESLint + Prettier** | Code quality |
| **Husky + lint-staged** | Pre-commit hooks |

**Total estimated bundle:** ~180-220KB gzipped (including fonts). Fast.

---

## 11. Mobile Adaptation

### Philosophy

The CLI metaphor should *enhance* mobile, not fight it. On touch devices, the terminal becomes a "smart assistant" interface — think of how ChatGPT works on mobile. The command metaphor translates naturally to conversational interaction.

### Specific Adaptations

**Layout:**
- Line numbers in the left margin are hidden on mobile (below `768px`) — they're decorative and would waste precious horizontal space
- Content goes full-width with `16px` horizontal padding
- Section command headers shrink to `text-sm` and stay on one line
- Project cards stack vertically, full-width

**Navigation:**
- The top nav bar shows only the current section name (as a file tab) + hamburger
- Hamburger opens a full-screen overlay: dark background, centered list of sections styled as commands, large touch targets (48px height minimum)
- The `>_` command palette button stays in the bottom-right, 56px diameter, always accessible with thumb
- Command palette opens as a bottom sheet (slides up from bottom, covers bottom 70% of screen), input at top with native keyboard integration

**Typography:**
- JetBrains Mono scales down slightly on mobile (`text-sm` becomes `text-xs`)
- Body text in Inter stays at `text-base` (16px) — readability first
- Hero text uses the `clamp()` scale, dropping to ~32px on small screens

**Animations:**
- Background data stream is disabled on mobile (performance)
- Typing animations are faster on mobile (30ms per char) — mobile users are impatient
- Scroll-triggered reveals use simpler transitions (fade-in only, no `translateY`) for smoother performance
- The RAG pipeline visualization switches to a vertical, simplified "step list" format instead of the branching diagram
- Parallax is disabled; straight scrolling only

**Interactions:**
- Hover effects are replaced with tap states
- Long-press on skill tags shows the verbose detail (instead of hover tooltip)
- The interactive `query` in the skills section becomes a pre-populated dropdown of example queries (no keyboard required)

**Touch gestures:**
- Swipe left/right on project cards to navigate between projects (optional carousel mode)
- Pull-to-refresh triggers the boot sequence animation again (fun, not functional)

**Performance budget on mobile:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- CLS: < 0.1

---

## 12. What Makes This Concept Unique

### 1. It's a design language, not a costume

Most "terminal portfolio" sites are literally a fake bash emulator where you type `about` to see text. This site uses CLI as a *visual language* while being a fully modern, accessible, beautiful website. Every visitor can navigate it normally. The CLI layer is an enhancement, not a barrier.

### 2. The data comes alive

The RAG pipeline visualization, the metric animations, the git log timeline — these aren't static images. They're interactive, animated representations of Lucas's actual work. A recruiter sees beautiful animations. A technical reviewer sees someone who understands these systems deeply enough to visualize them.

### 3. It demonstrates what it describes

The site itself is built with the exact stack Lucas lists in his skills. The smooth animations prove his frontend chops. The architecture proves his engineering thinking. The RAG visualization proves he understands retrieval pipelines. The site IS the portfolio piece.

### 4. Layered discovery

First visit: a beautiful dark portfolio with cool animations. Second visit (or curious visitor): discover the command palette, the easter eggs, the interactive query system, the theme switching. Power users get rewarded. Casual visitors aren't punished.

### 5. The human-machine duality

The most powerful aspect: the interplay between JetBrains Mono (the machine voice) and Inter (the human voice). Commands are typed by the machine. Descriptions are written by Lucas. The AI conversation element bridges both. It tells a story: here is someone who speaks both languages fluently.

### 6. Emotional arc

The site has a narrative arc through its scrolling:
- **Boot up** (hero) — anticipation, "let's see what this system can do"
- **Identity** (about) — warmth, humanity, the person behind the code
- **Proof** (experience, projects) — credibility, depth, "this person ships"
- **Capability** (skills) — scope, breadth, growth
- **Climax** (hackathon) — excitement, the timer counting up, the win
- **Connection** (contact) — invitation, openness, "let's build together"

This emotional journey, wrapped in a technical aesthetic, creates something memorable.

---

## Appendix: Key Micro-Decisions

**Cursor style:** Block (`█`), not line (`|`). Block cursors feel more terminal-authentic and are more visible.

**Prompt character:** `$` not `>`. The dollar sign is more universally recognized as a terminal prompt.

**Border radius:** `2px` on all elements. Sharp corners are more terminal-authentic. Absolutely no `rounded-xl`.

**Shadows:** Never use traditional `box-shadow` for depth. Instead, use colored `box-shadow` for glow effects and `border` for structure. Flat is more CLI.

**Scrollbar:** Custom-styled to match — thin (6px), Graphite track, Phosphor Green thumb, only visible on hover (Lenis handles this beautifully).

**Selection color:** When text is selected, use Phosphor Green background at 30% opacity with Bone text — even the text selection feels on-brand.

**Favicon:** A simple `>_` in Phosphor Green on a void black background.

**OG Image:** A beautiful rendering of the hero state — the boot sequence, centered, with the subtle green glow. Makes an incredible social share preview.

---

*This concept transforms a technical aesthetic into a storytelling device. It's not about looking like a terminal — it's about communicating like one: precise, responsive, and endlessly capable.*
