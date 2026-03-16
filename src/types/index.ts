export interface SectionConfig {
  id: string;
  index: string;
  label: string;
  command?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  command: string;
  accentColor: string;
  tags: string[];
  links: { label: string; url: string; icon: 'external' | 'github' | 'video' }[];
  status?: 'live' | 'in-progress';
}

export interface Skill {
  name: string;
  cluster: 'frontend' | 'backend' | 'ai' | 'soft';
  x: number;
  y: number;
  size: number;
  connections: string[];
}

export interface ExperienceEntry {
  hash: string;
  dateRange: string;
  title: string;
  company: string;
  companyColor: string;
  description: string[];
  tags?: string[];
  metrics?: { label: string; value: number; suffix: string }[];
  status?: 'active' | 'completed';
}

export interface Command {
  id: string;
  group: string;
  icon: string;
  label: string;
  description: string;
  shortcut?: string;
  action: () => void;
}
