'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycle: () => void;
};

const ORDER: ThemeMode[] = ['system', 'light', 'dark'];

export const useThemeMode = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
      cycle: () => {
        const current = get().mode;
        const idx = ORDER.indexOf(current);
        const next = ORDER[(idx + 1) % ORDER.length]!;
        set({ mode: next });
      },
    }),
    {
      name: 'serasalin.dev.theme',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
