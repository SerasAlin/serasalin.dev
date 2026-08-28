export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const primaryNav: readonly NavItem[] = [
  { href: '/', label: 'Home', description: 'Landing page' },
  { href: '/projects', label: 'Projects', description: 'Case studies and work' },
  { href: '/lab', label: 'Lab', description: 'Interactive engineering experiments' },
  { href: '/github', label: 'GitHub', description: 'Recent activity and stats' },
  { href: '/stack', label: 'Stack', description: 'Tools and technologies' },
  { href: '/writing', label: 'Writing', description: 'Notes and articles' },
  { href: '/api/docs', label: 'API', description: 'Public API for this site' },
  { href: '/contact', label: 'Contact', description: 'Get in touch' },
] as const;

export const utilityNav: readonly NavItem[] = [
  { href: '/about', label: 'About', description: 'Bio and background' },
  { href: '/uses', label: 'Uses', description: 'Editor, hardware, workflow' },
  { href: '/now', label: 'Now', description: 'What I am focused on right now' },
] as const;
