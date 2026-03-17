import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Frontend (cyan #22D3EE)
  { name: 'React', cluster: 'frontend', x: 22, y: 28, size: 14, connections: ['Next.js', 'TypeScript', 'Tailwind CSS'] },
  { name: 'Next.js', cluster: 'frontend', x: 30, y: 20, size: 13, connections: ['React', 'TypeScript'] },
  { name: 'TypeScript', cluster: 'frontend', x: 38, y: 32, size: 13, connections: ['React', 'Node.js'] },
  { name: 'Tailwind CSS', cluster: 'frontend', x: 16, y: 38, size: 11, connections: ['React'] },

  // Backend & Infra (purple #8B5CF6)
  { name: 'Node.js', cluster: 'backend', x: 62, y: 28, size: 13, connections: ['TypeScript', 'Supabase', 'REST APIs'] },
  { name: 'Supabase', cluster: 'backend', x: 70, y: 22, size: 12, connections: ['Node.js', 'PostgreSQL'] },
  { name: 'PostgreSQL', cluster: 'backend', x: 78, y: 30, size: 11, connections: ['Supabase'] },
  { name: 'REST APIs', cluster: 'backend', x: 58, y: 38, size: 10, connections: ['Node.js'] },
  { name: 'Python', cluster: 'backend', x: 72, y: 42, size: 10, connections: ['Node.js', 'Machine Learning'] },
  { name: 'Git', cluster: 'backend', x: 82, y: 40, size: 10, connections: [] },

  // AI / ML (amber #FBBF24)
  { name: 'LLM Integration', cluster: 'ai', x: 30, y: 68, size: 14, connections: ['RAG Pipelines', 'Prompt Engineering', 'AI Agents'] },
  { name: 'RAG Pipelines', cluster: 'ai', x: 40, y: 62, size: 12, connections: ['LLM Integration', 'PostgreSQL'] },
  { name: 'Prompt Engineering', cluster: 'ai', x: 22, y: 75, size: 11, connections: ['LLM Integration'] },
  { name: 'AI Agents', cluster: 'ai', x: 38, y: 78, size: 11, connections: ['LLM Integration'] },
  { name: 'Machine Learning', cluster: 'ai', x: 50, y: 72, size: 10, connections: ['Python', 'LLM Integration'] },
];

export const CLUSTER_COLORS: Record<string, string> = {
  frontend: '#22D3EE',
  backend: '#8B5CF6',
  ai: '#FBBF24',
};

export const CLUSTER_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend & Infra',
  ai: 'AI / ML',
};
