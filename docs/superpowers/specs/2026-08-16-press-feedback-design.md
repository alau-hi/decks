# Press page: Alex's readability feedback

**Request:** Alex (Slack, 2026-08-15 evening): the original was more readable, "esp with the larger titles"; remove the stat-tile row (48 / 9 / 16 / 7); make the whole of each entry clickable. Shaun clarified 2026-08-16: whole-row click opens the article (new tab), same destination as the headline.
**Decided:** 2026-08-16. All three in `press.html` only.

## Design

1. **Larger titles:** `.a-headline` `font-size:.95rem` → `1.15rem`, `line-height:1.4` → `1.35`. Nothing else resized.
2. **Stat tiles removed:** delete the `.stats` markup block (4 tiles), the `.stats`/`.stat`/`.stat-num`/`.stat-label` CSS rules (and the `.stats` mobile media rule), and the script's "Populate stats" block — the five lines computing `total/tier1/tier2/video` counts into `stat-total`/`stat-tier1`/`stat-trade`/`stat-video`. (Markup-only removal would null-crash the filter IIFE, so the script edit is required; the rest of the script stays verbatim.)
3. **Whole entry clickable:** appended inside the script IIFE — a delegated click listener on each `ol.articles`: clicks inside an `li.article` open that row's `.a-headline` href via `window.open(href,'_blank','noopener')`, skipped when the click target is inside a real `<a>` (native link wins) or when a text selection exists (`!getSelection().isCollapsed`). CSS: `.article{cursor:pointer}` + hover `background:rgba(244,236,223,.03)`.

## Non-impacts

- The 48 entry markups, tier sections, search + filters, foundational block, footnote: untouched.
- Deck, middleware, other pages: untouched.

## Acceptance

- No stat tiles; article titles visibly larger; filters and search still work (script intact).
- Clicking a row's note/date/rank opens the article in a new tab; clicking the headline or Read → behaves as before; selecting note text does not navigate.
- All 48 entries still present on the live page.
