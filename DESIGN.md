---
name: Lucas Duys Night Stage
description: A cinematic visual CV built from live-stage energy, public proof, and precise technical outcomes.
---

<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Lucas Duys Backstage Credential

## Overview

**Creative North Star: "Night Stage"**

The system takes its physical language from live stage shutters, night-time production graphics, and the large typographic authority of event screens. It must feel like a career entering under a lighting cue, not a themed conference website. Real photography carries atmosphere. Dates, roles, outcomes, and links carry credibility.

The world is bold but not noisy: one dominant image or fact at a time, native scrolling, and a processional rhythm that alternates dense evidence with quiet full-frame photography. Credential cues appear through cropping, bands, alignment, and typography rather than literal lanyards, QR codes, or fake tickets.

**Key Characteristics:**

- Real stage and founder photography at architectural scale
- Oversized, width-variable display typography
- Midnight navy and cold chrome fields with one hot vermilion signal color
- Chronology organized as a sequence of earned access and public proof
- One orchestrated opening establishes the world; a pinned stage-camera move hands off to scroll-timed proof without hijacking native scrolling

## Colors

The palette is a fixed cold-night world with one hot signal. Midnight navy carries the full page, cobalt-slate surfaces pace dense sections, and cold chrome keeps the CV legible. The visit does not change with the operating-system theme.

### Primary

- **Stage Vermilion** (`#FF5F3D`): active links, focus, selected chronology, and no more than one decisive element per viewport.

### Neutral

- **Midnight Canvas** (`#07111F`): the page ground and framing color around photography.
- **Cold Chrome** (`#E7EDF6`): primary copy and high-contrast figures.
- **Cobalt Slate** (`#0D1B2B`): secondary surfaces and work sections.
- **Raised Slate** (`#13263A`): hover and depth planes.
- **House Blue Gray** (`#76889F`): metadata that remains readable but recedes from the proof.

**The One Signal Rule.** Vermilion identifies the one thing to notice or act on. It never becomes decorative confetti, glow, or a multi-stop gradient.

## Typography

**Display Font:** Bricolage Grotesque at weights 600 and 800 with a sans-serif fallback

**Body Font:** Manrope with a system sans-serif fallback

**Character:** Bricolage provides the compressed and expanded forms of event lettering without needing a second decorative face. Manrope keeps the CV copy direct and highly readable.

### Hierarchy

- **Display:** wide or condensed Bricolage, heavy, tightly tracked, used for Lucas's name and major chapter titles.
- **Headline:** Bricolage at a stable width and medium-heavy weight, used for roles and milestone statements.
- **Body:** Manrope regular, generous line-height, maximum line length around 66 characters.
- **Label:** Bricolage medium in compact caps, used sparingly for dates, locations, and proof categories.
- **Figures:** tabular Manrope where possible, with the unit or context attached to every number.

**The Weight Carries Hierarchy Rule.** Type changes weight only to distinguish scale and role. It does not wobble or animate while the visitor reads.

## Layout

The page opens on the film: a 300svh section whose sticky stage holds a WebGL point field of stage dust. Scroll is the only clock. The dust gathers into three figures in sequence, the spotlight ring, the rising trajectory with vermilion milestone knots, and the LD mark, while one caption at a time states the proof in real DOM type: 2nd of 70, 500×, ~100/~10k. At rest the field neither plays nor freezes: each point drifts toward the light on its own phase and fades before it arrives. The film releases into the real stage photograph, and the film never restates below itself.

Below the film, CV chapters use a three-column ledger for period, role, and evidence. The work archive alternates description with a dominant product image, a four-image product contact sheet, and an offset two-project close. The contact close pairs the portrait photograph with the address. Mobile collapses to a strict single column; the film keeps a smaller point count and lifts the mark above its caption.

Native browser scrolling is the base; the sticky stage is honest and a flick passes it. One scroll listener writes CSS custom properties and shader uniforms; React renders nothing per frame. Section reveals use one IntersectionObserver whose hiding style engages only after an inline script confirms JavaScript. Reduced motion and no-JS both receive the complete static composition in pure CSS: the film flattens to the name and the three proof rows, and the canvas never draws.

Film engine rules: raw WebGL points, no scene-graph dependency; pixel ratio capped at 1.25; no idle clock once the visitor stops, frames drawn on demand; the canvas carries only light and dust, never words. Motion vocabulary: `--ease-stage` (0.16, 1, 0.3, 1) for arrivals, `--ease-exit` (0.4, 0, 1, 1) for departures; exits faster than entrances.

## Elevation & Depth

The system is flat by default. Depth comes from photographic foreground and background, hard overlaps, scale, and a restrained tonal step between fields. No ambient outer glow and no stack of floating glass cards. Shadows appear only when needed to separate an interactive overlay from photography.

**The Stage Depth Rule.** Images create atmosphere; interface surfaces organize it. CSS effects never compete with the light already present in the photographs.

## Shapes

The base language is sharp and cut, with near-square corners. Large photographs may use one clipped edge or notch derived from a credential, but every content container follows the same geometry. Pills are reserved for no component by default.

## Do's and Don'ts

### Do:

- **Do** lead with Lucas and his trajectory, then let projects prove the claims.
- **Do** pair every impressive number with a denominator, before-and-after state, or named event.
- **Do** use the existing photography without filters that obscure people or evidence.
- **Do** keep the site useful as a CV when motion, pointer input, or JavaScript is absent.

### Don't:

- **Don't** turn the system into a literal badge, airport, terminal, or conference simulation.
- **Don't** hide ordinary content behind scroll reveals.
- **Don't** use generic project cards for every chapter.
- **Don't** use gradients, neon glows, fake terminals, decorative status dots, or a custom cursor.
- **Don't** publish unverified stealth-startup details, invented metrics, or unsupported claims.
