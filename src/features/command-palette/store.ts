'use client';

import { create } from 'zustand';

type State = {
  open: boolean;
  query: string;
  activeIndex: number;
  openPalette: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (q: string) => void;
  setActiveIndex: (idx: number) => void;
};

export const useCommandPalette = create<State>((set) => ({
  open: false,
  query: '',
  activeIndex: 0,
  openPalette: () => set({ open: true, query: '', activeIndex: 0 }),
  close: () => set({ open: false }),
  toggle: () => set((s) => ({ open: !s.open, query: '', activeIndex: 0 })),
  setQuery: (query) => set({ query, activeIndex: 0 }),
  setActiveIndex: (activeIndex) => set({ activeIndex }),
}));
