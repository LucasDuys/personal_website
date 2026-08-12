---
name: Lucas Duys Shore
description: A cinematic visual CV in daylight: warm sand paper, deep-sea ink, one ocean signal, the film as ink stipple on paper.
---

<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Lucas Duys Shore

## Overview

**Creative North Star: "Shore"**

The system takes its physical language from the coast in daylight: sand, sea, and ink settling on warm paper, with the large typographic authority of a printed front page. It must feel like a record set in open air, not a themed conference website. Real photography carries atmosphere. Dates, roles, outcomes, and links carry credibility.

The world is bold but not noisy: one dominant image or fact at a time, native scrolling, and a processional rhythm that alternates dense evidence with quiet full-frame photography. Credential cues appear through cropping, bands, alignment, and typography rather than literal lanyards, QR codes, or fake tickets.

**Key Characteristics:**

- Real stage and founder photography at architectural scale
- Oversized, width-variable display typography
- Warm sand paper, deep-sea ink, and one ocean-blue signal
- Chronology organized as a sequence of earned access and public proof
- One orchestrated opening establishes the world; a pinned stage-camera move hands off to scroll-timed proof without hijacking native scrolling

## Colors

The palette is the coast in daylight: warm sand paper carries the full page, deep-sea ink carries every word, and one ocean signal directs the eye. The film is ink stipple settling on paper, not light on darkness. The visit does not change with the operating-system theme.

### Primary

- **Sea** (`#176D8C`): active links, focus, kickers and caption labels, the film's milestone knots, and no more than one decisive element per viewport.

### Neutral

- **Sand Paper** (`#F5F1E6`): the page ground and framing color around photography.
- **Sea Ink** (`#14232B`): primary copy, high-contrast figures, and the film's dust.
- **Weathered Ink** (`#4C5E68`): secondary copy.
- **Driftwood Gray** (`#63737B`): metadata that remains readable but recedes from the proof.

**The One Signal Rule.** Sea identifies the one thing to notice or act on. It never becomes decorative confetti, glow, or a multi-stop gradient.

## Typography

**Display Font:** Alegreya at weights 600 to 800 with a serif fallback

**Body Font:** Alegreya Sans with a system sans-serif fallback

**Character:** Alegreya is a humanist serif with real warmth at display sizes, set slightly loose; its sans companion keeps the CV copy direct and highly readable, and the two share one skeleton so the page reads as a single voice.

### Hierarchy

- **Display:** Alegreya, heavy, near-default tracking, used for Lucas's name and major chapter titles.
- **Headline:** Alegreya at medium-heavy weight, used for roles and milestone statements.
- **Body:** Alegreya Sans regular, generous line-height, maximum line length around 66 characters.
- **Label:** Alegreya Sans bold in compact caps, used sparingly for dates, locations, and proof categories.
- **Figures:** Alegreya bold, with the unit or context attached to every number.

**The Weight Carries Hierarchy Rule.** Type changes weight only to distinguish scale and role. It does not wobble or animate while the visitor reads.

## Layout

The page opens on the film: a 300svh section whose sticky stage holds a WebGL point field of stage dust. Scroll is the only clock. The dust gathers into three figures in sequence, the spotlight ring, the rising trajectory with sea-blue milestone knots, and the LD mark. Between figures, one caption at a time takes the centre of the frame as a pure-text beat: the field drains to near nothing beneath it (the last beat keeps a ghost of the mark), the caption falls in from above and departs downward, and the dust pours gently down while the words hold. 2nd of 70, 500×, 1 of ~100. At rest the field neither plays nor freezes: each point drifts toward the light on its own phase and fades before it arrives. The film releases into the real stage photograph, and the film never restates below itself.

Below the film, one record carries every venture exactly once: a three-column ledger of period, role, and evidence, with each entry's product imagery embedded in its evidence column (Stacklink carries a dominant product image and a four-image contact sheet, the hackathons a two-build pair). Nothing on the page is said twice: the film owns the headline figures, the record owns the detail, and the photo bands carry only their moment. The contact close pairs the portrait photograph with the address. Mobile collapses to a strict single column; the film keeps a smaller point count, and the final caption reads over the mark's ghost.

Native browser scrolling is the base; the sticky stage is honest and a flick passes it. One scroll listener writes CSS custom properties and shader uniforms; React renders nothing per frame. Section reveals use one IntersectionObserver whose hiding style engages only after an inline script confirms JavaScript. Reduced motion and no-JS both receive the complete static composition in pure CSS: the film flattens to the name and the three proof rows, and the canvas never draws.

Film engine rules: raw WebGL points with normal blending (ink on paper), no scene-graph dependency; pixel ratio capped at 1.25; no idle clock once the visitor stops, frames drawn on demand; the canvas carries only light and dust, never words. Motion vocabulary: `--ease-stage` (0.16, 1, 0.3, 1) for arrivals, `--ease-exit` (0.4, 0, 1, 1) for departures; exits faster than entrances.

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
