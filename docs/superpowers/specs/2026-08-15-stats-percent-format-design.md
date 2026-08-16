# Devices card: percent-first row format

**Request:** Shaun (2026-08-15), after seeing the shipped percents: the `·` between count and percent ("123 · 54%") reads like a decimal point. Chosen fix (from percent-first / different-separator / decimal options): **percent first with one decimal, count in parentheses** — `54.2% (123)`.
**Decided:** 2026-08-15. Display-only, `stats.html`.

## Design

Two edits in `stats.html`:

- `renderDevices()`: the row-number line becomes
  `n.textContent=(r.sessions/total*100).toFixed(1)+'% ('+r.sessions+')';`
  (replaces `r.sessions+' · '+Math.round(r.sessions/total*100)+'%'`).
- CSS: `.hbar .n` width `64px` → `88px` so `54.2% (123)` fits without wrapping.

Unchanged: unknown filter, filtered denominator, bars, subtitle ("N of M visits"), tabs, everything outside `renderDevices()`.

## Acceptance

- Rows read like `54.2% (123)`, `0.4% (1)` — percent leads, one decimal, count in parens; no wrapping at desktop or stacked widths.
