'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {

      media.add('(min-width: 881px)', () => {
        const hero = document.querySelector<HTMLElement>('.hero');
        const shell = document.querySelector<HTMLElement>('.hero-shell');
        if (!hero || !shell) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=90%',
            pin: shell,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
          .to('.hero-stage', { xPercent: -38, scale: 1.85, ease: 'none' }, 0)
          .to('.hero-stage img', { scale: 1.1, ease: 'none' }, 0)
          .to('.hero h1 span:first-child', { xPercent: -24, ease: 'none' }, 0)
          .to('.hero h1 span:last-child', { xPercent: 28, ease: 'none' }, 0)
          .to('.hero-copy', { xPercent: -12, opacity: 0, ease: 'none' }, 0.28)
          .to('.hero-stage figcaption', { yPercent: 110, opacity: 0, ease: 'none' }, 0.25)
          .to('.hero-progress__fill', { scaleY: 1, ease: 'none' }, 0);
      });

      media.add('(max-width: 880px)', () => {
        gsap.fromTo('.hero-stage img',
          { scale: 1.04, yPercent: -2 },
          {
            scale: 1,
            yPercent: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-stage',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
      });

      gsap.fromTo('.proof-overview-grid > div',
        { y: 80, opacity: 0, clipPath: 'inset(0 0 55% 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          stagger: 0.09,
          ease: 'none',
          scrollTrigger: {
            trigger: '.proof-overview',
            start: 'top 92%',
            end: 'top 38%',
            scrub: 0.65,
          },
        });

      gsap.utils.toArray<HTMLElement>('.experience-list > li').forEach((row) => {
        const period = row.querySelector('.period');
        const role = row.querySelector('.role');
        const detail = row.querySelector('.role-detail');

        gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            end: 'top 42%',
            scrub: 0.6,
          },
        })
          .to(row, { '--line-progress': 1, ease: 'none' }, 0)
          .fromTo(period, { x: -24, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
          .fromTo(role, { y: 48, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05)
          .fromTo(detail,
            { y: 72, opacity: 0, clipPath: 'inset(0 0 35% 0)' },
            { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', ease: 'none' },
            0.1);
      });

      gsap.fromTo('.photo-proof figure',
        { clipPath: 'inset(0 12% 0 12%)' },
        {
          clipPath: 'inset(0 0% 0 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.photo-proof',
            start: 'top 90%',
            end: 'top 30%',
            scrub: 0.7,
          },
        });

      gsap.fromTo('.photo-proof img',
        { scale: 1.16, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: '.photo-proof',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });

      gsap.utils.toArray<HTMLElement>('.cape-feature > img, .stacklink-hero, .stacklink-gallery, .work-small > img').forEach((visual, index) => {
        gsap.fromTo(visual,
          {
            clipPath: index % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
            scale: 1.04,
          },
          {
            clipPath: 'inset(0 0% 0 0%)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: visual,
              start: 'top 92%',
              end: 'top 38%',
              scrub: 0.6,
            },
          });
      });

      gsap.fromTo('.contact h2, .contact-email',
        { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 88%',
            end: 'top 40%',
            scrub: 0.65,
          },
        });

    });

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return null;
}
