# Press page: "Selected Press" rename, header trim, year filters out, date validation

**Request:** Shaun (2026-08-20): remove everything above "Press Coverage Dossier"; rename it "Selected Press"; remove the 2025 and 2026 filters; validate each article's displayed date by loading its page, updating where wrong. Unverifiable dates are listed in chat with links for Shaun to check by hand — not silently left.
**Decided:** 2026-08-20.

## Part A — page edits (`press.html`)

1. **Header trim:** delete the kicker markup (`<div class="kicker">InventWood × Superwood</div>`) and the `.kicker` CSS rule. Nothing else sits above the title (the back-row was removed in #14). The page opens on the title.
2. **Rename:** `<h1 class="title">Press Coverage Dossier</h1>` → `Selected Press`. The browser-tab `<title>` ("In the Press — InventWood") stays.
3. **Year filters out:** delete the two buttons (`data-filter="2025"`, `data-filter="2026"`) and the two dead script lines (`if (activeFilter === '2025' ...)`, `if (activeFilter === '2026' ...)`). `data-year` attributes on articles stay.

## Part B — date validation (all 48 entries)

Parallel subagents load each article URL and extract the actual publication date (article byline, meta tags such as `article:published_time`, or YouTube upload date).

- **Confident mismatch → correct** the `.a-date` text; keep `data-year` in sync if the year moved. Format follows the page's precision: `May 12, 2025` when exact, `Dec 2025` when only month is knowable.
- **Unverifiable** (paywall, 404/dead link, bare-homepage URL such as the Fast Company entry, or no discoverable date) → **left unchanged**; the entry (outlet, headline, URL, current date) goes into a chat-delivered list for Shaun to click and verify manually. Follow-up corrections from that manual pass are applied as a patch commit on request.
- Dead/404 URLs are reported in the same list even if the date matches — they need a human decision.

## Non-impacts

- Search, tier filters (All/Mainstream/Industry/International/Video), tier sections, whole-row click, foundational block, footnote: untouched.
- Deck and other pages: untouched.

## Acceptance

- Live /press opens on "Selected Press"; no kicker; filter row reads All / Mainstream / Industry / International / Video; both removed filters gone from markup and script; 48 entries intact; search and remaining filters work.
- Every confidently-datable article shows a date matching its source page; the unverifiable list is delivered in chat with clickable URLs.
