# 1. Next.js App Router

## Status

Accepted.

## Context

The site is a portfolio, but its second job is to demonstrate a modern
Next.js architecture. That rules out a split "React SPA + REST API" setup
and makes the App Router the natural default.

## Decision

Use only the App Router. No Pages Router, no React Router, no TanStack
Router. Route groups organize the site (`(site)`); nested layouts own
shared shells. Streaming and Suspense are used where they add value.

## Consequences

- All routing, caching, and server code live inside a single mental model.
- Server Components are the default; adding `"use client"` is a deliberate
  act.
- Route Handlers under `/api/*` double as the public API surface.
