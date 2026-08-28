import { z } from 'zod';

const profileSchema = z.object({
  name: z.string(),
  username: z.string(),
  role: z.string(),
  headline: z.string(),
  location: z.string(),
  timezone: z.string(),
  bio: z.string(),
  focus: z.array(z.string()).min(1),
  currentlyLearning: z.array(z.string()),
  favoriteStack: z.object({
    frontend: z.string(),
    backend: z.string(),
    language: z.string(),
    data: z.string(),
  }),
  github: z.string(),
  linkedin: z.string(),
  email: z.string().email(),
});

export type Profile = z.infer<typeof profileSchema>;

export const profile: Profile = profileSchema.parse({
  name: 'Your Name',
  username: 'SerasAlin',
  role: 'Software Engineer',
  headline: 'I build systems for the web.',
  location: 'Remote',
  timezone: 'Europe/Bucharest',
  bio:
    'Software engineer focused on the web platform. I care about developer experience, ' +
    'system design, and interfaces that feel purposeful.',
  focus: ['React and Next.js architecture', 'Public API design', 'Interactive learning tools'],
  currentlyLearning: ['distributed systems', 'system design at scale', 'edge runtimes'],
  favoriteStack: {
    frontend: 'Next.js',
    backend: 'Node.js',
    language: 'TypeScript',
    data: 'PostgreSQL',
  },
  github: 'https://github.com/SerasAlin',
  linkedin: 'https://www.linkedin.com/in/serasalin/',
  email: 'serasalin96@gmail.com',
});
