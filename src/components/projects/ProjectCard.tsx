'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/types';

interface Props {
  project: Project;
  onClick: () => void;
}

/* ---------- Per-project visual treatments ---------- */

function PitchrBadge() {
  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="relative">
        <div
          className="relative px-2.5 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider text-white"
          style={{ background: 'linear-gradient(135deg, #ff5941, #ff8c42)' }}
        >
          HACKATHON PROJECT
        </div>
      </div>
    </div>
  );
}

function StacklinkBorder({ accentColor }: { accentColor: string }) {
  return (
    <div
      className="absolute inset-0 rounded-xl pointer-events-none"
      style={{
        padding: '1px',
        background: `conic-gradient(from var(--scan-angle, 0deg), transparent 60%, ${accentColor} 80%, transparent 100%)`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        animation: 'scanRotate 3s linear infinite',
      }}
    />
  );
}

function CapeInProgressBadge() {
  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 font-mono text-[10px] font-bold tracking-wider text-[#8B5CF6]">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"
        style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
      />
      IN PROGRESS
    </div>
  );
}

function HackawayBadge() {
  return (
    <div className="absolute top-3 right-3 z-10">
      <div
        className="px-2.5 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider text-white"
        style={{ background: 'linear-gradient(135deg, #e1423d, #ff6b5a)' }}
      >
        HACKATHON PROJECT
      </div>
    </div>
  );
}

/* ---------- Link Icons ---------- */

function LinkIcon({ icon }: { icon: string }) {
  if (icon === 'external') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 1.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V7.5" />
        <path d="M7 1.5h3.5V5" />
        <path d="M5 7L10.5 1.5" />
      </svg>
    );
  }
  if (icon === 'video') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="4.5,2.5 9.5,6 4.5,9.5" />
      </svg>
    );
  }
  if (icon === 'github') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 .5a5.5 5.5 0 0 0-1.74 10.72c.28.05.38-.12.38-.26v-.93c-1.54.34-1.87-.74-1.87-.74a1.47 1.47 0 0 0-.62-.81c-.5-.34.04-.34.04-.34a1.17 1.17 0 0 1 .85.57 1.18 1.18 0 0 0 1.62.46 1.18 1.18 0 0 1 .35-.74c-1.23-.14-2.52-.62-2.52-2.74a2.14 2.14 0 0 1 .57-1.49 2 2 0 0 1 .05-1.47s.47-.15 1.53.57a5.28 5.28 0 0 1 2.8 0c1.06-.72 1.52-.57 1.52-.57a2 2 0 0 1 .06 1.47 2.14 2.14 0 0 1 .57 1.49c0 2.13-1.3 2.6-2.53 2.74a1.32 1.32 0 0 1 .38 1.03v1.52c0 .15.1.32.38.26A5.5 5.5 0 0 0 6 .5Z" />
      </svg>
    );
  }
  return null;
}

/* ---------- Card Component ---------- */

export function ProjectCard({ project, onClick }: Props) {
  const isPitchr = project.slug === 'pitchr';
  const isStacklink = project.slug === 'stacklink';
  const isCape = project.slug === 'cape';
  const isHackaway = project.slug === 'hackaway';

  return (
    <motion.article
      data-cursor="VIEW"
      onClick={onClick}
      className="group relative rounded-xl cursor-pointer overflow-hidden"
      style={{
        background: 'var(--surface-1, #0E0E14)',
        border: isCape
          ? '1px dashed var(--border, #1E1E2E)'
          : '1px solid var(--border, #1E1E2E)',
        ...(isPitchr
          ? { borderLeft: '2px solid transparent', borderImage: 'linear-gradient(to bottom, #ff5941, #ff8c42) 1' }
          : {}),
      }}
      whileHover={{
        y: -3,
        boxShadow: `0 8px 30px ${project.accentColor}20, 0 0 0 1px ${project.accentColor}40`,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Stacklink scanning border */}
      {isStacklink && <StacklinkBorder accentColor={project.accentColor} />}

      {/* Terminal Chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border,#1E1E2E)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <code className="ml-2 font-mono text-[11px] text-[var(--text-muted,#555566)] truncate">
          $ {project.command}
        </code>
      </div>

      {/* Visual Area */}
      <div
        className="relative h-32 md:h-36 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${project.accentColor}08 0%, ${project.accentColor}15 50%, ${project.accentColor}05 100%)`,
        }}
      >
        {isPitchr && <PitchrBadge />}
        {isCape && <CapeInProgressBadge />}
        {isHackaway && <HackawayBadge />}

        {/* Pitchr: embedded demo video */}
        {isPitchr && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="/videos/pitchr-demo.mov"
          />
        )}

        {/* Hackaway: embedded launch video */}
        {isHackaway && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="/videos/hackaway-demo.mp4"
          />
        )}

        {/* Stacklink: actual landing page screenshot */}
        {isStacklink && (
          <img
            src="/images/projects/stacklink-hero.png"
            alt="Stacklink landing page"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
          />
        )}

        {/* Decorative grid dots (non-media projects) */}
        {!isPitchr && !isStacklink && !isHackaway && (
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(${project.accentColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
        )}
      </div>

      {/* Content Area */}
      <div className="p-5">
        <h3 className="font-sans text-lg font-semibold text-[var(--text-primary,#E8E6E3)] mb-2">
          {project.title}
        </h3>
        <p className="font-sans text-sm text-[var(--text-secondary,#8B8B9E)] leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded font-mono text-[10px] border"
              style={{
                color: project.accentColor,
                borderColor: `${project.accentColor}30`,
                backgroundColor: `${project.accentColor}08`,
              }}
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 5 && (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border)]">
              +{project.tags.length - 5}
            </span>
          )}
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="flex gap-3">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] transition-colors"
                style={{ color: project.accentColor }}
              >
                <LinkIcon icon={link.icon} />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
