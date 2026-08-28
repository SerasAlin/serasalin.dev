import { profile } from './profile';

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  external: boolean;
};

export const socialLinks: readonly SocialLink[] = [
  { id: 'github', label: 'GitHub', href: profile.github, external: true },
  { id: 'linkedin', label: 'LinkedIn', href: profile.linkedin, external: true },
  { id: 'email', label: 'Email', href: `mailto:${profile.email}`, external: true },
];
