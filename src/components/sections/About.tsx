import { RiseGroup, RiseItem } from '@/components/ui/Motion';

const FACTS: { label: string; value: string; mono?: boolean }[] = [
  { label: 'Based in', value: 'Eindhoven, NL' },
  { label: 'University', value: 'TU Eindhoven, CS & Engineering' },
  { label: 'Graduating', value: 'May 2027', mono: true },
  { label: 'Currently', value: 'cape.io + Stacklink' },
];

export function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-5 md:px-10 py-28 md:py-36">
      <RiseGroup>
        <RiseItem>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-1)]">
            About
          </h2>
        </RiseItem>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-12 lg:gap-20">
          <RiseItem>
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-5">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-[var(--text-3)]">{fact.label}</dt>
                <dd
                  className={`mt-1 text-sm text-[var(--text-1)] ${fact.mono ? 'font-mono' : ''}`}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          </RiseItem>

          <RiseItem>
          <div className="space-y-6 text-[17px] leading-relaxed text-[var(--text-2)] max-w-[64ch]">
            <p>
              I got into AI before university. Used GPT-3 in a high school entrepreneurship
              competition to run sentiment analysis and pick a product. We won, and the
              company&apos;s marketing team had spent{' '}
              <span className="font-mono text-[15px] text-[var(--text-1)]">6 months</span>{' '}
              arriving at the same choice. That&apos;s when I knew I wanted to build this stuff,
              not just use it.
            </p>
            <p>
              I study CS &amp; Engineering at TU Eindhoven, but most of what I know comes from
              shipping. I&apos;ve built RAG systems with hybrid retrieval, a multi-agent grocery
              system in <span className="font-mono text-[15px] text-[var(--text-1)]">6 hours</span>{' '}
              at a hackathon, and went to Paris for HackEurope where I built Pitchr.live from
              scratch in <span className="font-mono text-[15px] text-[var(--text-1)]">24h</span>.
            </p>
            <p>
              Right now I&apos;m interning at cape.io on top of full-time studies, optimizing
              agentic systems. Cut token usage by{' '}
              <span className="font-mono text-[15px] text-[var(--text-1)]">99%</span>, scaled a
              pipeline from <span className="font-mono text-[15px] text-[var(--text-1)]">20</span>{' '}
              inputs to <span className="font-mono text-[15px] text-[var(--text-1)]">10k</span> at{' '}
              <span className="font-mono text-[15px] text-[var(--text-1)]">98%</span> accuracy.
              Also shipping Claude Code plugins and using LangSmith for tracing across the stack.
            </p>
            <p className="text-[var(--text-1)] font-medium">
              If you&apos;re building something with AI that actually matters, I want to hear
              about it.
            </p>
          </div>
          </RiseItem>
        </div>
      </RiseGroup>
    </section>
  );
}
