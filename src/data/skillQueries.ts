export const skillQueries: Record<string, Record<string, number>> = {
  'AI': {
    'LLM/RAG Systems': 0.95, 'Embeddings & pgvector': 0.92, 'Hybrid Retrieval': 0.88,
    'Chunking Strategies': 0.85, 'Prompt Engineering': 0.90, 'Supabase': 0.40,
    'PostgreSQL': 0.35, 'Node.js': 0.20, 'TypeScript': 0.15,
  },
  'full-stack': {
    'React': 0.90, 'Next.js': 0.92, 'TypeScript': 0.88, 'Tailwind CSS': 0.80,
    'Node.js': 0.90, 'Supabase': 0.85, 'REST APIs': 0.82, 'PostgreSQL': 0.75,
    'HTML/CSS': 0.70, 'OAuth': 0.60, 'Git': 0.55,
  },
  'leadership': {
    'Operations Leadership': 0.95, 'Agile/Scrum': 0.85, 'Workshop Facilitation': 0.80,
  },
  'data pipeline': {
    'PostgreSQL': 0.90, 'Supabase': 0.88, 'Embeddings & pgvector': 0.92,
    'LLM/RAG Systems': 0.75, 'Hybrid Retrieval': 0.80, 'Chunking Strategies': 0.78,
  },
};

export function getRelevanceScores(query: string): Record<string, number> {
  const q = query.toLowerCase().trim();

  // Check pre-defined queries
  for (const [key, scores] of Object.entries(skillQueries)) {
    if (q.includes(key.toLowerCase()) || key.toLowerCase().includes(q)) {
      return scores;
    }
  }

  // Fallback: empty (no matches)
  return {};
}
