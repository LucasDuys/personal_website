'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registry';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { CLIPrompt } from '@/components/ui/CLIPrompt';

const FRONTMATTER = [
  { key: 'name', value: 'Lucas Duys', color: 'var(--text-primary)' },
  {
    key: 'location',
    value: 'Veldhoven, NL \u2192 Eindhoven, NL',
    color: 'var(--text-primary)',
  },
  {
    key: 'university',
    value: 'TU Eindhoven \u2014 CS & Engineering',
    color: 'var(--accent-cyan)',
  },
  { key: 'graduation', value: 'May 2027', color: 'var(--text-primary)' },
  {
    key: 'current_role',
    value: 'AI Intern @ cape.io',
    color: 'var(--accent-green)',
  },
  {
    key: 'status',
    value: 'building things that matter',
    color: 'var(--accent-purple)',
  },
  {
    key: 'availability',
    value: 'open to opportunities',
    color: 'var(--accent-amber)',
    glow: true,
  },
];

function Highlight({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  const bgMap: Record<string, string> = {
    green: 'rgba(74, 222, 128, 0.1)',
    cyan: 'rgba(34, 211, 238, 0.1)',
    amber: 'rgba(251, 191, 36, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
  };
  const textMap: Record<string, string> = {
    green: 'var(--accent-green)',
    cyan: 'var(--accent-cyan)',
    amber: 'var(--accent-amber)',
    purple: 'var(--accent-purple)',
  };
  return (
    <span
      className="px-1.5 py-0.5 rounded"
      style={{
        background: bgMap[color] ?? 'transparent',
        color: textMap[color] ?? 'inherit',
      }}
    >
      {children}
    </span>
  );
}

const BODY_PARAGRAPHS = [
  <>
    I&apos;m a builder at the intersection of AI and product - the kind
    of person who enters a{' '}
    <Highlight color="amber">24-hour hackathon</Highlight> in Paris and walks
    out with a live product.
  </>,
  <>
    I study Computer Science &amp; Engineering at TU Eindhoven, but most of my
    learning happens by shipping. I&apos;ve built{' '}
    <Highlight color="cyan">RAG systems</Highlight> that actually retrieve the
    right answer, led operations at a London startup where I moved{' '}
    <Highlight color="purple">real business metrics</Highlight>, and built a{' '}
    <Highlight color="amber">multi-agent grocery system</Highlight> in 6 hours
    at a hackathon where five AI agents negotiate to fill your shopping cart.
  </>,
  <>
    Right now I&apos;m at{' '}
    <Highlight color="green">cape.io</Highlight>, building AI agent integrations
    - the kind of work where the problem space changes faster than the
    documentation. That&apos;s where I&apos;m happiest.
  </>,
];

const CTA_LINE =
  "If you're building something ambitious with AI, I want to hear about it.";

export function About() {
  const [cliDone, setCliDone] = useState(false);
  const frontmatterRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cliDone) return;
    const ctx = gsap.context(() => {
      // Animate frontmatter lines
      if (frontmatterRef.current) {
        const lines = frontmatterRef.current.querySelectorAll('.fm-line');
        gsap.from(lines, {
          y: 16,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: frontmatterRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Comment line
      if (commentRef.current) {
        gsap.from(commentRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: commentRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Body paragraphs
      if (bodyRef.current) {
        const paragraphs = bodyRef.current.querySelectorAll('.body-p');
        gsap.from(paragraphs, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // CTA
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 16,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [cliDone]);

  return (
    <SectionWrapper config={{ id: 'about', index: '002', label: 'about' }}>
      <div ref={sectionRef}>
        {/* CLI prompt */}
        <div className="mb-8">
          <CLIPrompt command="cat ~/about.md" onComplete={() => setCliDone(true)} />
        </div>

        {cliDone && (
          <div className="mt-6">
            {/* YAML Frontmatter */}
            <div ref={frontmatterRef} className="font-mono text-sm leading-relaxed mb-8">
              <div className="fm-line flex">
                <span className="w-8 text-right mr-4 text-[var(--text-muted)] opacity-30 select-none">
                  1
                </span>
                <span className="text-[var(--text-muted)]">---</span>
              </div>
              {FRONTMATTER.map((entry, i) => (
                <div key={entry.key} className="fm-line flex">
                  <span className="w-8 text-right mr-4 text-[var(--text-muted)] opacity-30 select-none">
                    {i + 2}
                  </span>
                  <span>
                    <span className="text-[var(--text-muted)]">{entry.key}:</span>{' '}
                    <span
                      style={{ color: entry.color }}
                      className={entry.glow ? 'glow-amber' : ''}
                    >
                      {entry.value}
                    </span>
                  </span>
                </div>
              ))}
              <div className="fm-line flex">
                <span className="w-8 text-right mr-4 text-[var(--text-muted)] opacity-30 select-none">
                  {FRONTMATTER.length + 2}
                </span>
                <span className="text-[var(--text-muted)]">---</span>
              </div>
            </div>

            {/* Comment line */}
            <div ref={commentRef} className="font-mono text-xs italic mb-10 opacity-30">
              <span className="text-[var(--text-muted)]">
                {'<!-- profile_photo: redacted \u2014 you\'ll have to meet me in person -->'}
              </span>
            </div>

            {/* Body text */}
            <div ref={bodyRef} className="max-w-[680px] space-y-6">
              {BODY_PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  className="body-p font-sans text-[17px] leading-relaxed text-[var(--text-secondary)]"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* CTA line */}
            <p
              ref={ctaRef}
              className="mt-8 font-sans text-[17px] leading-relaxed text-[var(--accent-green)] max-w-[680px]"
            >
              {CTA_LINE}
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
