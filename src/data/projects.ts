import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'stacklink',
    title: 'Stacklink',
    description: 'EU-sovereign agentic runtime: a permission-aware knowledge layer that sits beneath a company’s apps and above any model. Mounts connectors (Drive, Slack, Notion, GitHub) so governed AI agents can act on company data — on the customer’s own GPUs or fully air-gapped, with a hash-chained audit log and EU AI Act docs built in. In pilot with the second-largest company in the Netherlands, with 60+ companies in the pipeline.',
    command: './stacklink/runtime --sovereign --audit',
    accentColor: '#22D3EE',
    tags: ['Agentic Runtime', 'EU-Sovereign', 'Knowledge Graph', 'Multi-tenant / ACL', 'TypeScript', 'Go', 'Postgres / pgvector', 'Monorepo (60+ pkgs)'],
    links: [
      { label: 'stacklink.nl', url: 'https://stacklink.nl', icon: 'external' },
    ],
    status: 'in-progress',
  },
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
    slug: 'cape',
    title: 'Cape.io',
    description: 'Building and optimizing agentic systems at an enterprise AI company. Cut token usage by 99%, scaled pipelines from 20 to 10k inputs, and built a permission-aware tool layer that authorizes every agent action per call.',
    command: 'cd cape.io && git log --oneline -1',
    accentColor: '#8B5CF6',
    tags: ['AI Agents', 'TypeScript', 'Python', 'LangChain', 'LangSmith', 'Claude Code'],
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
