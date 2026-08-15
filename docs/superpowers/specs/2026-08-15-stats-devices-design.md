# Stats page: devices and screen formats

**Request:** Alex (Slack, 2026-08-15): "can you update the stats page so we can see what devices and screen formats people are logging in from?" — he has been doing the mobile-layout work and wants to know what investors actually view the deck on.
**Decided:** 2026-08-15. Show both per-viewer devices and an aggregate breakdown; formats as glanceable buckets with exact viewport sizes preserved in the detail.

## Current state

- Every dwell blob (`api/track.mjs`) and signup record (`api/enter.mjs`) already stores the raw user-agent (`ua`) — device/OS is derivable **retroactively** for all existing data.
- Nothing captures screen or viewport size. That part is **forward-only**: new sessions record it, old sessions show as "unknown".

## Design

Approach: extend the existing beacon and parse server-side. No new endpoints, no dependencies, no schema migration (dwell blobs are overwritten per session; the new field simply appears).

### Capture — `index.html` tracker

The beacon payload (`send()`, ~line 1413) gains one field, read at flush time so a rotated phone reports its latest state:

```js
scr: { w: innerWidth, h: innerHeight,
       sw: screen.width, sh: screen.height,
       dpr: devicePixelRatio || 1,
       o: matchMedia('(orientation: portrait)').matches ? 'p' : 'l' }
```

### Store — `api/track.mjs`

Validate and clamp: `w/h/sw/sh` integers 0–20000, `dpr` number 0–10, `o` in `{p,l}`; anything malformed → `scr` omitted. Stored on the dwell record alongside `ua`.

### Derive — `api/stats.mjs`

- `deviceFromUa(ua)` → `{cls, os}` via small regexes: iPhone/iPod → phone·iOS; iPad → tablet·iOS; Android + Mobile → phone·Android; Android → tablet·Android; Macintosh → desktop·Mac; Windows → desktop·Windows; Linux → desktop·Linux; else other/unknown. Known limitation, accepted: iPadOS 13+ presents a Mac UA, so modern iPads count as desktop·Mac (the format bucket still reflects their real viewport).
- `formatBucket(scr, cls)` → `phone-portrait` / `phone-landscape` (cls phone, by `o`), `tablet`, `laptop` (desktop, `w` < 1440), `desktop` (`w` ≥ 1440), `unknown` (no `scr`).
- Response additions:
  - per-viewer `devices`: deduped list like `{cls, os, scr}` with a `label` (e.g. `iPhone · 390×844 @3x`), most recent first;
  - top-level `deviceMix` and `formatMix`: `[{key, sessions}]` over all dwell sessions (device also counts pre-`scr` history; format shows `unknown` for it).
- `slideOrder`, dwell math, drop-off, map, viewer roster fields all unchanged.

### Render — `stats.html`

- Roster rows get a compact device chip (📱/💻 + OS) from the viewer's most recent device; exact viewports listed in the expanded viewer detail.
- One new "Devices & formats" card with two small horizontal-bar breakdowns (device mix, format mix) in the existing hand-built SVG/HTML style — muted axis text, data colors per the page's tokens. `unknown` renders as a normal muted row, never dropped.
- Charts and layout follow the existing card grid; mobile stacking as the page already does.

## Non-impacts

- Dwell seconds, drop-off, avg-time charts, world map, viewer auth, gate: untouched.
- Vercel custom events unchanged (still ≤2 data props).
- Storage-less deployments (staging, collaborators): `track` already no-ops; `stats` already returns an empty dataset — new fields simply absent.
- Blob count and `api/stats.mjs` listing cost unchanged (same blobs, one more field per record).

## Acceptance

- A phone session shows up on `/stats` with a phone chip on the viewer row and moves the aggregate phone count.
- Exact viewport (e.g. `390×844 @3x`) visible in the viewer detail for new sessions.
- Pre-existing sessions contribute to the device mix (from stored `ua`) and appear as `unknown` in the format mix.
- Desktop layout and phone layout of `/stats` both render the new card without breaking the existing charts.
