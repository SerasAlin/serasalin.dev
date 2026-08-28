export type ParsedInput = {
  raw: string;
  name: string;
  args: string[];
};

export const parseInput = (raw: string): ParsedInput | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Simple whitespace split; sufficient for a demo shell. If we ever need
  // quoted args, replace with a small tokenizer.
  const [name, ...args] = trimmed.split(/\s+/);
  return { raw: trimmed, name: name!, args };
};
