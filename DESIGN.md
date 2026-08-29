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
  variables, never hardcoded colors. Per-material tints (rust / silver / white on the Gap
  stat labels) were tried on 2026-08-29 and reverted the same day — the deck keeps one accent.
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
- **The Gap slide carries an image strip** (added 2026-08-29, Alex picked variant C from
  `alt-slide2.html`): three photographs between the lead and the stat row, each column lining
  up with the stat beneath it. The first two photographs **abut** — zero gutter (Alex, 2026-08-29: "to create the sense
  of intensity") — and the third is set **`.5rem` apart with rounded corners**, because steel and aluminum are
  import shares of a material while the data-centre figure is a demand signal, and Jon's
  feedback was that running all three flush implied a parallel that is not there. Both grids
  take the same offset on their third column, which is what keeps stat and photo registered. A light
  rule in that margin was tried on 2026-08-29 and rejected as ugly: **slide 2 separates on
  shape**, with the ground showing through as a brown gap and an `18px` radius on the
  demand-signal photograph alone. Slide 3 keeps the light rule, because its panels bleed to the
  slide edge and have no corners to round. Both grids therefore run at
  `gap:0` and the gutter moves inside each `.gr` as `padding-right`, which is what keeps every
  stat registered to its own photo's left edge. `#gap .gapcols` caps strip and stats to the
  same width — change one, change both. No scrim on
  these images: nothing is overlaid on them, so they only need `brightness(.96)` to sit in
  the palette. The strip is hidden below 700px (three sixteenths of a photo are unreadable
  at phone width; the slide reverts to the text-only row that already worked there) — and
  that media query is **`@media screen`-scoped on purpose**: unscoped, the print page box
  reports portrait and swallows the strip out of the PDF. Verified by printing the slide.
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
- **Stat tooltips**: every figure on both Gap slides — the three headline stats *and* the three
  "Also imported" rows — is a hover/focus `sw-ref` carrying a `sw-tip` with that figure's basis
  and corroboration (Alex, 2026-08-29). The aside rows are `subgrid` so each material is its own
  hover target while the two columns stay aligned across all three rows, and they use the
  `tipd` (open-downward) variant on the alt slide, where the aside sits at the top of the frame
  with nothing above it. Hover is right here
  and click is right for the Sources button — the tooltip explains one number, the panel lists
  a slide's provenance. Two specificity traps when extending this pattern into a stat block:
  `.gr span{white-space:nowrap}` outranks `.sw-tip`'s own `white-space:normal`, and the stat's
  `b` styling (Fraunces, gold, 1.25rem) leaks into the tooltip's `<b>`; both need winning back
  explicitly. On the full-bleed slide, a tip's absolute offsets resolve against the figcaption's
  padding box, which reaches the panel edge — the right-aligned tip steps back by the rail
  reserve or it lands under the nav.
- **On-slide sources live behind the Sources button** — a click-to-open pill bottom-right
  of Old Mills, Fast × Fast and the Appendix, listing that slide's sources with links and
  one-line summaries. No visible "Sources:" lines on slides. **The two Gap slides no longer
  carry one** (Alex, 2026-08-29): every figure on them, headline stat and aside row alike, now
  explains itself on hover, so the panel was duplicating its own slide. The trade-off to know:
  the panel carried clickable source *links*, and the tooltips do not — for the Gap slides the
  URLs now live only in [REFERENCES.md](REFERENCES.md), which is repo-private. If a viewer ever
  needs to click through to AISI or USGS from the deck itself, the button has to come back.
- Conflicting data is surfaced honestly, never averaged into convenience.

## Full-bleed slides

`#gapalt` (The Gap (alt), added 2026-08-29) is the deck's only edge-to-edge slide, and it
works by **having no direct-child `.wrap`** — `fitSlides()` bails on such a section
(`if(!w)return`), so nothing is zoomed and the layout sizes off the viewport instead. That is
deliberate: a sparse full-bleed slide handed to `fitSlides` upscales to the 1.4x cap and
throws its headline into the nav rail. Two consequences to respect when editing it:

- Absolute layers ignore the section's `padding-right:max(6vw,9.5rem)` rail reserve, so the
  last panel's caption re-applies that exact expression itself. Keep them in step.
- **All three panels bleed.** An inset card for the data centre was tried on 2026-08-29 and
  reverted the same day: on this slide the data centre carries *scale of opportunity*, and a
  card set into the ground argues the opposite of scale. The separation is carried instead by
  the `.5rem` light rule and the slightly wider `1.06fr` column, which is as much differentiation as
  this slide can take without undercutting its own point. Slide 2 is where the distinction can
  be drawn more strongly, because nothing there depends on the image conveying scale.
- **Measuring rail clearance: compare against the widest nav label that overlaps vertically,
  not the first one.** The nav is right-aligned, so `nav.dots a:first-child` ("Cover 01") starts
  furthest right of any label and reports a comfortable gap while a long mid-list label like
  "Cost Roadmap 08" is already overlapping. A first-link measurement here read 41px clear when
  the true figure was −18px. Iterate every link, keep those whose vertical band intersects the
  element, and take the minimum.
- The headline block is a flex row: headline left, the "Also imported" table right (added
  2026-08-29 so the alt slide carries the same other-materials list as The Gap). Because that
  block already sits inside the rail reserve, the table clears the nav links at every size
  tested — measured, not eyeballed: 86px at the tightest (1600x700, where the taller 20-slide
  nav list climbs highest). Re-measure if the deck gains slides.
- It carried a Sources panel cloned from `#gap` at load; both were removed on 2026-08-29 when
  the stats became self-explaining on hover. If a panel ever returns to these slides, clone it
  again rather than duplicating the markup — two hand-maintained copies of one citation list
  drift.

## Deck mechanics

- **Scroll-snap sections**, one per `<section id data-nav>`; right-hand **nav dock** built
  from `data-nav` (keyword labels, scroll-spy `.active`, first/last edge handling);
  left/right arrows jump slides, up/down scroll; type a number to jump.
- **`.wrap` is left-aligned, not centred** (`margin:0 auto 0 0`). CSS `zoom` scales the wrap's
  *layout* width, so any slide `fitSlides` shrinks becomes narrower than the space available and
  a centring `margin:0 auto` walks it rightwards — the more a slide shrank, the further in its
  text started. Measured before the fix: The Gap and most slides at 96px, Team at 176, Financing
  197, Cost Roadmap 183, The Fleet 265. Every slide now starts at the section's own left padding.
  Do not restore `auto` on the left.
- **`fitSlides()`** zooms each slide's `.wrap` to fill the viewport (shrink on overflow,
  grow to 1.4x cap; width-capped against the viewport). Quirks that bite: rem lengths
  scale under zoom; right-aligned content can ride into the nav rail on sparse slides —
  cap the containing block's width (see `.gapfoot`). Elements outside `.wrap` (sources
  buttons) escape the zoom.
- **Reveals**: `.rv` elements animate when their section gains `.in` (IntersectionObserver).
  Default state must be presentable — print, headless, and reduced-motion all see it.
- **Counters never fabricate**: real final values always in the DOM; animation is a
  600ms opacity fade only — no intermediate numbers ever exist.
- **Icons are inline SVG, not CSS masks** (converted 2026-08-29). One `<symbol id="ic-factory">`
  sits just after `<body>`; every glyph is a `<svg class="fx"><use href="#ic-factory"/></svg>`,
  filled with `currentColor` so the per-group tints (`.gicons.green`, `.gicons.orange`) still
  work and per-icon `--fh` sizing is unchanged. The mask version painted in normal Chrome but
  vanished in headless **and in print/PDF**, and a failed mask leaves an invisible box rather
  than a broken-image marker — 36 glyphs silently disappeared from the exported deck with
  nothing in the DOM to show for it. `assets/icon-factory-hf.png` is retained as the master
  artwork the path was traced from; it is no longer loaded at runtime.
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
- Headless lies about: reveal animations, sub-500px widths
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
