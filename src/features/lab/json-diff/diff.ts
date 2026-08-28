export type DiffEntry =
  | { kind: 'added'; path: string; value: unknown }
  | { kind: 'removed'; path: string; value: unknown }
  | { kind: 'changed'; path: string; from: unknown; to: unknown }
  | { kind: 'unchanged'; path: string; value: unknown };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const compareArrays = (base: unknown[], next: unknown[], path: string): DiffEntry[] => {
  const entries: DiffEntry[] = [];
  const max = Math.max(base.length, next.length);
  for (let i = 0; i < max; i += 1) {
    const p = `${path}[${i}]`;
    if (i >= base.length) {
      entries.push({ kind: 'added', path: p, value: next[i] });
    } else if (i >= next.length) {
      entries.push({ kind: 'removed', path: p, value: base[i] });
    } else {
      entries.push(...diffValue(base[i], next[i], p));
    }
  }
  return entries;
};

const diffValue = (base: unknown, next: unknown, path: string): DiffEntry[] => {
  if (Array.isArray(base) && Array.isArray(next)) return compareArrays(base, next, path);
  if (isObject(base) && isObject(next)) {
    const keys = new Set([...Object.keys(base), ...Object.keys(next)]);
    const entries: DiffEntry[] = [];
    for (const key of keys) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in base)) {
        entries.push({ kind: 'added', path: p, value: next[key] });
      } else if (!(key in next)) {
        entries.push({ kind: 'removed', path: p, value: base[key] });
      } else {
        entries.push(...diffValue(base[key], next[key], p));
      }
    }
    return entries;
  }
  if (Object.is(base, next)) return [{ kind: 'unchanged', path, value: base }];
  return [{ kind: 'changed', path, from: base, to: next }];
};

export const diffJson = (base: unknown, next: unknown): DiffEntry[] =>
  diffValue(base, next, '').filter((entry) => entry.kind !== 'unchanged');
