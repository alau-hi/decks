# Stats charts: angled slide names on the x-axis

**Issue:** [#4](https://github.com/alau-hi/decks/issues/4) — Alex: "can you put the slide name under each of the slide numbers in the graph?"
**Decided:** 2026-07-23, brainstormed with visual mockups; option chosen: **angled names** (over horizontal-truncated and vertical treatments, which either truncate at the ~37px/column budget or force sideways reading).

## Design

All changes in `superwood-presentation/stats.html`, function `barChart()` — both charts ("Time per slide", "Drop-off") share it.

- **Labels:** each column's x-tick becomes `"<n> · <name>"`, where `name` strips the "The " prefix (matches the viewer-table headers). Names come from `rows[i].name`, already present in both charts' data — no API change.
- **Rotation:** −40°, `text-anchor:end`, anchored just below the baseline at the column center. Keeps the muted `.axis` text token (text never wears the series color).
- **Geometry:** bottom margin 30 → 65; both SVG viewBoxes `0 0 560 290` → `0 0 560 325`. Bars, gridlines, value labels, tooltips, legend, and the click-a-viewer overlay are untouched.
- **Hit areas:** each column's invisible hover rect extends over the label zone, so hovering a label shows that slide's tooltip.
- **Mobile:** SVG scales with the card via viewBox; labels shrink proportionally at stacked widths. Accepted: names stay glanceable, tooltips and the table carry exact values.

## Acceptance

- Both charts show every slide's name legibly at desktop width with no label collisions.
- No collisions when the charts stack at narrow widths.
- Tooltips and viewer-overlay behavior unchanged.
