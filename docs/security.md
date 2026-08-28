# Security

## Secrets

Server-only env is imported through `@/lib/env/server`, which imports
`server-only` first — importing that file from a client bundle fails the
Next.js build. `GITHUB_TOKEN`, `RESEND_API_KEY`, and `CONTACT_TO_ADDRESS`
never appear in `NEXT_PUBLIC_*` names.

## Input validation

Every API boundary validates its input with Zod. Client-side validation is
UX; server-side validation is the contract. The contact form ships the
same Zod schema to both sides.

## Rate limiting

`/api/contact` is limited to five submissions per hour per IP. The limiter
lives in `src/lib/security/rate-limit.ts`. It's in-memory today (fine for a
single-instance deployment) and is written to be swapped for a shared store
like Upstash Redis without changing callers.

## Output encoding

MUI and React handle escaping by default. `dangerouslySetInnerHTML` is used
in exactly one place — the JSON-LD components — where the input is a
static object serialized with `JSON.stringify`.

## Response headers

`next.config.mjs` sets `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
and a restrictive `Permissions-Policy` on every response. A stricter CSP
belongs in the deployment layer where nonces can be issued per-request.

## What client-side JavaScript does not do

- Run untrusted JS. The event-loop visualizer models a curated set of
  statements — no `eval`, no `Function` constructor.
- Send tokens off-device. The JWT inspector decodes locally.
- Store secrets. Zustand persist only holds theme preference.
