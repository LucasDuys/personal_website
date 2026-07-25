export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  links: { label: string; url: string }[];
  status: 'live' | 'in-progress';
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ExperienceEntry {
  dateRange: string;
  title: string;
  company: string;
  description: string[];
  tags?: string[];
  status?: 'active' | 'completed';
}

export interface CommandItem {
  id: string;
  group: string;
  label: string;
  description: string;
  shortcut?: string;
  action: () => void;
}
