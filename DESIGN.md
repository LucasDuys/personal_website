---
name: Lucas Duys Black Cut
description: A cinematic visual CV on a pure black stage: warm-white dust, Geist with mono figures, one cobalt signal, figures that part around the words.
---

<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Lucas Duys Black Cut

## Overview

**Creative North Star: "Black Cut"**

The system is a black stage under one working light: warm-white dust in darkness, engineering type, and figures of light that form, part around the words, and re-form. It must feel like an instrument reading out a record, not a themed conference website. Real photography carries atmosphere. Dates, roles, outcomes, and links carry credibility.

The world is bold but not noisy: one dominant image or fact at a time, native scrolling, and a processional rhythm that alternates dense evidence with quiet full-frame photography. Credential cues appear through cropping, bands, alignment, and typography rather than literal lanyards, QR codes, or fake tickets.

**Key Characteristics:**

- Real stage and founder photography at architectural scale
- Oversized, width-variable display typography
- Pure black ground, warm-white ink, and one cobalt signal
- Chronology organized as a sequence of earned access and public proof
- One orchestrated opening establishes the world; a pinned stage-camera move hands off to scroll-timed proof without hijacking native scrolling

## Colors

The palette is pure black with one accent used only where something must be noticed. Warm-white carries every word and the film's dust; cobalt carries kickers, caption labels, links, and the trajectory's milestone knots. The visit does not change with the operating-system theme.

### Primary

- **Cobalt** (`#5E8BFF`): active links, focus, kickers and caption labels, the film's milestone knots, and no more than one decisive element per viewport.

### Neutral

- **Black** (`#050505`): the page ground and framing color around photography.
- **Warm White** (`#F2F2EE`): primary copy, figures, and the film's dust.
- **Dim White** (`#B0B0A8`): secondary copy.
- **Stone** (`#83837B`): metadata that remains readable but recedes from the proof.

**The One Signal Rule.** Cobalt identifies the one thing to notice or act on. It never becomes decorative confetti, glow, or a multi-stop gradient.

## Typography

**Display and Body Font:** Geist Sans, self-hosted via the geist package, no font CDN

**Figures Font:** Geist Mono, for every number that carries proof

**Character:** The same two faces as the Kenward site, on purpose: one engineering voice across both properties. Display sits at weight 650, tightly tracked; figures are mono because a measurement should look like a measurement.

### Hierarchy

- **Display:** Geist Sans at 650, tightly tracked, used for Lucas's name and major chapter titles.
- **Headline:** Geist Sans semibold, used for roles and milestone statements.
- **Body:** Geist Sans regular, generous line-height, maximum line length around 66 characters.
- **Label:** Geist Sans bold in compact caps, used sparingly for dates, locations, and proof categories.
- **Figures:** Geist Mono medium, with the unit or context attached to every number.

**The Weight Carries Hierarchy Rule.** Type changes weight only to distinguish scale and role. It does not wobble or animate while the visitor reads.

## Layout

The page opens on the film: a 300svh section whose sticky stage holds a WebGL point field of stage dust. Scroll is the only clock. The dust gathers into three figures in sequence, the spotlight ring, the rising trajectory with cobalt milestone knots, and the LD mark. Each figure forms crisp, then its caption takes the centre of the frame, crowned by the organisation's mark and wordmark as the beat's one live link, and the field PARTS AROUND the words: every point inside an ellipse the size of the text block slides out to its rim, so the figure visibly re-forms around the caption instead of fading behind it. Captions fall in from above and depart downward. 2nd of 70, 500×, 1 of ~100. At rest the field neither plays nor freezes: each point drifts toward the light on its own phase and fades before it arrives. The film releases into the real stage photograph, and the film never restates below itself.

Below the film, one record carries every venture exactly once: a three-column ledger of period, role, and evidence, with each entry's product imagery embedded in its evidence column (Stacklink carries a dominant product image and a four-image contact sheet, the hackathons a two-build pair). Nothing on the page is said twice: the film owns the headline figures, the record owns the detail, and the photo bands carry only their moment. The contact close pairs the portrait photograph with the address. Mobile collapses to a strict single column; the film keeps a smaller point count, and the text-exclusion ellipse narrows with the aspect ratio.

Native browser scrolling is the base; the sticky stage is honest and a flick passes it. One scroll listener writes CSS custom properties and shader uniforms; React renders nothing per frame. Section reveals use one IntersectionObserver whose hiding style engages only after an inline script confirms JavaScript. Reduced motion and no-JS both receive the complete static composition in pure CSS: the film flattens to the name and the three proof rows, and the canvas never draws.

Film engine rules: raw WebGL points with additive blending (light on black), no scene-graph dependency; pixel ratio capped at 1.25; no idle clock once the visitor stops, frames drawn on demand; the canvas carries only light and dust, never words. Motion vocabulary: `--ease-stage` (0.16, 1, 0.3, 1) for arrivals, `--ease-exit` (0.4, 0, 1, 1) for departures; exits faster than entrances.

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
