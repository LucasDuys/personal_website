import { skills } from './skills';

export const skillQueries: Record<string, Record<string, number>> = {
  'AI': {
    'LLM Integration': 0.95, 'RAG Pipelines': 0.92, 'Prompt Engineering': 0.90,
    'AI Agents': 0.88, 'Machine Learning': 0.85, 'Python': 0.60,
    'Supabase': 0.30, 'PostgreSQL': 0.25,
  },
  'full-stack': {
    'React': 0.92, 'Next.js': 0.92, 'TypeScript': 0.90, 'Tailwind CSS': 0.82,
    'Node.js': 0.90, 'Supabase': 0.85, 'REST APIs': 0.82, 'PostgreSQL': 0.78,
    'Git': 0.55, 'Python': 0.40,
  },
  'frontend': {
    'React': 0.95, 'Next.js': 0.92, 'TypeScript': 0.88, 'Tailwind CSS': 0.90,
    'Node.js': 0.30, 'REST APIs': 0.40,
  },
  'backend': {
    'Node.js': 0.92, 'Supabase': 0.90, 'PostgreSQL': 0.88, 'REST APIs': 0.85,
    'Python': 0.75, 'Git': 0.60, 'TypeScript': 0.70,
  },
  'data pipeline': {
    'PostgreSQL': 0.90, 'Supabase': 0.85, 'RAG Pipelines': 0.92,
    'LLM Integration': 0.75, 'Python': 0.70, 'Machine Learning': 0.65,
  },
  'leadership': {
    'Operations': 0.95, 'Agile': 0.80, 'Workshop Facilitation': 0.75,
    'LLM Integration': 0.30, 'AI Agents': 0.25,
  },
  'soft skill': {
    'Operations': 0.95, 'Agile': 0.90, 'Workshop Facilitation': 0.88,
  },
  'management': {
    'Operations': 0.92, 'Agile': 0.85, 'Workshop Facilitation': 0.70,
  },
  'agile': {
    'Agile': 0.95, 'Operations': 0.60, 'Git': 0.40,
  },
  'workshop': {
    'Workshop Facilitation': 0.95, 'LLM Integration': 0.65, 'Prompt Engineering': 0.55,
    'Operations': 0.40,
  },
  'database': {
    'PostgreSQL': 0.95, 'Supabase': 0.90, 'RAG Pipelines': 0.60,
    'Node.js': 0.40, 'REST APIs': 0.35,
  },
  'react': {
    'React': 0.95, 'Next.js': 0.85, 'TypeScript': 0.75, 'Tailwind CSS': 0.70,
  },
  'python': {
    'Python': 0.95, 'Machine Learning': 0.80, 'LLM Integration': 0.60,
    'RAG Pipelines': 0.50, 'AI Agents': 0.45,
  },
};

export function getRelevanceScores(query: string): Record<string, number> {
  const q = query.toLowerCase().trim();
  if (!q) return {};

  // Check pre-defined queries (partial match both directions)
  for (const [key, scores] of Object.entries(skillQueries)) {
    if (q.includes(key.toLowerCase()) || key.toLowerCase().includes(q)) {
      return scores;
    }
  }

  // Fallback: fuzzy match against actual skill names
  const scores: Record<string, number> = {};
  let hasMatch = false;
  for (const skill of skills) {
    const name = skill.name.toLowerCase();
    if (name.includes(q) || q.includes(name)) {
      scores[skill.name] = 0.95;
      hasMatch = true;
      // Also boost connected skills
      for (const conn of skill.connections) {
        if (!scores[conn]) scores[conn] = 0.5;
      }
    }
  }

  return hasMatch ? scores : {};
}
