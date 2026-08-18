# Press page: remove the "Back to the deck" row

**Request:** Alex (Slack, 2026-08-18): "Can you remove the 'back to the deck' link on the press page?"
**Decided:** 2026-08-18. Remove the whole `.backrow` — with the link gone, its remaining "InventWood — SUPERWOOD" label would duplicate the masthead kicker ("InventWood × Superwood") directly below it.

## Design

In `press.html` only:

- Delete the `.backrow` markup block (the `<div class="backrow">` containing the brand span and the `← Back to the deck` link, lines ~75–78).
- Delete the three CSS rules: `.backrow`, `.backrow a`, `.backrow a:hover` (lines ~22–24).
- No spacing compensation: `.pc-root` keeps `padding:6vh 5vw 60px`, so the masthead starts at the top naturally.

## Non-impacts

- The 48 entries, tier sections, search/filters, foundational block, footnote: untouched.
- The deck's Press coverage button and Dezeen tile still link *to* `/press` — inbound path unchanged.

## Acceptance

- No "Back to the deck" link and no `.backrow` remnants on the live `/press`; all 48 entries intact; filters work.
