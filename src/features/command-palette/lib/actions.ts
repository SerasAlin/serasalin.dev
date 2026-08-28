import { primaryNav, utilityNav } from '@/content/navigation';
import { profile } from '@/content/profile';
import { socialLinks } from '@/content/social';
import type { CommandAction } from '../types';

export const buildActions = (): CommandAction[] => {
  const navigation: CommandAction[] = [...primaryNav, ...utilityNav].map((item) => ({
    id: `nav:${item.href}`,
    title: `Go to ${item.label}`,
    subtitle: item.description,
    group: 'Navigate',
    keywords: [item.label.toLowerCase(), item.href],
    perform: ({ router, close }) => {
      router.push(item.href);
      close();
    },
  }));

  const external: CommandAction[] = socialLinks.map((link) => ({
    id: `ext:${link.id}`,
    title: `Open ${link.label}`,
    subtitle: link.href,
    group: 'External',
    keywords: [link.label.toLowerCase(), link.id],
    perform: ({ close }) => {
      window.open(link.href, '_blank', 'noopener,noreferrer');
      close();
    },
  }));

  const toggles: CommandAction[] = [
    {
      id: 'toggle:theme',
      title: 'Toggle theme',
      subtitle: 'Cycle system → light → dark',
      group: 'Toggle',
      keywords: ['dark', 'light', 'appearance', 'color'],
      shortcut: ['⇧', 'T'],
      perform: ({ toggleTheme }) => {
        toggleTheme();
      },
    },
    {
      id: 'action:open-terminal',
      title: 'Open terminal',
      subtitle: 'Focus the interactive terminal',
      group: 'Actions',
      keywords: ['shell', 'command', 'tty'],
      perform: ({ openTerminal, router, close }) => {
        router.push('/');
        openTerminal();
        close();
      },
    },
    {
      id: 'action:copy-email',
      title: 'Copy email address',
      subtitle: profile.email,
      group: 'Actions',
      keywords: ['email', 'contact', 'copy'],
      perform: async ({ close }) => {
        try {
          await navigator.clipboard.writeText(profile.email);
        } catch {
          // Clipboard blocked — quietly ignore; the /contact page is the fallback.
        }
        close();
      },
    },
  ];

  return [...navigation, ...toggles, ...external];
};
