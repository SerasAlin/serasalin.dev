import { describe, expect, it } from 'vitest';
import { complete } from './autocomplete';
import { commandRegistry } from '../commands';

describe('complete', () => {
  it('does nothing after a space (arg completion is out of scope)', () => {
    expect(complete('open ', commandRegistry).next).toBe('open ');
  });

  it('completes a unique prefix to the full name plus space', () => {
    const result = complete('who', commandRegistry);
    expect(result.next).toBe('whoami ');
  });

  it('advances to the common prefix when multiple match', () => {
    const result = complete('h', commandRegistry);
    expect(result.matches.length).toBeGreaterThan(0);
    expect('help'.startsWith(result.next.trimEnd())).toBe(true);
  });
});
