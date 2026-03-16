'use client';
import { useEffect, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 40, delay = 0, className = '', onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const { displayText, isComplete, start } = useTypewriter(text, { speed, onComplete });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, start]);

  if (!started) return null;

  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <span
          className="inline-block w-2 h-[18px] bg-[var(--accent-green)] ml-[1px] align-middle"
          style={{ animation: 'blink 1.06s step-end infinite' }}
        />
      )}
    </span>
  );
}
