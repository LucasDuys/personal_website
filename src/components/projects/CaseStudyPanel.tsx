'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/types';

/* ---------- Per-project case study content ---------- */

interface CaseStudyContent {
  problem: string;
  approach: string;
  solution: string | string[];
  outcome?: string;
}

const caseStudies: Record<string, CaseStudyContent> = {
  pitchr: {
    problem: 'Founders waste months rehearsing pitches with no structured feedback.',
    approach: 'Real-time AI feedback loop: STT \u2192 rubric scoring \u2192 script rewrite \u2192 voice agent Q&A.',
    solution: [
      'Recording + real-time transcription via AssemblyAI',
      'Rubric scoring /100 across 5 dimensions (clarity, structure, persuasion, delivery, substance)',
      'AI-generated script rewrite with tracked improvements',
      'Mock investor Q&A powered by Claude + ElevenLabs voice synthesis',
    ],
    outcome: 'Won 1st place at HackEurope Paris. Built in 30 hours.',
  },
  stacklink: {
    problem: 'Knowledge scattered across Google Drive folders. Finding info takes 20+ minutes.',
    approach: 'RAG pipeline with dual chunking, hybrid retrieval, Reciprocal Rank Fusion.',
    solution: [
      'Google Drive ingest with incremental sync',
      'Semantic chunking with overlap for context preservation',
      'pgvector embeddings for vector similarity search',
      'BM25 keyword search for exact term matching',
      'Reciprocal Rank Fusion (RRF) re-ranking',
      'LLM-generated answers with source citations',
    ],
    outcome: 'Average query time: 2.3s. Reduced lookup from 20 minutes to seconds.',
  },
  cape: {
    problem: 'Enterprise software needs intelligent automation beyond simple rules.',
    approach: "Integrating AI agents into Cape's platform architecture.",
    solution: '__IN_PROGRESS__',
  },
  workshops: {
    problem: "Businesses know AI matters but don't know where to start.",
    approach: "Personalized workshops using each client's own data and challenges.",
    solution: [
      'Module 1: Market Research Automation \u2014 using LLMs to analyze competitive landscapes',
      'Module 2: Project Scoping \u2014 AI-assisted requirements gathering and estimation',
      'Module 3: Sentiment Analysis \u2014 extracting insights from customer feedback at scale',
    ],
    outcome: 'Delivered 12 workshops.',
  },
};

/* ---------- Link Icons ---------- */

function LinkIcon({ icon }: { icon: string }) {
  if (icon === 'external') {
    return (
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 1.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V7.5" />
        <path d="M7 1.5h3.5V5" />
        <path d="M5 7L10.5 1.5" />
      </svg>
    );
  }
  if (icon === 'video') {
    return (
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="4.5,2.5 9.5,6 4.5,9.5" />
      </svg>
    );
  }
  return null;
}

/* ---------- CLI Section Block ---------- */

function CLISection({ command, children, accentColor }: { command: string; children: React.ReactNode; accentColor: string }) {
  return (
    <div className="mb-8">
      <div className="font-mono text-sm mb-3">
        <span style={{ color: accentColor }}>&gt; </span>
        <span className="text-[var(--text-muted)]">{command}</span>
      </div>
      <div className="pl-4 border-l border-[var(--border)]">
        {children}
      </div>
    </div>
  );
}

/* ---------- Blinking Cursor ---------- */

function BlinkingCursor() {
  return (
    <span
      className="inline-block w-2 h-[18px] bg-[var(--accent-green)] ml-[2px] align-middle"
      style={{ animation: 'blink 1.06s step-end infinite' }}
    />
  );
}

/* ---------- Main Panel ---------- */

interface CaseStudyPanelProps {
  project: Project | null;
  onClose: () => void;
}

export function CaseStudyPanel({ project, onClose }: CaseStudyPanelProps) {
  const isOpen = project !== null;

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Scroll lock + escape key + URL hash
  useEffect(() => {
    if (isOpen && project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      window.history.replaceState(null, '', `#project/${project.slug}`);
    } else {
      document.body.style.overflow = '';
      // Only clean hash if we had a project hash
      if (window.location.hash.startsWith('#project/')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, project, handleKeyDown]);

  const content = project ? caseStudies[project.slug] : null;

  return (
    <AnimatePresence>
      {isOpen && project && content && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`project-card-${project.slug}`}
              className="relative w-full max-w-[900px] max-h-[85vh] overflow-y-auto rounded-xl border border-[var(--border)] pointer-events-auto"
              style={{ background: 'var(--surface-1, #0E0E14)' }}
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-1,#0E0E14)]/95 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <h2
                    className="font-sans text-xl font-bold"
                    style={{ color: project.accentColor }}
                  >
                    {project.title}
                  </h2>
                  {project.status === 'live' && (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent-green)]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent-green)]" />
                      </span>
                      LIVE
                    </span>
                  )}
                  {project.links.length > 0 && (
                    <div className="flex gap-3">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] transition-colors hover:opacity-80"
                          style={{ color: project.accentColor }}
                        >
                          <LinkIcon icon={link.icon} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
                  aria-label="Close case study"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 3l8 8M11 3l-8 8" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Problem */}
                <CLISection command="cat PROBLEM.md" accentColor={project.accentColor}>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {content.problem}
                  </p>
                </CLISection>

                {/* Approach */}
                <CLISection command="cat APPROACH.md" accentColor={project.accentColor}>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {content.approach}
                  </p>
                </CLISection>

                {/* Solution */}
                <CLISection command="cat SOLUTION.md" accentColor={project.accentColor}>
                  {content.solution === '__IN_PROGRESS__' ? (
                    <div className="font-mono text-sm text-[var(--text-muted)]">
                      In Progress. Check back soon.<BlinkingCursor />
                    </div>
                  ) : Array.isArray(content.solution) ? (
                    <ul className="space-y-2">
                      {content.solution.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <span style={{ color: project.accentColor }} className="mt-0.5 shrink-0">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {content.solution}
                    </p>
                  )}
                </CLISection>

                {/* Outcome */}
                {content.outcome && (
                  <CLISection command="cat OUTCOME.md" accentColor={project.accentColor}>
                    <p className="text-[var(--text-primary)] text-sm leading-relaxed font-medium">
                      {content.outcome}
                    </p>
                  </CLISection>
                )}

                {/* Tech Stack */}
                <div className="pt-6 mt-6 border-t border-[var(--border)]">
                  <div className="font-mono text-xs text-[var(--text-muted)] mb-3">
                    &gt; tech stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded font-mono text-[11px] border"
                        style={{
                          color: project.accentColor,
                          borderColor: `${project.accentColor}30`,
                          backgroundColor: `${project.accentColor}08`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
