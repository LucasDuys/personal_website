import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'pitchr',
    title: 'Pitchr.live',
    description: 'AI pitch coach for founders. Record your pitch, get rubric-scored feedback across 5 dimensions, receive a rewritten script, then face a mock Q&A with an AI investor.',
    command: 'cat pitchr.live/README.md',
    accentColor: '#ff5941',
    tags: ['Next.js', 'React 19', 'TypeScript', 'Tailwind 4', 'Supabase', 'Claude API', 'AssemblyAI', 'ElevenLabs'],
    links: [
      { label: 'Live Site', url: 'https://pitchr.live', icon: 'external' },
      { label: 'Demo Video', url: '#', icon: 'video' },
    ],
    status: 'live',
  },
  {
    slug: 'stacklink',
    title: 'Stacklink.nl',
    description: 'Internal knowledge retrieval for businesses. Ingest from Google Drive, chunk and embed documents, retrieve answers using hybrid vector + BM25 search with Reciprocal Rank Fusion.',
    command: './stacklink.nl/pipeline --visualize',
    accentColor: '#22D3EE',
    tags: ['Next.js 14', 'React', 'TypeScript', 'Tailwind', 'Supabase', 'pgvector', 'OpenRouter', 'Google Drive API'],
    links: [
      { label: 'Live Site', url: 'https://stacklink.nl', icon: 'external' },
    ],
    status: 'live',
  },
  {
    slug: 'cape',
    title: 'Cape.io',
    description: 'AI agent integration and development. Exploring how autonomous agents can enhance enterprise software platforms.',
    command: 'cd cape.io && git log --oneline -1',
    accentColor: '#8B5CF6',
    tags: ['AI Agents', 'TypeScript', 'Python'],
    links: [
      { label: 'Cape.io', url: 'https://cape.io', icon: 'external' },
    ],
    status: 'in-progress',
  },
  {
    slug: 'hackaway',
    title: 'Weekly Shop Agent',
    description: 'Multi-agent grocery orchestration for Picnic. Five AI agents collaborate through a DAG to turn one sentence into a complete weekly grocery order with meal planning, budget negotiation, and dietary intelligence.',
    command: 'cd hackaway && node orchestrate.ts --persona family',
    accentColor: '#e1423d',
    tags: ['Next.js', 'OpenAI', 'Multi-Agent', 'Framer Motion', 'Picnic API', 'DAG'],
    links: [
      { label: 'GitHub', url: 'https://github.com/LucasDuys/hackaway-grocery-agent', icon: 'github' },
    ],
    status: 'live',
  },
];
