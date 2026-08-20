# Press page: search on its own row, buttons on one line

**Request:** Shaun (2026-08-18): after the tier-button renames the controls row wraps messily — the 2026 button falls to a second line and the search placeholder is clipped ("Search outlet, headline, or keywor"). Buttons should sit on one line and the placeholder show fully.
**Decided:** 2026-08-18. One CSS value change in `press.html`.

## Design

The seven filter buttons need only ~590px — they fit one line easily. The wrap comes from the search input sharing the row (its 240px flex-basis plus the buttons overflows at typical window widths).

- `.search`: `flex:1 1 240px` → `flex:1 1 100%`. The input takes its own full-width row; the existing `flex-wrap` on `.controls` puts all seven buttons together on the next line.
- Nothing else changes: no markup, no label or padding compression, no new media rules. Below ~700px viewport the buttons wrap into short rows as before — normal phone behavior.

## Acceptance

- Desktop: search input spans the content width with the full placeholder visible; all seven buttons (All / Mainstream / Industry / International / Video / 2025 / 2026) on a single line.
- Filters and search behavior unchanged; 48 entries intact.
