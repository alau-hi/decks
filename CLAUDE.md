# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

InventWood pitch decks. Everything is static HTML — no build step, no framework, no dependencies to install. `InventWood Teaser Deck - MASTER.pptx` at the root is the original PowerPoint source the HTML decks were derived from.

- `superwood-presentation/` — the main investor deck, actively developed. Deployed to Vercel (`vercel.json`, Vercel Analytics wired into the page).
- `gemini/teaser/` — an alternate teaser deck with its own styling; largely dormant.

## Commands

```bash
cd superwood-presentation && npm run dev   # vite static server on port 3000
```

That's the only command. There are no tests or linters. To preview the other deck, run the same from `gemini/teaser/`.

## superwood-presentation architecture

`index.html` is the live deck and is fully self-contained: all CSS, markup, and JS in one file (~950 lines), plus images in `assets/`. `SUPERWOOD.html` is an older iteration and `SUPERWOOD.reverted.bak` a backup — edit `index.html` unless told otherwise.

Structure of `index.html`:

- 14 slides, each a `<section id="s1..s14" data-nav="...">`. The deck scrolls inside `#deck` with CSS scroll-snap (`scroll-snap-type: y mandatory`); each section is `min-height:100vh`.
- **Sequential loading gate**: a script hides all slides after the first, preloads each slide's images in order, and only reveals slide N once its assets are loaded (`readyUpTo`). Keyboard/scroll navigation past the loaded frontier shows a "Loading…" pill. When adding images, they participate in this gate automatically (both `<img>` and inline `background-image`).
- **Reveal animations**: elements with class `.rv` animate in when their section gets the `.in` class from an IntersectionObserver (≥50% visible). Elements with `data-count` animate numbers when the section enters.
- Fixed chrome: progress bar `#prog`, brand logo, numbered nav dots (`nav.dots`, built from `data-nav`), keyboard navigation (arrows/PageUp/PageDown/Home/End).
- **Analytics**: Vercel Analytics (`/_vercel/insights/script.js`) plus a custom tracker that reads a viewer identity from the `?v=` (or `?to=`/`?viewer=`) query param and emits `deck_open`, `section_view`, and `section_time` (per-slide dwell seconds) events. Preserve this when restructuring slides — it keys off `data-nav`/section ids.

## Access gate & analytics (Vercel)

The deployed deck is gated: every path except `/gate`, `/api/enter`, `/_vercel/*`, `/favicon.ico`, and `/assets/og-cover.jpg` requires a signed `sw_auth` cookie.

- `gate.html` — branded email + access-code form shown to unauthenticated visitors (middleware rewrites to it, URL preserved).
- `api/enter.mjs` — validates the code against the `DECK_PASSWORD` env var, records the signup to Vercel Blob (`deck-signups/` prefix in the `deck-signups` store), sets an HMAC-signed cookie (secret: `AUTH_SECRET` env var, 30-day expiry), and redirects to `/?v=<email>` so the deck's per-viewer analytics attribute automatically.
- `middleware.js` — Edge middleware enforcing the cookie; also redirects authenticated visits to `/` onto `/?v=<email>`.

Engagement analytics are two-layered. Vercel Web Analytics gets `deck_open` and `section_view` custom events (kept to ≤2 data properties — the plain-Pro limit). Per-slide dwell time is first-party: the tracker script at the bottom of `index.html` beacons cumulative per-section seconds to `api/track.mjs` (one Blob per session under `deck-dwell/<email>/<session>.json`, overwritten on each flush so repeats never double-count). Both record types include the viewer's IP and Vercel-provided geo (`x-vercel-ip-city`/`-country`). `stats.html` + `api/stats.mjs` render the private dashboard at `/stats`: full viewer roster (from signups, with IP + location) merged with a per-viewer × per-slide time heatmap; the API requires the `STATS_KEY` env var (separate from the deck access code). Slide columns in `stats.html` are a hardcoded list of the `data-nav` names — update it if slides are renamed/reordered.

Operational notes: change the access code or stats key by updating the env var in Vercel project settings (then redeploy); view captured emails in the Vercel dashboard (Storage → deck-signups) or `vercel blob list`. Deploys: `vercel --prod` from `superwood-presentation/` (project `superwood-presentation`, team `inventwood`). Production domain: `sw.inventwood.net` (CNAME in Route 53 → `cname.vercel-dns.com`).

## Conventions

- Mobile matters: recent history is heavy with mobile-specific fixes. Slides use per-slide `@media` blocks (breakpoints vary: 560/700/820/900/980px, plus portrait orientation). Verify changes at phone widths, not just desktop.
- Charts and diagrams (cost graph, market tiles, IP donut, roadmap) are hand-built inline SVG/HTML — there is no chart library.
- Palette and type are defined as CSS custom properties in `:root` (warm wood/cream theme, Fraunces + Inter + Montserrat via Google Fonts). Reuse the variables rather than hardcoding colors.
- Commit messages in this repo are short imperative descriptions of the visual change (see `git log`).
