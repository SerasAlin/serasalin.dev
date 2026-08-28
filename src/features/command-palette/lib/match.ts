import type { CommandAction } from '../types';

const normalize = (value: string): string => value.toLowerCase().trim();

const scoreOne = (haystack: string, needle: string): number => {
  if (!needle) return 1;
  if (haystack.startsWith(needle)) return 100 - haystack.length;
  if (haystack.includes(needle)) return 60 - haystack.length;
  // Subsequence match — every char of needle appears in order in haystack.
  let hi = 0;
  for (let ni = 0; ni < needle.length; ni += 1) {
    const ch = needle[ni]!;
    const found = haystack.indexOf(ch, hi);
    if (found === -1) return 0;
    hi = found + 1;
  }
  return 20;
};

export const rankCommands = (
  commands: readonly CommandAction[],
  rawQuery: string,
): CommandAction[] => {
  const query = normalize(rawQuery);
  if (!query) return [...commands];

  const scored = commands.map((cmd) => {
    const haystacks = [cmd.title, cmd.subtitle ?? '', cmd.group, ...(cmd.keywords ?? [])]
      .map(normalize)
      .filter(Boolean);
    let best = 0;
    for (const h of haystacks) {
      best = Math.max(best, scoreOne(h, query));
    }
    return { cmd, score: best };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ cmd }) => cmd);
};
