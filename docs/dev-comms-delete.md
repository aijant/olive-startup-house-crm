# Dev-only: Delete communications by email

## Purpose

This tool removes all Communication Center data for a given mailbox by calling the Supabase Edge Function `dev-delete-all-communications-by-email` (POST JSON `{ "email": "..." }`). It is intended for **local and non-production** cleanup only.

## When it is available

- The **Delete communications** control on the **Properties** page is shown only to **admin** and **manager** roles **and** when the app is not a **production Vite build** (`import.meta.env.PROD` is `false` — typically `npm run dev`).

- The client action `deleteAllCommunicationsByEmail` in `client/src/actions/communications.ts` **rejects** with a clear error if called when `isDevCommsDeleteEnabled()` is false (see `client/src/lib/dev-comms-delete.ts`).

## When it is not available

- **Production** deployments: standard `vite build` sets `import.meta.env.PROD` to `true`. The button and dialog are not rendered; the action still rejects if invoked (e.g. from devtools).

## Code references

| Area | File |
|------|------|
| Enable flag | `client/src/lib/dev-comms-delete.ts` — `isDevCommsDeleteEnabled()` |
| API | `client/src/actions/communications.ts` — `deleteAllCommunicationsByEmail` |
| UI | `client/src/pages/properties.tsx` — header button + dialog |

## Server-side hardening (optional)

For defense in depth, the Edge Function `dev-delete-all-communications-by-email` can validate a server-only environment (e.g. Supabase secret or `DENO_ENV`) and refuse requests in production-like projects. That is not implemented in this repository unless the function source lives here.

## Staging

If a staging site uses a **production** Vite build, this UI stays off. A future opt-in (e.g. an explicit `VITE_…` flag used only in staging) could be added; do not set such a flag on real production hosting.
