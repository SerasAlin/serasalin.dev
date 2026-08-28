# Styling

Three tools with clearly separated jobs.

## Material UI

Interactive primitives and layout components that need accessibility built
in: dialogs, drawers, buttons, tables, chips, tooltips, form controls, and
MUI X Charts. The theme lives in `src/theme/theme.ts`.

- Uses the unified `cssVariables` API. Both color schemes are declared in
  `colorSchemes`; `InitColorSchemeScript` avoids a color-mode flash on
  first paint.
- Registers CSS variables (`--rgb-*`) that Tailwind reads via semantic
  colors like `bg-surface`, `text-fg-muted`, and `border-accent`.

## Tailwind CSS

Layout only. `preflight` is disabled so Tailwind's reset doesn't fight
`CssBaseline`. The tokens Tailwind sees are the same tokens MUI writes — no
duplicate palettes.

If a class string is getting long or has more than three or four bits of
custom state, move it to a CSS Module.

## CSS Modules

Anything visual that isn't primitive: terminal chrome, event-loop
visualization columns, hero glow, project card hover states. Sits next to
the component that uses it.
