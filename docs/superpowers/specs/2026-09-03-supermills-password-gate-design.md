# Shared password for the supermills deck

**Request:** Shaun (2026-09-03): the SUPERMILLS America deck at `/supermills-america-overview` should be password protected with a single password for all users, *in addition to* the existing email gate (email first, then password). Superwood deck unchanged.

**Decided:** 2026-09-03.

## Decisions

1. **Server-side, in the middleware.** A client-side password in `slides.html` would protect nothing (the HTML and assets are still served, and it would also break the pull-only rule on Alex's subtree). The check lives in `middleware.js`; nothing in `supermills-america-overview/` changes.
2. **Second cookie, same scheme.** Passing the password sets `sw_deck_supermills` — HMAC-SHA256 over `deck.<deckId>.<expiry-ms>` with `AUTH_SECRET`, value `<expiry>.<sig>`, 30-day `Max-Age`, `HttpOnly; Secure; SameSite=Lax`, `Domain=inventwood.net` on inventwood.net hosts (host-only elsewhere) — mirroring `sw_auth`/`sw_admin`. The cookie asserts "this browser passed the deck password"; changing the password does not invalidate existing cookies (they expire in 30 days).
3. **Generic by registry.** A new shared module `api/_decks.mjs` defines the decks (see the multi-deck-stats spec, which reuses it). Each deck entry may carry `password: '<ENV_VAR_NAME>'`; the middleware protects any deck whose named env var is set. Supermills: `password: 'SUPERMILLS_PASSWORD'`. Superwood has no password entry.
4. **Env-aware.** No `SUPERMILLS_PASSWORD` → no password step (collaborator deployments; staging until the var is set in the preview env). `AUTH_SECRET` missing or `GATE_DISABLED=1` → no password step (the whole gate is off).

## Registry (`api/_decks.mjs`)

```js
export const DECKS = {
  superwood:  { label: 'SUPERWOOD',          prefix: '/intro',                        home: '/intro' },
  supermills: { label: 'SUPERMILLS America', prefix: '/supermills-america-overview',  home: '/supermills-america-overview/', password: 'SUPERMILLS_PASSWORD' },
};
export const DEFAULT_DECK = process.env.DECK_ID || 'superwood';
export function deckFromPath(path) { /* longest matching prefix among non-default decks, else DEFAULT_DECK */ }
```
`middleware.js` runs on the Edge runtime and cannot import Node-only modules; `_decks.mjs` must stay dependency-free (plain data + one function) so both the middleware and the Node APIs can import it.

## Flow

1. Visitor (email-gated already, `sw_auth` valid) requests any path under `/supermills-america-overview` (deck or `assets/…`).
2. Middleware: `deckFromPath` → `supermills`; its `password` env var is set; no valid `sw_deck_supermills` cookie → `rewrite('/deckpass')` (URL preserved, like the gate). For an asset request the rewrite simply yields an HTML page in place of the image — acceptable, since a browser only fetches assets after the deck page itself passed.
3. `deckpass.html` — branded like `gate.html` (same palette/type, same card), copy: "This deck is shared with a password. Enter the password Alex or Shaun gave you." One password field + button + inline error. JS POSTs `{ deck, password }` to `/api/deckpass` where `deck` = `deckFromPath(location.pathname)` computed client-side by prefix (the page embeds the prefix list) — or simpler: the server derives the deck from the `Referer`-free `next` field: the page posts `{ password, path: location.pathname }` and the server calls `deckFromPath(path)`. **Chosen: post `path`; server derives the deck.**
4. `api/deckpass.mjs`: `deck = deckFromPath(path)`; if the deck has no password env var or it is unset → `{ ok: true }` (nothing to check). Compare `password` to `process.env[deck.password]` with `timingSafeEqual` on equal-length buffers (mirroring `keyOk` in `api/stats.mjs`); mismatch → 401 `{ error: 'That password isn’t right.' }`. Match → set the cookie, return `{ ok: true }`. Rate limiting: none in v1 (same posture as the email gate and stats key).
5. Page reloads (`location.reload()`); the middleware now passes; the deck renders.
6. Ungated deployments: `/api/deckpass` returns `{ ok: true }` without setting anything (the page is never shown there anyway).

## Middleware placement

Inside the existing authenticated branch, after the `/changes` admin check and before the `/intro` `?v=` redirect: look up the deck by path; if it declares a password whose env var is set, validate `sw_deck_<id>`; on failure `rewrite('/deckpass')`. `/deckpass`, `/deckpass.html` and `/api/deckpass` join `OPEN_PATHS`? **No** — they sit behind the email gate on purpose (a visitor must identify first); the middleware must simply not apply the *deck* check to them (they don't match a deck prefix, so `deckFromPath` returns the default deck, which has no password — no special case needed). Team browsers get no bypass in v1 (everyone enters it once per browser).

## Non-impacts

- Superwood deck, `/stats`, `/changes`, `/press`, the watchman, dwell tracking: untouched. The `?v=` viewer param survives the round-trip (URL preserved through the rewrite, reload keeps it).
- No database changes. One new env var (`SUPERMILLS_PASSWORD`) in the production and preview environments, set by Shaun (value never enters the repo or chat logs).
- Alex's subtree: untouched.

## Acceptance (gated staging, then production read-only)

- Sign in at the supermills gate → password page appears at `/supermills-america-overview/`; wrong password → inline error, still on the page; right password → deck renders, assets load; reload → straight to the deck (cookie).
- With a valid `sw_auth` but no deck cookie, `curl` of `/supermills-america-overview/assets/cube-hero.jpg` returns the password page, not the image; with both cookies → 200 image.
- Superwood `/intro` flow is byte-identical (no password page).
- Staging-open (no env vars): deck serves with no password page.
- Production: read-only — deck path with a minted `sw_auth` only → password page; no sign-in performed.
