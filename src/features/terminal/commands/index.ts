import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { skillCategories } from '@/content/skills';
import { labExperiments } from '@/content/lab';
import { usesCategories } from '@/content/uses';
import { now } from '@/content/now';
import { articles } from '@/content/writing';
import type { TerminalCommand, TerminalLine } from '../types';
import { blank, line, link, text } from '../lib/line';

const HELP_ORDER: TerminalCommand['category'][] = ['Info', 'Navigate', 'Settings', 'Meta', 'Fun'];

const helpCommand: TerminalCommand = {
  name: 'help',
  aliases: ['?'],
  description: 'List available commands.',
  category: 'Meta',
  run: ({ commands }) => {
    const visible = commands.filter((c) => !c.hidden);
    const grouped = new Map<TerminalCommand['category'], TerminalCommand[]>();
    for (const cmd of visible) {
      grouped.set(cmd.category, [...(grouped.get(cmd.category) ?? []), cmd]);
    }
    const lines: TerminalLine[] = [line([text('Commands are typed just like in a shell.')])];
    for (const cat of HELP_ORDER) {
      const list = grouped.get(cat);
      if (!list || list.length === 0) continue;
      lines.push(blank(), line([text(`— ${cat} —`, 'accent')]));
      for (const cmd of list) {
        lines.push(line([text(cmd.name.padEnd(14), 'accent'), text(cmd.description)]));
      }
    }
    lines.push(blank(), line([text('Try `whoami`, `projects`, or `open github`.', 'muted')]));
    return lines;
  },
};

const whoamiCommand: TerminalCommand = {
  name: 'whoami',
  description: 'Print my identity.',
  category: 'Info',
  run: () => [
    line([text(profile.name, 'accent'), text(' — '), text(profile.role)]),
    line([text(profile.headline, 'muted')]),
    line([text(`Location: ${profile.location} (${profile.timezone})`, 'muted')]),
  ],
};

const aboutCommand: TerminalCommand = {
  name: 'about',
  description: 'A short bio.',
  category: 'Info',
  run: () => [
    line([text(profile.bio)]),
    blank(),
    line([text('Currently focused on:', 'muted')]),
    ...profile.focus.map((f) => line([text('  • '), text(f)])),
  ],
};

const skillsCommand: TerminalCommand = {
  name: 'skills',
  description: 'Print a summary of my stack.',
  category: 'Info',
  run: () => {
    const lines: TerminalLine[] = [];
    for (const cat of skillCategories) {
      lines.push(line([text(cat.title, 'accent')]));
      lines.push(line([text(cat.skills.map((s) => s.name).join(', '), 'muted')]));
      lines.push(blank());
    }
    return lines;
  },
};

const projectsCommand: TerminalCommand = {
  name: 'projects',
  description: 'List projects.',
  category: 'Info',
  run: () => [
    line([text('Type `project <slug>` to open one.', 'muted')]),
    blank(),
    ...projects.map((p) => line([text(p.slug.padEnd(24), 'accent'), text(p.tagline)])),
  ],
};

const projectCommand: TerminalCommand = {
  name: 'project',
  description: 'Open a project by slug.',
  usage: 'project <slug>',
  category: 'Navigate',
  run: ({ args, navigate }) => {
    const slug = args[0];
    if (!slug) {
      return [line([text('Usage: project <slug>', 'warning')])];
    }
    const found = projects.find((p) => p.slug === slug);
    if (!found) {
      return [line([text(`No project matches "${slug}".`, 'danger')])];
    }
    navigate(`/projects/${found.slug}`);
    return [line([text(`Opening ${found.title}…`, 'success')])];
  },
};

const openCommand: TerminalCommand = {
  name: 'open',
  description: 'Navigate to an internal path.',
  usage: 'open <path|shortcut>',
  category: 'Navigate',
  run: ({ args, navigate }) => {
    const target = args[0];
    if (!target) return [line([text('Usage: open <path>', 'warning')])];
    const shortcuts: Record<string, string> = {
      home: '/',
      projects: '/projects',
      lab: '/lab',
      github: '/github',
      stack: '/stack',
      uses: '/uses',
      writing: '/writing',
      now: '/now',
      contact: '/contact',
      api: '/api/docs',
    };
    const href = shortcuts[target] ?? (target.startsWith('/') ? target : `/${target}`);
    navigate(href);
    return [line([text(`Opening ${href}…`, 'success')])];
  },
};

const labCommand: TerminalCommand = {
  name: 'lab',
  description: 'List Lab experiments.',
  category: 'Info',
  run: () => [
    line([text('Interactive experiments in /lab.', 'muted')]),
    blank(),
    ...labExperiments.map((l) =>
      line([
        text(l.slug.padEnd(18), 'accent'),
        text(l.tagline),
        text('  '),
        text(
          l.status === 'live' ? '[live]' : '[planned]',
          l.status === 'live' ? 'success' : 'muted',
        ),
      ]),
    ),
  ],
};

const stackCommand: TerminalCommand = {
  name: 'stack',
  description: 'Open the stack page.',
  category: 'Navigate',
  run: ({ navigate }) => {
    navigate('/stack');
    return [line([text('Opening /stack…', 'success')])];
  },
};

const usesCommand: TerminalCommand = {
  name: 'uses',
  description: 'Print my daily tools.',
  category: 'Info',
  run: () => {
    const lines: TerminalLine[] = [];
    for (const cat of usesCategories) {
      lines.push(line([text(cat.title, 'accent')]));
      for (const item of cat.items) {
        lines.push(line([text('  • '), text(item.name)]));
      }
      lines.push(blank());
    }
    return lines;
  },
};

const nowCommand: TerminalCommand = {
  name: 'now',
  description: "What I'm focused on right now.",
  category: 'Info',
  run: () => [
    line([text(`Updated ${now.updated}`, 'muted')]),
    blank(),
    line([text('Building:', 'accent')]),
    ...now.building.map((s) => line([text('  • '), text(s)])),
    blank(),
    line([text('Learning:', 'accent')]),
    ...now.learning.map((s) => line([text('  • '), text(s)])),
  ],
};

const writingCommand: TerminalCommand = {
  name: 'writing',
  description: 'List recent articles.',
  category: 'Info',
  run: () => [
    ...articles.map((a) =>
      line([
        text(a.slug.padEnd(38), 'accent'),
        text(a.title),
        text('  '),
        text(a.publishedAt, 'muted'),
      ]),
    ),
    blank(),
    line([text('Open one with `open writing/<slug>`.', 'muted')]),
  ],
};

const contactCommand: TerminalCommand = {
  name: 'contact',
  description: 'Show contact links.',
  category: 'Info',
  run: () => [
    line([text('Email: '), link(profile.email, `mailto:${profile.email}`, true)]),
    line([text('GitHub: '), link(profile.github, profile.github, true)]),
    line([text('LinkedIn: '), link(profile.linkedin, profile.linkedin, true)]),
  ],
};

const clearCommand: TerminalCommand = {
  name: 'clear',
  aliases: ['cls'],
  description: 'Clear the screen.',
  category: 'Meta',
  run: ({ clear }) => {
    clear();
    return [];
  },
};

const historyCommand: TerminalCommand = {
  name: 'history',
  description: 'Print recently run commands.',
  category: 'Meta',
  run: () => [line([text('Use ↑ and ↓ to walk through history.', 'muted')])],
};

const themeCommand: TerminalCommand = {
  name: 'theme',
  description: 'Set the color scheme.',
  usage: 'theme [light|dark|system]',
  category: 'Settings',
  run: ({ args, setTheme, toggleTheme }) => {
    const mode = args[0];
    if (!mode) {
      toggleTheme();
      return [line([text('Cycled theme.', 'success')])];
    }
    if (mode === 'light' || mode === 'dark' || mode === 'system') {
      setTheme(mode);
      return [line([text(`Theme set to ${mode}.`, 'success')])];
    }
    return [line([text('Usage: theme [light|dark|system]', 'warning')])];
  },
};

const echoCommand: TerminalCommand = {
  name: 'echo',
  description: 'Print arguments.',
  category: 'Meta',
  hidden: true,
  run: ({ args }) => [line([text(args.join(' '))])],
};

const dateCommand: TerminalCommand = {
  name: 'date',
  description: 'Print the current date.',
  category: 'Meta',
  hidden: true,
  run: ({ now: at }) => [line([text(at.toISOString())])],
};

const sudoCommand: TerminalCommand = {
  name: 'sudo',
  description: 'Attempt to escalate privileges.',
  category: 'Fun',
  run: ({ args }) => {
    if (args.join(' ').includes('hire-me')) {
      return [
        line([text('Access granted.', 'success')]),
        line([text('See /contact — inbox is open.', 'muted')]),
      ];
    }
    return [
      line([text('Nice try. This shell is unprivileged.', 'warning')]),
      line([text('Try `sudo hire-me`.', 'muted')]),
    ];
  },
};

const coffeeCommand: TerminalCommand = {
  name: 'coffee',
  description: 'Make coffee.',
  category: 'Fun',
  run: () => [line([text("418 · I'm a teapot. But I appreciate the offer.", 'muted')])],
};

const vimCommand: TerminalCommand = {
  name: 'vim',
  description: 'Open vim.',
  category: 'Fun',
  run: () => [line([text('Not today. `:q!` if you need to escape.', 'muted')])],
};

const matrixCommand: TerminalCommand = {
  name: 'matrix',
  description: 'Follow the white rabbit.',
  category: 'Fun',
  run: () => [
    line([text('01001000 01100101 01101100 01101100 01101111', 'accent')]),
    line([text('Wake up, developer.', 'muted')]),
  ],
};

const fortuneCommand: TerminalCommand = {
  name: 'fortune',
  description: 'A short line of wisdom.',
  category: 'Fun',
  run: () => {
    const fortunes = [
      'Two hard things: naming, and cache invalidation.',
      'Server Components own the data. Clients own the interactions.',
      'The most important abstraction is the one you did not add.',
      'Errors are just data flowing the wrong way.',
    ];
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)]!;
    return [line([text(pick, 'muted')])];
  },
};

const rmSafeguardCommand: TerminalCommand = {
  name: 'rm',
  description: 'Refuse dangerous removals.',
  category: 'Fun',
  hidden: true,
  run: ({ args }) => {
    const joined = args.join(' ');
    if (joined.includes('-rf') && joined.includes('/')) {
      return [
        line([text('Nice try. This shell is a demo.', 'warning')]),
        line([text('No filesystem, no destructive operations.', 'muted')]),
      ];
    }
    return [line([text('rm: nothing to remove — this is a browser shell.', 'muted')])];
  },
};

export const commandRegistry: TerminalCommand[] = [
  helpCommand,
  whoamiCommand,
  aboutCommand,
  skillsCommand,
  projectsCommand,
  projectCommand,
  openCommand,
  labCommand,
  stackCommand,
  usesCommand,
  nowCommand,
  writingCommand,
  contactCommand,
  clearCommand,
  historyCommand,
  themeCommand,
  echoCommand,
  dateCommand,
  sudoCommand,
  coffeeCommand,
  vimCommand,
  matrixCommand,
  fortuneCommand,
  rmSafeguardCommand,
];

export const findCommand = (
  name: string,
  registry: readonly TerminalCommand[] = commandRegistry,
): TerminalCommand | undefined => {
  const lower = name.toLowerCase();
  return registry.find((c) => c.name === lower || c.aliases?.includes(lower));
};
