import { z } from 'zod';

const labStatusSchema = z.enum(['live', 'planned']);

const labExperimentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  tagline: z.string(),
  status: labStatusSchema,
  tags: z.array(z.string()).min(1),
});

export type LabExperiment = z.infer<typeof labExperimentSchema>;

export const labExperiments: readonly LabExperiment[] = z.array(labExperimentSchema).parse([
  {
    slug: 'event-loop',
    title: 'Event Loop Visualizer',
    tagline: 'Step through the call stack, microtask queue, and task queue.',
    status: 'live',
    tags: ['runtime', 'JavaScript', 'visualization'],
  },
  {
    slug: 'jwt-inspector',
    title: 'JWT Inspector',
    tagline: 'Decode a JWT and inspect its header, claims, and signature.',
    status: 'live',
    tags: ['security', 'tokens'],
  },
  {
    slug: 'json-diff',
    title: 'JSON Diff',
    tagline: 'Structural diff between two JSON documents.',
    status: 'live',
    tags: ['data', 'diff'],
  },
  {
    slug: 'cron-explorer',
    title: 'Cron Explorer',
    tagline: 'Parse a cron expression and preview the next executions.',
    status: 'live',
    tags: ['schedules', 'ops'],
  },
  {
    slug: 'rate-limiter',
    title: 'Rate Limiter Visualizer',
    tagline: 'Fixed window, sliding window, and token bucket, side by side.',
    status: 'planned',
    tags: ['systems', 'visualization'],
  },
]);

export const getLabExperimentBySlug = (slug: string): LabExperiment | undefined =>
  labExperiments.find((l) => l.slug === slug);
