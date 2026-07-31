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

Desktop uses a broad asymmetric grid where one image, chapter title, or outcome owns most of the frame. The first viewport follows one left-to-right path: identity and current status on the left, public stage proof on the right. A three-part evidence ledger below the hero translates the strongest outcomes into comparable scale. CV chapters use a three-column ledger for period, role, and evidence. The work archive alternates a sticky description with a dominant product image, a four-image product contact sheet, and an offset two-project close.

Mobile collapses to a strict single column. Every image keeps a purposeful crop, numbers retain their context, and no essential content depends on hover, parallax, or horizontal travel.

Native browser scrolling is the base. A sub-second stage-shutter sequence reveals the name, current status, and stage photograph in reading order. On desktop, GSAP ScrollTrigger briefly pins that scene and expands the stage photograph into a near full-frame camera move before releasing into the evidence ledger. Chronology rules, outcomes, and project imagery then reveal in restrained scroll-linked beats. Mobile keeps the image drift but removes the pin, and reduced-motion preferences receive the complete static composition.

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
