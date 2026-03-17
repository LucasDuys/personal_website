export interface CommandItem {
  id: string;
  group: string;
  groupColor: string;
  icon: string;
  label: string;
  description: string;
  shortcut?: string;
  action: () => void;
}

export function createCommands(scrollTo: (target: string) => void): CommandItem[] {
  return [
    // Navigation
    { id: 'nav-about', group: 'Navigation', groupColor: '#4ADE80', icon: '\u2192', label: 'Go to About', description: 'Learn about Lucas', action: () => scrollTo('#about') },
    { id: 'nav-work', group: 'Navigation', groupColor: '#4ADE80', icon: '\u25FB', label: 'Go to Work', description: 'View projects', action: () => scrollTo('#projects') },
    { id: 'nav-skills', group: 'Navigation', groupColor: '#4ADE80', icon: '\u26A1', label: 'Go to Skills', description: 'Technical skills', action: () => scrollTo('#skills') },
    { id: 'nav-experience', group: 'Navigation', groupColor: '#4ADE80', icon: '\uD83D\uDCCB', label: 'Go to Experience', description: 'Work history', action: () => scrollTo('#experience') },
    { id: 'nav-contact', group: 'Navigation', groupColor: '#4ADE80', icon: '\u2709', label: 'Go to Contact', description: 'Get in touch', action: () => scrollTo('#contact') },
    { id: 'nav-top', group: 'Navigation', groupColor: '#4ADE80', icon: '\u2191', label: 'Back to Top', description: 'Return to hero', action: () => scrollTo('#hero') },
    // Actions
    { id: 'act-resume', group: 'Actions', groupColor: '#22D3EE', icon: '\uD83D\uDCC4', label: 'Download Resume', description: 'Get PDF resume', action: () => { window.location.href = '/resume.pdf'; } },
    { id: 'act-email', group: 'Actions', groupColor: '#22D3EE', icon: '\u2709', label: 'Send Email', description: 'Open mail client', action: () => { window.location.href = 'mailto:lucas.duys@gmail.com'; } },
    { id: 'act-linkedin', group: 'Actions', groupColor: '#22D3EE', icon: '\uD83D\uDCBC', label: 'View LinkedIn', description: 'Open LinkedIn', action: () => { window.location.href = 'https://linkedin.com/in/lucas-duys'; } },
    { id: 'act-copy', group: 'Actions', groupColor: '#22D3EE', icon: '\uD83D\uDD17', label: 'Copy Link', description: 'Copy page URL', action: () => { navigator.clipboard.writeText(window.location.href); } },
  ];
}
