import type { SkillGroup } from '@/types';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'AI / ML',
    items: [
      'LLM integration',
      'RAG pipelines',
      'AI agents',
      'Agentic runtimes',
      'Knowledge graphs',
      'Prompt engineering',
      'Machine learning',
    ],
  },
  {
    label: 'Backend & infra',
    items: [
      'Node.js',
      'Python',
      'Go',
      'PostgreSQL',
      'Supabase',
      'Multi-tenant / ACL',
      'Monorepo / Turborepo',
      'REST APIs',
      'Git',
    ],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    label: 'Leadership & strategy',
    items: ['Operations', 'Agile', 'Workshop facilitation'],
  },
];
