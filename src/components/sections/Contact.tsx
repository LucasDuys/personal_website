'use client';

import { useState, useCallback } from 'react';
import { RiseGroup, RiseItem } from '@/components/ui/Motion';

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('lucas.duys@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="px-2.5 py-1 rounded-lg border border-[var(--hairline)] text-xs text-[var(--text-2)] hover:border-[var(--hairline-strong)] hover:text-[var(--text-1)] transition-colors duration-150"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function Contact() {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-10">
      <RiseGroup>
        <RiseItem>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-1)] max-w-[24ch]">
          Building something with AI that actually matters?
        </h2>
        <p className="mt-4 text-lg text-[var(--text-2)]">I want to hear about it.</p>
        </RiseItem>

        <RiseItem>
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:lucas.duys@gmail.com"
              className="font-mono text-base md:text-lg text-[var(--text-1)] hover:text-[var(--accent)] transition-colors duration-150 break-all"
            >
              lucas.duys@gmail.com
            </a>
            <CopyEmail />
          </div>
          <div className="flex flex-wrap gap-5 text-sm">
            <a
              href="https://linkedin.com/in/lucas-duys"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/LucasDuys"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        </RiseItem>
      </RiseGroup>

      <footer className="mt-24 border-t border-[var(--hairline)] py-8">
        <p className="text-xs text-[var(--text-3)]">© 2026 Lucas Duys</p>
      </footer>
    </section>
  );
}
