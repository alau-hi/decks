# SUPERWOOD for Data Centers deck at /datacenters

**Request:** Alex (Slack, 2026-09-06): "fun new deck. it's on github now. Can you deploy to investor.inventwood.net/datacenters?" Behind the password: yes. Shaun: stats integration too.

**Decided:** 2026-09-06 (Shaun). Spike the same day: a symlink from `superwood-presentation/` to the root directory 404s on Vercel (the CLI uploads the link, not the files), so the directory moves.

## Decisions

1. **The deck is in this repo already.** Alex committed `superwood-datacenter-investor/` at the repo root of `alau-hi/decks` (no separate repo, no subtree). It is co-owned: we may edit it here (the tracker line); Alex keeps working in it and deploying his own Vercel project `superwood-datacenter-investor` from it as his staging.
2. **Move, don't link.** `git mv superwood-datacenter-investor superwood-presentation/superwood-datacenter-investor`. The Vercel CLI uploads only the project root, and the spike showed a symlink does not survive upload. The directory keeps its name. Alex's one-time cost after pulling: `mv ~/Git/decks/superwood-datacenter-investor/.vercel ~/Git/decks/superwood-presentation/superwood-datacenter-investor/` (or `vercel link` once from the new folder) and the path in his `FRESH-LOOK-PROMPT.md`.
3. **Only `slides.html` + `assets/` ship.** The root `.vercelignore` allowlist gains the same three lines as for supermills. Everything else in the directory (123 MB of `prep/`, `archive/`, `media/`, PDF, PPTX, analyses, and Alex's own copies of `gate.html`, `middleware.js`, `api/`, `vercel.json`, `index.html` stub) stays off the site. The `index.html` exclusion is load-bearing for the same reason as before (it would be served for the directory URL ahead of the rewrite and meta-refresh to a nonexistent `/slides.html`). Non-root `middleware.js`/`vercel.json`/`api/` are ignored by Vercel anyway.
4. **One password for all gated decks (for now).** The registry entry points at the existing `SUPERMILLS_PASSWORD` env var; no new variable. The password cookie stays per deck (`sw_deck_datacenters`): a viewer who unlocked supermills enters the same password once more on first visit here. Diverging later = one registry line + one new env var.
5. **Stats by the existing multi-deck machinery.** Tracker line in `slides.html`, prefix mirror in `deck-track.js`, registry entry. Slide order arrives via `deck_slides` from the deck's 19 `data-nav` names on first visit. No schema change, no database apply.

## Registry (`api/_decks.mjs`)

```js
datacenters: { label: 'SUPERWOOD for Data Centers', prefix: '/datacenters', home: '/datacenters/', password: 'SUPERMILLS_PASSWORD' },
```
`deck-track.js`: `PREFIXES={supermills:'/supermills-deck',datacenters:'/datacenters'}`.

## Routing (`superwood-presentation/vercel.json`)

- redirect `/datacenters` → `/datacenters/` (307, like `/supermills-deck`).
- rewrite `/datacenters/` → `/superwood-datacenter-investor/slides` (cleanUrls form).
- rewrite `/datacenters/:path+` → `/superwood-datacenter-investor/:path+` (the deck's relative `assets/…?v=<hash>` paths; the query string passes through).
- headers: `/datacenters/assets/(.*)` → `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
- `.vercelignore`: `superwood-datacenter-investor/*`, `!superwood-datacenter-investor/slides.html`, `!superwood-datacenter-investor/assets`.
- Never set `trailingSlash` (same loop hazard as supermills).

## Gate flow (unchanged code)

Unauthenticated `/datacenters/` → gate asks email + password (`_swx=3`); authenticated without the deck cookie → password only (`_swx=2`); both cookies → deck. `api/enter.mjs` derives the deck from `next` and sets `sw_deck_datacenters`. Signups from this deck record `deck = 'datacenters'`.

## Tracker line (`superwood-datacenter-investor/slides.html`)

`<script src="/deck-track.js" defer></script>` in `<head>`, committed here directly. It 404s harmlessly on Alex's own deployment (no `/deck-track.js` there).

## Docs

- `changes.html` LOG: "SUPERWOOD for Data Centers deck joins the site at /datacenters (email gate + shared password; on /stats)".
- `CLAUDE.md`: new bullet for the deck (in-repo, co-owned, only `slides.html` + `assets/` ship, Alex's deck-local gate files are inert here, his own Vercel project is his staging); note the two patterns now in play (subtree pull-only vs in-repo co-owned).

## Non-impacts

Superwood and supermills decks, the sync script, the gate page, `api/enter.mjs`, `api/stats.mjs`, the schema. `gemini/teaser/` and `investor-data/`, `tools/` stay at the root.

## Acceptance (gated staging, then production read-only)

1. `GET /datacenters` → 307 to `/datacenters/`.
2. `GET /datacenters/` with no cookies → 200 gate page, `_swx=3`, `Cache-Control: no-store`.
3. With a minted `sw_auth` only → gate page, `_swx=2`.
4. With `sw_auth` + minted `sw_deck_datacenters` → 200, `<title>SUPERWOOD for Data Centers`, and `/datacenters/assets/inventwood_logo.png?v=29cddb1d` → 200 image with the cache header.
5. `/datacenters/PRODUCT.md`, `/datacenters/index`, `/datacenters/gate` (Alex's copies) → 404 (or gate/308 per cleanUrls), never content.
6. `/intro` and `/supermills-deck/` behave as before.
7. `/api/stats?deck=datacenters` (with the stats key) → 200 with `deck: 'datacenters'` and three entries in `decks`; after one real visit the heatmap shows 19 slides.
