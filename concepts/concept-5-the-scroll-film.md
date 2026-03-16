# Concept 5: The Scroll Film

A cinematic, horizontal-scroll storytelling portfolio that tells Lucas Duys's story like a documentary. The scroll IS the playhead.

---

## 1. Overall Vibe & Theme

**One-line pitch:** Your portfolio is a short film. Scrolling plays it.

The experience is modeled after documentary filmmaking -- specifically the visual grammar of films like *Jiro Dreams of Sushi* or *Abstract: The Art of Design*. Dark, atmospheric, contemplative. Every full-screen panel is a composed frame. There is no "page" -- there is a *timeline*. The user does not navigate; they *watch*.

**Key principles:**
- **Narrative arc over information architecture.** The site has a beginning, middle, and end -- not a nav menu.
- **Cinematic framing.** Every visible state is composed like a film frame: rule-of-thirds placement, intentional negative space, depth through layering.
- **Restraint.** Animations serve the story. Nothing moves for the sake of moving. Every reveal is earned.
- **Atmospheric density.** Film grain, vignette, warm lighting on dark backgrounds. The feeling of sitting in a dark theater.

**Reference tone board:**
- Robby Leonardi's interactive resume (scroll-driven narrative) -- but SERIOUS, not playful
- Dennis Snellenberg's portfolio (polish, timing, craft)
- Apple's AirPods Pro page (scroll-driven reveals, full-screen moments)
- The opening sequence of *Se7en* (typography, texture, mood)

---

## 2. Color Palette

A cinematic palette built from deep darks, warm practical lighting, and cool accent tones. Think: a dark editing suite with a warm desk lamp.

| Role               | Color     | Hex       | Usage                                           |
|---------------------|-----------|-----------|--------------------------------------------------|
| Deep Black          | Void      | `#0A0A0B` | Primary background, scene canvases               |
| Warm Black          | Carbon    | `#141416` | Card backgrounds, secondary panels               |
| Film Grain Base     | Charcoal  | `#1C1C1F` | Subtle texture layer                             |
| Primary Text        | Bone      | `#E8E4DF` | Headlines, body text                             |
| Secondary Text      | Smoke     | `#8A8A8F` | Captions, metadata, timestamps                   |
| Warm Accent         | Amber     | `#D4A853` | Highlights, active states, the "warm light"      |
| Cool Accent         | Steel     | `#5B8FB9` | Technical data, links, secondary highlights       |
| Danger/Energy       | Ember     | `#C44B3F` | Hackathon countdown, urgency moments             |
| Success/Growth      | Sage      | `#6B8F71` | Metrics, positive numbers                        |
| Progress Bar Fill   | Amber Low | `#D4A85340`| 25% opacity amber for track, full amber for fill |

**Film grain overlay:** A 512x512 noise texture at 3-4% opacity, blended `multiply`, animated with a subtle random offset every 100ms (3 frames of noise, cycling). Applied globally over `<body>` via a fixed pseudo-element.

**Vignette:** Radial gradient from `transparent` at center to `rgba(0,0,0,0.4)` at edges. Fixed position, `pointer-events: none`. Covers entire viewport.

---

## 3. Typography

Two typefaces. Serif for the narrative voice. Sans for data and interface.

### Primary (Narrative): **Playfair Display**
- Used for: Scene titles, chapter headings, pull quotes, narrative text
- Weights: 400 (body narrative), 700 (scene titles), 900 (dramatic moments like "24 HOURS")
- Style: Often italic for narrative captions (like director's commentary)
- Letter-spacing: `0.02em` at body size, `0.08em` at title size, `-0.02em` at display size (120px+)
- Line-height: `1.4` body, `1.1` display

### Secondary (Technical): **JetBrains Mono** (for code) + **Inter** (for UI/data)
- JetBrains Mono: code snippets, technical labels, the RAG pipeline labels, terminal-style text
- Inter: metrics numbers, navigation, progress indicator, metadata, timestamps
- Inter weights: 300 (metadata), 400 (body), 600 (emphasis), 700 (numbers/metrics)

### Type Scale (desktop)
```
Display XL:   clamp(80px, 8vw, 160px)   — "24 HOURS", opening name
Display:      clamp(48px, 5vw, 96px)    — Scene titles
Heading 1:    clamp(32px, 3.5vw, 64px)  — Chapter headings
Heading 2:    clamp(24px, 2.5vw, 40px)  — Sub-headings
Body Large:   clamp(18px, 1.8vw, 24px)  — Narrative text
Body:         16px                       — Standard text
Caption:      14px                       — Metadata, timestamps
Micro:        12px                       — Progress bar labels
```

---

## 4. Story Structure (Scene Map)

The film is 8 scenes. Total horizontal scroll width: **800vw** (8 full-screen panels). Each scene spans **100vw** of horizontal space, which maps to a specific vertical scroll distance (see Section 5).

```
[Scene 1]  [Scene 2]  [Scene 3]  [Scene 4]  [Scene 5]  [Scene 6]  [Scene 7]  [Scene 8]
 Opening    Builder    Pitchr    Stacklink   Workshops   Thinker    Numbers    Credits
 100vw      100vw      100vw     100vw       100vw       100vw      100vw      100vw
```

### Scene 1: "Opening Title" (The Frame)
**Scroll distance:** 1500px of vertical scroll
**Content:**
- Black screen. 2 seconds of nothing (300px scroll).
- Lucas's name fades in, letter by letter, centered. `LUCAS DUYS` in Playfair Display, 900 weight, `clamp(80px, 8vw, 160px)`.
- Below the name, a subtitle types out character by character: `CS & Engineering // TU Eindhoven // Builder`
- Background: extremely slow parallax drift of a faint topographic map of Eindhoven (3% opacity, Smoke color)
- A thin horizontal line extends from left edge to right edge below the title (the "timeline" establishing itself)
- At the bottom, a gentle prompt: `scroll to play` with a subtle down-arrow that pulses (opacity 0.3 to 0.6, 2s ease-in-out loop)
- As user starts scrolling, the title drifts left and a warm amber gradient washes in from the right edge -- the film has begun

### Scene 2: "The Builder" (Establishing Shot)
**Scroll distance:** 2000px of vertical scroll
**Content:**
- A wide establishing shot of Lucas's world. Three "cards" representing his major projects float in at staggered depths (parallax).
- Foreground: His title/role text slides in from the right: *"I build things that think."*
- Midground: Three project thumbnails (Pitchr, Stacklink, Workshops) arranged in a loose constellation
- Background: Subtle grid pattern (like a storyboard) at 2% opacity
- Each project card has: a screenshot/visual, a one-line description, and a chapter number (CH.01, CH.02, CH.03)
- As scroll progresses, the cards drift apart and the "camera" pushes toward the first one (Pitchr) -- zooming into Scene 3

### Scene 3: "The Hackathon" (Pitchr — Chapter 1)
**Scroll distance:** 3000px of vertical scroll (longest scene -- this is the centerpiece)
**Content broken into sub-beats:**

**Beat 1 — The Setup (0-600px):**
- Location card fades in: `PARIS // HACKEUROPE // 2025`
- Below: `24 HOURS TO BUILD SOMETHING THAT MATTERS`
- The "24" is in Display XL (160px), Ember red color, slightly rotated (-2deg)

**Beat 2 — The Clock (600-1200px):**
- A countdown timer appears center-screen, large format: `23:59:42`
- As user scrolls, the clock ticks down rapidly (mapping scroll to time elapsed)
- Around the clock, code snippets and UI wireframes fly in from edges, assembling themselves
- Snippets are real code from Pitchr: a React component, a Supabase query, a prompt template
- The background shifts from dark to a warm amber glow (the intensity rising)

**Beat 3 — The Pipeline (1200-1800px):**
- The Pitchr architecture reveals itself as a horizontal flow diagram:
  `Speech-to-Text --> Transcript --> Rubric Scoring --> LLM Feedback --> Voice Agent Q&A`
- Each node lights up sequentially as user scrolls
- Below each node, a technical detail in JetBrains Mono: the actual tech used (Whisper, GPT-4, etc.)

**Beat 4 — The Demo (1800-2400px):**
- Text: *"And then, we showed them."*
- The actual Pitchr demo video embeds center-screen in a 16:9 frame with a subtle drop shadow and film-strip border
- Video has custom play controls styled to match the site (amber accent, minimal)
- Below the video: `WINNER // HACKEUROPE PARIS`
- Confetti? No. A single, slow camera flash effect (white overlay at 8% opacity, 200ms fade-in, 800ms fade-out)

**Beat 5 — The Takeaway (2400-3000px):**
- Quote in Playfair Italic: *"24 hours taught me more about shipping than 24 months of theory."*
- Tech stack listed cinematically, each item fading up one by one: `React` `Next.js` `Supabase` `OpenAI` `ElevenLabs`
- Transition: scene dims, a horizontal wipe reveals Scene 4

### Scene 4: "The Pipeline" (Stacklink — Chapter 2)
**Scroll distance:** 2500px of vertical scroll
**Content:**

**The RAG Flow Animation (the centerpiece of this scene):**
This is a fully animated, scroll-driven data flow visualization. The entire pipeline is laid out horizontally within the scene panel. As the user scrolls, data moves through the pipeline left-to-right.

**Stage 1 — Ingest (0-500px):**
- Document icons (Google Drive files) float in from the left edge
- They're recognizable: a PDF, a Sheets file, a Docs file
- Each has a subtle glow and trails light as it moves
- Label: `INGEST // Google Drive API`

**Stage 2 — Chunk (500-1000px):**
- Documents hit a vertical "blade" (a thin amber line) and split into smaller rectangles
- The chunks scatter slightly, then reorganize into neat rows
- Label: `SEMANTIC CHUNKING // Overlap: 200 tokens`

**Stage 3 — Embed (1000-1500px):**
- Chunks transform into dots (embeddings) that scatter into a 3D-like point cloud
- The point cloud slowly rotates (CSS 3D transform, parallax-simulated depth)
- Similar chunks cluster together (color-coded by topic)
- Label: `EMBEDDINGS // OpenAI ada-002`

**Stage 4 — Retrieve (1500-2000px):**
- A search query appears at top: `"What was our Q3 revenue?"`
- A "beam" shoots from the query into the point cloud, illuminating the nearest neighbors
- Irrelevant dots fade to 5% opacity; relevant dots pulse amber
- Label: `HYBRID RETRIEVAL // pgvector + BM25`
- Sub-label: `RECIPROCAL RANK FUSION`

**Stage 5 — Answer (2000-2500px):**
- Retrieved chunks flow into a "lens" (circular element) that focuses them
- Out the other side, formatted text appears, typed out character by character
- The answer is clean, cited, accurate
- Label: `LLM SYNTHESIS // GPT-4`
- Below: `stacklink.nl` in Inter 600, Steel blue, underlined

### Scene 5: "The Teacher" (Workshops — Chapter 3)
**Scroll distance:** 1500px of vertical scroll
**Content:**
- Lighter scene. The background shifts to Charcoal (`#1C1C1F`) instead of Void
- Title: `CH.03 // THE WORKSHOPS`
- A brief narrative: *"I realized the best way to understand AI was to teach it."*
- Three workshop "posters" arranged in perspective (CSS 3D perspective, rotateY), as if pinned on a wall
- Each poster tilts slightly as the scroll progresses (subtle parallax rotation)
- Content on each poster: workshop title, audience (business type), key outcome
- Below: a pull-quote from a participant (if available) or a description of the approach
- Transition: posters recede into darkness, Scene 6 emerges

### Scene 6: "The Thinker" (Philosophy)
**Scroll distance:** 2000px of vertical scroll
**Content:**
- The most atmospheric scene. Minimal content, maximum mood.
- Background: a very slow-moving abstract gradient (dark blues and ambers, 60s loop, CSS animated)
- Large text, centered, revealed line by line as user scrolls:
  - *"AI is not the product."*
  - *"It's the material."*
  - *"The question is: what are you building with it?"*
- Each line appears with 400ms stagger, Playfair Display Italic, `clamp(32px, 4vw, 72px)`
- After the quote, Lucas's current context:
  - `AI Intern @ cape.io` -- learning agent integration
  - `Head of Ops @ Amplifirm` -- scaling human systems
  - `CS & Engineering @ TU Eindhoven` -- graduating May 2027
- Each role card slides in from the right with a 200ms stagger
- Visual thread: a faint dotted line connecting `Veldhoven --> Eindhoven --> Paris --> London` plotted on a minimal map outline at 5% opacity in the background

### Scene 7: "The Numbers" (Impact Metrics)
**Scroll distance:** 1800px of vertical scroll
**Content:**
- Dark background returns to Void (`#0A0A0B`)
- Title: `THE IMPACT` in Inter 700, all caps, wide letter-spacing (`0.3em`)
- Four large metric blocks, each revealed sequentially:

```
+40%                     +60%                    +35%                    24h
CLOSING RATE             OUTREACH EXPANSION      REVENUE INCREASE        HACKATHON TO WINNER
Amplifirm                Amplifirm               Amplifirm               HackEurope Paris
```

- Each number uses Inter 700 at Display size, Sage green for the percentage, Amber for "24h"
- Numbers count up from 0 as they enter the viewport (scroll-driven, not time-driven)
- Below each number: context in Caption size, Smoke color
- After the metrics, a horizontal bar chart or timeline showing Lucas's journey:
  `2023 --> Amplifirm // 2024 --> Stacklink // 2025 --> HackEurope, cape.io, Workshops`

### Scene 8: "Credits" (Contact + Closing)
**Scroll distance:** 2000px of vertical scroll
**Content:**
- Styled exactly like movie end credits
- The horizontal scroll stops. Content scrolls VERTICALLY within this final panel (a deliberate shift -- the film is over, now you're reading credits)
- Content rolls upward, slow, centered:

```
A FILM BY
LUCAS DUYS

STARRING
React // Next.js // TypeScript // Tailwind CSS
Node.js // Supabase // OpenAI // LangChain

SHOT ON LOCATION IN
Veldhoven // Eindhoven // Paris // London

PRODUCED WITH
GSAP // ScrollTrigger // Framer Motion // Vercel

---

GET IN TOUCH

lucas@email.com
github.com/lucasduys
linkedin.com/in/lucasduys

---

"Thanks for watching."
```

- Each section fades up as it enters the center of the panel
- Contact links are interactive (hover: amber underline, Steel blue on focus)
- After the last line, a subtle callback: the "scroll to play" prompt from Scene 1 reappears, but now it says `scroll to replay` -- clicking it smooth-scrolls back to the top

---

## 5. Scroll Mechanics

### The Core Technique: GSAP ScrollTrigger Horizontal Pin

The entire experience is one horizontally-scrolling container, pinned in place, driven by vertical scroll input.

```
Total horizontal width:  800vw (8 scenes x 100vw)
Total vertical scroll:   16,300px (sum of all scene scroll distances)

Scene scroll distances:
  Scene 1 (Opening):     1,500px
  Scene 2 (Builder):     2,000px
  Scene 3 (Hackathon):   3,000px
  Scene 4 (RAG):         2,500px
  Scene 5 (Workshops):   1,500px
  Scene 6 (Thinker):     2,000px
  Scene 7 (Numbers):     1,800px
  Scene 8 (Credits):     2,000px
```

### GSAP Implementation

```javascript
// Master horizontal scroll
const sections = gsap.utils.toArray('.scene');
const totalWidth = sections.length * window.innerWidth;

gsap.to('.scenes-container', {
  x: () => -(totalWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.scroll-film',
    pin: true,
    scrub: 1,           // 1 second smoothing for cinematic feel
    end: () => `+=${16300}`,
    invalidateOnRefresh: true,
  }
});

// Per-scene animations use nested ScrollTriggers
// Each one uses containerAnimation to reference the master scroll
scenes.forEach((scene, i) => {
  const sceneStart = cumulativeScrollDistances[i] / 16300;
  const sceneEnd = cumulativeScrollDistances[i + 1] / 16300;

  ScrollTrigger.create({
    trigger: scene,
    containerAnimation: masterTween,
    start: 'left center',
    end: 'right center',
    onEnter: () => activateScene(i),
    onLeaveBack: () => deactivateScene(i),
  });
});
```

### Scrub Value: `1`
A scrub value of `1` means 1 second of easing between the scroll position and the animation position. This creates the cinematic "weight" -- the horizontal movement doesn't snap instantly but glides. Higher values (like `2`) would feel sluggish; `0.5` would feel too responsive and lose the filmic quality.

### Progress Indicator
A thin (2px) horizontal progress bar fixed at the very bottom of the viewport.

```
Position:    fixed, bottom: 0, left: 0
Track:       100vw wide, 2px tall, Amber Low (#D4A85340)
Fill:        height 2px, Amber (#D4A853), width = scrollProgress * 100%
Scene marks: 8 small tick marks on the track at each scene boundary (1px wide, 6px tall, Smoke color)
Label:       Current scene name appears above the progress bar in Micro size (12px), Inter 300, Smoke
             Positioned at the fill's leading edge
             Transitions between scene names with 200ms crossfade
```

The progress bar is scroll-driven (no JS animation needed -- pure CSS with scroll-timeline or GSAP-updated CSS custom property).

---

## 6. Scene Transitions

Each scene boundary has a specific transition. No two transitions are the same.

| Transition          | From --> To             | Type                     | Duration (scroll-px) | Details |
|---------------------|--------------------------|--------------------------|----------------------|---------|
| T1: Fade In         | Nothing --> Scene 1      | Opacity 0 to 1           | 300px                | Pure black to content. `ease: power2.out` |
| T2: Push Zoom       | Scene 1 --> Scene 2      | Scale 1.0 to 0.95 + fade | 400px                | Scene 1 slightly shrinks as Scene 2 slides in. Gives depth. |
| T3: Card Zoom       | Scene 2 --> Scene 3      | Scale up project card     | 500px                | The Pitchr card from Scene 2 scales from its position to fill the screen. `ease: power3.inOut` |
| T4: Horizontal Wipe | Scene 3 --> Scene 4      | Clip-path wipe left       | 300px                | `clip-path: inset(0 X% 0 0)` where X animates 100 to 0. Amber-tinted leading edge. |
| T5: Crossfade       | Scene 4 --> Scene 5      | Opacity crossfade         | 400px                | Both scenes visible simultaneously for 400px. Scene 4 fades out, Scene 5 fades in. |
| T6: Depth Push      | Scene 5 --> Scene 6      | Z-axis push               | 500px                | Scene 5 moves "into" the screen (scale down + blur increase). Scene 6 emerges from behind. |
| T7: Hard Cut        | Scene 6 --> Scene 7      | Instant switch            | 50px                 | A deliberate hard cut. Jarring. Like a documentary switching to data. 1-frame black flash. |
| T8: Scroll Shift    | Scene 7 --> Scene 8      | Horizontal stops, vertical begins | 300px       | The pinning releases. Content begins vertical scroll. A clear "the film is ending" signal. |

### Transition Implementation (GSAP)

```javascript
// Example: T4 Horizontal Wipe (Scene 3 to Scene 4)
gsap.fromTo('.scene-4',
  { clipPath: 'inset(0 100% 0 0)' },
  {
    clipPath: 'inset(0 0% 0 0)',
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.scene-4',
      containerAnimation: masterTween,
      start: 'left-=300 center',
      end: 'left center',
      scrub: true,
    }
  }
);

// Example: T7 Hard Cut (flash of black)
gsap.timeline({
  scrollTrigger: {
    trigger: '.scene-7',
    containerAnimation: masterTween,
    start: 'left-=50 center',
    end: 'left center',
    scrub: true,
  }
})
.to('.flash-overlay', { opacity: 1, duration: 0.3 })
.to('.flash-overlay', { opacity: 0, duration: 0.7 });
```

---

## 7. The Hackathon Scene (Scene 3) — Deep Dive

This is the emotional climax of the film. It should feel *intense*.

### Visual Language
- Color temperature shifts warmer as the scene progresses (background goes from `#0A0A0B` to `#1A1008` -- barely perceptible but felt)
- The ambient grain texture increases from 3% to 6% opacity (more "raw footage" feeling)
- A subtle vignette tightens (the edges get darker, focusing attention to center)

### The Countdown Clock

```
Font:       Inter 700
Size:       clamp(48px, 6vw, 120px)
Color:      Ember (#C44B3F)
Format:     HH:MM:SS
Behavior:   Driven by scroll position within Scene 3
            At beat start (600px into scene): 24:00:00
            At beat end (1200px into scene): 00:00:00
            Maps linearly: every 1px scroll = 24*60*60/600 = 144 seconds off the clock
            Numbers use tabular-nums (monospace digits) so they don't shift layout
Shadow:     0 0 40px rgba(196, 75, 63, 0.3) — a red glow behind the numbers
```

### Code Snippet Fly-Ins

During Beat 2 (600-1200px), 6 code snippets enter from random edges and settle into a loose grid:

```
Snippet 1: A React component header (<PitchFeedback />)
Snippet 2: A Supabase insert query
Snippet 3: An OpenAI API call
Snippet 4: A WebSocket connection setup
Snippet 5: A scoring rubric JSON object
Snippet 6: A voice agent prompt template
```

Each snippet:
- Enters with `ease: back.out(1.7)` (slight overshoot, then settle)
- Has a subtle `rotate` on entry (random between -5deg and 5deg), settling to 0
- Uses JetBrains Mono, 14px, with syntax highlighting (VS Code dark theme colors)
- Background: `rgba(20, 20, 22, 0.9)` with 1px border in `#2A2A2F`
- Max width: 300px, truncated with ellipsis if needed
- Stagger: 100ms between each snippet's entrance

### Demo Video Embed

```
Container:  max-width: 800px, centered, 16:9 aspect ratio
Border:     2px solid #2A2A2F with a film-strip pattern on left and right edges
            (alternating 8px dark/light rectangles, like 35mm film perforations)
Shadow:     0 20px 60px rgba(0,0,0,0.5)
Controls:   Custom play button (amber triangle), progress bar (amber), time display (Inter 300)
            Muted by default. Unmute icon visible.
Poster:     A still frame from the demo, slightly desaturated, with a large play triangle overlay
Entry anim: Scale from 0.8 to 1.0, opacity 0 to 1, ease: power2.out, over 400px of scroll
```

### "WINNER" Reveal

After the video (scroll position 2200-2400px):
- Flash effect: `.flash-overlay` goes from `opacity: 0` to `opacity: 0.08` to `opacity: 0` over 200px of scroll
- Text `WINNER` appears in Playfair Display 900, Display size, Amber color
- Below it: `HACKEUROPE PARIS` in Inter 300, Caption size, Smoke color, letter-spacing 0.4em
- Both elements fade up with `ease: power2.out`

---

## 8. The RAG Scene (Scene 4) — Deep Dive

This scene is a technical showpiece. The animation should make a complex system feel intuitive.

### Layout

The entire pipeline is arranged left-to-right within the 100vw panel. The panel itself has internal horizontal arrangement, but it all moves with the master horizontal scroll.

```
|  INGEST  |  CHUNK  |  EMBED  |  RETRIEVE  |  ANSWER  |
|  ~20vw   |  ~20vw  |  ~20vw  |   ~20vw    |  ~20vw   |
```

Each stage occupies roughly 500px of vertical scroll distance.

### Stage Visual Specifications

**Documents (Ingest):**
- 5 document icons, each 60x80px
- Styled as simplified file icons with Google Drive colors (blue for Docs, green for Sheets, red for Slides)
- Enter from left with `ease: power2.out`, staggered 80ms
- Trail: a 200px horizontal line in `rgba(212, 168, 83, 0.15)` that fades behind each document as it moves

**Chunking Blade:**
- A vertical line, 2px wide, `#D4A853`, full viewport height
- Slight glow: `box-shadow: 0 0 20px rgba(212, 168, 83, 0.3)`
- When documents cross the blade, they split (clip-path animation) into 3-4 smaller rectangles
- Splitting animation: `ease: power1.out`, 200ms per document

**Embedding Point Cloud:**
- 40-60 dots (circles, 4-8px diameter)
- Initial state: arranged in rows (from chunking)
- End state: scattered in a 2D cloud with slight perspective rotation (CSS `transform: perspective(800px) rotateY(15deg) rotateX(-5deg)`)
- Color-coded by simulated topic: 3 colors (muted amber, muted steel, muted sage) at 60% opacity
- Transition: dots move from grid to cloud positions over 400px of scroll. `ease: power3.inOut`
- Ambient animation: dots have a very subtle float (2px random movement, 3s loop, CSS keyframes)

**Retrieval Beam:**
- A search query types out at top: `"What was our Q3 revenue?"` in Playfair Italic, Body Large
- After typing completes (200px scroll), a conical "beam" (SVG or CSS gradient) extends from the query down into the point cloud
- The beam is a gradient: `rgba(212, 168, 83, 0.1)` at edges to `rgba(212, 168, 83, 0.3)` at center
- Relevant dots (5-6 of them) pulse to full Amber, scale up to 12px
- Irrelevant dots fade to 5% opacity over 100px scroll
- Labels appear near relevant dots: `chunk_42`, `chunk_17`, etc. in JetBrains Mono 11px

**Answer Synthesis:**
- A circular "lens" element, 120px diameter, Steel blue border (1px), center of the stage area
- Retrieved dots flow into the lens (animate x/y to lens center, then opacity 0)
- Out the right side of the lens, text appears, typed out:
  *"Based on the Q3 financial report, total revenue was EUR 2.4M, representing a 35% increase over Q2..."*
- Text in Inter 400, Body size, Bone color
- Typing speed: 1 character per 3px of scroll

---

## 9. Animations & Interactions — Complete Specification

### 9.1 Horizontal Scroll Pinning

```javascript
// GSAP ScrollTrigger configuration
gsap.registerPlugin(ScrollTrigger);

const scrollFilm = document.querySelector('.scroll-film');
const scenesContainer = document.querySelector('.scenes-container');
const scenes = gsap.utils.toArray('.scene');

// Calculate total scroll distance from scene durations
const sceneScrollDistances = [1500, 2000, 3000, 2500, 1500, 2000, 1800, 2000];
const totalScrollDistance = sceneScrollDistances.reduce((a, b) => a + b, 0); // 16300

const masterTween = gsap.to(scenesContainer, {
  x: () => -(scenesContainer.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: scrollFilm,
    pin: true,
    anticipatePin: 1,     // Prevents jump on pin
    scrub: 1,             // 1s smoothing
    end: () => `+=${totalScrollDistance}`,
    invalidateOnRefresh: true,
    fastScrollEnd: true,  // Better handling of fast scrolls
  }
});
```

### 9.2 Parallax Depth Layers

Each scene has 3 depth layers with different scroll speeds relative to the master horizontal scroll:

```
Layer          | Speed Multiplier | Usage                        | z-index
Background     | 0.3x             | Textures, maps, gradients    | 1
Midground      | 1.0x             | Primary content              | 2
Foreground     | 1.4x             | Overlay text, floating elements | 3
```

Implementation:
```javascript
// Within each scene, elements with data-depth attributes
scenes.forEach(scene => {
  const bgElements = scene.querySelectorAll('[data-depth="bg"]');
  const fgElements = scene.querySelectorAll('[data-depth="fg"]');

  gsap.to(bgElements, {
    x: () => window.innerWidth * 0.3,  // Moves slower (appears further)
    ease: 'none',
    scrollTrigger: {
      trigger: scene,
      containerAnimation: masterTween,
      start: 'left right',
      end: 'right left',
      scrub: true,
    }
  });

  gsap.to(fgElements, {
    x: () => -window.innerWidth * 0.15, // Moves faster (appears closer)
    ease: 'none',
    scrollTrigger: {
      trigger: scene,
      containerAnimation: masterTween,
      start: 'left right',
      end: 'right left',
      scrub: true,
    }
  });
});
```

### 9.3 Text Reveal Animations

**Cinematic Title Cards (Scene Titles):**
```javascript
// Each title uses SplitType for character-level control
const title = new SplitType('.scene-title', { types: 'chars' });

gsap.from(title.chars, {
  opacity: 0,
  y: 20,
  letterSpacing: '0.2em',   // Extra spacing that contracts
  stagger: 0.03,             // 30ms between each character
  duration: 1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.scene-title',
    containerAnimation: masterTween,
    start: 'left 70%',       // Triggers when title is 70% from the left
    toggleActions: 'play none none reverse',
  }
});
```

**Narrative Text (Body Text Blocks):**
```javascript
// Lines fade up sequentially
gsap.from('.narrative-line', {
  opacity: 0,
  y: 30,
  stagger: 0.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.narrative-block',
    containerAnimation: masterTween,
    start: 'left 60%',
    end: 'left 30%',
    scrub: true,
  }
});
```

**The Typewriter Effect (for quotes and the RAG query):**
```javascript
// CSS approach for typewriter
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #D4A853;
  animation: blink-caret 0.75s step-end infinite;
}

// GSAP scroll-driven width reveal
gsap.fromTo('.typewriter',
  { width: 0 },
  {
    width: 'auto',
    ease: 'steps(40)',  // Step function for character-by-character feel
    scrollTrigger: {
      trigger: '.typewriter',
      containerAnimation: masterTween,
      start: 'left 60%',
      end: 'left 30%',
      scrub: true,
    }
  }
);
```

### 9.4 Image/Video Reveals

**Clip-Path Wipe (for project screenshots):**
```javascript
gsap.from('.project-image', {
  clipPath: 'inset(0 100% 0 0)',  // Fully clipped from right
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '.project-image',
    containerAnimation: masterTween,
    start: 'left 70%',
    end: 'left 40%',
    scrub: true,
  }
});
```

**Scale Reveal (for the demo video):**
```javascript
gsap.from('.video-container', {
  scale: 0.8,
  opacity: 0,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.video-container',
    containerAnimation: masterTween,
    start: 'left 65%',
    end: 'left 45%',
    scrub: true,
  }
});
```

### 9.5 Progress Bar

```css
.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(212, 168, 83, 0.25);
  z-index: 100;
  pointer-events: none;
}

.progress-bar__fill {
  height: 100%;
  width: 0%;
  background: #D4A853;
  transition: none; /* GSAP handles this */
}

.progress-bar__label {
  position: fixed;
  bottom: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #8A8A8F;
  transition: opacity 0.2s;
}

/* Scene tick marks */
.progress-bar__tick {
  position: absolute;
  width: 1px;
  height: 6px;
  background: #8A8A8F;
  bottom: 0;
}
```

```javascript
// Update progress bar with scroll
ScrollTrigger.create({
  trigger: '.scroll-film',
  start: 'top top',
  end: `+=${totalScrollDistance}`,
  onUpdate: (self) => {
    gsap.set('.progress-bar__fill', { width: `${self.progress * 100}%` });
    gsap.set('.progress-bar__label', { left: `${self.progress * 100}%` });
    // Update label text based on which scene we're in
    updateSceneLabel(self.progress);
  }
});
```

### 9.6 Ambient Background Effects

**Film Grain:**
```css
.grain-overlay {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: url('/textures/grain-512.png');
  background-repeat: repeat;
  opacity: 0.035;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 9999;
  animation: grain-shift 100ms steps(3) infinite;
}

@keyframes grain-shift {
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(-2%, -3%); }
  66%  { transform: translate(3%, 1%); }
  100% { transform: translate(0, 0); }
}
```

**Vignette:**
```css
.vignette {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
  z-index: 9998;
}
```

### 9.7 Sound Design (Optional)

```javascript
// Ambient audio manager
class AmbientAudio {
  constructor() {
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15; // Very quiet
    this.masterGain.connect(this.ctx.destination);
    this.muted = true; // Start muted, user opts in
  }

  // Low ambient drone that evolves with scroll position
  playAmbient() {
    // A warm, low-frequency pad (C2, ~65Hz)
    // Changes timbre based on scroll progress
    // Scene 3 (hackathon): adds tension (minor second interval)
    // Scene 6 (thinker): opens up (major seventh)
    // Scene 8 (credits): resolves to root
  }
}
```

**Mute Toggle:**
```
Position:   fixed, top: 24px, right: 24px
Icon:       Minimal speaker icon, 16px, Smoke color
Active:     Amber color with 2 sound waves
Hover:      opacity 0.6 to 1.0
z-index:    100
```

### 9.8 Scene-Specific Animation Summary

| Scene | Key Animation                        | Easing              | Trigger      |
|-------|--------------------------------------|----------------------|--------------|
| 1     | Name letter-by-letter reveal         | `power2.out`         | Scroll 0-300 |
| 1     | Subtitle typewriter                  | `steps(N)`           | Scroll 300-600 |
| 2     | Project cards float in (staggered)   | `back.out(1.4)`      | Scene enter  |
| 3     | Countdown clock tick                 | `none` (linear)      | Scrub        |
| 3     | Code snippets fly-in                 | `back.out(1.7)`      | Scrub        |
| 3     | Pipeline nodes illuminate            | `power1.inOut`       | Scrub        |
| 3     | Video scale-in                       | `power2.out`         | Scrub        |
| 3     | Winner flash                         | `power3.out`         | Scrub        |
| 4     | Documents enter                      | `power2.out`         | Scrub        |
| 4     | Chunking split                       | `power1.out`         | Scrub        |
| 4     | Dots scatter to cloud                | `power3.inOut`       | Scrub        |
| 4     | Retrieval beam extend                | `power2.inOut`       | Scrub        |
| 4     | Answer typewriter                    | `steps(N)`           | Scrub        |
| 5     | Workshop posters perspective         | `power2.out`         | Scrub        |
| 6     | Philosophy lines fade up             | `power2.out`         | Scrub        |
| 6     | Role cards slide in                  | `power2.out`         | Scrub 200ms stagger |
| 7     | Numbers count up                     | `power1.out`         | Scrub        |
| 8     | Credits vertical scroll              | `none` (linear)      | Scrub        |

### 9.9 Custom Cursor

```css
/* Hide default cursor on desktop */
@media (hover: hover) {
  * { cursor: none !important; }

  .custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(212, 168, 83, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.15s ease-out, border-color 0.2s;
    /* Small dot in center */
  }

  .custom-cursor::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3px;
    height: 3px;
    background: #D4A853;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  /* Expand on hoverable elements */
  a:hover ~ .custom-cursor,
  button:hover ~ .custom-cursor {
    transform: scale(2);
    border-color: #D4A853;
  }
}
```

GSAP-smoothed cursor position (follows mouse with slight delay for cinematic feel):
```javascript
const cursor = document.querySelector('.custom-cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

gsap.ticker.add(() => {
  gsap.to(cursor, {
    x: mouseX - 10,
    y: mouseY - 10,
    duration: 0.15,
    ease: 'power2.out',
  });
});
```

---

## 10. Personal Touches

### "24 HOURS" Display Text
- Appears at the start of Scene 3, Beat 1
- Playfair Display 900, Display XL size: `clamp(80px, 12vw, 200px)`
- Ember red (`#C44B3F`)
- Rotation: `-2deg`
- Entry: Scale from 3.0 to 1.0, opacity 0 to 1, `ease: power3.out`, over 200px scroll
- A subtle pulsing glow behind the text: `text-shadow: 0 0 80px rgba(196, 75, 63, 0.4)`
- After 400px of scroll, it fades to 10% opacity and moves to background layer, becoming atmospheric

### Code Snippets in Build Scenes
Real code from Lucas's projects, not placeholder. Snippets should be:
- Actual React JSX from Pitchr
- Actual Supabase queries
- Actual LangChain pipeline code from Stacklink

They appear by flying in from random edges (top, right, bottom -- never left, since that's where we came from). Entry vectors are randomized but always settle into a loose grid. They create the sense of "building in real-time."

### Geography Thread
A subtle dotted path connecting locations appears across multiple scenes as a background element:

```
Scene 1:  Eindhoven dot glows (it's where the story starts)
Scene 3:  Paris dot glows (HackEurope)
Scene 6:  London dot appears (Amplifirm), Eindhoven still present (TU/e)
Scene 8:  Full path visible: Veldhoven -> Eindhoven -> Paris -> London
```

The path is drawn with SVG, using `stroke-dasharray` and `stroke-dashoffset` animated by scroll. The line is 1px, Smoke color, with dots at each city that glow Amber when active.

```javascript
// Geography path reveal
gsap.to('.geo-path', {
  strokeDashoffset: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.scroll-film',
    start: 'top top',
    end: `+=${totalScrollDistance}`,
    scrub: true,
  }
});
```

### Film Credits
The credits in Scene 8 are styled with exact film credit typography:
- Role labels: Inter 300, 14px, Smoke, letter-spacing `0.3em`, uppercase
- Names/values: Playfair Display 400, 28px, Bone
- Spacing: 80px between credit blocks
- Scroll speed: credits move at roughly 30px per 100px of scroll (slow, readable)
- A thin horizontal rule (1px, `#2A2A2F`) separates the credits from the contact section
- The final "Thanks for watching." is in Playfair Display Italic, 20px, with a period (deliberate, final)

---

## 11. Tech Stack

### Core
| Technology              | Purpose                                    |
|--------------------------|---------------------------------------------|
| **Next.js 14+ (App Router)** | Framework, SSR for SEO, route handling   |
| **TypeScript**           | Type safety across components              |
| **Tailwind CSS**         | Utility-first styling, responsive           |
| **GSAP + ScrollTrigger** | Master horizontal scroll, all scroll-driven animations |
| **SplitType**            | Text splitting for character/word-level animation |

### Animation Layer
| Technology              | Purpose                                    |
|--------------------------|---------------------------------------------|
| **GSAP ScrollTrigger**   | Pinning, scrubbing, containerAnimation     |
| **GSAP core**            | Tweens, timelines, easing                  |
| **CSS keyframes**        | Ambient loops (grain, cursor blink, dot float) |
| **SVG animations**       | Geography path, RAG pipeline flow          |

### Assets & Media
| Technology              | Purpose                                    |
|--------------------------|---------------------------------------------|
| **next/image**           | Optimized image loading, AVIF/WebP         |
| **Cloudinary or Vercel Blob** | Video hosting for Pitchr demo          |
| **Custom font loading**  | `next/font` for Playfair Display + Inter, self-hosted JetBrains Mono |

### Deployment
| Technology              | Purpose                                    |
|--------------------------|---------------------------------------------|
| **Vercel**               | Hosting, edge functions, analytics         |
| **Vercel Analytics**     | Performance monitoring, Core Web Vitals    |
| **Vercel Speed Insights**| Real user metrics                          |

### Optional Enhancements
| Technology              | Purpose                                    |
|--------------------------|---------------------------------------------|
| **Lenis**                | Smooth scroll normalization (works with GSAP) |
| **Framer Motion**        | React-native animation API for UI elements (modals, hover states) |
| **Tone.js**              | Web Audio API abstraction for ambient sound |
| **Theatre.js**           | Visual animation editor for fine-tuning complex sequences |

---

## 12. Mobile Adaptation

### Strategy: Vertical with Scene Snapping

On screens below `768px`, the horizontal scroll paradigm breaks (no horizontal gesture affordance, smaller viewport makes horizontal panels feel cramped). The adaptation:

**The horizontal film becomes a vertical reel.**

```
Desktop (>= 768px):  Horizontal scroll, pinned, full cinematic experience
Mobile (< 768px):    Vertical scroll, scene-by-scene snap, simplified animations
```

### Mobile Specifics

**Layout:**
- Each scene is a full-viewport-height panel (100svh -- using small viewport height for mobile browser chrome)
- `scroll-snap-type: y mandatory` for scene-by-scene snapping
- Each scene: `scroll-snap-align: start`

**Typography:**
- Display XL drops to `clamp(40px, 10vw, 64px)`
- Body Large drops to 16px
- Caption stays 14px

**Animations:**
- Parallax: disabled entirely (performance + disorienting on mobile)
- Code snippets in hackathon scene: reduced from 6 to 3, no fly-in animation (fade only)
- RAG pipeline: simplified to a vertical flow (top-to-bottom instead of left-to-right), fewer dots (20 instead of 60)
- Custom cursor: disabled (touch devices)
- Film grain: disabled (GPU cost)
- Vignette: kept but lighter (0.2 opacity instead of 0.4)

**Progress Indicator:**
- Moves from bottom horizontal bar to a right-edge vertical bar
- Same 2px width, same amber fill
- Tick marks become dots along the right edge

**Scene 8 (Credits):**
- Already vertical, so no adaptation needed
- Contact links get larger tap targets (48px minimum)

**Video (Scene 3):**
- Full-width embed
- Autoplay disabled (mobile browsers block it anyway)
- Prominent play button with larger hit area

**Navigation Addition (Mobile Only):**
- Subtle scene indicator dots on the right edge (like iOS page dots)
- Tapping a dot scrolls to that scene
- Current scene dot is Amber, others are Smoke at 40% opacity

---

## 13. Performance Optimization

### Critical Rendering Path

**Font Loading:**
```javascript
// next/font preloads and self-hosts
import { Playfair_Display } from 'next/font/google';
import { Inter } from 'next/font/google';
// JetBrains Mono loaded only for scenes that use it (3, 4)
// Use font-display: swap to prevent FOIT
```

**Image Strategy:**
- All images use `next/image` with `priority` on Scene 1 content only
- Scenes 2-8 images use `loading="lazy"` with generous `rootMargin` in IntersectionObserver (load 2 scenes ahead)
- Format: AVIF with WebP fallback
- Sizes: generate 640, 960, 1280, 1920 variants

**Video Loading:**
- Pitchr demo video does NOT autoplay
- Video `preload="metadata"` (loads first frame and duration, not full video)
- When Scene 3 is within 1 scene of viewport, switch to `preload="auto"`
- Use `<source>` with WebM (VP9) primary, MP4 (H.264) fallback
- Target: 1080p max, 4-6 Mbps bitrate

### Scroll Performance

**GSAP Best Practices:**
```javascript
// Use will-change only on actively animating elements
// Apply via GSAP's onStart/onComplete callbacks
ScrollTrigger.create({
  onToggle: (self) => {
    if (self.isActive) {
      self.trigger.style.willChange = 'transform';
    } else {
      self.trigger.style.willChange = 'auto'; // Clean up
    }
  }
});

// Use transform3d for GPU compositing (GSAP does this by default)
// Avoid animating properties that trigger layout (width, height, top, left)
// Stick to: transform, opacity, clip-path
```

**Layer Management:**
- Only the visible scene + 1 scene on each side are fully rendered
- Off-screen scenes have `visibility: hidden` (removes from paint but keeps in layout)
- The grain overlay uses a TINY texture (512x512) repeated, not a full-screen noise canvas

**Paint Reduction:**
```css
/* Isolate frequently-changing layers */
.scene { contain: layout style paint; }
.grain-overlay { contain: strict; }
.progress-bar { contain: layout style; }
```

**Scroll Jank Prevention:**
- `scrub: 1` (not `scrub: true`) adds smoothing that masks minor frame drops
- `fastScrollEnd: true` prevents ScrollTrigger from overcompensating on fast scrolls
- `anticipatePin: 1` prevents the "jump" when pinning begins
- Use `Lenis` for scroll normalization (consistent scroll deltas across browsers/trackpads/mice)

```javascript
// Lenis + GSAP integration
const lenis = new Lenis({
  lerp: 0.1,           // Smoothing factor
  smoothWheel: true,
  wheelMultiplier: 0.8, // Slightly slow down wheel (cinematic pacing)
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0); // Prevent GSAP from compensating for lag
```

### Performance Budget

| Metric                  | Target        |
|--------------------------|---------------|
| First Contentful Paint   | < 1.2s        |
| Largest Contentful Paint | < 2.5s        |
| Total Blocking Time      | < 200ms       |
| Cumulative Layout Shift  | < 0.1         |
| Scroll FPS (desktop)     | 55+ fps       |
| Scroll FPS (mobile)      | 50+ fps       |
| Total JS bundle          | < 150KB gzip  |
| Total page weight        | < 3MB (excl. video) |

### Monitoring

```javascript
// Report scroll performance in development
if (process.env.NODE_ENV === 'development') {
  let frames = 0;
  let lastTime = performance.now();

  function measureFPS() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      console.log(`Scroll FPS: ${frames}`);
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(measureFPS);
  }
  requestAnimationFrame(measureFPS);
}
```

---

## 14. What Makes This Concept Unique

### No developer portfolio does this.

The personal portfolio space for developers is saturated with:
1. **The Grid** -- projects in cards, hover effects, done.
2. **The Minimal** -- white space, Helvetica, "less is more" to the point of "nothing is here."
3. **The 3D Flex** -- Three.js scene that loads for 8 seconds and then shows... a grid of projects.
4. **The Terminal** -- CLI aesthetic that was novel in 2019.

Nobody treats the portfolio as a **film**. Nobody uses scroll as a **playhead**. Nobody tells a **story** with cinematic grammar: establishing shots, close-ups, montage sequences, resolution.

### Why this works for Lucas specifically:

1. **He has a story to tell.** A hackathon win in 24 hours. A RAG system that demonstrates deep technical thinking. A trajectory from Veldhoven to international impact. This is not a list of skills -- it is a narrative.

2. **The scroll-as-film metaphor matches his work.** Lucas builds things that transform inputs into outputs (speech to feedback, documents to answers). The scroll film transforms scroll input into visual narrative. The medium IS the message.

3. **It demonstrates craft at the medium level.** Any developer can show React on their resume. Building a scroll-driven cinematic experience with GSAP ScrollTrigger, performant parallax, and scene-specific animations SHOWS mastery of frontend engineering without saying it.

4. **It is memorable.** A recruiter or collaborator who visits this site will remember it. Not because it's flashy, but because it told them a story. People remember stories. They forget grids.

5. **It is award-worthy.** This concept, executed well, is an Awwwards Site of the Day candidate. The technical execution (scroll-driven horizontal narrative, containerAnimation-based parallax, performant cinematic transitions) combined with the narrative design (scenes, transitions, pacing) is at the level of top agency work -- built by one person.

### The risk and how to mitigate it:

**Risk:** Complexity leads to bugs, performance issues, or an overwhelming experience.
**Mitigation:**
- Progressive enhancement: the site works as a simple vertical scroll with no JS (all content is in the DOM in reading order)
- Scene-by-scene development: build Scene 1 first, get it perfect, then Scene 2, etc.
- Performance testing on mid-range devices (not just M3 MacBook)
- A "skip to content" link for accessibility (screen readers get a linearized version)
- The total experience is 2-3 minutes of scrolling. Not longer. Respect the viewer's time.

**Risk:** Accessibility.
**Mitigation:**
- All content is semantic HTML underneath the visual layer
- `prefers-reduced-motion` media query disables all animation, shows a clean vertical layout
- Focus management for keyboard navigation (Tab moves between interactive elements within the current scene)
- `aria-live` regions announce scene transitions for screen readers
- Progress bar has `role="progressbar"` with `aria-valuenow`

```css
@media (prefers-reduced-motion: reduce) {
  .scenes-container {
    /* Disable horizontal scroll entirely */
    display: flex;
    flex-direction: column;
  }
  .scene {
    width: 100%;
    height: auto;
    min-height: 100vh;
  }
  .grain-overlay,
  .vignette,
  .custom-cursor {
    display: none;
  }
}
```

---

## Appendix A: File Structure

```
src/
  app/
    layout.tsx              # Root layout, font loading, grain + vignette overlays
    page.tsx                # Main page, ScrollFilm wrapper
    globals.css             # Tailwind base, custom properties, grain/vignette CSS
  components/
    ScrollFilm/
      ScrollFilm.tsx        # Master GSAP ScrollTrigger setup
      ProgressBar.tsx       # Fixed progress indicator
      SceneContainer.tsx    # Wrapper for each scene with parallax layers
      CustomCursor.tsx      # Custom cursor component
    scenes/
      Scene1Opening.tsx
      Scene2Builder.tsx
      Scene3Hackathon.tsx
      Scene4RAG.tsx
      Scene5Workshops.tsx
      Scene6Thinker.tsx
      Scene7Numbers.tsx
      Scene8Credits.tsx
    animations/
      useParallax.ts        # Parallax hook per-scene
      useTextReveal.ts      # SplitType + GSAP text animation hook
      useCountUp.ts         # Number counting animation hook
      useTypewriter.ts      # Typewriter effect hook
    ui/
      CodeSnippet.tsx       # Syntax-highlighted code block
      VideoPlayer.tsx       # Custom video player with themed controls
      GeoPath.tsx           # SVG geography thread
      MetricBlock.tsx       # Single metric display (number + label)
      AudioToggle.tsx       # Mute/unmute button
  lib/
    gsap-config.ts          # GSAP plugin registration, shared ScrollTrigger config
    scene-data.ts           # Scene metadata (titles, scroll distances, colors)
    sounds.ts               # Ambient audio manager (optional)
  public/
    textures/
      grain-512.png         # Film grain texture tile
    videos/
      pitchr-demo.webm      # Pitchr demo video (WebM VP9)
      pitchr-demo.mp4       # Pitchr demo video (H.264 fallback)
    fonts/
      JetBrainsMono-*.woff2 # Self-hosted JetBrains Mono
```

---

## Appendix B: Scroll Distance & Timing Cheat Sheet

```
Scene    Start (px)   End (px)    Duration (px)   % of Film
1        0            1,500       1,500            9.2%
2        1,500        3,500       2,000           12.3%
3        3,500        6,500       3,000           18.4%
4        6,500        9,000       2,500           15.3%
5        9,000       10,500       1,500            9.2%
6       10,500       12,500       2,000           12.3%
7       12,500       14,300       1,800           11.0%
8       14,300       16,300       2,000           12.3%
TOTAL    0           16,300      16,300          100.0%

At average scroll speed (~100px/s), total experience: ~2 minutes 43 seconds
```

---

## Appendix C: Easing Reference

```
power1.out     — Gentle deceleration. Data, metrics, functional reveals.
power2.out     — Standard deceleration. Most text and image reveals.
power2.inOut   — Smooth start and end. Transitions, wipes.
power3.out     — Strong deceleration. Dramatic reveals (winner flash, large text).
power3.inOut   — Heavy smoothing. Major transitions (zoom into project card).
back.out(1.4)  — Slight overshoot. Project cards, playful elements.
back.out(1.7)  — More overshoot. Code snippets flying in (energy, chaos).
none           — Linear. Countdown clock, progress bar, scrubbed animations.
steps(N)       — Stepped. Typewriter effects.
```
