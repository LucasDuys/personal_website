'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const NEOFETCH_ART = `
  ██╗     ██████╗
  ██║     ██╔══██╗
  ██║     ██║  ██║
  ██║     ██║  ██║
  ███████╗██████╔╝
  ╚══════╝╚═════╝

  visitor@lucas.dev
  ─────────────────
  OS:     lucasOS v1.0.0
  Host:   the internet
  Shell:  bash 5.2
  Theme:  dark [always]
  Stack:  Next.js / React / TS
  AI:     LLMs / RAG / Agents
  Fuel:   deadlines-and-curiosity
  Uptime: since 2003
`;

const HELP_TEXT = `Available commands:
  help      - Show this message
  whoami    - Who are you?
  neofetch  - System info
  clear     - Clear terminal
  exit      - Close terminal
  sudo rm -rf /  - Nice try`;

export function SecretTerminal() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<{ input: string; output: string }[]>(
    []
  );
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const konamiIndex = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Konami code listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open) return;
      if (e.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI.length) {
          setOpen(true);
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Auto-focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmed) {
      case 'help':
        output = HELP_TEXT;
        break;
      case 'whoami':
        output = 'visitor - curious enough to find this. I like that.';
        break;
      case 'neofetch':
        output = NEOFETCH_ART;
        break;
      case 'sudo rm -rf /':
        output =
          'Permission denied: nice try, but this portfolio has plot armor.';
        break;
      case 'exit':
        setOpen(false);
        return;
      case 'clear':
        setHistory([]);
        return;
      case '':
        return;
      default:
        output = `command not found: ${trimmed}. Type "help" for available commands.`;
    }

    setHistory((prev) => [...prev, { input: cmd, output }]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCommand(input);
        setInput('');
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [input, handleCommand]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[10vh] bottom-[10vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[640px] z-[201] rounded-xl border border-[var(--accent-green)] overflow-hidden flex flex-col"
            style={{
              background: 'rgba(6,6,10,0.98)',
              boxShadow: '0 0 40px rgba(74,222,128,0.15)',
            }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                secret-terminal
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                [x]
              </button>
            </div>

            {/* Terminal body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm"
            >
              <div className="text-[var(--accent-green)] mb-2">
                {'> You found the secret terminal. Type "help" to begin.'}
              </div>

              {history.map((entry, i) => (
                <div key={i} className="mb-2">
                  <div>
                    <span className="text-[var(--accent-green)]">visitor</span>
                    <span className="text-[var(--text-muted)]">@</span>
                    <span className="text-[var(--accent-cyan)]">lucas.dev</span>
                    <span className="text-[var(--text-muted)]">:~$ </span>
                    <span className="text-[var(--text-primary)]">
                      {entry.input}
                    </span>
                  </div>
                  <pre className="text-[var(--text-secondary)] whitespace-pre-wrap mt-1">
                    {entry.output}
                  </pre>
                </div>
              ))}

              {/* Input line */}
              <div className="flex items-center">
                <span className="text-[var(--accent-green)]">visitor</span>
                <span className="text-[var(--text-muted)]">@</span>
                <span className="text-[var(--accent-cyan)]">lucas.dev</span>
                <span className="text-[var(--text-muted)]">:~$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-[var(--text-primary)] outline-none font-mono text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
