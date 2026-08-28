import type { TerminalCommand } from '../types';

const commonPrefix = (values: string[]): string => {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0]!;
  let prefix = values[0]!;
  for (let i = 1; i < values.length; i += 1) {
    while (values[i]!.indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
};

export type CompletionResult = {
  next: string;
  matches: string[];
};

export const complete = (input: string, commands: readonly TerminalCommand[]): CompletionResult => {
  if (input.includes(' ')) return { next: input, matches: [] };
  const q = input.toLowerCase();
  const matches = commands
    .filter((c) => !c.hidden)
    .flatMap((c) => [c.name, ...(c.aliases ?? [])])
    .filter((name) => name.startsWith(q));

  if (matches.length === 0) return { next: input, matches: [] };
  if (matches.length === 1) return { next: `${matches[0]!} `, matches };
  const shared = commonPrefix(matches);
  return { next: shared.length > q.length ? shared : input, matches };
};
