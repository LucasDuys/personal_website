import { EXPERIENCE } from '@/data/experience';
import { RiseSolo } from '@/components/ui/Motion';

export function Experience() {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-5 md:px-10 py-28 md:py-36">
        <RiseSolo>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-1)]">
          Experience
        </h2>
        </RiseSolo>

      <div className="mt-14 space-y-16">
        {EXPERIENCE.map((entry) => (
            <RiseSolo key={`${entry.company}-${entry.dateRange}`}>
            <article
              className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-10"
            >
              <div className="font-mono text-xs text-[var(--text-3)] pt-1.5 whitespace-nowrap">
                {entry.dateRange}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-1)]">
                  {entry.title}
                  <span className="text-[var(--text-3)] font-normal"> · {entry.company}</span>
                </h3>
                <ul className="mt-4 space-y-2.5 max-w-[72ch]">
                  {entry.description.map((line) => (
                    <li key={line} className="text-[15px] leading-relaxed text-[var(--text-2)] pl-4 relative">
                      <span className="absolute left-0 top-[0.72em] w-1.5 h-px bg-[var(--hairline-strong)]" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
                {entry.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg border border-[var(--hairline)] text-xs text-[var(--text-3)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
            </RiseSolo>
        ))}
      </div>
    </section>
  );
}
