'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

type Phase = 'booting' | 'ready' | 'exiting' | 'done';

const OK_LINES = [
  { text: 'Loading neural-interface v2.4.1...', hasHighlight: false },
  { text: 'Mounting /projects/2024...', hasHighlight: false },
  { text: 'Injecting skills: ', hasHighlight: true, highlight: 'react, next.js, typescript, AI/RAG' },
  { text: 'Syncing neural-network particles...', hasHighlight: false },
];

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>('booting');
  const [visibleOkLines, setVisibleOkLines] = useState(0);
  const [showFinalLine, setShowFinalLine] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isShortened, setIsShortened] = useState(false);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('visited')) {
      setIsShortened(true);
    }
  }, []);

  // Lock body scroll while preloader is active
  useEffect(() => {
    if (phase !== 'done') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // Shortened version: quick flash and exit
  useEffect(() => {
    if (!isShortened) return;
    setProgress(100);
    const timer = setTimeout(() => {
      setPhase('exiting');
      setTimeout(() => {
        setPhase('done');
        sessionStorage.setItem('visited', 'true');
        onComplete?.();
      }, 600);
    }, 400);
    return () => clearTimeout(timer);
  }, [isShortened, onComplete]);

  const handleCommandComplete = useCallback(() => {
    // Start showing OK lines with stagger
    let lineIndex = 0;
    const stagger = setInterval(() => {
      lineIndex++;
      setVisibleOkLines(lineIndex);
      setProgress(Math.min(20 + lineIndex * 18, 90));
      if (lineIndex >= OK_LINES.length) {
        clearInterval(stagger);
        // Show spinner then checkmark
        setTimeout(() => {
          setShowFinalLine(true);
          setProgress(95);
          setTimeout(() => {
            setShowCheckmark(true);
            setProgress(100);
            setPhase('ready');
            // Begin exit
            exitTimerRef.current = setTimeout(() => {
              setPhase('exiting');
              setTimeout(() => {
                setPhase('done');
                sessionStorage.setItem('visited', 'true');
                onComplete?.();
              }, 800);
            }, 600);
          }, 600);
        }, 300);
      }
    }, 180);
    return () => clearInterval(stagger);
  }, [onComplete]);

  const { displayText: cmdText, isComplete: cmdComplete, start: startCmd } = useTypewriter(
    'systemctl start lucas-portfolio.service',
    { speed: 35, jitter: 10, onComplete: handleCommandComplete }
  );

  // Start typing the command
  useEffect(() => {
    if (isShortened) return;
    const timer = setTimeout(() => {
      startCmd();
      setProgress(5);
    }, 500);
    return () => clearTimeout(timer);
  }, [startCmd, isShortened]);

  // Progress animation smoothing
  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((p) => Math.min(p + 1, 100));
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'var(--bg)',
        opacity: phase === 'exiting' ? 0 : 1,
        filter: phase === 'exiting' ? 'blur(8px)' : 'none',
        transition: 'opacity 0.8s ease, filter 0.8s ease',
      }}
    >
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 w-full max-w-xl mx-4">
        {/* Terminal window */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="font-mono text-xs text-[var(--text-muted)] ml-2">
              lucas@portfolio:~
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-4 font-mono text-sm space-y-1 min-h-[200px]">
            {/* Command line */}
            {!isShortened && (
              <div className="leading-relaxed">
                <span className="text-[var(--text-muted)]">$ </span>
                <span className="text-[var(--text-primary)]">{cmdText}</span>
                {!cmdComplete && (
                  <span
                    className="inline-block w-2 h-[18px] bg-[var(--accent-green)] ml-[1px] align-middle"
                    style={{ animation: 'blink 1.06s step-end infinite' }}
                  />
                )}
              </div>
            )}

            {/* OK lines */}
            {OK_LINES.slice(0, visibleOkLines).map((line, i) => (
              <div
                key={i}
                className="leading-relaxed"
                style={{
                  animation: 'fadeIn 0.3s ease forwards',
                }}
              >
                <span className="text-[var(--accent-green)]">[  OK  ]</span>{' '}
                <span className="text-[var(--text-secondary)]">
                  {line.hasHighlight ? (
                    <>
                      {line.text}
                      <span className="text-[var(--accent-cyan)]">{line.highlight}</span>
                    </>
                  ) : (
                    line.text
                  )}
                </span>
              </div>
            ))}

            {/* Final line */}
            {showFinalLine && (
              <div className="leading-relaxed mt-2" style={{ animation: 'fadeIn 0.3s ease forwards' }}>
                {showCheckmark ? (
                  <>
                    <span className="text-[var(--accent-green)]">&#10003;</span>{' '}
                    <span className="text-[var(--text-primary)]">Portfolio loaded. Welcome.</span>
                  </>
                ) : (
                  <>
                    <span
                      className="inline-block text-[var(--accent-cyan)]"
                      style={{ animation: 'spin 0.8s linear infinite' }}
                    >
                      &#9696;
                    </span>{' '}
                    <span className="text-[var(--text-secondary)]">Initializing...</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--surface-2)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
