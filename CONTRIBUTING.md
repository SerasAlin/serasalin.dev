# Contributing

Thanks for looking at this repo. If you're forking it as a personal site,
here's what will be least surprising:

## Ground rules

- Keep the state boundary honest: server data on the server, TanStack Query
  for client-side server state, Zustand for cross-route UI state, React Hook
  Form for forms.
- Prefer editing existing files. Do not add abstractions until they earn
  their weight.
- No emojis in code or docs unless a page already uses them.
- No `any`. If a schema is unclear, model it with a discriminated union.

## Local workflow

```bash
pnpm install
pnpm dev

# Before committing
pnpm validate
```

`pnpm validate` runs prettier, ESLint, `tsc --noEmit`, and Vitest. The
pre-commit hook runs `lint-staged` (Prettier and ESLint auto-fix on staged
files) and commit messages are validated by commitlint against the
Conventional Commits spec.

## Adding a project

Append to `src/content/projects.ts`. Everything else — index page, detail
page, API endpoint, sitemap, terminal command output — reads that source
of truth.

## Adding a terminal command

Create a `TerminalCommand` in `src/features/terminal/commands/index.ts`.
Handlers receive a context with `navigate`, `setTheme`, `clear`, and a
list of registered commands so `help` can be regenerated from the registry
without any hardcoded switch statement.

## Adding a Lab experiment

Create a `src/features/lab/<slug>/…` module with its own components,
utilities, and styles. Register the metadata in `src/content/lab.ts` and add
a case for the slug in `src/app/(site)/lab/[slug]/page.tsx`.

## Adding an API endpoint

Route Handlers live under `src/app/api/*`. Every endpoint validates its input
with Zod (if any), and error responses use `apiError()` from
`src/lib/api/errors.ts`. Document the endpoint in
`src/app/(site)/api/docs/page.tsx`.
