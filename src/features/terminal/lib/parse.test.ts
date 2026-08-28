import { describe, expect, it } from 'vitest';
import { parseInput } from './parse';

describe('parseInput', () => {
  it('returns null for empty input', () => {
    expect(parseInput('')).toBeNull();
    expect(parseInput('   ')).toBeNull();
  });

  it('splits command from args', () => {
    expect(parseInput('project serasalin-dev')).toEqual({
      raw: 'project serasalin-dev',
      name: 'project',
      args: ['serasalin-dev'],
    });
  });

  it('handles multiple whitespace between tokens', () => {
    expect(parseInput('  open   projects  ')).toEqual({
      raw: 'open   projects',
      name: 'open',
      args: ['projects'],
    });
  });
});
