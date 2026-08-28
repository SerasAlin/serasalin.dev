'use client';

import { create } from 'zustand';
import type { TerminalLine } from './types';

type State = {
  focused: boolean;
  lines: TerminalLine[];
  history: string[];
  historyIndex: number | null;
  requestFocus: () => void;
  releaseFocus: () => void;
  append: (line: TerminalLine) => void;
  appendMany: (lines: TerminalLine[]) => void;
  clear: () => void;
  pushHistory: (raw: string) => void;
  setHistoryIndex: (idx: number | null) => void;
};

const MAX_HISTORY = 100;

export const useTerminalStore = create<State>((set) => ({
  focused: false,
  lines: [],
  history: [],
  historyIndex: null,
  requestFocus: () => set({ focused: true }),
  releaseFocus: () => set({ focused: false }),
  append: (line) => set((s) => ({ lines: [...s.lines, line] })),
  appendMany: (lines) => set((s) => ({ lines: [...s.lines, ...lines] })),
  clear: () => set({ lines: [] }),
  pushHistory: (raw) =>
    set((s) => {
      const trimmed = raw.trim();
      if (!trimmed) return s;
      const dedup =
        s.history[s.history.length - 1] === trimmed ? s.history : [...s.history, trimmed];
      const capped = dedup.length > MAX_HISTORY ? dedup.slice(dedup.length - MAX_HISTORY) : dedup;
      return { history: capped, historyIndex: null };
    }),
  setHistoryIndex: (historyIndex) => set({ historyIndex }),
}));
