---
target: slides.html (Super Mills America deck)
total_score: 17
max_score: 20
prior_score: 9
p0_count: 0
p1_count: 0
p2_count: 0
p3_count: 3
timestamp: 2026-08-25T14-30-00Z
slug: slides-html
kind: post-fix re-audit
---
# Re-audit after fixes: Super Mills America deck

Ran all seven recommended commands. Uncommitted — 32 paths changed.

## Audit Health Score

| # | Dimension | Was | Now | What moved |
|---|-----------|-----|-----|------------|
| 1 | Accessibility | 2 | 4 | rail 13x12 -> 26x26 (WCAG 2.5.8 passes); bio cards named + described; no text under 9px on mobile |
| 2 | Performance | 2 | 3 | cover 793 KB -> 84 KB; `querySelectorAll('*')` hoisted out of both fit loops; 31 images given intrinsic dimensions; 1.3 MB pruned |
| 3 | Theming | 2 | 3 | six repeated panel/popover values tokenized; 9 dead custom properties removed; SVG data-series literals deliberately left |
| 4 | Responsive | 1 | 4 | slides now scroll instead of shrinking past legibility; min text 4.0px -> 9.0px |
| 5 | Implementation Integrity | 2 | 3 | 307 dead rules and 2 dead JS branches removed; duplicates merged |
| **Total** | **9** | **17/20** | **Good** |

## Measured before / after

At a 390px viewport with the root font-size set to the coarse-pointer branch a real phone takes:

| Slide | zoom before | text < 9px before | min before | zoom after | text < 9px after | min after |
|---|---|---|---|---|---|---|
| `#s7` Team | 0.54 | 32 | **4.0px** | 0.90 | 0 | 9.0px |
| `#gnet` Fleet | 0.82 | 49 | 5.8px | 0.90 | 0 | 9.0px |
| `#s8` Investors | 0.96 | 11 | 7.7px | 0.90 | 0 | 9.0px |
| `#ask` Opportunity | 1.13 | 7 | 8.0px | 0.90 | 0 | 9.0px |
| `#s18` Financing | 1.14 | 4 | 8.2px | 0.90 | 0 | 9.0px |
| **total** | | **~110** | **4.0px** | | **0** | **9.0px** |

Other measurements: nav rail 13x12px -> 26x26px (30px pitch); rail/content collisions 3 -> 0;
worst bottom-chrome clearance -26px -> +18px on every slide; detector 80 -> 42 findings (the
remaining 40 are the pinned Fraunces/Inter brand, a standing false positive).

Desktop was held byte-stable throughout: 60 elements under 11px, minimum 8.9px, zero padding
violations, identical per-slide zoom values — before and after.

## What changed, by command

**adapt** — the P0. Two independent causes, both fixed:
- `fitSlides()` had no legibility floor (per-iteration clamps of `.75`/`.6` across 8 iterations
  each compound to effectively unbounded). Now floored at 0.9 on narrow screens, 0.55 on desktop,
  and capped at 1.0 on narrow screens — `zoom` scales from the origin while the flex container
  still sizes to the layout box, so any `z>1` pushed content visually past its own padding.
  Past the floor a slide grows and scrolls: `scroll-snap-type:proximity`, `scroll-snap-stop:normal`,
  `overflow-x:clip` (not `hidden`, which would force a y-axis scroll container). `realign()` is
  guarded off, since it assumes every section is exactly one viewport tall.
- The type ramp bottoms at `.54rem`, which was 6–8px at the old 11.5px mobile root *before* any
  zoom. Root floor raised 11.5px -> 15px (and the fine-pointer branch 9px -> 11px), plus one rule
  flooring the micro-label tier at `max(.76rem, 11.5px)`.
- Rail buttons padded to a 26px minimum hit area without widening the dock.
- Right and bottom gutters widened to clear the rail and the fixed chrome, now that slides scroll.

**optimize** — cover `supermill-two-aerial.png` 793 KB -> WebP 84 KB (an 89% cut on the deck's
heaviest byte, and its LCP element). Both `querySelectorAll('*')` calls hoisted out of the fit
loops. All 31 images given intrinsic `width`/`height`. 26 unreferenced files (1.3 MB) deleted;
`assets/` is now exactly the 36 files the deck references.

**harden** — the ten `.person`/`.advc` cards get `role="group"`, `aria-labelledby` (name + role)
and `aria-describedby` pointing at their bio. Deliberately *not* `role="button"`: they open on
focus, not activation, and a button role would promise Enter/Space handling that the deck's own
key bindings already own.

**distill** — 307 dead rules removed (~46% of the stylesheet) plus 4 orphaned `@keyframes`, both
dead JS branches (`apxIdx`/`subIds` could never fire), the duplicate `.machbox` and
`#mach .machstats .gr b` declarations, and one empty rule. Verified mechanically: zero selectors
remain that cannot match the document.

**extract** — `--pop-bg`, `--panel`, `--panel-ink`, `--panel-ink2`, `--panel-muted`, `--ink-deep`
promoted to `:root` (16 literal occurrences collapsed). Nine unused custom properties dropped.
SVG chart literals deliberately left alone — they are a categorical data palette, not theme
tokens, and `var()` in presentation attributes would add a failure mode to a deck that gets
printed and emailed.

**clarify** — `#s8` headline: "Backed by *deeply sophisticated* investors" ->
"Backed by institutional capital *and industrial operators*", which is what the panel below
actually shows. **Review this one** — it is investor-facing copy and the replacement is my
wording, not yours.

## Three bugs found while fixing, not in the original audit

1. **`cube-hero.jpg` is portrait (1187x1484)** and at `width:100%` stood 816px tall, driving the
   Properties slide under the fit zoom. This was masked by a lazy-load race — the slide was
   fitted against a 0-height image, then reflowed once it arrived. Adding intrinsic dimensions
   exposed it. Fixed with `max-height:58vh;object-fit:cover` on `.media-frame img`.
2. **`.brand` had no width** — with only `right` set, its box stretched the full viewport: an
   invisible `z-index:95` strip across the bottom swallowing pointer events. `width:max-content`.
3. **The reveal depended on a threshold race.** `intersectionRatio` caps at
   `scrollportH / sectionH`, so once slides can exceed the viewport, one at exactly 2x can never
   reach the `.5` threshold and one just over it sits on the boundary. Reveal is now driven by
   "which section covers the middle of the scrollport", called from `jumpTo`, scroll-settle, and
   load. This never bit while every slide was one viewport tall; it would have, now that they grow.

## Residual (all P3, none blocking)

- Mobile micro-labels sit at 9.0px. Legible, but if you want 11px everywhere the density of the
  Fleet and Investors slides has to come down — that is a content decision, not a CSS one.
- `supermill-two-aerial` is only 1024x434 and is upscaled on any large display. Needs a
  higher-resolution source render; I cannot invent pixels.
- Detector still flags "world-class" (Alex's bio, and the "World-Class Advisors" heading) and 44
  em-dashes. Both are your copy and your house voice — left alone deliberately.
- Fixed chrome still passes over content mid-scroll on phones. Inherent to scrolling slides; the
  `.conf`/`.pageno`/`.brand` pills all carry their own backing so they stay readable.
- ~25 elements still carry inline `style=` layout overrides. Not worth the churn now, but it is
  why `h2` sizing has four competing sources of truth.

## Verification

Desktop and mobile measured together each round; every number above is from the built page, not
intention. Two caveats on method, stated because they shaped what I trusted:
- The mobile figures come from a same-origin iframe at 390px with the root font-size forced to
  the coarse-pointer value. The iframe reports `pointer:fine`, so without that override it takes
  the desktop root branch and understates real-phone sizes by ~28%.
- IntersectionObserver callbacks and CSS transitions do not advance while an awaited script holds
  the renderer, so in-script reads of `.rv` opacity always return 0 — on the untouched baseline
  too. Reveal state was confirmed by screenshot after the script returned, not by those reads.
