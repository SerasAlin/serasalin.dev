import { describe, expect, it } from 'vitest';
import { diffJson } from './diff';

describe('diffJson', () => {
  it('reports added and removed keys', () => {
    const diff = diffJson({ a: 1 }, { b: 2 });
    expect(diff).toEqual(
      expect.arrayContaining([
        { kind: 'removed', path: 'a', value: 1 },
        { kind: 'added', path: 'b', value: 2 },
      ]),
    );
  });

  it('reports changed leaves with from/to', () => {
    const diff = diffJson({ level: 'core' }, { level: 'exploring' });
    expect(diff).toEqual([{ kind: 'changed', path: 'level', from: 'core', to: 'exploring' }]);
  });

  it('handles nested objects and arrays', () => {
    const base = { user: { role: 'ic' }, tags: ['a', 'b'] };
    const next = { user: { role: 'staff' }, tags: ['a', 'b', 'c'] };
    const diff = diffJson(base, next);
    expect(diff).toContainEqual({ kind: 'changed', path: 'user.role', from: 'ic', to: 'staff' });
    expect(diff).toContainEqual({ kind: 'added', path: 'tags[2]', value: 'c' });
  });

  it('returns empty for identical inputs', () => {
    expect(diffJson({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })).toEqual([]);
  });
});
