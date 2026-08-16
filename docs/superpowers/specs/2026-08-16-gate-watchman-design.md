# Gate watchman: bounce detection + IP intelligence on /stats

**Request:** Alex (Slack, 2026-08-16): "i don't want them to skip entering their email, i just want to see how many people are turning away when they get that prompt — and get their ip addresses so we can guess who they are. it's a self-serve gate but I want to put a watchman on it!" Shaun: new section at the bottom of /stats — map + IP list, per-IP visits, last visit, unique browsers (cookie-based), with filtering so team testing and random pings don't inflate the numbers.

**Decided:** 2026-08-16.

## Dependency / sequencing

**Implementation is blocked on the Neon Postgres migration branch merging to main** (Shaun + Alex review this week; the branch is being brought up to date in a separate session). This feature is the first one built against the Postgres layer. Nothing here is implemented on the migration branch itself — the feature lands on main after the merge. All storage below is additive: one new table, no changes to migrated tables. Table naming, client library, and connection conventions follow whatever the merged migration establishes (`@neondatabase/serverless` + `DATABASE_URL` per the deferred-decision note in CLAUDE.md).

## Capture

Today the gate records nothing — a visitor who sees the email form and leaves is invisible. New pieces:

1. **Beacon in `gate.html`:** a small script fires on page load via `navigator.sendBeacon` (fetch keepalive fallback) to new `api/gatehit.mjs`, sending the path the visitor was trying to reach (current URL) and screen size. JS-fired means curl/crawlers/security scanners mostly never register.
2. **`api/gatehit.mjs`:** sets an anonymous browser cookie `sw_gid` (random UUID, 400-day) if absent, then inserts one row into new table `gate_hits`:
   `ts, ip, gid, ua, city, country, lat, lng, path, scr, team boolean`
   (geo from the `x-vercel-ip-*` headers, same as existing records). Server-side UA bot-word check (bot/crawl/spider/preview etc.) drops obvious bots.
3. **Team flag, not team drop:** hits from a browser carrying a valid `sw_admin` cookie are **recorded with `team = true`**, not discarded — filterable in the UI and retroactively fixable if the filter misses (incognito tests etc.). No manual exclusion UI in v1.
4. **Conversion link:** `api/enter.mjs` additionally stamps the current `sw_gid` onto the signup record. A `gid` that appears on a signup marks all that browser's gate hits as converted; a `gid` with no signup is a bounce.
5. **Scope:** the beacon exists only on the gate page. Authenticated deck viewing is already covered by dwell tracking; this feature watches the unauthenticated doorstep only.
6. **Env-awareness:** like the rest of the stack, no `DATABASE_URL` → `api/gatehit.mjs` no-ops with 204. Collaborator deployments record nothing.

## Definitions

- **Hit:** one beacon fire (one gate page load).
- **Visit:** hits from the same `gid` grouped within a 30-minute window. Raw hit counts are kept; visit grouping is computed at read time.
- **Bounce:** a visit by a `gid` that has never appeared on a signup.
- **Unique browsers (per IP):** count of distinct `gid`s seen at that IP.

## /stats section (new, at the bottom)

One new card, "Gate watch":

1. **Funnel headline:** **X gate visits · Y converted · Z turned away** — unique browsers, team-filtered. This is Alex's number, front and center.
2. **Map:** same embedded Natural Earth SVG pattern as the existing visit map; dots are gate hits — muted dot = bounced, wood-bright = converted.
3. **IP list:** one row per IP — visits, unique browsers, city/country, first seen, last seen, outcome badge: `bounced` (warm red) or `converted → <email>` (green) when any browser at that IP later signed up. Rows expand in place to a per-browser visit history (timestamps + device class from UA, reusing `deviceFromUa`). Sorted by last seen, newest first.
4. **Team toggle:** team-flagged rows hidden by default; a "show team" toggle reveals them (visually muted).
5. Served by the stats API (same `STATS_KEY` + `sw_auth` gating as the rest of /stats).

## Non-impacts

- Deck (`index.html`), dwell tracking, existing stats cards: untouched.
- No changes to migrated Postgres tables; `gate_hits` is additive.
- Gate UX unchanged — the form looks and behaves identically; the beacon is invisible.

## Acceptance

- Visiting the gate in a fresh browser records a hit with geo + a new `sw_gid`; signing up links that `gid` to the email; the /stats row flips from bounced to converted.
- Team browsers (with `sw_admin`) are flagged and hidden by default, shown by the toggle.
- curl of the gate URL records nothing (no JS).
- Funnel numbers count unique browsers, excluding team.
- Collaborator deployments (no `DATABASE_URL`): beacon 204s, nothing recorded, gate still works.
