'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registry';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { CLIPrompt } from '@/components/ui/CLIPrompt';
import { CipherText } from '@/components/ui/CipherText';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-green)] hover:border-[var(--accent-green)] transition-colors"
    >
      {copied ? 'copied!' : 'copy'}
    </button>
  );
}

export function Contact() {
  const [cliDone, setCliDone] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cliDone) return;
    const ctx = gsap.context(() => {
      if (responseRef.current) {
        gsap.from(responseRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: responseRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (linksRef.current) {
        const links = linksRef.current.querySelectorAll('.contact-link');
        gsap.from(links, {
          x: -16,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: linksRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (footerRef.current) {
        gsap.from(footerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [cliDone]);

  return (
    <SectionWrapper config={{ id: 'contact', index: '006', label: 'contact' }}>
      <div ref={sectionRef}>
        {/* CLI prompt */}
        <div className="mb-8">
          <CLIPrompt
            command={`curl -X POST https://lucas.dev/contact --data '{"intent": "connect"}'`}
            onComplete={() => setCliDone(true)}
          />
        </div>

        {cliDone && (
          <div className="mt-6">
            {/* HTTP Response */}
            <div ref={responseRef} className="font-mono text-sm mb-10">
              <div className="text-[var(--accent-green)] mb-3">
                HTTP/1.1 200 OK
              </div>
              <div className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] p-6 max-w-[600px]">
                <div className="space-y-1">
                  <div>
                    <span className="text-[var(--text-muted)]">{'{'}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[var(--accent-cyan)]">
                      &quot;status&quot;
                    </span>
                    <span className="text-[var(--text-muted)]">: </span>
                    <span className="text-[var(--accent-green)]">
                      &quot;available&quot;
                    </span>
                    <span className="text-[var(--text-muted)]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[var(--accent-cyan)]">
                      &quot;response_time&quot;
                    </span>
                    <span className="text-[var(--text-muted)]">: </span>
                    <span className="text-[var(--accent-green)]">
                      &quot;&lt;24h&quot;
                    </span>
                    <span className="text-[var(--text-muted)]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[var(--accent-cyan)]">
                      &quot;message&quot;
                    </span>
                    <span className="text-[var(--text-muted)]">: </span>
                    <span className="text-[var(--text-primary)] font-semibold">
                      &quot;Let&apos;s build something.&quot;
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">{'}'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-[var(--accent-amber)]">
                X-Powered-By: coffee-and-curiosity
              </div>
            </div>

            {/* Contact links */}
            <div ref={linksRef} className="mb-12 space-y-4">
              <div className="contact-link flex items-center gap-4 font-mono text-sm">
                <span className="text-[var(--accent-green)]">&rarr;</span>
                <span className="text-[var(--text-muted)] w-20">email</span>
                <CipherText className="text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors">
                  lucas.duys@gmail.com
                </CipherText>
                <CopyButton text="lucas.duys@gmail.com" />
              </div>
              <div className="contact-link flex items-center gap-4 font-mono text-sm">
                <span className="text-[var(--accent-green)]">&rarr;</span>
                <span className="text-[var(--text-muted)] w-20">linkedin</span>
                <a
                  href="https://linkedin.com/in/lucas-duys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors"
                >
                  /in/lucas-duys
                </a>
                <a
                  href="https://linkedin.com/in/lucas-duys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-green)] hover:border-[var(--accent-green)] transition-colors"
                >
                  open
                </a>
              </div>
            </div>

            {/* Final prompt */}
            <div className="mb-4 font-mono text-sm">
              <span className="text-[var(--accent-green)]">visitor</span>
              <span className="text-[var(--text-muted)]">@</span>
              <span className="text-[var(--accent-cyan)]">lucas.dev</span>
              <span className="text-[var(--text-muted)]">:~$ </span>
              <span
                className="inline-block w-2 h-[18px] bg-[var(--accent-green)] ml-[1px] align-middle"
                style={{ animation: 'blink 1.06s step-end infinite' }}
              />
            </div>
            <p className="font-sans text-sm text-[var(--text-muted)] mb-16">
              The terminal is yours. What will you build?
            </p>

            {/* Footer */}
            <div ref={footerRef}>
              <div className="border-t border-[var(--border)] pt-8 pb-4">
                <p className="font-mono text-xs text-[var(--text-muted)] text-center">
                  &copy; 2026 Lucas Duys | Built with Next.js + obsession |
                  v1.0.0
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
