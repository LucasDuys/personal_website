'use client';
import { useEffect, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

interface Props {
  command: string;
  delay?: number;
  onComplete?: () => void;
  showPrompt?: boolean;
}

export function CLIPrompt({ command, delay = 0, onComplete, showPrompt = true }: Props) {
  const [started, setStarted] = useState(false);
  const { displayText, isComplete, start } = useTypewriter(command, {
    speed: 45,
    jitter: 15,
    onComplete,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, start]);

  if (!started && delay > 0) return null;

  return (
    <div className="font-mono text-sm leading-relaxed">
      {showPrompt && (
        <span>
          <span className="text-[var(--accent-green)]">visitor</span>
          <span className="text-[var(--text-muted)]">@</span>
          <span className="text-[var(--accent-cyan)]">lucas.dev</span>
          <span className="text-[var(--text-muted)]">:~$ </span>
        </span>
      )}
      <span className="text-[var(--text-primary)]">{displayText}</span>
      {!isComplete && (
        <span
          className="inline-block w-2 h-[18px] bg-[var(--accent-green)] ml-[1px] align-middle"
          style={{ animation: 'blink 1.06s step-end infinite' }}
        />
      )}
    </div>
  );
}
