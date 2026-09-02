# Supermills America deck: monorepo import, served at /supermills-america-overview

**Request:** Alex (Slack, 2026-08-31): put the SUPERMILLS America deck (currently `super-mills-america.vercel.app`, repo `alau-hi/supermills-america`) at `investors.inventwood.net/supermills-america-overview`. Shaun: treat Alex's own deployment as *his staging*, not the production origin; keep the door open to stats-page integration later; Alex agreed to move into the monorepo, but may keep committing to his original repo for a while.

**Decided:** 2026-09-01.

## Decisions

1. **Monorepo, imported with `git subtree`.** The deck lives at `superwood-presentation/supermills-america-overview/` as ordinary tracked files (no submodule pointer, no clone-time init). `git subtree add` brings Alex's full commit history (145 commits) into `alau-hi/decks`.
2. **Transition bridge.** While Alex still pushes to `alau-hi/supermills-america`, his repo is the source of truth for the deck's *content* and `git subtree pull` merges his new commits in. Wrapped as `npm run sync:supermills` (run from `superwood-presentation/`). When he switches to committing in the monorepo, the script stops being used and his old repo is archived — nothing to dismantle.
3. **Pull-only rule during the transition:** nobody edits files inside `supermills-america-overview/` in the decks repo until Alex has moved over (an edit on our side would conflict with the next pull). Everything this feature builds lives *outside* that directory, so the rule costs nothing.
4. **Alex's Vercel project stays his staging.** Production serves only what was promoted into the monorepo and deployed with `npm run deploy:prod`. Promotion = sync (or, post-transition, a normal commit) + deploy. `git log` on the directory is the record of what investors saw.
5. **Gated, with return-path.** The deck sits behind the existing email gate (automatic: the middleware gates every non-allowlisted path). Signing in at the gate returns the visitor to the URL they came for instead of always landing on `/intro`.

## Layout

```
superwood-presentation/
  supermills-america-overview/     ← subtree of alau-hi/supermills-america (main)
    slides.html                    the deck (single file, relative assets/… paths)
    index.html                     Alex's redirect stub — NOT served here (see Routing)
    assets/                        5.9 MB of images
    STORY.md DESIGN.md REFERENCES.md README.md sources/ .impeccable/ feedback/ render/
    alt-slide2.html alt-datacenter.html
```

Docs, sources, critique history and alt slides ride along in git (they're Alex's working notes and useful history) but are **excluded from deployment** via a new root `superwood-presentation/.vercelignore` — only the root ignore file applies to a Vercel project, so Alex's own `.vercelignore` is inert here. Entries mirror his list, prefixed: `supermills-america-overview/{README.md,STORY.md,DESIGN.md,REFERENCES.md,sources,.impeccable,feedback,render,alt-slide2.html,alt-datacenter.html,.vercelignore,.gitignore}`. Deployed: `slides.html`, `index.html` (harmless, never routed to), `assets/`.

## Routing (`superwood-presentation/vercel.json`)

The deck uses relative asset URLs (`assets/foo.webp`), so it must be served from a trailing-slash directory URL or those paths resolve to the superwood deck's own `/assets/` and collide. Alex's `index.html` meta-refreshes to the absolute `/slides.html`, which would 404 in this project, so it is bypassed entirely.

- Redirect `/supermills-america-overview` → `/supermills-america-overview/` (302, `permanent: false`, matching the repo's existing redirect style).
- Rewrite `/supermills-america-overview/` → `/supermills-america-overview/slides.html`.
- Assets need no rule: `/supermills-america-overview/assets/*` is served from the filesystem as-is. The existing `/assets/(.*)` cache header is extended to cover `/supermills-america-overview/assets/(.*)` too.

`cleanUrls: true` stays on. Verify on staging that a rewrite destination ending in `.html` serves the file rather than bouncing through cleanUrls' `.html`-stripping redirect; if it does bounce, the fallback is rewriting to `/supermills-america-overview/slides` (the clean URL).

## Gate return-path

- `gate.html`: the form gains a hidden `next` field, filled by JS from `location.pathname + location.search` (the middleware's rewrite to `/gate` preserves the original URL). Sent in the existing JSON POST as `next`.
- `api/enter.mjs`: reads `next`; accepts it only if it matches `^/[A-Za-z0-9_\-./]*$` and does not start with `//` (same-site relative path only — no open redirect); otherwise falls back to `/intro`. The redirect becomes `<next>?v=<email>` (the `?v=` viewer identity is harmless on non-superwood paths and keeps `/intro` behavior byte-identical).
- Middleware: unchanged. Its authenticated `/intro` → `/intro?v=` redirect is unaffected; supermills visits by authenticated viewers pass straight through.
- Ungated deployments (`/api/enter` short-circuit branch) also honor `next` so the redirect stays consistent everywhere.

## Sync script and docs

- `package.json` (in `superwood-presentation/`): `"sync:supermills": "git subtree pull --prefix=supermills-america-overview git@github.com:alau-hi/supermills-america.git main -m 'Sync supermills deck from alau-hi/supermills-america'"`. Squash is **not** used — we want his real commits in history.
- Initial import is a one-time manual `git subtree add --prefix=superwood-presentation/supermills-america-overview git@github.com:alau-hi/supermills-america.git main` run from the repo root (subtree paths are relative to the repo root; the npm script therefore runs from `superwood-presentation/` with a repo-root-relative prefix — verify the prefix resolution once during implementation and adjust the script's `cd` if needed).
- `CLAUDE.md`: new short section — the deck's location, the URL, the pull-only rule during the transition, `npm run sync:supermills`, and that Alex's vercel.app deployment is his staging.
- `changes.html` `LOG`: one entry for the new deck's arrival.

## Non-impacts

- The superwood deck (`index.html`), its analytics, `/stats`, `/changes`, `/press`: untouched.
- No database changes. No new env vars. Collaborator deployments behave as before (ungated everywhere; the new path simply serves).
- Alex's repo is never written to by this feature.

## Acceptance

- `investors.inventwood.net/supermills-america-overview` (unauthenticated) shows the email gate; after signing in the visitor lands on the supermills deck, not `/intro`. `/intro` sign-ins still land on `/intro?v=<email>`.
- Authenticated visit renders the deck with all images loading from `/supermills-america-overview/assets/…`; no request hits `/slides.html` or `/assets/` at the root.
- `curl -s https://sw.inventwood.net/supermills-america-overview/STORY.md` (with a valid cookie) is a 404 — docs are not deployed.
- `git log --oneline superwood-presentation/supermills-america-overview | wc -l` ≥ 145 after import (history preserved); `npm run sync:supermills` after a new commit in Alex's repo brings it in with no conflict.
- Deployed via staging first (`superwood-stage.vercel.app`), then production.

## Later (not in this feature)

- Per-slide dwell tracking for the supermills deck: once Alex works in the monorepo, add the tracker beacon to `slides.html` and give slides `data-nav` names; `/stats` would then key on the existing `DECK_ID`/`deck` column convention to show a second deck.
- Archive `alau-hi/supermills-america` when Alex has fully moved.
