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

The deployed deck is gated: every path except `/gate`, `/api/enter`, `/_vercel/*`, `/favicon.ico`, and `/assets/og-cover.jpg` requires a signed `sw_auth` cookie. The gate is env-aware: it activates only where `AUTH_SECRET` is configured (the production project), and `GATE_DISABLED=1` force-disables it — so staging projects deployed with no env vars serve the deck open, and deployments without `DATABASE_URL` accept but drop tracking beacons.

- `gate.html` — branded email form shown to unauthenticated visitors (middleware rewrites to it, URL preserved). Email-only by design: no access code required (one existed originally; the unused `DECK_PASSWORD` env var remains if it's ever wanted back).
- `api/enter.mjs` — validates the email shape, records the signup to Postgres (`signups` table), sets an HMAC-signed cookie (secret: `AUTH_SECRET` env var, 30-day expiry), and redirects to `/?v=<email>` so the deck's per-viewer analytics attribute automatically.
- `middleware.js` — Edge middleware enforcing the cookie; also redirects authenticated visits to `/` onto `/?v=<email>`.

Engagement analytics are two-layered. Vercel Web Analytics gets `deck_open` and `section_view` custom events (kept to ≤2 data properties — the plain-Pro limit). Per-slide dwell time is first-party: the tracker script at the bottom of `index.html` beacons cumulative per-section seconds to `api/track.mjs` (one `dwell_sessions` row per session, upserted on each flush so repeats never double-count). Both record types include the viewer's IP and Vercel-provided geo (`x-vercel-ip-city`/`-country`/`-latitude`/`-longitude`). The tracker applies a 180s idle cutoff (no pointer/key/scroll activity → time stops accruing) so abandoned-open tabs don't inflate dwell. `stats.html` + `api/stats.mjs` render the private dashboard at `/stats`: viewer roster + per-slide heatmap, plus SVG charts (avg time per slide with click-a-viewer overlay, drop-off) and an SVG world visit map (Natural Earth outline embedded in `stats.html`; old records without coords fall back to country centroids). `/changes` (change-log page) is team-only: beyond the viewer cookie it requires a signed `sw_admin` cookie (400-day lifetime), set by entering `STATS_KEY` on either `/key` or `/stats` (endpoint: `api/adminkey.mjs`). The stats API requires the `STATS_KEY` env var (separate from viewer auth) and returns `slideOrder` — the canonical slide-name list lives in `api/stats.mjs` and must match the `data-nav` names in `index.html` if slides are renamed/reordered.

The `/changes` request board is shared: `api/changes.mjs` (full CRUD, `sw_admin`-cookie-gated for reads and writes, `change_requests` table with soft deletes). The change *log* on the same page stays hardcoded in `changes.html` — it's authored at commit time and git-versioned; every push that changes the deck must extend its `LOG` array. Without `DATABASE_URL` the board falls back to the seed requests + per-browser localStorage (the pre-Postgres behavior); a one-time banner offers to import a browser's old localStorage edits into the shared board.

Operational notes: change the stats key by updating the `STATS_KEY` env var in Vercel project settings (then redeploy); view captured emails in the Neon console (`select * from signups`) — pre-migration records also remain archived in Vercel Blob (Storage → deck-signups).

Environments (one Vercel project, `superwood-presentation`, team `inventwood`; deploy scripts in `package.json`, always run from `superwood-presentation/` — never the repo root):
- **Production** — `npm run deploy:prod` → `sw.inventwood.net` (+ `investor.`/`investors.`; CNAMEs in Route 53 → `cname.vercel-dns.com`). Gated; `DATABASE_URL` points at the Neon **primary** branch.
- **Gated staging** — `npm run deploy:stage` (preview env + alias) → `superwood-stage.vercel.app`. Email gate active (preview has `AUTH_SECRET`/`STATS_KEY`); its `DATABASE_URL` points at the Neon **`staging` branch** database, so logins/dwell recorded there never pollute production stats.
- **Ungated staging** — `npm run deploy:stage-open` (custom environment `staging-open` + alias) → `superwood-stage-open.vercel.app`. No secrets + `GATE_DISABLED=1`: no gate at all.
Vercel's own SSO deployment protection is intentionally OFF for this project — the email gate is the protection layer.

### Deploying — CRITICAL rule

**Never run `vercel` from the repo root.** Always `cd superwood-presentation` first (the `deploy:*` npm scripts assume that cwd), in the same shell command as the deploy. A root-level `vercel --yes` auto-creates a brand-new PUBLIC project named `decks` that serves the entire repo ungated — including the 90MB master PPTX. This has happened three times. Telltale symptoms: deploy output says "Failed to link alau-hi/decks" or aliases to `decks-*.vercel.app` instead of `sw.inventwood.net`. Recovery: `vercel project rm decks`, delete the root `.vercel/` directory, redeploy from `superwood-presentation/`.

### New machine setup (team members)

1. `vercel login` (team scope: `inventwood`; project `superwood-presentation` links on first deploy from `superwood-presentation/`).
2. GitHub: the working account needs write access to `alau-hi/decks` (SSH or `gh auth login`).
3. Secrets are never in this repo — the stats key and gate secrets live in Vercel project env vars. To read them: `cd superwood-presentation && vercel env pull --environment=production .env.check` (then delete the file). `STATS_KEY` unlocks `/stats` and `/changes`.
4. AWS/Route 53 is only needed for new subdomains (records are CNAME → `cname.vercel-dns.com`); the CLI user `S-Mac-cmdline` lacks Route 53 permissions, so records are created manually in the console.

### Neon Postgres (migrated 2026-07-20)

Analytics and the `/changes` board live in Neon Postgres — a **direct Neon account** (not the Vercel Marketplace) so the DB stays portable; driver `@neondatabase/serverless`; connection via the `DATABASE_URL` env var (pooled connection string). Schema: `scripts/schema.sql` (`signups`, `dwell_sessions`, `change_requests`), applied by `scripts/backfill.mjs` — which also idempotently copies the pre-migration Blob records and seeds the board; safe to re-run any time (needs `BLOB_READ_WRITE_TOKEN` + `DATABASE_URL`, see the script header). Convention: the Neon **primary** branch serves production; a Neon **`staging`** branch serves the Vercel preview env. The old Blob store is a frozen archive — nothing writes to it anymore.

### Collaborator deployments (no env vars)

The gating is designed so collaborators (e.g. Alex, the designer) can deploy this repo to their own Vercel project and run locally with **zero configuration** — all protection keys off env vars that exist only in the team's project:

- No `AUTH_SECRET` → `middleware.js` passes every request through: no email gate, `/changes` and `/stats` pages open (and `/api/changes` skips its cookie check).
- No `DATABASE_URL` → `/api/track` returns a 204 no-op, `/api/stats` returns an empty dataset, and `/api/changes` serves the static seed requests (edits stay in localStorage); nothing is ever recorded on collaborator deployments.
- `/api/enter` returns a harmless redirect instead of erroring (the empty-HMAC-key 500 was fixed for good).
- The build needs no env vars, and `npm run dev` (vite) serves the static deck with no middleware/APIs at all.

Collaborators deploy with plain `vercel` / `vercel --prod` on their own project. The `deploy:prod|stage|stage-open` scripts are pinned to `--scope inventwood` and will fail harmlessly with a permissions error for anyone outside the team. `GATE_DISABLED` is optional everywhere: its absence never enables the gate — only the presence of `AUTH_SECRET` does.

## Conventions

- Mobile matters: recent history is heavy with mobile-specific fixes. Slides use per-slide `@media` blocks (breakpoints vary: 560/700/820/900/980px, plus portrait orientation). Verify changes at phone widths, not just desktop.
- Charts and diagrams (cost graph, market tiles, IP donut, roadmap) are hand-built inline SVG/HTML — there is no chart library.
- Palette and type are defined as CSS custom properties in `:root` (warm wood/cream theme, Fraunces + Inter + Montserrat via Google Fonts). Reuse the variables rather than hardcoding colors.
- Commit messages in this repo are short imperative descriptions of the visual change (see `git log`).

