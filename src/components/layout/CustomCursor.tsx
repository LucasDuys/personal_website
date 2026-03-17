'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/registry';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isTouch = useMediaQuery('(hover: none)');
  const [label, setLabel] = useState('');
  const [isText, setIsText] = useState(false);

  // Position state (mutable refs for perf - no React re-renders)
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, { scale: 0.75, duration: 0.1, ease: 'power2.in' });
      }
    };

    const handleMouseUp = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.4)' });
      }
    };

    // Detect interactive elements for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], [data-cursor]');

      if (interactive) {
        const cursorLabel = interactive.getAttribute('data-cursor') || 'VIEW';
        setLabel(cursorLabel);
        setIsText(false);
        if (ringRef.current) {
          ringRef.current.style.width = '64px';
          ringRef.current.style.height = '64px';
          ringRef.current.style.background = 'rgba(232, 230, 227, 0.08)';
          ringRef.current.style.borderColor = 'rgba(232, 230, 227, 0.3)';
        }
        if (dotRef.current) dotRef.current.style.opacity = '0';
        if (labelRef.current) labelRef.current.style.opacity = '1';
        return;
      }

      const textEl = target.closest('p, h1, h2, h3, h4, h5, h6, span, li');
      if (textEl && textEl.textContent?.trim()) {
        setIsText(true);
        setLabel('');
        if (ringRef.current) {
          ringRef.current.style.width = '4px';
          ringRef.current.style.height = '28px';
          ringRef.current.style.borderRadius = '2px';
          ringRef.current.style.borderColor = '#4ADE80';
        }
        if (dotRef.current) dotRef.current.style.opacity = '0';
        if (labelRef.current) labelRef.current.style.opacity = '0';
        return;
      }

      // Reset to default
      setLabel('');
      setIsText(false);
      if (ringRef.current) {
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.borderRadius = '50%';
        ringRef.current.style.background = 'transparent';
        ringRef.current.style.borderColor = 'rgba(232, 230, 227, 0.5)';
      }
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (labelRef.current) labelRef.current.style.opacity = '0';
    };

    // GSAP ticker for smooth position updates
    const tickerCallback = () => {
      // Dot follows instantly (1:1 with real cursor)
      dotPos.current.x = mouse.current.x;
      dotPos.current.y = mouse.current.y;
      // Ring follows with slight trail (30% lerp - fast but smooth)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.3;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.3;
      // Glow follows with gentle trail
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * 0.15;
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
      }
      if (ringRef.current) {
        const w = parseFloat(ringRef.current.style.width || '36') || 36;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - w / 2}px, ${ringPos.current.y - w / 2}px, 0)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ringPos.current.x - 12}px, ${ringPos.current.y - 5}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x - 300}px, ${glowPos.current.y - 300}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    gsap.ticker.add(tickerCallback);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      gsap.ticker.remove(tickerCallback);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div id="custom-cursor" className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference">
      {/* Glow aura */}
      <div
        ref={glowRef}
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          top: 0,
          left: 0,
          background: 'radial-gradient(circle, rgba(46,125,255,0.06) 0%, rgba(46,125,255,0.02) 35%, transparent 70%)',
          willChange: 'transform',
          mixBlendMode: 'screen',
          zIndex: -1,
        }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 rounded-full bg-[var(--text-primary)]"
        style={{ top: 0, left: 0, willChange: 'transform' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed rounded-full border border-[rgba(232,230,227,0.5)]"
        style={{
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          willChange: 'transform',
          transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background-color 0.3s ease, border-radius 0.3s ease',
        }}
      />
      {/* Label */}
      <div
        ref={labelRef}
        className="fixed font-mono text-[9px] font-medium tracking-widest uppercase text-[#06060A] pointer-events-none"
        style={{
          top: 0,
          left: 0,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      >
        {label}
      </div>
    </div>
  );
}
