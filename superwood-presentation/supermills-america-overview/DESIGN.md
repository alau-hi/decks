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
  small-caps band labels and the SUPERWOOD legend keys on the cost chart (Alex asked for
  Gotham; Montserrat is the loaded stand-in). Root font clamps with a **9px floor** — nothing
  on the deck may render smaller (sub-.6rem styles carry their own `clamp(10px,…)`).
- **SVG font gotcha**: `.ucchart svg text` sets Fraunces via CSS, which beats any
  `font-family` presentation attribute on a `<text>` node. To change a chart label's face,
  give it a class and a CSS rule (see `.uclab`, `.uckey`) — an attribute alone silently loses.

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

- **Export mode hides the Sources pill.** `html.exporting .srcwrap` is hidden and any section
  holding a `.srcwrap` or `.sw-tip` gets `.has-notes`, whose `::after` prints "See Notes and
  References in Appendix" where the pill sat. The Appendix TOC carries an export-only
  "Notes and References" row (`.notesrow`, numbered slides+1 by the TOC script). The PDF's Notes
  pages are built from the same elements (`exports/` pipeline in the session scratchpad:
  `render-pdf.sh`, `assemble.py`).
- **Render PDF pages inside a 1440x810 iframe.** Headless Chrome's `--screenshot` captures at a
  taller viewport than the page's JS sees (window 897 -> JS innerHeight 810 -> capture 897), so
  a bare page fits its content for 810 while `position:fixed` chrome paints at 897 — cropping to
  810 then cuts the Confidential / page number / brand footer (2026-09-03). A wrapper page with a
  1440x810 iframe gives layout, fit and footer one viewport; crop the capture to the iframe.
- **Deliberate exceptions to the rules above (Alex, 2026-09-02, at critique):** the
  **Demand** slide keeps its four stat cards (large figure over caption, rust accent
  `#c56c32`, cream + dark cards) and **The Fleet** keeps its five cards with the green and
  orange icon tints. Both were flagged by `/impeccable critique` as breaking "no stat-tile
  dramatization", "tables over cards" and "one accent"; Alex chose to keep them as they are.
  Do not "fix" them toward the rules without asking. Recorded in
  `.impeccable/critique/ignore.md` so future critiques stop raising them.

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

## Appendix dividers

The four divider pages (Appendix, Technology, Mass Timber, Data Centers) are the
investor-overview deck's own, byte-for-byte (Alex, 2026-09-02, after a one-day unified
treatment was tried and reverted): plant-wall image with per-page scrims, Technology faded
with no scrim, gold-italic second words. The one local rule is `.tier-divider .wrap`
re-centering itself, because this deck's wrap is otherwise left-anchored. The TOC carries
per-section slide counts and a Manufacturing Comparison entry the overview lacks.

## Full-bleed slides

Two rules that hold on `#gapalt` specifically (Alex, 2026-08-31):

- **Also imported sits under the two materials it extends**, in a `.tripfoot` that repeats
  `.trip`'s own `grid-template-columns` and spans the first two cells — so the row ends exactly
  where the aluminum panel does, and stays there if the columns are ever retuned. Change one
  template, change both. Opposite the headline in the far corner it read as unrelated to anything
  on the slide. It uses the same one-row `.gapfoot` markup as slides 2 and 2b rather than restating
  those rules, and its tooltips drop `tipd tipr` because the row now opens upward from the foot.
- **The panel divider fades before it reaches the footer.** A hard rule running the full height
  cuts straight through the captions and the Also-imported row. A border cannot carry a gradient,
  so the seam is drawn as a `::before` with no `z-index` — which keeps it under the `::after` scrim
  exactly where the border used to sit. Only the steel|aluminum seam needs it; the third panel
  separates on its `.5rem` margin.

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

## The three Gap slides

**Parked to one (Alex, 2026-09-01):** the original card-strip Gap (`#gap`) and the full-bleed
alt (`#gapalt`) are parked — wrapped whole in `<template id="parked-gap-slides">` in
`slides.html`, out of the deck/nav/numbering but kept intact. `#gapmid` (the former 2b) is now
the deck's one Gap slide, numbered 02 and labeled "The Gap". To un-park: move the sections back
out of the template and restore `data-num`/`data-nav` suffixes on all three. The notes below
describe all three treatments and still apply to the parked pair.

### Live images (Alex, 2026-08-31)

All three Gap slides animate their photographs. Each `<img>` is followed by a duplicate of
itself, `class="glow"`, at `mix-blend-mode:screen` with `opacity` animated up from 0:

| layer | image | motion |
|---|---|---|
| `.pour` | steel | 3.4s smooth flare — the molten pour and sparks swell and settle |
| `.hall` | aluminum | 7.2s slow breathe on the overhead lamps |
| — | data centre | **not CSS**: a real 20s clip, see below |

The mechanism to preserve if you touch this: **screen against a near-black backdrop is a
no-op**, so the pulse is luminance-weighted for free. Only what is already bright in the frame
moves; the dark plant structure does not lift. That is why no masks are needed, and why the
same two clip bands work on all three slides even though each crops the photograph differently
(`object-fit:cover` at 3:2, 1:1 and full-bleed) — where a band lands on the corridor instead of
a rack, the blend simply does nothing. Do not swap `screen` for an opacity fade of a brightened
copy; that lifts the blacks and the images go milky.

**The data centre is a video, not a still** (Alex, 2026-08-31: "it shouldn't be the whole bank of
lights going on and off in sync, it should be different lights coming on and off slowly"). Two CSS
attempts were made and both dropped. An unkeyed screen layer lifted the whole band, because that
frame is not dark enough for screen to key itself — the corridor, the floor and the amber doors are
all mid-tone. A luminance-keyed version (`brightness(.69) contrast(26)`) fixed that and did isolate
the LEDs, but a clipped band can only ever pulse a whole region: it cannot blink one light while its
neighbour stays lit, which is the thing that actually reads as a live room.

`assets/gap-datacenter-racks.mp4` is a Seedance 2.5 image-to-video render off a bright blue
data-center corridor photo Alex supplied (`sources/datacenter image.jpg`, 2026-08-31) — chosen over
the original dark warm-toned rack photo because it carries hundreds of visible LEDs, so far more of
the frame can participate in the blinking (two earlier renders off the dark photo are superseded;
the second's prompt-side fix — most LEDs on every rack, each on its own clock — carried over here).
Locked-off camera, LEDs only, ping-ponged with ffmpeg so the loop point is seamless — LED blinking
is time-symmetric, so the reverse pass reads identically and there is no cut. Rendered at 720p,
upscaled to 1080p with ByteDance's AIGC preset, encoded crf 25. 2.6 MB, h264, silent. Verified
before shipping: a no-LED crop of the glossy floor is unchanged frame to frame (no camera drift),
individual LEDs differ between t=0 and t=5, and the ping-pong seam is byte-exact. The `poster`
(`gap-datacenter-racks.webp`) is now the loop's exact first frame, so play start never pops; print,
first paint and reduced motion show that same frame.

The clips ride the same `.in` gate as the CSS layers, through `playIn()`: three 1080p decoders
running behind slides nobody is looking at is CPU charged to every scroll.

Three details that are load-bearing:

- **Blink timings are irregular on purpose.** Evenly spaced keyframes read as a loading spinner.
  The two data-centre bands run on unrelated periods so the racks never blink in unison.
- **`animation-play-state` rides the `.in` class.** A screen-blended layer repaints rather than
  composites, so three of them animating on three off-screen slides is jank charged to every
  scroll. The reveal observer already adds `.in` on entry *and removes it on exit*, which makes
  it a real two-way viewport gate — only the Gap slide on screen is running.
- **Print and reduced motion are both handled.** `@media print{.glow{display:none}}` (a still has
  nothing to blink and the screen layer only washes it out), and the global reduced-motion block
  collapses the animations, leaving the layers at their `opacity:0` base — the photographs render
  exactly as they did before this change.


The deck now carries three treatments of the same content, all live, kept in step by hand:

| | image size | stats | notes |
|---|---|---|---|
| `#gap` (2) | 62rem strip, 3:2 | below the images | the working default |
| `#gapmid` (2b, 2026-08-30) | full padding box, 1:1 | **on** the images | middle setting |
| `#gapalt` (2a) | full bleed | on the images | scale of opportunity |

2b exists because 2's images are small and 2a's are the whole slide (Alex, 2026-08-30). Its
extra image height is bought by moving the stat row onto the photographs, not by growing the
slide. Two things to keep if it is edited:

- **Only the first figure carries `aspect-ratio`.** The third loses 8px of width to its
  `.5rem` separation margin, so a ratio on it makes it 8px shorter and drops its caption off
  the shared baseline. The others stretch to the grid row instead.
- The footnote row is reserved (`grid-template-rows:auto auto 3.3rem`) so all three labels
  share a baseline whether or not a panel has a footnote. Lengthen a footnote past two lines
  and that reserve has to grow with it.

The "Also imported" table on 2 and 2b is **one horizontal row**, kicker inline, running the
width of the slide. It has been through both failure modes in one sitting (Alex, 2026-08-30):
as a block under column one it read as a footnote to steel, and split across the Steel and
Aluminum columns it read as a spread-out table. One row belongs to the slide, not to a column.
The shared `.gapaside .tbl` is a two-column subgrid and sits later in the stylesheet, so the
row overrides need `.gapfoot .gapaside`-depth selectors to win on specificity — `.gapfoot .tbl`
alone loses the tie and the list silently goes back to a column.

`#gapalt` keeps the stacked two-column table: it rides beside the headline in the rail reserve,
where a row has nowhere to go. Only the `.gapfoot` copies are rows.

## Deck mechanics

- **Slide numbers are labels, not indices.** A section carrying `data-num` takes that label and
  does not advance the count: `#gapalt` is 2a and `#gapmid` is 2b, so the deck's third *idea* is
  still slide 3 (Alex, 2026-08-31). Everything else numbers itself in order, so adding or removing
  a slide needs no bookkeeping. One list (`slideNums`) feeds the rail, the page counter and the
  number-key jump, so they cannot drift apart. Consequence to know: the number keys only accept
  digits, so 2a and 2b are reachable by arrow, click or scroll but not by typing.

- **The deck closes The Opportunity → Thank You → Appendix** (Alex, 2026-08-31), with the
  forward-looking paragraph as a `.fwdlook` footnote at the bottom of The Opportunity, matching
  `../investor-overview/` (the wording is identical between the two decks — copy it, do not
  re-draft it). Two placements were tried and dropped the same day: under the Thank You contact
  block, where it overflowed the 100vh `.thanks` grid and hung below the fold; and as its own
  `#fls` slide at body size, which gave one paragraph of boilerplate a full page in the nav dock.

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
- **Titles are pinned on paper; slides centre on screen (2026-09-03).** On screen sections are
  `align-items:center`, so each slide sits centred in the viewport. In export mode
  (`html.exporting`) sections top-align (the cover, Thank you, SUPERMILL ONE photo slide and the
  appendix dividers stay centred), so every PDF page has its title at the same height. In both
  modes the title block — `.wrap>.kicker`, `.wrap>h2`, and a `.lead` directly after the h2 — carries
  `zoom:calc(1/var(--z))`, undoing the fit zoom `fitSlides` writes to `--z`. Result: every
  title sits 49px from the top (78px under an appendix kicker) at 42px, whatever the body's
  zoom (measured before: 35–69px, 42–135px down). Only the body scales. `fitSlides` then
  measures the leftover height and writes it to `--slack`; the title block spends half of it
  as bottom margin so a thin slide's body centres in the space under the title instead of
  piling at the bottom. Thin appendix slides spend the other half on their body (`#mtb` photo
  height, `#dcm`/`#dcf` card padding) so they fill. Both variables reset to 0 at the start of
  every fit, so the natural size is what gets measured. Do not give an h2 an inline
  `font-size` — that was how `fast` and the Data Centers trio drifted.
- **The Fleet is one row of five subgrid cards, packed at runtime (2026-09-02).** The old 4+1
  layout was ~1060px tall and shrank to 0.71x, which is why its notes read at 9px. Each card is
  a `subgrid` sharing the title, eyebrow and note rows; the icon field and stat rows share the
  `1fr` row as a flex column (`.gmid`) so each field takes exactly its own card's slack. Fields
  are empty in the markup; `packFleet()` (called after every fit of the section) reads the field
  box and bottom-left-fills it from `data-mix` (icon heights in rem, largest first; SUPERMILL TWO
  = 3.0, 2x = 4.24, LARGE/4x = 6.0 — "N x as large" is visual area) on a 3px lattice, then keeps
  placing the three smallest sizes until nothing fits, so a field is full down to its smallest
  icon by construction. Boxes overlap ~4px on purpose (glyph edges are chimney and roofline).
  It skips when the box is unchanged, so the reveal animation plays once. On a phone
  (`position:static` field) it emits only the base mix and lets it wrap.
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
