import type { TerminalLine, TerminalLineKind, TerminalSpan, TerminalTextSpan } from '../types';

let counter = 0;
const nextId = (): string => {
  counter += 1;
  return `l${Date.now().toString(36)}-${counter.toString(36)}`;
};

const isSpanArray = (spans: readonly (TerminalSpan | string)[]): spans is TerminalSpan[] =>
  spans.every((s) => typeof s !== 'string');

export const line = (
  spans: readonly (TerminalSpan | string)[],
  kind: TerminalLineKind = 'output',
): TerminalLine => ({
  id: nextId(),
  kind,
  spans: isSpanArray(spans)
    ? [...spans]
    : spans.map((s) =>
        typeof s === 'string' ? ({ type: 'text', value: s } satisfies TerminalTextSpan) : s,
      ),
});

export const text = (value: string, emphasis?: TerminalTextSpan['emphasis']): TerminalTextSpan => ({
  type: 'text',
  value,
  ...(emphasis ? { emphasis } : {}),
});

export const link = (label: string, href: string, external = false): TerminalSpan => ({
  type: 'link',
  href,
  label,
  external,
});

export const blank = (): TerminalLine => line([{ type: 'text', value: '' }]);
