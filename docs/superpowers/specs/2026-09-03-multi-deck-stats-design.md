# Multi-deck stats: supermills on /stats with a deck switcher

**Request:** Shaun (2026-09-02): incorporate the new deck into the stats page — a deck switcher at the top. Tracker delivery: ask Alex for one script line in his repo (approved). Slide order: captured from the deck itself rather than hardcoded (approved).

**Decided:** 2026-09-03. Depends on `api/_decks.mjs` from the supermills-password-gate spec (built first).

## Problem

Every analytics row is tagged with the *deployment's* deck (`DECK_ID` env, always `superwood`). Two decks now share one deployment and one gate, so deck identity must come from the **path**: dwell beacons from the deck they run on, signups from the `next` path the visitor was headed to, gate hits from their recorded `path`. The supermills deck has no tracker, and its directory is pull-only.

## Decisions

1. **Shared tracker file `/deck-track.js`.** The inline tracker at the bottom of `index.html` moves, verbatim in behavior, into `superwood-presentation/deck-track.js`, with two additions: `deck` = `deckFromPath(location.pathname)` (the prefix list is inlined in the script — it cannot import a module) sent in every beacon, and `order` = the `data-nav` (fallback `id`) of every `<section>` in DOM order, deduplicated keeping first occurrence, sent in every beacon. `index.html` replaces the inline script with `<script src="/deck-track.js" defer></script>`. Vercel Analytics `va` events are unchanged (2-property cap; no deck field).
2. **One line in Alex's repo.** `slides.html` in `alau-hi/supermills-america` gets `<script src="/deck-track.js" defer></script>` before `</body>`, via a commit/PR from the local clone at `../supermills-america`. Relative path: 404s harmlessly on his vercel.app and local previews; live only on our deployment. Arrives here via `npm run sync:supermills`. Nothing else in his repo changes; his deck already uses `<section id data-nav>` and `#deck`, which the tracker expects.
3. **Deck from path on the write side.**
   - `api/track.mjs`: `deck` = body.deck if it is a key of `DECKS`, else `DEFAULT_DECK`; stored in `dwell_sessions.deck`. When `order` is a non-empty array of ≤ 80 strings (each ≤ 60 chars), upsert `deck_slides(deck, slides, updated_at)` — latest beacon wins.
   - `api/enter.mjs`: `signups.deck` = `deckFromPath(safeNext(next))`.
   - `api/gatehit.mjs`: `gate_hits.deck` = `deckFromPath(path)`.
4. **New table** (additive, `scripts/schema.sql`): `deck_slides (deck text primary key, slides jsonb not null, updated_at timestamptz not null)`. Applied to staging and production before deploying code that queries it (same rule as `gate_hits`).
5. **Backfill:** one statement in the rollout, `UPDATE gate_hits SET deck='supermills' WHERE path LIKE '/supermills-america-overview%'`. Signups recorded before this feature carry no path and stay under superwood (one row as of 2026-09-02; accepted).
6. **Read side.** `api/stats.mjs` accepts `?deck=<id>` (must be a `DECKS` key; default `DEFAULT_DECK`), filters all three tables by it, and returns `deck`, `decks: [{ id, label }]`, and `slideOrder` = `deck_slides.slides` for that deck if present, else the registry's fallback list (superwood keeps today's hardcoded list as its fallback; supermills has none — an empty heatmap until its first dwell beacon). Everything else in the response is unchanged in shape.
7. **Switcher on `/stats`.** A tab row at the top of the dashboard (next to Refresh/Forget key), one tab per deck from `decks`, styled like the existing `.dtab` buttons. Active deck in the URL as `?deck=<id>` (bookmarkable; default superwood). Switching refetches `/api/stats?key=…&deck=…` and re-renders every card — roster, heatmap, time/drop-off charts, devices & formats, visit map, Gate watch — unchanged otherwise. Page `<h1>` shows the deck label ("SUPERWOOD deck — viewer stats" / "SUPERMILLS America deck — viewer stats").
8. **Roster semantics.** A deck's viewers = signups whose deck-of-entry is that deck ∪ viewers with dwell sessions on it. Someone who entered via superwood and later views supermills appears in both rosters through their dwell.

## Non-impacts

- Gate UX, both decks' rendering, `/changes`, the watchman's behavior (only its `deck` tag changes), the pull-only rule (only `slides.html` in Alex's own repo changes, by one line).
- No env vars. Existing rows keep their `superwood` tag (correct — only that deck existed).

## Rollout

1. Land the tracker line in Alex's repo (commit from `../supermills-america`, push; or PR if Alex prefers) → `npm run sync:supermills` → the line is in the monorepo.
2. Schema (`deck_slides`) + backfill on staging, then production.
3. Deploy staging; visit both decks in a real browser (dwell needs a browser — Chrome extension or Shaun's click); `/stats` switcher shows both decks with data; superwood heatmap unchanged.
4. Deploy production; read-only checks; close the issue.

## Acceptance

- `/deck-track.js` is served on our deployment and 404s on Alex's; `index.html` has no inline tracker left; beacons carry `deck` and `order`.
- After one staging visit to the supermills deck, `dwell_sessions` has a row with `deck='supermills'` and `deck_slides` has the supermills order; `/api/stats?deck=supermills` returns that order as `slideOrder`.
- `/stats` switcher toggles between decks; `?deck=` round-trips; the superwood view is unchanged from today.
- Gate hits at `/supermills-america-overview/` and signups whose `next` was that path are tagged `supermills`.
