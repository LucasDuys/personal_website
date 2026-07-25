'use client';

import { useState } from 'react';
import { projects } from '@/data/projects';
import { RiseGroup, RiseItem } from '@/components/ui/Motion';
import { CaseStudy } from '@/components/projects/CaseStudy';
import type { Project } from '@/types';

const HAS_CASE_STUDY = new Set(['stacklink', 'pitchr', 'hackaway']);

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="max-w-6xl mx-auto px-5 md:px-10 py-28 md:py-36">
      <RiseGroup>
        <RiseItem>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-1)]">
          Selected work
        </h2>
        <p className="mt-3 text-sm text-[var(--text-3)]">
          A dashed border means still in flight. Solid with the accent edge means shipped.
        </p>
        </RiseItem>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {projects.map((project) => {
          const shipped = project.status === 'live';
          return (
              <RiseItem key={project.slug}>
              <article
                className={`card-hover relative rounded-2xl bg-[var(--sheet)] overflow-hidden flex flex-col ${
                  shipped
                    ? 'border border-[var(--hairline)]'
                    : 'border border-dashed border-[var(--hairline-strong)]'
                }`}
                style={{ boxShadow: shipped ? 'var(--shadow-rest)' : undefined }}
              >
                {shipped && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full bg-[var(--accent)] z-10"
                  />
                )}
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover object-top border-b border-[var(--hairline)]"
                />
                <div className="p-6 md:p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-[var(--text-1)]">{project.title}</h3>
                  <span className="font-mono text-[11px] text-[var(--text-3)] whitespace-nowrap">
                    {shipped ? 'Shipped' : 'In progress'}
                  </span>
                </div>

                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-2)]">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg border border-[var(--hairline)] text-xs text-[var(--text-2)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-5 flex gap-4">
                  {HAS_CASE_STUDY.has(project.slug) && (
                    <button
                      onClick={() => setSelected(project)}
                      className="text-sm font-medium text-[var(--accent)] hover:underline underline-offset-4"
                    >
                      Case study
                    </button>
                  )}
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[var(--accent)] hover:underline underline-offset-4"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
                </div>
              </article>
              </RiseItem>
          );
        })}
      </div>
      </RiseGroup>

      <CaseStudy project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
