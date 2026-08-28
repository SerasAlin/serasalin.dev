# 2. State management boundaries

## Status

Accepted.

## Context

TanStack Query, Zustand, React Hook Form, and Next.js server data can all
model "data that changes over time". Without a rule, the same piece of state
ends up owned by two of them.

## Decision

- Server Components own initial data. Client Components never re-fetch what
  a Server Component already handed them.
- TanStack Query owns client-triggered fetches and mutations.
- Zustand owns cross-route UI state. One store per feature.
- React Hook Form owns form state.
- `useState` owns local, non-shared state.

## Consequences

- Bug reports about state become easier to route — there's only one
  legitimate owner.
- Zustand stores stay small. TanStack Query stays inside features that
  actually refetch.
- Data doesn't need to move through a Route Handler just because a
  component wanted a hook.
