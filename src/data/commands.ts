import type { CommandItem } from '@/types';

export function createCommands(scrollTo: (target: string) => void): CommandItem[] {
  return [
    { id: 'nav-about', group: 'Navigation', label: 'Go to About', description: 'Who I am', action: () => scrollTo('#about') },
    { id: 'nav-work', group: 'Navigation', label: 'Go to Work', description: 'Selected projects', action: () => scrollTo('#projects') },
    { id: 'nav-skills', group: 'Navigation', label: 'Go to Skills', description: 'What I work with', action: () => scrollTo('#skills') },
    { id: 'nav-experience', group: 'Navigation', label: 'Go to Experience', description: 'Work history', action: () => scrollTo('#experience') },
    { id: 'nav-contact', group: 'Navigation', label: 'Go to Contact', description: 'Get in touch', action: () => scrollTo('#contact') },
    { id: 'nav-top', group: 'Navigation', label: 'Back to top', description: 'Return to the start', action: () => scrollTo('#hero') },
    { id: 'act-resume', group: 'Actions', label: 'Download resume', description: 'PDF', action: () => { window.location.href = '/resume.pdf'; } },
    { id: 'act-email', group: 'Actions', label: 'Send email', description: 'lucas.duys@gmail.com', action: () => { window.location.href = 'mailto:lucas.duys@gmail.com'; } },
    { id: 'act-linkedin', group: 'Actions', label: 'Open LinkedIn', description: '/in/lucas-duys', action: () => { window.open('https://linkedin.com/in/lucas-duys', '_blank'); } },
    { id: 'act-github', group: 'Actions', label: 'Open GitHub', description: '/LucasDuys', action: () => { window.open('https://github.com/LucasDuys', '_blank'); } },
    { id: 'act-copy', group: 'Actions', label: 'Copy page link', description: 'Copy URL to clipboard', action: () => { navigator.clipboard.writeText(window.location.href); } },
  ];
}
