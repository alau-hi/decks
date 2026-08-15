# Stats devices card: tabs + screen-break view

**Request:** Shaun (2026-08-15), iterating on the just-shipped "Devices & formats" card: make the two mixes switchable instead of shown side by side, and add a third view showing the closest screen break each session used (chosen over a raw resolutions list as less verbose).
**Decided:** 2026-08-15. Tabs — **Devices | Formats | Breaks** — one list at a time. Breaks use the deck's real media-query tiers and apply to touch sessions only; desktop sessions are labeled **`Desktop (no break)`** because every width-based media query in the deck is gated on `pointer:coarse` and never fires for desktop windows.

## Design

No tracker/beacon changes and no new capture — `scr.w`/`scr.h` from the previous feature already carry everything needed, so the break view is retroactive to every `scr`-bearing session.

### `api/stats.mjs`

- New exported pure function:
  `breakBucket(scr, cls)` → `'≤560' | '≤700' | '≤820' | '≤900' | '≤980' | '≤1080' | '>1080' | 'Desktop (no break)' | 'unknown'`.
  Rules: no `scr` (or no `scr.w`) → `unknown`; `cls` `desktop` or `unknown` → `Desktop (no break)`; `phone`/`tablet` → smallest deck breakpoint ≥ `scr.w` from the ladder `[560, 700, 820, 900, 980, 1080]`, else `>1080`. (560 is the deck's `35rem` query at default root font size.)
- Response gains `breakMix: [{key, sessions}]`, counted in the existing dwell loop next to `deviceMix`/`formatMix`, but sorted in **tier order** — the ladder above, then `Desktop (no break)`, then `unknown` — not by session count; the natural ladder reads better for breaks. Zero-session tiers are omitted (consistent with the other mixes, which only contain observed keys).
- Storage-less early return gains `breakMix: []`.

### `stats.html`

- The card's side-by-side `devgrid` (two `<div>` columns `#c-dev`/`#c-fmt`) is replaced by a tab strip plus a single list container:
  - Tabs **Devices | Formats | Breaks**, styled like the existing ghost buttons at compact size; active tab gets the filled treatment. Plain in-page state (a variable + re-render), Devices default, no persistence.
  - The visible list reuses the existing `.hbar` row rendering unchanged; `unknown` keeps its muted `.unk` treatment (applies in every tab). The list is constrained to ~560px max-width so the wide card doesn't look empty.
  - The card subtitle updates per tab: "sessions by device · N visits" / "sessions by screen format · N visits" / "sessions by closest deck breakpoint · N visits".
- Missing `breakMix` (older cached API response) degrades to the "no data yet" row, same as the other tabs' guards.

## Non-impacts

- Tracker, `api/track.mjs`, dwell blobs: untouched.
- Time/drop-off charts, map, roster table (including the per-viewer device lines): untouched.
- Vercel custom events unchanged; staging/collaborator empty states unaffected.

## Acceptance

- The card shows one list at a time; clicking tabs switches between the three mixes without reloading.
- A phone session at 390px viewport appears under `≤560`; a desktop session appears as `Desktop (no break)`; sessions without `scr` appear as `unknown`.
- Break rows appear in ladder order regardless of counts.
- Existing sessions (already recorded with `scr`) populate the Breaks tab immediately — no new data needed.
