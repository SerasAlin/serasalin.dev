# 3. Styling strategy

## Status

Accepted.

## Context

The site needs accessible primitives, tight control over layout and
responsive behavior, and enough freedom to build a terminal UI and Lab
visualizations without fighting a framework.

## Decision

Three tools:

- **Material UI** for accessible interactive primitives and charts.
- **Tailwind CSS** for layout, spacing, and responsive utilities. Tailwind's
  preflight is disabled to avoid conflicting with MUI's CssBaseline.
- **CSS Modules** for terminal chrome, code blocks, visualizations, and any
  component whose style would become unreadable as utility strings.

Design tokens live in one file (`src/theme/tokens.ts`). MUI writes them as
CSS variables. Tailwind reads them as semantic aliases (`bg-surface`,
`text-fg-muted`). Nothing declares the same color twice.

## Consequences

- Adding a new UI primitive means reaching for MUI first, not a bespoke
  component.
- Component-heavy pages stay readable because Tailwind is confined to layout.
- Visual effects live next to the component they belong to.
