# Deck served at /intro, root redirects

**Request:** Alex (Slack, 2026-08-04): make the teaser deck URL `investor.inventwood.net/intro` — the bare domain "feels too exposed, too commodity". `/intro` becomes the home page of the teaser; the root keeps working.
**Decided:** 2026-08-05. Root 302s to `/intro` (chosen over serving both paths, so Vercel Web Analytics pageviews consolidate on one path). Applies on all domains and deployments — sw./investor./investors.inventwood.net, both stagings, and collaborator projects alike.

## Design

Approach: declarative routing in `vercel.json`, with two one-line follow-ons. No env-var dependence, so the collaborator zero-config story is unchanged.

- **`vercel.json`:** add `redirects: [{ source: "/", destination: "/intro", permanent: false }]` and `rewrites: [{ source: "/intro", destination: "/index.html" }]`. 302 (not permanent) so browsers never cache the redirect irrevocably. Query strings pass through automatically — existing `/?v=<email>` links land on `/intro?v=<email>`.
- **`middleware.js`:** two changes. (1) Because Edge middleware runs before `vercel.json` routing, the middleware also 302s `/` → `/intro` (query preserved) ahead of any auth handling — otherwise unauthenticated gated visitors would see the gate at `/` instead of `/intro`. (2) The viewer-identity redirect (injects `?v=<email>` for cookied visitors) matches `path === '/intro'` instead of `path === '/'`. Flow for a cookied root visit: middleware passes `/` through → Vercel redirects to `/intro` → middleware stamps `?v=` → rewrite serves the deck. Unauthenticated `/intro` visits hit the existing gate rewrite with the URL preserved (gate shows at `/intro`). No other auth logic changes.
- **`api/enter.mjs`:** post-signup redirect becomes `/intro?v=<email>`; the no-AUTH_SECRET fallback redirect becomes `/intro`.
- **`CLAUDE.md`:** note that the canonical deck URL is `/intro` and the root redirects.

## Non-impacts

- First-party analytics (dwell blobs, viewer roster, drop-off, map) key off email/session/`data-nav` slide names — path never recorded; dataset stays continuous.
- `deck_open`/`section_view` custom events unchanged.
- `/stats`, `/changes`, `/key`, `/api/*`, `/assets/*` untouched.
- Vercel Web Analytics pageviews shift from the `/` row to `/intro` at the transition — cosmetic only.
- Local `npm run dev` (vite) doesn't read `vercel.json`; `/intro` exists only on Vercel deployments. Accepted — local preview stays at `/`.

## Acceptance

- `GET /` → 302 to `/intro` (query preserved) on gated and ungated deployments.
- `/intro` serves the deck; unauthenticated visitors see the gate at `/intro`; email entry lands on `/intro?v=<email>`.
- Cookied return visits to `/` or `/intro` end at `/intro?v=<email>`.
- `/stats` renders identically with pre-existing data.
