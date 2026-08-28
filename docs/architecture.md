# Architecture

## Runtime shape

- Next.js App Router owns routing, layouts, streaming, and caching.
- Server Components render every route by default. Client Components are
  scoped to interactivity (terminal, command palette, contact form, Lab
  experiments, theme toggle).
- Route Handlers under `/api/*` serve the site's public API. They are the
  same source the pages read from — the API is a documented, versioned view
  of the same data.

## Data flow

- `src/content/*` is the single source of truth for personal content. Every
  file is validated at import time with a Zod schema.
- Server Components import content and GitHub data directly — no extra API
  hop.
- Client Components hit `/api/*` only when they need to refetch after a
  user action.

## Caching

- GitHub responses use Next.js fetch caching with `revalidate: 600` and the
  `github` tag. On-demand invalidation is possible with
  `revalidateTag('github')` from a Route Handler if we ever need it.
- Static Route Handlers (`/api/me`, `/api/projects`, …) set
  `revalidate = 3600` because the data underneath is content-only.

## Feature ownership

Every feature owns its own store, hooks, schemas, components, and (where
useful) commands or actions. Cross-feature imports go through explicit
public modules to avoid deep coupling.

## Error handling

- `error.tsx` sits at the route level for recoverable failures.
- `global-error.tsx` is the last resort — no MUI, no Tailwind, just enough
  HTML to explain the failure.
- Route Handlers return a normalized `{ error: { code, message, details? } }`
  envelope, gated through `apiError()`.
