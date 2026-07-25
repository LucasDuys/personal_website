export type Cluster = 'ai' | 'backend' | 'frontend' | 'leadership';

export interface SkillNode {
  label: string;
  cluster: Cluster;
  /** base position, % of container */
  x: number;
  y: number;
  /** public/logos/<icon>.svg */
  icon?: string;
}

export const CLUSTER_LABELS: Record<Cluster, string> = {
  ai: 'AI / ML',
  backend: 'Backend & infra',
  frontend: 'Frontend',
  leadership: 'Leadership & strategy',
};

// Loose spatial clusters: frontend top-left, backend right,
// AI bottom-left/center, leadership bottom-right.
export const SKILL_NODES: SkillNode[] = [
  // Frontend
  { label: 'React', cluster: 'frontend', x: 12, y: 20, icon: 'react' },
  { label: 'Next.js', cluster: 'frontend', x: 26, y: 12, icon: 'nextdotjs' },
  { label: 'TypeScript', cluster: 'frontend', x: 34, y: 26, icon: 'typescript' },
  { label: 'Tailwind CSS', cluster: 'frontend', x: 16, y: 34, icon: 'tailwindcss' },

  // Backend & infra
  { label: 'Node.js', cluster: 'backend', x: 62, y: 14, icon: 'nodedotjs' },
  { label: 'Python', cluster: 'backend', x: 76, y: 22, icon: 'python' },
  { label: 'Go', cluster: 'backend', x: 88, y: 14, icon: 'go' },
  { label: 'PostgreSQL', cluster: 'backend', x: 70, y: 34, icon: 'postgresql' },
  { label: 'Supabase', cluster: 'backend', x: 85, y: 40, icon: 'supabase' },
  { label: 'Git', cluster: 'backend', x: 58, y: 42, icon: 'git' },
  { label: 'Turborepo', cluster: 'backend', x: 90, y: 27, icon: 'turborepo' },
  { label: 'Multi-tenant / ACL', cluster: 'backend', x: 74, y: 48, icon: undefined },

  // AI / ML
  { label: 'LLM integration', cluster: 'ai', x: 18, y: 58 },
  { label: 'RAG pipelines', cluster: 'ai', x: 34, y: 52 },
  { label: 'AI agents', cluster: 'ai', x: 10, y: 72 },
  { label: 'Agentic runtimes', cluster: 'ai', x: 28, y: 80 },
  { label: 'Knowledge graphs', cluster: 'ai', x: 44, y: 68 },
  { label: 'Prompt engineering', cluster: 'ai', x: 22, y: 92 },
  { label: 'LangChain', cluster: 'ai', x: 44, y: 88, icon: 'langchain' },
  { label: 'Anthropic', cluster: 'ai', x: 16, y: 48, icon: 'anthropic' },

  // Leadership & strategy
  { label: 'Operations', cluster: 'leadership', x: 68, y: 66 },
  { label: 'Agile', cluster: 'leadership', x: 84, y: 60 },
  { label: 'Workshop facilitation', cluster: 'leadership', x: 76, y: 82 },
];
