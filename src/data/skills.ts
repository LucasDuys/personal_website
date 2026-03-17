import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Frontend (cyan #22D3EE)
  { name: 'React', cluster: 'frontend', x: 18, y: 22, size: 14, connections: ['Next.js', 'TypeScript', 'Tailwind CSS'] },
  { name: 'Next.js', cluster: 'frontend', x: 26, y: 15, size: 13, connections: ['React', 'TypeScript'] },
  { name: 'TypeScript', cluster: 'frontend', x: 34, y: 28, size: 13, connections: ['React', 'Node.js'] },
  { name: 'Tailwind CSS', cluster: 'frontend', x: 12, y: 32, size: 11, connections: ['React'] },

  // Backend & Infra (purple #8B5CF6)
  { name: 'Node.js', cluster: 'backend', x: 65, y: 18, size: 13, connections: ['TypeScript', 'Supabase', 'REST APIs'] },
  { name: 'Supabase', cluster: 'backend', x: 72, y: 12, size: 12, connections: ['Node.js', 'PostgreSQL'] },
  { name: 'PostgreSQL', cluster: 'backend', x: 80, y: 22, size: 11, connections: ['Supabase'] },
  { name: 'REST APIs', cluster: 'backend', x: 60, y: 30, size: 10, connections: ['Node.js'] },
  { name: 'Python', cluster: 'backend', x: 75, y: 35, size: 10, connections: ['Node.js', 'Machine Learning'] },
  { name: 'Git', cluster: 'backend', x: 85, y: 30, size: 10, connections: [] },

  // AI / ML (amber #FBBF24)
  { name: 'LLM Integration', cluster: 'ai', x: 22, y: 62, size: 14, connections: ['RAG Pipelines', 'Prompt Engineering', 'AI Agents'] },
  { name: 'RAG Pipelines', cluster: 'ai', x: 35, y: 55, size: 12, connections: ['LLM Integration', 'PostgreSQL'] },
  { name: 'Prompt Engineering', cluster: 'ai', x: 15, y: 72, size: 11, connections: ['LLM Integration'] },
  { name: 'AI Agents', cluster: 'ai', x: 32, y: 75, size: 11, connections: ['LLM Integration'] },
  { name: 'Machine Learning', cluster: 'ai', x: 45, y: 68, size: 10, connections: ['Python', 'LLM Integration'] },

  // Leadership & Strategy (green #4ADE80)
  { name: 'Operations', cluster: 'soft', x: 68, y: 60, size: 12, connections: ['Scrum'] },
  { name: 'Scrum', cluster: 'soft', x: 75, y: 55, size: 11, connections: ['Operations'] },
  { name: 'Workshop Facilitation', cluster: 'soft', x: 82, y: 65, size: 10, connections: ['Operations'] },
];

export const CLUSTER_COLORS: Record<string, string> = {
  frontend: '#22D3EE',
  backend: '#8B5CF6',
  ai: '#FBBF24',
  soft: '#4ADE80',
};

export const CLUSTER_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend & Infra',
  ai: 'AI / ML',
  soft: 'Leadership & Strategy',
};
