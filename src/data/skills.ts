import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Frontend (cyan #22D3EE) - cluster around x:20-35, y:20-40
  { name: 'React', cluster: 'frontend', x: 25, y: 28, size: 14, connections: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { name: 'Next.js', cluster: 'frontend', x: 30, y: 22, size: 13, connections: ['React', 'TypeScript'] },
  { name: 'TypeScript', cluster: 'frontend', x: 42, y: 30, size: 12, connections: ['React', 'Node.js', 'Vitest'] },
  { name: 'Tailwind CSS', cluster: 'frontend', x: 18, y: 35, size: 11, connections: ['React'] },
  { name: 'HTML/CSS', cluster: 'frontend', x: 12, y: 40, size: 9, connections: [] },
  { name: 'Responsive Design', cluster: 'frontend', x: 15, y: 45, size: 8, connections: [] },
  { name: 'Framer Motion', cluster: 'frontend', x: 28, y: 18, size: 9, connections: ['React'] },

  // Backend (purple #8B5CF6) - cluster around x:55-80, y:25-50
  { name: 'Node.js', cluster: 'backend', x: 62, y: 32, size: 13, connections: ['TypeScript', 'Supabase', 'REST APIs'] },
  { name: 'Supabase', cluster: 'backend', x: 68, y: 28, size: 12, connections: ['Node.js', 'PostgreSQL'] },
  { name: 'PostgreSQL', cluster: 'backend', x: 72, y: 35, size: 11, connections: ['Supabase', 'Embeddings & pgvector'] },
  { name: 'REST APIs', cluster: 'backend', x: 55, y: 38, size: 10, connections: ['Node.js', 'OAuth'] },
  { name: 'OAuth', cluster: 'backend', x: 58, y: 45, size: 9, connections: ['REST APIs', 'Google Drive API', 'Slack API'] },
  { name: 'Git', cluster: 'backend', x: 75, y: 48, size: 10, connections: [] },
  { name: 'Google Drive API', cluster: 'backend', x: 65, y: 50, size: 9, connections: ['OAuth'] },
  { name: 'Slack API', cluster: 'backend', x: 70, y: 52, size: 9, connections: ['OAuth'] },

  // AI/ML (amber #FBBF24) - cluster around x:25-45, y:60-80
  { name: 'LLM/RAG Systems', cluster: 'ai', x: 32, y: 68, size: 14, connections: ['Embeddings & pgvector', 'Hybrid Retrieval', 'Chunking Strategies', 'Prompt Engineering'] },
  { name: 'Embeddings & pgvector', cluster: 'ai', x: 40, y: 62, size: 12, connections: ['LLM/RAG Systems', 'PostgreSQL'] },
  { name: 'Hybrid Retrieval', cluster: 'ai', x: 38, y: 75, size: 11, connections: ['LLM/RAG Systems'] },
  { name: 'Chunking Strategies', cluster: 'ai', x: 25, y: 78, size: 10, connections: ['LLM/RAG Systems'] },
  { name: 'Prompt Engineering', cluster: 'ai', x: 28, y: 60, size: 10, connections: ['LLM/RAG Systems'] },

  // Soft Skills (green #4ADE80) - cluster around x:65-85, y:60-80
  { name: 'Agile/Scrum', cluster: 'soft', x: 72, y: 68, size: 11, connections: ['Operations Leadership'] },
  { name: 'Operations Leadership', cluster: 'soft', x: 78, y: 62, size: 12, connections: ['Agile/Scrum', 'Workshop Facilitation'] },
  { name: 'Workshop Facilitation', cluster: 'soft', x: 82, y: 72, size: 10, connections: ['Operations Leadership'] },
];

export const CLUSTER_COLORS: Record<string, string> = {
  frontend: '#22D3EE',
  backend: '#8B5CF6',
  ai: '#FBBF24',
  soft: '#4ADE80',
};

export const CLUSTER_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend / Infra',
  ai: 'AI / ML',
  soft: 'Soft Skills',
};
