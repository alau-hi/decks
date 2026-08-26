# Design system & format rules

How this deck looks, moves, and is built — the companion to [STORY.md](STORY.md) (which
owns *what the deck argues*; this file owns *how it says it*). Derived 2026-08-23 from
`../aaron-deck/` (same visual system); rules below accumulated through iteration with
Alex, 2026-08-23 → 26.

## The visual world

- **Single-file deck**: all CSS, markup, JS in `slides.html`. No build step, no framework,
  no chart library — every chart and diagram is hand-built inline SVG/HTML.
- **Palette**: dark wood ground (`--ink #1f150c`) with cream type (`--cream/--cream-dim/--muted`)
  and wood/gold accents (`--wood #b87d44`, `--wood-bright #cda165`, `--gold #e2b877`).
  Inverted "cream panel" world for cards that need lift (`--panel*` vars). Always use the
  variables, never hardcoded colors.
- **Type**: Fraunces for display/figures, Inter for text/labels, Montserrat for
  small-caps band labels. Root font clamps with a **9px floor** — nothing on the deck may
  render smaller (sub-.6rem styles carry their own `clamp(10px,…)`).

## Format rules (Alex-set, load-bearing)

- **Titles are claims.** Full sentences that summarize the point; no label-titles, no
  self-grading adjectives. Analogies frame but never substitute for our numbers.
- **No stat-tile dramatization.** Never the giant-number-tiny-caption pattern. Lead with a
  worded header; figures play a supporting role in context (a sentence, a labelled row, a
  chart). On stat rows, labels sit above values at comparable weight.
- **Tables over cards** for anything comparative; compact, dense presentation generally.
- **Legends and asides live in empty side space** (e.g. the Gap slide's "Also imported"
  table bottom-right; chart legends beside, not below).
- **Casing canon**: SUPERMILL ONE / SUPERMILL TWO / CHIPMILL in display (titles, nav,
  stat labels); SuperMill One / Two in running prose. Numbered mills first appear at the
  Cost Roadmap slide — upstream slides speak only of "the SUPERMILL" as a machine class
  (see STORY.md naming rule).
- **Plain language.** No AI-speak ("the gap lands on…"), no hedging filler. Voice-level
  edits from Alex override anything here.

## Claims discipline (the most load-bearing rule)

- Every checkable number, named entity, or attributed position traces to
  [sources/claims.yaml](sources/claims.yaml) (this deck's new claims) or to
  `../investor-overview/sources/claims.yaml` (inherited). Provenance labeled
  (published / derived / triangulated / estimated / internal / asserted) with confidence.
- [REFERENCES.md](REFERENCES.md) is the readable per-slide companion; register entries are
  the authority. Claims researched but not print-ready stay register-only with a
  do-not-print note (e.g. carbon fiber tonnage).
- **On-slide sources live behind the Sources button** — a click-to-open pill bottom-right
  of each data-heavy slide (The Gap, Old Mills, Fast × Fast, Appendix), listing that
  slide's sources with links and one-line summaries. No visible "Sources:" lines on slides.
- Conflicting data is surfaced honestly, never averaged into convenience.

## Deck mechanics

- **Scroll-snap sections**, one per `<section id data-nav>`; right-hand **nav dock** built
  from `data-nav` (keyword labels, scroll-spy `.active`, first/last edge handling);
  left/right arrows jump slides, up/down scroll; type a number to jump.
- **`fitSlides()`** zooms each slide's `.wrap` to fill the viewport (shrink on overflow,
  grow to 1.4x cap; width-capped against the viewport). Quirks that bite: rem lengths
  scale under zoom; right-aligned content can ride into the nav rail on sparse slides —
  cap the containing block's width (see `.gapfoot`). Elements outside `.wrap` (sources
  buttons) escape the zoom.
- **Reveals**: `.rv` elements animate when their section gains `.in` (IntersectionObserver).
  Default state must be presentable — print, headless, and reduced-motion all see it.
- **Counters never fabricate**: real final values always in the DOM; animation is a
  600ms opacity fade only — no intermediate numbers ever exist.
- **Sequential image gate**: slide N reveals once its images load; new `<img>`s
  participate automatically.
- **Circles**: `border-radius:50%` only — `clip-path:circle(50%)` mis-anchors under
  fractional ancestor zoom in current Chrome.
- **Print**: `@media print` gives letter-landscape, one slide per page, chrome and
  sources buttons hidden, `print-color-adjust:exact`.

## Faces

Avatar crops are detector-based, never hand-estimated: OpenCV Haar frontal-face + eye
cascades; eyes at 43% of the circle, chin at 76%; edge-mode padding (never reflect —
mirror ghosts) with blur-softened margins; single LANCZOS resample; 4x supersampled
alpha circle. Investors get a baked gold ring; team/advisors none. True originals live in
`../investor-overview/assets/` and `../../superwood-presentation/assets/` — the `-c` files
here are derived crops.

## Verification workflow

- **Headless harness** per changed slide: copy `slides.html`, inject
  `<style>section{display:none!important}#SID{display:flex!important}.rv{opacity:1!important;transform:none!important}</style>`
  before `</head>`, screenshot with Chrome
  `--headless --window-size=1600,900 --virtual-time-budget=8000 --screenshot=…`.
  Screenshot every layout change before calling it done.
- Headless lies about: CSS-mask glyphs (don't paint), reveal animations, sub-500px widths
  (window floor). Verify avatars/masks/interactions in real Chrome.
- Measure, don't eyeball, nav-rail clearance (getBoundingClientRect via `--dump-dom`
  with an injected measuring script).

## Deploy

`vercel --prod --yes` from **inside this directory only** — never the `decks` repo root
(a root deploy creates a public `decks` project serving the whole repo; see
`../CLAUDE.md`). Project `super-mills-america` → https://super-mills-america.vercel.app.
`.vercelignore` keeps internal docs (STORY, DESIGN, REFERENCES, sources/) off the public
deployment — the deck ships alone. One focused commit per logical change; commit
messages: what in the subject, why in the body.
