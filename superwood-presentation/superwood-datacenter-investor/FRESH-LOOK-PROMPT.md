# Session prompt — fresh look at the SUPERWOOD data center investor deck

Take a fresh, critical look at our **data center deck for investors**. I want new eyes on
it, not a continuation of how it was built.

## Where everything is

- **Project folder:** `~/Git/decks/superwood-datacenter-investor/` — work only here.
  - `gen.js` — generates the PPTX (pptxgenjs). `node gen.js` rebuilds it.
  - `slides.html` + `assets/` — the web version, currently deployed.
  - `STORY-OUTLINE.md` — narrative arc and slide-by-slide map.
  - `analyses/`, `prep/`, `media/`, `render/` — research, processed imagery, saved
    image-generation prompts.
  - `SUPERWOOD-for-Data-Centers-Companion.pptx` / `.pdf` — current exports.
- **Live (gated):** https://superwood-datacenter-investor.vercel.app — email gate, then
  `/slides`. Vercel project `superwood-datacenter-investor`. Deploy with
  `vercel deploy --prod --yes` from the folder.
- **Reviews of the sibling customer deck:**
  `~/Git/decks/superwood-datacenter/reviews/REVIEW-2026-07-24.md` — four critiques
  (hyperscaler CSO, DC construction head, DC architect, Elemental/DCII program lead).
  Most findings apply here too. Read before proposing changes.
- **Brand:** invoke the `inventwood-brand` skill before styling anything.

## Separation is essential

These decks must stay separate — separate folders, separate Vercel projects, separate
audiences. Do not merge them, do not deploy this one through the teaser project
(`inventwood-teaser` / `~/Git/decks/superwood-presentation`), and do not edit
`superwood-presentation/index.html` — it is the protected standard deck.

- customer / DCII deck → `~/Git/decks/superwood-datacenter/`
- investor DC deck → `~/Git/decks/superwood-datacenter-investor/` (this one)
- standard InventWood deck → `~/Git/decks/superwood-presentation/` (read-only)

## What I want from the fresh look

1. Read the deck end to end and tell me honestly where it is weak — argument gaps,
   slides that do not earn their place, claims that would not survive a sharp investor.
2. Propose a revised storyline and slide-by-slide outline. **Wait for my OK before
   building.**
3. Then implement, rebuild both the PPTX and the web version, and redeploy.

## Tooling gotchas (learned the hard way — do not rediscover)

- **Export PDFs via Keynote AppleScript, not PowerPoint** — PowerPoint hangs on files this
  size. If Keynote wedges, `pkill -f Keynote` and retry.
- **Keynote's PDF export silently drops native pptxgenjs line charts.** Bar charts survive.
  Render line charts with matplotlib in the brand palette and place them as images.
- Validate with the `pptx` skill's `scripts/office/validate.py` (needs a Python 3.12 venv
  with `lxml` + `defusedxml`; system python3.9 is too old).
- **Always visually QA**: `pdftoppm -jpeg -r 90 -f N -l N deck.pdf out`, then actually look
  at the slide before calling it done.
- Imagery: Higgsfield MCP `generate_image` with `nano_banana_pro`. Image-to-image editing
  works well — pass a prior `job_id` as `medias[{role:"image", value:...}]` with "keep this
  image exactly the same except…". `remove_background` returns real alpha PNGs for
  compositing. Save every prompt into `render/`.
- Web deck conventions: fixed right-hand dock of short keyword labels with live scroll-spy
  highlighting (first section must activate at the very top, last at the very bottom), and
  left/right arrow keys jump section to section.
- `.vercelignore` keeps source (PPTX, PDF, zip, `gen.js`, `prep/`, `media/`, `analyses/`,
  outline) off the CDN. Keep it that way — only `slides.html`, `index.html`, `gate.html`,
  `api/`, `middleware.js` and `assets/` should ship.

## Standing rules

- **Never invent numbers, quotes, market sizes, or named-person positions.** Mark specific
  claims `[conf: H|M|L]`; anything unsourced gets `[needs source]`. Show derivations.
- Terse, structured responses. No emojis.
- Propose the plan for structural changes and wait for my OK; just do small fixes.

## Known open items

- "60% of a data center's mass is steel" is still unsourced.
- A "90% reduction in steel-manufacturing emissions" headline needs a written derivation.
- LCA is in progress with Prof. Ming Hu, University of Notre Dame — all carbon figures are
  pre-LCA projections and must be labeled as such.
- Prof. Hu's H-index is 198.
- SUPERWOOD price figures in the deck are base cost x1.7; confirm that is the right basis.
