# Press page: remove the "Back to the deck" row + rename tier filter buttons

**Request:** Alex (Slack, 2026-08-18): "Can you remove the 'back to the deck' link on the press page?" and "rename the Tier I, Tier II, and Tier III buttons Mainstream, Industry, and International?"
**Decided:** 2026-08-18. Both in `press.html` only, one deploy.

## Design

### 1. Remove the back row

- Delete the `.backrow` markup block (the `<div class="backrow">` containing the brand span and the `← Back to the deck` link, lines ~75–78). With the link gone, its remaining "InventWood — SUPERWOOD" label would duplicate the masthead kicker ("InventWood × Superwood") directly below it, so the whole row goes.
- Delete the three CSS rules: `.backrow`, `.backrow a`, `.backrow a:hover` (lines ~22–24).
- No spacing compensation: `.pc-root` keeps `padding:6vh 5vw 60px`, so the masthead starts at the top naturally.

### 2. Rename the tier filter buttons

Visible label text only — `data-filter` values and the filter script untouched:

- `<button class="filter-btn" data-filter="tier1">Tier 1</button>` → label `Mainstream`
- `<button class="filter-btn" data-filter="tier2">Tier 2</button>` → label `Industry`
- `<button class="filter-btn" data-filter="tier3">Tier 3</button>` → label `International`

The names are the keywords of the section titles they filter (Mainstream Mass-Audience & Business Press / Industry, Trade & Specialist Publications / Syndication, Regional & International). Labels render uppercase via the existing `.filter-btn` CSS; the button row wraps, so the longer "International" is safe at phone widths. `All`, `Video`, `2025`, `2026` buttons unchanged.

## Non-impacts

- The 48 entries, tier sections and their titles, search, filter behavior, foundational block, footnote: untouched.
- The deck's Press coverage button and Dezeen tile still link *to* `/press` — inbound path unchanged.

## Acceptance

- No "Back to the deck" link and no `.backrow` remnants on the live `/press`.
- Buttons read All / Mainstream / Industry / International / Video / 2025 / 2026; clicking Mainstream/Industry/International filters to the same sections Tier 1/2/3 did.
- All 48 entries intact.
