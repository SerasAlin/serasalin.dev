import { z } from 'zod';

const projectStatusSchema = z.enum(['shipping', 'active', 'sunset', 'concept']);

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  tagline: z.string(),
  status: projectStatusSchema,
  year: z.number().int(),
  featured: z.boolean().default(false),
  tech: z.array(z.string()).min(1),
  overview: z.string(),
  problem: z.string(),
  solution: z.string(),
  architecture: z.string(),
  decisions: z.array(z.object({ title: z.string(), body: z.string() })),
  challenges: z.array(z.string()),
  tradeoffs: z.array(z.object({ chose: z.string(), against: z.string(), why: z.string() })),
  lessons: z.array(z.string()),
  links: z.object({
    repository: z.string().url().optional(),
    live: z.string().url().optional(),
  }),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;

export const projectStatusLabel: Record<ProjectStatus, string> = {
  shipping: 'Shipping',
  active: 'Active',
  sunset: 'Sunset',
  concept: 'Concept',
};

export const projects: readonly Project[] = z.array(projectSchema).parse([
  {
    slug: 'serasalin-dev',
    title: 'serasalin.dev',
    tagline: 'This site — an interactive developer OS built with Next.js.',
    status: 'shipping',
    year: 2026,
    featured: true,
    tech: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Material UI',
      'Tailwind CSS',
      'TanStack Query',
      'Zustand',
      'Zod',
      'Playwright',
      'Storybook',
    ],
    overview:
      'A personal site designed as a developer environment: a homepage, a global command palette, an interactive terminal, an engineering lab, a live GitHub view, and a small public API — all wired through App Router, Server Components, and a deliberate state boundary.',
    problem:
      'Portfolio sites usually collapse into a hero image, a project grid, and a contact form. That format hides the parts of engineering I actually care about — architecture decisions, tradeoffs, and how state moves through a system.',
    solution:
      'Build the site as a real product. Give it interactive tools, a public API, and a case-study format for projects. Use Next.js as intended: Server Components own data fetching, client islands own interactivity, TanStack Query owns client-side server state, Zustand owns UI state.',
    architecture:
      'App Router with route groups. Server Components fetch content and GitHub data. Client islands (command palette, terminal, contact form) opt in with `"use client"`. A small `/api` surface serves the same content publicly. GitHub responses are cached via Next.js fetch revalidation.',
    decisions: [
      {
        title: 'Server Components by default',
        body: 'Nothing hits the browser as JavaScript unless it needs interactivity. Every page starts as a Server Component; interactive parts are lifted into small client components with clearly scoped responsibilities.',
      },
      {
        title: 'Three-way styling boundary',
        body: 'Material UI for interactive primitives (dialogs, menus, tables, form controls, charts). Tailwind for layout, spacing, and responsive structure. CSS Modules for terminal, code, and visualizer effects that would become unreadable as utility strings.',
      },
      {
        title: 'Modular command registry for the terminal',
        body: 'Commands are declared as small typed objects with a name, description, and handler. The terminal knows nothing about specific commands — it just runs whatever is registered. `help` is generated from the registry.',
      },
    ],
    challenges: [
      'Keeping client bundles small while still shipping a real command palette and terminal.',
      'Making the state ownership boundary between Server Components, TanStack Query, and Zustand clear enough to stay honest under change.',
      'Rate limiting the GitHub calls without punishing users.',
    ],
    tradeoffs: [
      {
        chose: 'Next.js App Router only',
        against: 'A separate SPA + REST API',
        why: 'App Router already handles routing, streaming, caching, and server code — running two runtimes would add build complexity for no user-visible win.',
      },
      {
        chose: 'MUI + Tailwind + CSS Modules together',
        against: 'A single styling system',
        why: "Each tool has a clear job. MUI ships accessible primitives, Tailwind removes layout boilerplate, CSS Modules cover the visual details that don't deserve a component.",
      },
    ],
    lessons: [
      'A public API turns your portfolio into a living reference. Design its errors like production code.',
      'Zustand is more useful when it stays small — one store per feature scales better than one global store.',
    ],
    links: {
      repository: 'https://github.com/SerasAlin/serasalin.dev',
    },
  },
  {
    slug: 'event-loop-visualizer',
    title: 'Event Loop Visualizer',
    tagline: 'Watch the call stack, microtask queue, and task queue for any JS snippet.',
    status: 'shipping',
    year: 2026,
    featured: true,
    tech: ['React', 'TypeScript', 'CSS Modules', 'Instrumented interpreter'],
    overview:
      'A learning tool that traces a small subset of JavaScript through a modeled event loop. Users can play, pause, step, and adjust speed to inspect execution order.',
    problem:
      'Most explanations of the event loop are static diagrams. Learners rarely get to see the difference between microtasks and macrotasks or the exact ordering of promises and timers.',
    solution:
      'Ship an instrumented executor that pushes frames onto a modeled call stack, queues microtasks and tasks, and animates a play/pause/step controller. Users see execution order, not just an outcome.',
    architecture:
      'A small, safe, script model (no arbitrary code) drives a state machine: stack, microtask queue, task queue, web APIs. The UI subscribes to each transition and renders columns.',
    decisions: [
      {
        title: 'No arbitrary code execution',
        body: 'The visualizer models a curated set of statements. It never `eval`s user input or runs untrusted code on the server.',
      },
    ],
    challenges: [
      'Making the model faithful enough to be educational without emulating an entire JS engine.',
    ],
    tradeoffs: [
      {
        chose: 'Curated statement model',
        against: 'A real JS interpreter',
        why: 'Executing untrusted JS in a browser or Node is a security surface. A curated statement set keeps the tool safe and focused.',
      },
    ],
    lessons: [
      'Constrained toys teach better than blank editors. Users learn faster when the model is small enough to reason about.',
    ],
    links: {},
  },
]);

export const featuredProjects = projects.filter((p) => p.featured);

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
