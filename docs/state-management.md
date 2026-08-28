# State management

Four buckets. Nothing crosses buckets without a reason.

## Server data

Fetched inside Server Components or Route Handlers. Cached by Next.js fetch
revalidation (GitHub) or by the route's `revalidate` export (content-only
endpoints). This state is never mirrored into TanStack Query on the client —
that would defeat both caches.

## Client-side server state

TanStack Query owns any client-triggered fetch. The only current caller is
the contact form, which posts to `/api/contact`. When a Lab experiment ever
polls a Route Handler or fires a mutation, it will use TanStack Query.

Rules:

- Every hook returns the typed query result. No untyped `any`.
- Query keys come from `src/lib/query/keys.ts`.
- No sharing a QueryClient across renders — it's constructed once inside
  `Providers` and lives for the app's lifetime.

## Global UI state

Zustand. One store per feature:

- `features/theme/store.ts` — theme preference, persisted.
- `features/command-palette/store.ts` — open/close, query, active index.
- `features/terminal/store.ts` — lines, history, focus.

Selectors are called with the shallowest possible read — a component that
needs `open` doesn't read `query`.

## Form state

React Hook Form. Every form uses Zod through
`@hookform/resolvers/zod`. The same schema validates on the client and
inside the Route Handler.

## Local state

`useState` where the value never leaves the component. If you're reaching
for a store because you can't lift the value, first check whether URL state
or a query string would work.
