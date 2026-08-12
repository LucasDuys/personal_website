'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

/**
 * Opening sequence for the personal site hero.
 *
 * Animates: vermilion shutter reveal → name types → photo expands → status emerges.
 * Respects prefers-reduced-motion by skipping animations entirely.
 */
export function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    if (prefersReducedMotion || !containerRef.current) return;

    // Build the timeline
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // Shutter sweep: vermilion bars reveal
    if (shutterRef.current) {
      tl.to(shutterRef.current, {
        xPercent: -100,
        duration: 0.6,
        ease: 'power3.inOut',
      }, 'idle+=0.9');
    }

    // Name types character by character
    if (nameRef.current) {
      const nameText = nameRef.current.textContent || '';
      nameRef.current.textContent = '';

      tl.to({}, {
        duration: 1.2,
        ease: 'linear',
        onUpdate: function() {
          const progress = this.progress();
          const charsToShow = Math.floor(progress * nameText.length);
          nameRef.current!.textContent = nameText.slice(0, charsToShow);
        },
      }, 'idle+=1.5');
    }

    // Photo expands
    if (photoRef.current) {
      tl.to(photoRef.current, {
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 'idle+=2.7');
    }

    // Status and proof headline fade in
    if (statusRef.current) {
      tl.to(statusRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 'idle+=3.5');
    }

    // Scroll hint (subtle downward motion)
    const scrollHint = containerRef.current?.querySelector('[data-scroll-hint]');
    if (scrollHint) {
      gsap.to(scrollHint, {
        y: 8,
        opacity: 0.6,
        duration: 1.5,
        delay: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="hero-sequence">
      <div className="hero-shell frame">
        <div className="hero-copy">
          {/* Vermilion shutter overlay */}
          <div
            ref={shutterRef}
            className="shutter"
            aria-hidden="true"
          />

          <p className="hero-kicker">Founder / AI engineer</p>

          {/* Name with typing effect */}
          <h1 className="hero-name" ref={nameRef}>
            Lucas Duys
          </h1>

          <p className="hero-summary">
            Building a stealth AI startup. Selected for Antler ONE, September 2026.
          </p>

          <a className="hero-action" href="#experience">View experience</a>
        </div>

        {/* Hero stage photograph */}
        <figure className="hero-stage">
          <div ref={photoRef} className="photo-container">
            <picture>
              <source media="(max-width: 680px)" srcSet="/images/me/stage-pitch-900.avif" type="image/avif" />
              <source srcSet="/images/me/stage-pitch-1800.avif" type="image/avif" />
              <img
                src="/images/me/stage-pitch.jpg"
                alt="Lucas pitching Stacklink on stage at the TU/e Contest 2026 finale"
                width={2048}
                height={1152}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
          <figcaption>
            <span>Pitching Stacklink at the TU/e Contest 2026</span>
            <strong>First Runner-Up / 2nd of 70</strong>
          </figcaption>
        </figure>

        {/* Status proof */}
        <div ref={statusRef} className="hero-proof" style={{ opacity: 0, transform: 'translateY(16px)' }}>
          <div className="proof-headline">
            <span className="proof-accent" aria-hidden="true">✓</span>
            First Runner-Up / 2nd of 70
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-progress" aria-hidden="true" data-scroll-hint>
          <span>01</span>
          <i><b className="hero-progress__fill" /></i>
          <span>04</span>
        </div>
      </div>

      <style jsx>{`
        .hero-sequence {
          position: relative;
          overflow: hidden;
        }

        .hero-shell {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: center;
          min-height: 100vh;
          padding: 4rem;
          background: linear-gradient(135deg, #07111f 0%, #0d1b2b 100%);
        }

        .hero-copy {
          position: relative;
          z-index: 2;
        }

        .hero-kicker {
          font-size: 0.875rem;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #76889f;
          margin-bottom: 1rem;
        }

        .hero-name {
          font-size: clamp(3rem, 8vw, 7rem);
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #e7edf6;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          min-height: 1.2em;
        }

        .hero-summary {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #76889f;
          max-width: 32rem;
          margin: 0 0 2rem 0;
        }

        .hero-action {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #ff5f3d;
          color: #07111f;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          text-decoration: none;
          border-radius: 0;
          transition: background 200ms ease;
        }

        .hero-action:hover {
          background: #ff7654;
        }

        .hero-action:focus {
          outline: 2px solid #e7edf6;
          outline-offset: 4px;
        }

        .shutter {
          position: absolute;
          inset: 0;
          background: #ff5f3d;
          transform: translateX(0);
          z-index: 10;
          pointer-events: none;
        }

        .hero-stage {
          position: relative;
          margin: 0;
        }

        .photo-container {
          overflow: hidden;
          border-radius: 0;
          aspect-ratio: 16 / 9;
          transform: scale(1);
        }

        .photo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-stage figcaption {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #76889f;
        }

        .hero-stage figcaption strong {
          color: #ff5f3d;
          font-weight: 600;
          display: block;
          margin-top: 0.25rem;
        }

        .hero-proof {
          position: absolute;
          bottom: 4rem;
          left: 4rem;
          z-index: 2;
        }

        .proof-headline {
          font-size: 0.9rem;
          color: #e7edf6;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .proof-accent {
          color: #ff5f3d;
          font-weight: 800;
        }

        .hero-progress {
          position: absolute;
          bottom: 4rem;
          right: 4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
          color: #76889f;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 600;
        }

        .hero-progress i {
          display: block;
          width: 40px;
          height: 2px;
          background: #13263a;
          position: relative;
        }

        .hero-progress__fill {
          display: block;
          height: 2px;
          background: #ff5f3d;
          width: 25%;
          position: absolute;
          top: 0;
          left: 0;
        }

        @media (max-width: 768px) {
          .hero-shell {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
            min-height: auto;
          }

          .hero-name {
            font-size: clamp(2rem, 6vw, 3.5rem);
          }

          .hero-summary {
            font-size: 1rem;
          }

          .hero-proof,
          .hero-progress {
            position: static;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .shutter {
            display: none;
          }

          .hero-proof {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
