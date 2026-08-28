import { z } from 'zod';

const useItemSchema = z.object({
  name: z.string(),
  detail: z.string().optional(),
});
const usesCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(useItemSchema).min(1),
});

export type UsesCategory = z.infer<typeof usesCategorySchema>;

export const usesCategories: readonly UsesCategory[] = z.array(usesCategorySchema).parse([
  {
    id: 'editor',
    title: 'Editor & shell',
    items: [
      { name: 'JetBrains WebStorm', detail: 'Primary IDE for large TypeScript projects.' },
      { name: 'VS Code', detail: 'Quick edits, containers, remote work.' },
      { name: 'zsh + starship', detail: 'Prompt with git and env awareness.' },
      { name: 'Ghostty', detail: 'Terminal emulator.' },
    ],
  },
  {
    id: 'tooling',
    title: 'Tooling',
    items: [
      { name: 'pnpm', detail: 'Fast, disk-friendly package manager.' },
      { name: 'fnm / nvm', detail: 'Node version switching per project.' },
      { name: 'GitHub CLI', detail: 'Everyday PR and repo work from the terminal.' },
      { name: 'Playwright', detail: 'E2E and browser automation.' },
    ],
  },
  {
    id: 'browser',
    title: 'Browser',
    items: [
      { name: 'Arc', detail: 'Daily browsing.' },
      { name: 'Chrome DevTools', detail: 'Web platform work.' },
      { name: 'React Developer Tools', detail: 'Component tree, profiling.' },
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware',
    items: [
      { name: 'MacBook Pro', detail: 'Primary development machine.' },
      { name: 'External 4K display', detail: 'Editor + docs side by side.' },
      { name: 'Mechanical keyboard', detail: 'Tactile switches, split layout.' },
    ],
  },
]);
