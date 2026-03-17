'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  'CS & Engineering @ TU Eindhoven',
  'AI Intern @ cape.io',
  'Building Pitchr.live',
  'Full-Stack Developer',
];

// ---------- Role Cycler ----------
function RoleCycler({ startDelay = 0 }: { startDelay?: number }) {
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const roleIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  const typeRole = useCallback((role: string, onDone: () => void) => {
    let i = 0;
    const type = () => {
      if (i >= role.length) {
        onDone();
        return;
      }
      i++;
      setText(role.slice(0, i));
      timeoutRef.current = setTimeout(type, 40);
    };
    timeoutRef.current = setTimeout(type, 40);
  }, []);

  const deleteRole = useCallback((role: string, onDone: () => void) => {
    let i = role.length;
    const del = () => {
      if (i <= 0) {
        onDone();
        return;
      }
      i--;
      setText(role.slice(0, i));
      timeoutRef.current = setTimeout(del, 25);
    };
    timeoutRef.current = setTimeout(del, 25);
  }, []);

  const cycle = useCallback(() => {
    const role = ROLES[roleIndex.current % ROLES.length];
    typeRole(role, () => {
      timeoutRef.current = setTimeout(() => {
        deleteRole(role, () => {
          roleIndex.current++;
          timeoutRef.current = setTimeout(cycle, 200);
        });
      }, 2500);
    });
  }, [typeRole, deleteRole]);

  useEffect(() => {
    if (!started) return;
    cycle();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [started, cycle]);

  if (!started) return null;

  return (
    <span className="text-[var(--text-primary)]">
      {text}
      <span
        className="inline-block w-2 h-[18px] bg-[var(--accent-green)] ml-[1px] align-middle"
        style={{ animation: 'blink 1.06s step-end infinite' }}
      />
    </span>
  );
}

// ---------- Live Clock ----------
function LiveClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Amsterdam',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTime(now.toLocaleTimeString('en-GB', opts));
      setDate(
        now.toLocaleDateString('en-GB', {
          timeZone: 'Europe/Amsterdam',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-right font-mono text-xs text-[var(--text-muted)]">
      <div className="text-[var(--text-secondary)]">{time} <span className="text-[var(--text-muted)]">CET</span></div>
      <div>{date}</div>
    </div>
  );
}

// ---------- Scroll Indicator ----------
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
      <span>scroll</span>
      <div className="relative w-[1px] h-8 bg-[var(--border)] overflow-hidden">
        <div
          className="absolute w-full h-3 bg-[var(--accent-green)]"
          style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
        />
      </div>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-[var(--text-muted)]">
        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ---------- Hero ----------
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const greetRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Corners fade in
      const corners = cornersRef.current?.querySelectorAll('.hud-corner');
      if (corners) {
        tl.fromTo(
          corners,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' }
        );
      }

      // Greeting
      if (greetRef.current) {
        tl.fromTo(
          greetRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      }

      // Name
      if (nameRef.current) {
        tl.fromTo(
          nameRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      }

      // Role
      if (roleRef.current) {
        tl.fromTo(
          roleRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }

      // CTAs
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      }

      // Scroll indicator
      if (scrollIndRef.current) {
        tl.fromTo(
          scrollIndRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.1'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const trigger: ScrollTrigger.Vars = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      };

      if (nameRef.current) {
        gsap.to(nameRef.current, { y: -60, opacity: 0, ease: 'none', scrollTrigger: trigger });
      }
      if (greetRef.current) {
        gsap.to(greetRef.current, { y: -30, opacity: 0, ease: 'none', scrollTrigger: trigger });
      }
      if (roleRef.current) {
        gsap.to(roleRef.current, { y: -40, opacity: 0, ease: 'none', scrollTrigger: trigger });
      }
      if (ctaRef.current) {
        gsap.to(ctaRef.current, { y: 20, opacity: 0, ease: 'none', scrollTrigger: trigger });
      }
      if (cornersRef.current) {
        gsap.to(cornersRef.current, { opacity: 0, ease: 'none', scrollTrigger: trigger });
      }
      if (scrollIndRef.current) {
        gsap.to(scrollIndRef.current, { y: 15, opacity: 0, ease: 'none', scrollTrigger: { ...trigger, end: '40% top' } });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* HUD corners */}
      <div ref={cornersRef} className="absolute inset-0 pointer-events-none">
        {/* Top-left: location */}
        <div className="hud-corner absolute top-6 left-6 md:top-10 md:left-10 opacity-0">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-green)]" />
            </span>
            <span className="text-[var(--text-secondary)]">Eindhoven, NL</span>
          </div>
          <div className="font-mono text-xs text-[var(--text-muted)] mt-0.5 ml-4">
            51.4416&deg;N, 5.4697&deg;E
          </div>
        </div>

        {/* Top-right: clock */}
        <div className="hud-corner absolute top-6 right-6 md:top-10 md:right-10 opacity-0">
          <LiveClock />
        </div>

        {/* Bottom-left: section index */}
        <div className="hud-corner absolute bottom-6 left-6 md:bottom-10 md:left-10 font-mono text-xs text-[var(--text-muted)] opacity-0">
          <span className="text-[var(--accent-green)]">// </span>001 - hero
        </div>

        {/* Bottom-right: scroll indicator */}
        <div ref={scrollIndRef} className="hud-corner absolute bottom-6 right-6 md:bottom-10 md:right-10 opacity-0">
          <ScrollIndicator />
        </div>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <div ref={greetRef} className="font-mono text-sm mb-4 opacity-0">
          <span className="text-[var(--accent-green)]">&gt; </span>
          <span className="text-[var(--text-secondary)]">Hello, I&apos;m</span>
        </div>

        {/* Name */}
        <h1
          ref={nameRef}
          className="font-sans font-bold mb-6 opacity-0"
          style={{
            fontSize: 'clamp(56px, 8vw, 120px)',
            lineHeight: 1.05,
            background: 'linear-gradient(135deg, var(--text-primary) 60%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Lucas Duys
        </h1>

        {/* Role cycler */}
        <div ref={roleRef} className="font-mono text-sm md:text-base mb-10 opacity-0">
          <span className="text-[var(--text-muted)]">$ title: </span>
          <RoleCycler startDelay={1800} />
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col items-center gap-4 opacity-0">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm bg-[var(--accent-green)] text-[var(--bg)] font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:scale-[1.02]"
            >
              $ cd ./projects <span className="opacity-70 group-hover:opacity-100 transition-opacity">&crarr;</span>
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm border border-[var(--border)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-green)] hover:text-[var(--text-primary)]"
            >
              $ contact --open <span className="opacity-70 group-hover:opacity-100 transition-opacity">&crarr;</span>
            </a>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)] opacity-50 mt-2">
            press <kbd className="px-1.5 py-0.5 border border-[var(--border)] rounded text-[var(--text-secondary)]">{'\u2318'}K</kbd> to navigate
          </span>
        </div>
      </div>
    </section>
  );
}
