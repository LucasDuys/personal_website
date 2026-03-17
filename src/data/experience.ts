import type { ExperienceEntry } from '@/types';

export const EXPERIENCE: ExperienceEntry[] = [
  {
    hash: 'a3f7c1d',
    dateRange: 'Sep 2025 - Present',
    title: 'AI Intern',
    company: 'cape.io',
    companyColor: 'var(--accent-green)',
    description: [
      'Building AI agent integrations for enterprise workflow automation',
      'Designing and shipping LLM-powered features across the platform',
      'Working in a fast-moving environment where the problem space evolves daily',
    ],
    tags: ['LLM', 'Agents', 'Python', 'TypeScript'],
    status: 'active',
  },
  {
    hash: 'e9b2f4a',
    dateRange: 'Feb 2025 - Jun 2025',
    title: 'Operations Lead',
    company: 'Amplifirm',
    companyColor: 'var(--accent-purple)',
    description: [
      'Led operations at a London-based startup, driving measurable business outcomes',
      'Built internal dashboards and automated workflows that scaled team output',
      'Moved real metrics - not vanity numbers',
    ],
    tags: ['Operations', 'Automation', 'Dashboards'],
    metrics: [
      { label: 'Pipeline Growth', value: 40, suffix: '%' },
      { label: 'Efficiency Gain', value: 60, suffix: '%' },
      { label: 'Output Increase', value: 35, suffix: '%' },
    ],
    status: 'completed',
  },
  {
    hash: 'c8d1e5f',
    dateRange: 'Sep 2024 - Present',
    title: 'CS & Engineering Student',
    company: 'TU Eindhoven',
    companyColor: 'var(--accent-cyan)',
    description: [
      'Studying Computer Science & Engineering with a focus on AI and systems',
      'Created and led LLM workshops - turning "AI is magic" into practical skills',
      'Building projects that ship, not just assignments that pass',
    ],
    tags: ['CS', 'AI', 'Systems', 'Education'],
    status: 'active',
  },
  {
    hash: 'f2a9b3c',
    dateRange: 'Nov 2024',
    title: 'Hackathon Project',
    company: 'HEC Paris x Station F',
    companyColor: 'var(--accent-amber)',
    description: [
      'Built a live product from scratch in 24 hours at HackEurope Paris',
      'Pitched to judges and demonstrated a working prototype',
      'Proved that speed + quality is not a tradeoff when you care enough',
    ],
    tags: ['Hackathon', 'Product', 'Pitch'],
    status: 'completed',
  },
  {
    hash: 'd7e4f8a',
    dateRange: 'Jun 2024 - Aug 2024',
    title: 'Project: Stacklink',
    company: 'Personal Project',
    companyColor: 'var(--text-secondary)',
    description: [
      'Built a retrieval-augmented generation system for internal knowledge retrieval',
      'Focused on precision - systems that actually retrieve the right answer',
      'Designed embedding pipelines and evaluation frameworks from scratch',
    ],
    tags: ['RAG', 'Embeddings', 'LLM', 'Python'],
    status: 'completed',
  },
];
