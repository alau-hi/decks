# Press page at /press, restyled to the deck

**Request:** Slack thread (Shaun + Alex, 2026-08-15): the press dossier Alex built lives at `bucolic-paletas-474eff.netlify.app` — "not very natural looking". Migrate its content to `investor.inventwood.net/press`, restyle it to match the deck (Alex: "Restyling's a good idea if Claude can pull it off"), and only after it looks good, change the deck's "View press highlights" button to point at it (Shaun: "We can do that before moving the button link to be sure its good looking").
**Decided:** 2026-08-15. `/press` is an **open path** (no email gate — press coverage is public and Alex can share the URL directly). The deck button will point to **relative `/press`** so every domain (investor., sw., stagings, collaborator deploys) keeps viewers on their own host; on investor.inventwood.net that is exactly `investor.inventwood.net/press`.

## Source material

The Netlify page is a fully self-contained artifact: no images, no external scripts, 48 press entries as cards in 4 tier sections — "Mainstream Mass-Audience & Business Press", "Industry, Trade & Specialist Publications", "Syndication, Regional & International", "YouTube & Video Coverage" — with a light "newspaper" palette (cream paper, Palatino serif, rust/olive tier accents). A snapshot is saved for implementation reference; re-fetch `https://bucolic-paletas-474eff.netlify.app` if needed.

## Design

### `press.html` (new, in `superwood-presentation/`)

- Served at `/press` automatically by `cleanUrls` — same mechanism as `/stats` and `/changes`; no `vercel.json` change.
- **Content migrated 1:1**: every entry (rank, outlet, headline, note, date, link), all four tier sections, the stat tiles, search box and filter buttons, the foundational-paper block, and the footnote — same order, no editorial changes. The page's existing self-contained search/filter/stat JS is kept verbatim (the restyle only replaces the `<style>` block and page chrome).
- **Restyled to the deck's design language**: the deck's `:root` tokens (warm dark `--ink` background, cream text, wood accents, `--line` borders), Fraunces for the page headline and tier headings, Inter for card text; card treatment consistent with the stats page's bordered cards. The source's three tier-accent colors map onto deck tones (wood-bright / teal / muted) instead of rust/olive. Links keep `target="_blank" rel="noopener"`.
- **Header row**: brand mark + "In the Press" headline + a quiet "← Back to the deck" link to `/intro`.
- `<title>In the Press — InventWood</title>`, `<meta name="robots" content="noindex">` (consistent with stats), responsive at phone widths (single-column cards).
- No tracker on this page (press-view analytics can be added later if wanted).

### `middleware.js`

- Add `/press` and `/press.html` to `OPEN_PATHS`. Nothing else changes.

### `index.html` — second step, gated on visual approval

- After Shaun/Alex approve the live page: change the button at the "In the Press" slide (`.press-cta .btn`) from `https://bucolic-paletas-474eff.netlify.app/` to `/press` (keep `target="_blank" rel="noopener"`). The Netlify page stays up; nothing breaks while step 2 waits.

## Rollout

1. Build `press.html` + middleware change, deploy production, verify `/press` serves ungated. **Stop for Shaun/Alex visual review.**
2. On approval: flip the button href, deploy, verify.

## Non-impacts

- Deck slides, loading gate, analytics/tracker, `/stats`, `/changes`, gate flow: untouched (until the one-line button change in step 2).
- Staging and collaborator deployments serve `/press` with zero config (static file + cleanUrls; open path only matters where a gate exists).
- Vercel Web Analytics will record `/press` pageviews automatically; no custom events added.

## Acceptance

- `https://sw.inventwood.net/press` (and investor./investors.) serves the restyled dossier with **no email gate**, in a fresh incognito window.
- All 48 entries and 4 tiers present; links open the original articles in new tabs; search and tier/year filters still work.
- Page reads as part of the deck's family: dark wood/cream, Fraunces headings, legible at phone widths.
- Step 2 only: the deck's "View press highlights" button opens `/press` on the viewer's current domain.
