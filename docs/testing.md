# Testing

## Vitest + React Testing Library

Runs under jsdom. `src/test/setup.ts` wires:

- `@testing-library/jest-dom` matchers
- `matchMedia`, `scrollTo`, `scrollIntoView` stubs (missing in jsdom)
- MSW's Node server bound to the handlers in `src/test/msw/handlers.ts`

`src/test/render.tsx` renders through the same theme and query client the
app uses at runtime.

Tests to keep honest:

- `src/features/lab/json-diff/diff.test.ts` — the diff algorithm.
- `src/features/lab/cron-explorer/cron.test.ts` — cron parsing and
  execution generation.
- `src/features/terminal/lib/parse.test.ts` — terminal input tokenizer.
- `src/features/terminal/lib/autocomplete.test.ts` — tab completion.
- `src/features/terminal/commands.test.ts` — the command registry
  contract.
- `src/features/command-palette/lib/match.test.ts` — ranking behavior.
- `src/features/contact/schema.test.ts` — Zod schema.

## Playwright

Chromium, Firefox, WebKit, and mobile-Chrome projects. In CI, only Chromium
runs. Configured in `playwright.config.ts` with `retain-on-failure` trace,
screenshot, and video artifacts.

Specs cover:

- Home renders + navigation (`home.spec.ts`)
- Command palette open/close via keyboard (`command-palette.spec.ts`)
- Basic a11y smoke (`accessibility.spec.ts`)

## Storybook

Configured against `@storybook/nextjs`. Only the command palette has a
story right now — the philosophy is that stories should show real
integration surface, not wrap every static component.
