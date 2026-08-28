import { describe, expect, it } from 'vitest';
import { rankCommands } from './match';
import type { CommandAction } from '../types';

const noop = () => {};

const cmds: CommandAction[] = [
  {
    id: 'a',
    title: 'Go to Projects',
    group: 'Navigate',
    keywords: ['projects', '/projects'],
    perform: noop,
  },
  { id: 'b', title: 'Toggle theme', group: 'Toggle', keywords: ['dark', 'light'], perform: noop },
  { id: 'c', title: 'Open GitHub', group: 'External', keywords: ['github'], perform: noop },
];

describe('rankCommands', () => {
  it('returns all commands when the query is empty', () => {
    expect(rankCommands(cmds, '')).toHaveLength(3);
  });

  it('ranks title prefix matches highest', () => {
    const ranked = rankCommands(cmds, 'go');
    expect(ranked[0]?.id).toBe('a');
  });

  it('supports subsequence matches on keywords', () => {
    const ranked = rankCommands(cmds, 'drk');
    expect(ranked.map((c) => c.id)).toContain('b');
  });

  it('filters out non-matches', () => {
    expect(rankCommands(cmds, 'zzz')).toHaveLength(0);
  });
});
