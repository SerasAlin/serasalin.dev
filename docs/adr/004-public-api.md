# 4. Public API as a portfolio surface

## Status

Accepted.

## Context

A portfolio that only renders HTML is a static resume with hyperlinks. If
this site claims to demonstrate API thinking, it should have an API.

## Decision

Route Handlers under `/api/*` expose the same content the site renders. The
API has a normalized error envelope, versioned only implicitly (by the fact
that projects and skills are read from `src/content/*` and would break
callers if the shape changed).

The endpoints are documented at `/api/docs`. The public docs page is
generated from the same list the routes implement, so it stays honest under
refactors.

## Consequences

- The API is not built for scale — it's a portfolio surface. But its
  contract is stable enough to link to.
- Rate limiting protects `POST /api/contact`; GET endpoints inherit
  Next.js caching.
- Anyone can fork this repo, replace `src/content/*`, and their API
  updates automatically.
