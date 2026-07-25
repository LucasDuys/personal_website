'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StagePipeline } from './StagePipeline';
import { RAG_PIPELINE, AGENT_RUNTIME } from '@/data/pipelines';
import type { Project } from '@/types';

const STACKLINK_SHOTS = [
  { src: '/images/projects/sl-cited.png', cap: 'Ask once. One cited answer.' },
  { src: '/images/projects/sl-file.png', cap: 'Real analysis on the real file.' },
  { src: '/images/projects/sl-sql.png', cap: 'Live SQL. Every row audited.' },
  { src: '/images/projects/sl-watch.png', cap: 'Watchers ping Slack when it is green.' },
];

function Media({ slug }: { slug: string }) {
  if (slug === 'pitchr' || slug === 'hackaway') {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        className="w-full rounded-xl border border-[var(--hairline)] bg-black"
        src={slug === 'pitchr' ? '/videos/pitchr-demo.mov' : '/videos/hackaway-demo.mp4'}
      />
    );
  }

  if (slug === 'stacklink') {
    return (
      <div className="space-y-8">
        <a href="https://stacklink.nl" target="_blank" rel="noreferrer" className="block group">
          <img
            src="/images/projects/sl-hero.png"
            alt="Stacklink landing page"
            className="w-full rounded-xl border border-[var(--hairline)] transition-opacity group-hover:opacity-90"
          />
          <p className="mt-2 font-mono text-xs text-[var(--text-3)]">
            Live at <span className="text-[var(--accent)]">stacklink.nl</span>
          </p>
        </a>

        <StagePipeline title="The agent runtime" stages={AGENT_RUNTIME} />
        <StagePipeline title="The retrieval pipeline" stages={RAG_PIPELINE} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STACKLINK_SHOTS.map((shot) => (
            <figure key={shot.src}>
              <img
                src={shot.src}
                alt={shot.cap}
                className="w-full rounded-xl border border-[var(--hairline)]"
              />
              <figcaption className="mt-1.5 text-xs text-[var(--text-2)]">{shot.cap}</figcaption>
            </figure>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-medium text-[var(--text-1)]">On stage</h4>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {['stage-pitch.jpg', 'award.jpg', 'cofounders.jpg'].map((img) => (
              <img
                key={img}
                src={`/images/me/${img}`}
                alt="TU/e Contest 2026 finals"
                className="w-full h-32 object-cover rounded-xl border border-[var(--hairline)]"
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-xs text-[var(--text-3)]">
            First runner-up · TU/e Contest 2026 finals
          </p>
        </div>
      </div>
    );
  }

  return null;
}

interface CaseStudyProps {
  project: Project | null;
  onClose: () => void;
}

export function CaseStudy({ project, onClose }: CaseStudyProps) {
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110]"
            style={{
              background: 'color-mix(in srgb, var(--text-1) 30%, transparent)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 14 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[111] flex items-start md:items-center justify-center p-3 md:p-8 pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} case study`}
              className="pointer-events-auto w-full max-w-3xl max-h-[88dvh] overflow-y-auto rounded-2xl border border-[var(--hairline)] bg-[var(--canvas)]"
              style={{ boxShadow: 'var(--shadow-raised)' }}
            >
              <div className="sticky top-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--hairline)] bg-[var(--canvas)]">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-lg font-semibold text-[var(--text-1)]">{project.title}</h3>
                  <span className="font-mono text-[11px] text-[var(--text-3)]">
                    {project.status === 'live' ? 'Shipped' : 'In progress'}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close case study"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--hairline)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--hairline-strong)] transition-colors duration-150"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <Media slug={project.slug} />
                <p className="text-[15px] leading-relaxed text-[var(--text-2)]">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg border border-[var(--hairline)] text-xs text-[var(--text-2)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 pb-1">
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
