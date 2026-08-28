import { z } from 'zod';

const nowSchema = z.object({
  updated: z.string(),
  building: z.array(z.string()).min(1),
  learning: z.array(z.string()).min(1),
  reading: z.array(z.string()),
  interests: z.array(z.string()),
});

export type NowContent = z.infer<typeof nowSchema>;

export const now: NowContent = nowSchema.parse({
  updated: '2026-08-28',
  building: [
    'This site — serasalin.dev — as a real production application.',
    'A small library of interactive engineering visualizations for the Lab.',
  ],
  learning: [
    'Edge runtimes and streaming SSR patterns in Next.js.',
    'System design at scale — reading and note-taking.',
  ],
  reading: [
    'Designing Data-Intensive Applications (revisit).',
    'The Next.js and React server-component docs, patiently.',
  ],
  interests: [
    'Developer tools that reveal system behavior instead of hiding it.',
    'Public APIs as a portfolio surface.',
  ],
});
