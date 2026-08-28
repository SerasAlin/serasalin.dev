import { z } from 'zod';

const articleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).min(1),
  readingMinutes: z.number().int().positive(),
  body: z.array(
    z.discriminatedUnion('type', [
      z.object({ type: z.literal('paragraph'), text: z.string() }),
      z.object({
        type: z.literal('heading'),
        text: z.string(),
        level: z.union([z.literal(2), z.literal(3)]),
      }),
      z.object({ type: z.literal('code'), language: z.string(), value: z.string() }),
      z.object({ type: z.literal('callout'), text: z.string(), tone: z.enum(['info', 'warning']) }),
    ]),
  ),
});

export type Article = z.infer<typeof articleSchema>;
export type ArticleBlock = Article['body'][number];

export const articles: readonly Article[] = z.array(articleSchema).parse([
  {
    slug: 'server-and-client-boundaries',
    title: 'Drawing the Server / Client Boundary in Next.js',
    description:
      'How I decide what stays on the server, what becomes a client island, and where TanStack Query and Zustand actually belong.',
    publishedAt: '2026-04-12',
    tags: ['Next.js', 'React', 'Architecture'],
    readingMinutes: 6,
    body: [
      {
        type: 'paragraph',
        text: 'Next.js App Router gives you a bigger toolbox than most React frameworks. The interesting question is not "can I use TanStack Query here?" — it is "who owns this data?"',
      },
      { type: 'heading', level: 2, text: 'A simple rule' },
      {
        type: 'paragraph',
        text: 'Server Components own everything the first paint needs. Client islands own interactivity. TanStack Query owns anything the client will refetch or mutate. Zustand owns UI state that lives across route boundaries.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'When two systems disagree about who owns some state, the bug is architectural, not local.',
      },
      { type: 'heading', level: 2, text: 'What this looks like in code' },
      {
        type: 'code',
        language: 'tsx',
        value:
          '// Server Component — data is fetched during render\nexport default async function ProjectsPage() {\n  const projects = await getProjects();\n  return <ProjectList projects={projects} />;\n}',
      },
      {
        type: 'paragraph',
        text: 'The client only gets JavaScript for the interactive pieces — a filter bar, a command palette, a form.',
      },
    ],
  },
  {
    slug: 'zod-at-trust-boundaries',
    title: 'Zod Only at Trust Boundaries',
    description: 'A short note on where Zod earns its keep, and where it slows you down.',
    publishedAt: '2026-05-02',
    tags: ['TypeScript', 'Zod'],
    readingMinutes: 3,
    body: [
      {
        type: 'paragraph',
        text: 'Not everything needs runtime validation. Zod is worth its runtime cost at the edges — environment variables, HTTP request bodies, external API responses.',
      },
      {
        type: 'paragraph',
        text: 'Inside your own module boundaries, TypeScript is enough. Validating everywhere makes tests brittle and code louder than it needs to be.',
      },
    ],
  },
]);

export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);
