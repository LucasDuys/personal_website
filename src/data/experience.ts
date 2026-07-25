import type { ExperienceEntry } from '@/types';

export const EXPERIENCE: ExperienceEntry[] = [
  {
    dateRange: 'Mar 2026 - Present',
    title: 'AI Engineering Intern',
    company: 'cape.io',
    description: [
      'Cut agent token usage from 190k to 1.2k per run by reworking how prompts are structured and chained, saving 99%+ on API costs',
      'The system originally handled 20 inputs in 55s with under 50% accuracy. Rebuilt the pipeline so it now processes 10k inputs in ~8s at 98%',
      'Built a permission-aware tool layer that authorizes every agent action per call, so agents can only touch what the calling user is allowed to',
      'Added real-time UI that shows each element as the agent processes it. Set up LangSmith for tracing and evaluation across runs',
      'Built and shipped Claude Code plugins and internal developer skills. Working in sprints across a large Python + TypeScript codebase',
    ],
    tags: ['LLM', 'Agents', 'Python', 'TypeScript', 'LangSmith', 'LangChain', 'Claude Code'],
    status: 'active',
  },
  {
    dateRange: 'Mar 2026 - Present',
    title: 'Co-founder',
    company: 'Stacklink',
    description: [
      'First Runner-Up at the TU/e Contest 2026 finals, pitching Stacklink on stage to the jury',
      'In pilot with the second-largest company in the Netherlands, with 60+ companies in the sales pipeline',
      'Co-founding an EU-sovereign agentic runtime: a permission-aware knowledge layer that lets governed AI agents act on company data, deployable on the customer’s own GPUs or fully air-gapped',
      'Architected as a 60+ package TypeScript monorepo with 8 deployable services (TS / Go / Python), where Cloud vs Sovereign is a config swap, not a code fork: every backend (model, embedding, sandbox, connector, audit) sits behind a versioned adapter',
      'Built the hybrid-retrieval RAG substrate on Postgres/pgvector: BM25 + HNSW vector + reciprocal-rank fusion with ACL pre-filter and post-check, plus reranking',
      'Mounted 7 connectors (Drive, Slack, Notion, GitHub, Gmail, Calendar, Postgres) as an ACL-aware tool surface, with a hash-chained, tamper-evident audit log and EU AI Act documentation',
    ],
    tags: ['Agentic runtime', 'EU-sovereign', 'Knowledge graph', 'Multi-tenant / ACL', 'TypeScript', 'Go', 'Postgres'],
    status: 'active',
  },
  {
    dateRange: 'Sep 2024 - Present',
    title: 'CS & Engineering Student',
    company: 'TU Eindhoven',
    description: [
      'Studying Computer Science & Engineering with a focus on AI and systems',
      'Building RAG pipelines, multi-agent systems, and AI products that ship',
      'Two hackathon projects pitched to judges (Paris, Amsterdam)',
    ],
    tags: ['CS', 'AI', 'Systems'],
    status: 'active',
  },
  {
    dateRange: 'Mar 2026',
    title: 'Hackathon Project',
    company: 'Hackaway x Picnic',
    description: [
      'Built Weekly Shop Agent in 6 hours: 5 AI agents that negotiate to fill your grocery cart',
      'Selected to pitch to judges out of 80 builders at AI House Amsterdam',
      'Multi-agent DAG with budget negotiation, meal planning, and dietary intelligence',
    ],
    tags: ['Hackathon', 'Multi-agent', 'Next.js', 'OpenAI'],
    status: 'completed',
  },
  {
    dateRange: 'Feb 2026',
    title: 'Hackathon Project',
    company: 'HackEurope Paris x Station F',
    description: [
      'Built Pitchr.live from scratch in 24 hours: AI pitch coach with rubric scoring and mock investor Q&A',
      'Wired up ElevenLabs STT + Claude for section-by-section scoring and voice agent practice mode',
      'Got the full prototype working under time pressure and demo-stable for judging',
    ],
    tags: ['Hackathon', 'Claude', 'ElevenLabs', 'Next.js'],
    status: 'completed',
  },
];
