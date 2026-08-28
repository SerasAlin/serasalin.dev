import { z } from 'zod';

const skillLevelSchema = z.enum(['exploring', 'comfortable', 'proficient', 'core']);

const skillSchema = z.object({
  name: z.string(),
  level: skillLevelSchema,
  note: z.string().optional(),
});

const skillCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  skills: z.array(skillSchema).min(1),
});

export type SkillLevel = z.infer<typeof skillLevelSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const skillLevelLabel: Record<SkillLevel, string> = {
  exploring: 'Exploring',
  comfortable: 'Comfortable',
  proficient: 'Proficient',
  core: 'Core skill',
};

export const skillCategories: readonly SkillCategory[] = z.array(skillCategorySchema).parse([
  {
    id: 'languages',
    title: 'Languages',
    description: 'What I reach for when I need to build something.',
    skills: [
      { name: 'TypeScript', level: 'core', note: 'Daily driver for backend and frontend.' },
      { name: 'JavaScript', level: 'core' },
      { name: 'Node.js', level: 'core' },
      { name: 'SQL', level: 'proficient' },
      { name: 'Bash', level: 'comfortable' },
      { name: 'Go', level: 'exploring', note: 'Learning through small services.' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'How I build interfaces.',
    skills: [
      { name: 'React', level: 'core' },
      { name: 'Next.js (App Router)', level: 'core' },
      { name: 'Material UI', level: 'proficient' },
      { name: 'Tailwind CSS', level: 'proficient' },
      { name: 'Zustand', level: 'proficient' },
      { name: 'TanStack Query', level: 'proficient' },
      { name: 'React Hook Form', level: 'proficient' },
      { name: 'Storybook', level: 'comfortable' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Services and APIs.',
    skills: [
      { name: 'Node.js APIs', level: 'core' },
      { name: 'Next.js Route Handlers', level: 'core' },
      { name: 'REST', level: 'core' },
      { name: 'Zod validation', level: 'proficient' },
      { name: 'WebSockets', level: 'comfortable' },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    description: 'Persistence and caching.',
    skills: [
      { name: 'PostgreSQL', level: 'proficient' },
      { name: 'Redis', level: 'comfortable' },
      { name: 'Prisma', level: 'comfortable' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    description: 'How I keep behavior honest.',
    skills: [
      { name: 'Vitest', level: 'proficient' },
      { name: 'React Testing Library', level: 'proficient' },
      { name: 'Playwright', level: 'proficient' },
      { name: 'MSW', level: 'comfortable' },
    ],
  },
  {
    id: 'tooling',
    title: 'Tooling',
    description: 'The tools I keep close.',
    skills: [
      { name: 'pnpm', level: 'proficient' },
      { name: 'ESLint flat config', level: 'proficient' },
      { name: 'Prettier', level: 'proficient' },
      { name: 'Husky + lint-staged', level: 'proficient' },
      { name: 'GitHub Actions', level: 'proficient' },
    ],
  },
  {
    id: 'exploring',
    title: 'Currently exploring',
    description: 'What I am investing time to learn.',
    skills: [
      { name: 'Edge runtimes', level: 'exploring' },
      { name: 'Distributed systems', level: 'exploring' },
      { name: 'OpenTelemetry', level: 'exploring' },
    ],
  },
]);
