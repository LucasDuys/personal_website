'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CaseStudyPanel } from '@/components/projects/CaseStudyPanel';
import { projects } from '@/data/projects';
import type { Project } from '@/types';

const sectionConfig = { id: 'projects', index: '003', label: 'work' };

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <SectionWrapper config={sectionConfig}>
      {/* CLI intro */}
      <div className="mb-12 font-mono text-sm">
        <div className="mb-3">
          <span className="text-[var(--accent-green)]">visitor</span>
          <span className="text-[var(--text-muted)]">@</span>
          <span className="text-[var(--accent-cyan)]">lucas.dev</span>
          <span className="text-[var(--text-muted)]">:~$ </span>
          <span className="text-[var(--text-primary)]">ls -la ~/projects/</span>
        </div>
        <div className="ml-0 space-y-0.5 text-xs">
          <div className="text-[var(--text-muted)]">total 4</div>
          {projects.map((p) => (
            <div key={p.slug} className="flex gap-4">
              <span className="text-[var(--text-muted)]">drwxr-xr-x</span>
              <span className="text-[var(--text-muted)]">lucas</span>
              <span style={{ color: p.accentColor }}>{p.slug}/</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {projects.map((project) => (
          <motion.div key={project.slug} variants={cardVariants}>
            <ProjectCard
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Case Study Overlay */}
      <CaseStudyPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </SectionWrapper>
  );
}
