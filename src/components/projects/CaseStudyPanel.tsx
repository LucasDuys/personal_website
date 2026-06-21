'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/types';
import { RAGPipeline } from './RAGPipeline';
import { AgentRuntimeFlow } from './AgentRuntimeFlow';

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
    outcome: 'Built at HackEurope Paris in 30 hours.',
  },
  stacklink: {
    problem: 'European companies want to put AI on their internal knowledge — but not by piping their data through US-jurisdiction clouds. And a chatbot that only answers questions leaves the real cost untouched: the same work gets done by hand over and over, and tribal knowledge stays locked in people’s heads.',
    approach: 'Build the sovereign substrate first: mount a company’s connectors as a permission-aware layer, let governed AI agents act on that data under the same permissions a person would have, and log every action to a tamper-evident audit trail — deployable on the customer’s own infrastructure.',
    solution: [
      'EU-sovereign by construction: runs on the customer’s own GPUs or fully air-gapped — Cloud vs Sovereign is a config swap, not a code fork',
      'Connectors mounted as an ACL-aware layer (Drive, Slack, Notion, GitHub, Gmail, Calendar, Postgres), with reads and writes gated by the calling principal’s permissions',
      'Governed AI agents with a configurable autonomy spectrum and per-run guardrails — designed so “sales cannot see HR” on shared infrastructure',
      'Hybrid-retrieval RAG substrate: BM25 + pgvector HNSW + reciprocal-rank fusion with ACL pre-filter and post-check (the retrieval layer, not the product)',
      'Hash-chained, tamper-evident audit log and EU AI Act documentation built in',
      'Built as a 60+-package TypeScript monorepo across 8 deployable services (TS / Go / Python)',
    ],
    outcome: 'In pilot with the second-largest company in the Netherlands, with 60+ companies in the pipeline. Co-founded with Julius Brussee, targeting the European mid-market that wants AI without routing data through US jurisdiction.',
  },
  cape: {
    problem: 'Enterprise agentic systems were slow, expensive, and inaccurate. The existing pipeline handled 20 inputs in 55s with under 50% accuracy, burning through 190k tokens per run.',
    approach: 'Reworked how prompts are structured and chained. Rebuilt the pipeline architecture for scale and accuracy. Added observability and real-time feedback.',
    solution: [
      'Cut agent token usage from 190k to 1.2k per run by restructuring prompt pipelines, saving 99%+ on API costs',
      'Scaled from 20 inputs in 55s to 10k inputs in ~8s at 98% accuracy',
      'Built real-time UI that shows each element as the agent processes it',
      'Set up LangSmith for tracing and evaluation across runs',
      'Shipped Claude Code plugins and internal developer skills',
    ],
    outcome: 'Working in sprints across a large Python + TypeScript codebase. Ongoing.',
  },
  hackaway: {
    problem: 'Weekly grocery shopping wastes 30+ minutes. You forget staples, struggle to plan meals, go over budget, and realize too late your friend is vegan and coming for dinner Saturday.',
    approach: 'Built a multi-agent DAG system solo in 6 hours at the Hackaway hackathon (80 builders, AI House Amsterdam). Five specialized agents that negotiate and disagree rather than just sequencing API calls.',
    solution: [
      'Auto-replenishment mode detects when you are due for a shop and builds a cart from purchase history',
      'Meal planning takes natural language ("lasagna Wednesday, friends Saturday, under 80 euro") and maps to real Picnic recipes with verified prices',
      'Budget Optimizer rejects over-budget plans and negotiates cheaper ingredient substitutions',
      'Dietary intelligence swaps ingredients for vegan/halal/gluten-free guests on specific days without affecting other meals',
      'System learns across runs: brand preferences, spending patterns, dietary needs. Run 1 is good, run 23 is personal',
    ],
    outcome: 'Selected to pitch to judges. Every price grounded in real Picnic product catalog data, never hallucinated.',
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
      document.documentElement.style.overflow = 'hidden';
      // Stop Lenis smooth scroll so background doesn't scroll
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
      window.addEventListener('keydown', handleKeyDown);
      window.history.replaceState(null, '', `#project/${project.slug}`);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // Restart Lenis smooth scroll
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
      // Only clean hash if we had a project hash
      if (window.location.hash.startsWith('#project/')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
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
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`project-card-${project.slug}`}
              className="relative w-full max-w-full md:max-w-[900px] h-full md:h-auto max-h-full md:max-h-[85vh] overflow-y-auto overscroll-contain rounded-none md:rounded-xl border-0 md:border border-[var(--border)] pointer-events-auto"
              style={{ background: 'var(--surface-1, #0E0E14)', WebkitOverflowScrolling: 'touch' }}
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-1,#0E0E14)]/95 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
                  <h2
                    className="font-sans text-lg sm:text-xl font-bold truncate"
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
                    <div className="hidden sm:flex gap-3">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
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

              {/* Hero Video (Hackaway) */}
              {project.slug === 'hackaway' && (
                <div className="relative w-full aspect-video bg-black/50">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain"
                    src="/videos/hackaway-demo.mp4"
                  />
                </div>
              )}

              {/* Hero Video (Pitchr) */}
              {project.slug === 'pitchr' && (
                <div className="relative w-full aspect-video bg-black/50">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain"
                    src="/videos/pitchr-demo.mov"
                  />
                </div>
              )}

              {/* Real UI screenshots (Stacklink — captured from stacklink.nl) */}
              {project.slug === 'stacklink' && (
                <div className="relative w-full bg-black/30 p-4 sm:p-6">
                  {/* Landing hero */}
                  <a href="https://stacklink.nl" target="_blank" rel="noopener noreferrer" className="block group">
                    <img
                      src="/images/projects/sl-hero.png"
                      alt="Stacklink landing page — Unify your knowledge"
                      className="w-full rounded-lg border border-[var(--border)] mb-2 transition-opacity group-hover:opacity-90"
                    />
                    <p className="font-mono text-[10px] text-[var(--text-muted)] mb-4">
                      &gt; live at <span className="text-[var(--accent-cyan)]">stacklink.nl</span>
                    </p>
                  </a>
                  {/* Real product UI grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { src: 'sl-cited.png', cap: 'Ask once. One cited answer.' },
                      { src: 'sl-file.png', cap: 'Real analysis on the real file.' },
                      { src: 'sl-sql.png', cap: 'Live SQL. Every row audited.' },
                      { src: 'sl-watch.png', cap: 'Watchers ping Slack when it’s green.' },
                    ].map((shot) => (
                      <div key={shot.src}>
                        <p className="font-mono text-[10px] text-[var(--accent-cyan)] mb-1.5 uppercase tracking-wider">
                          {shot.cap}
                        </p>
                        <img
                          src={`/images/projects/${shot.src}`}
                          alt={`Stacklink — ${shot.cap}`}
                          className="w-full rounded-lg border border-[var(--border)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8">
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

                {/* Architecture + retrieval visualizations (Stacklink only) */}
                {project.slug === 'stacklink' && (
                  <>
                    <CLISection command="cat RUNTIME.svg" accentColor={project.accentColor}>
                      <AgentRuntimeFlow />
                    </CLISection>
                    <CLISection command="cat RETRIEVAL_SUBSTRATE.svg" accentColor={project.accentColor}>
                      <p className="font-mono text-[10px] text-[var(--text-muted)] mb-3">
                        Hybrid retrieval is the substrate beneath the agent runtime, not the product.
                      </p>
                      <RAGPipeline />
                    </CLISection>
                  </>
                )}

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
