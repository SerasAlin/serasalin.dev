export type TerminalLineKind = 'input' | 'output' | 'error' | 'system';

export type TerminalTextSpan = {
  type: 'text';
  value: string;
  emphasis?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';
};

export type TerminalLinkSpan = {
  type: 'link';
  href: string;
  label: string;
  external?: boolean;
};

export type TerminalSpan = TerminalTextSpan | TerminalLinkSpan;

export type TerminalLine = {
  id: string;
  kind: TerminalLineKind;
  spans: TerminalSpan[];
};

export type TerminalCommandContext = {
  args: string[];
  raw: string;
  now: Date;
  navigate: (href: string) => void;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  clear: () => void;
  print: (lines: TerminalLine[]) => void;
  commands: readonly TerminalCommand[];
};

export type TerminalCommand = {
  name: string;
  aliases?: readonly string[];
  description: string;
  usage?: string;
  category: 'Navigate' | 'Info' | 'Settings' | 'Fun' | 'Meta';
  hidden?: boolean;
  run: (ctx: TerminalCommandContext) => TerminalLine[] | Promise<TerminalLine[]>;
};
