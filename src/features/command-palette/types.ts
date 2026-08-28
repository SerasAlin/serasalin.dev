import type { ReactNode } from 'react';

export type CommandAction = {
  id: string;
  title: string;
  subtitle?: string;
  group: 'Navigate' | 'Actions' | 'Toggle' | 'External';
  keywords?: readonly string[];
  icon?: ReactNode;
  shortcut?: readonly string[];
  perform: (ctx: CommandContext) => void | Promise<void>;
};

export type CommandContext = {
  router: {
    push: (href: string) => void;
  };
  toggleTheme: () => void;
  openTerminal: () => void;
  close: () => void;
};
