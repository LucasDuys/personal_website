import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'stacklink',
    image: '/images/projects/sl-hero.png',
    imageAlt: 'Stacklink landing page',
    title: 'Stacklink',
    description:
      'EU-sovereign agentic runtime: a permission-aware knowledge layer that sits beneath a company’s apps and above any model. Mounts connectors (Drive, Slack, Notion, GitHub) so governed AI agents can act on company data, on the customer’s own GPUs or fully air-gapped, with a hash-chained audit log and EU AI Act docs built in. In pilot with the second-largest company in the Netherlands, with 60+ companies in the pipeline.',
    tags: ['Agentic runtime', 'EU-sovereign', 'Knowledge graph', 'Multi-tenant / ACL', 'TypeScript', 'Go', 'Postgres / pgvector'],
    links: [{ label: 'stacklink.nl', url: 'https://stacklink.nl' }],
    status: 'in-progress',
  },
  {
    slug: 'pitchr',
    image: '/images/projects/pitchr-live.jpg',
    imageAlt: 'Pitchr.live landing page',
    title: 'Pitchr.live',
    description:
      'AI pitch coach for founders. Record your pitch, get rubric-scored feedback across 5 dimensions, receive a rewritten script, then face a mock Q&A with an AI investor. Built from scratch in 24 hours at HackEurope Paris.',
    tags: ['Next.js', 'React 19', 'TypeScript', 'Supabase', 'Claude API', 'AssemblyAI', 'ElevenLabs'],
    links: [{ label: 'pitchr.live', url: 'https://pitchr.live' }],
    status: 'live',
  },
  {
    slug: 'cape',
    image: '/images/projects/cape-live.jpg',
    imageAlt: 'Cape.io landing page',
    title: 'Cape.io',
    description:
      'Building and optimizing agentic systems at an enterprise AI company. Cut token usage by 99%, scaled pipelines from 20 to 10k inputs, and built a permission-aware tool layer that authorizes every agent action per call.',
    tags: ['AI agents', 'TypeScript', 'Python', 'LangChain', 'LangSmith', 'Claude Code'],
    links: [{ label: 'cape.io', url: 'https://cape.io' }],
    status: 'in-progress',
  },
  {
    slug: 'hackaway',
    image: '/images/projects/hackaway-demo.jpg',
    imageAlt: 'Weekly Shop Agent assembling a Picnic cart',
    title: 'Weekly Shop Agent',
    description:
      'Multi-agent grocery orchestration for Picnic. Five AI agents collaborate through a DAG to turn one sentence into a complete weekly grocery order with meal planning, budget negotiation, and dietary intelligence.',
    tags: ['Next.js', 'OpenAI', 'Multi-agent', 'Framer Motion', 'Picnic API', 'DAG'],
    links: [{ label: 'GitHub', url: 'https://github.com/LucasDuys/hackaway-grocery-agent' }],
    status: 'live',
  },
];
