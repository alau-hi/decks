# Devices card: hide unknown, show percents

**Request:** Shaun (2026-08-15), queued alongside the /press work: in the Devices & formats card, stop showing the `unknown` rows, and show a percent next to each count — percent computed without the unknown sessions.
**Decided:** 2026-08-15. Display-only change in `stats.html`; the API keeps returning `unknown` in all three mixes so the data remains available.

## Design

All changes inside `renderDevices()` (and the `.hbar .n` width):

- **Filter:** drop rows with `key === 'unknown'` from the active tab's list before rendering. Applies to all three tabs (Devices / Formats / Breaks). `Desktop (no break)` is real data and stays.
- **Percent:** each row renders `<sessions> · <pct>%` where `pct = Math.round(sessions / visibleTotal * 100)` and `visibleTotal` = sum of `sessions` over the filtered (non-unknown) rows of that tab. Bars scale to the filtered max, as now.
- **Subtitle:** states the filtered denominator honestly — `sessions by <tab> · <visibleTotal> of <totalSessions> visits` — so the numbers visibly sum to the stated count. (Previously it showed only `totalSessions`.)
- **Empty state:** a tab whose filtered list is empty (all-unknown or no data) shows the existing "no data yet" row.
- **CSS:** `.hbar .n` widens from 30px to 64px to fit `12 · 43%`; the `.hbar.unk` muted-fill rule becomes unused and is removed.

## Non-impacts

- `api/stats.mjs`, tracker, dwell blobs: untouched — `unknown` still counted and returned.
- Roster device lines, other charts, map, table: untouched.
- Staging empty states unaffected.

## Acceptance

- No `unknown` row on any tab; percents on every visible row; each tab's percents sum to ~100 (rounding aside).
- Breaks tab example with 4 known + 220 unknown sessions: shows only the 4 known, percents out of 4, subtitle "… · 4 of 224 visits".
- A tab with zero non-unknown rows shows "no data yet".
