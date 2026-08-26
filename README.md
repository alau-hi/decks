# Super Mills America deck

InventWood investor deck: America's materials gap → SUPERMILLS as the fastest, cheapest
way to make more building material, at home. 19 slides, single-file HTML, no build step.
Derived 2026-08-23 from `../aaron-deck/` (visual system) and `../investor-overview/`
(claims discipline). Live: https://super-mills-america.vercel.app

## What lives where

```
super-mills-america/
├── slides.html          The deck itself — all markup, CSS, and JS in one file
├── index.html           Redirect stub → /slides.html
├── assets/              Images, logos/, face crops (originals live in parent decks)
│
├── STORY.md             WHY — thesis, arc, and every slide-level decision with dates
├── DESIGN.md            HOW — visual system, format rules, deck mechanics,
│                        claims discipline, verification workflow, deploy rules
├── REFERENCES.md        SOURCES — per-slide companion: every source and commentary
├── sources/
│   ├── claims.yaml      The claims register (authority on provenance + confidence);
│   │                    inherits from ../investor-overview/sources/claims.yaml
│   └── Pub61706.pdf     ORNL/NREL 2016 carbon fiber supply-chain analysis
│
├── .impeccable/         Design-critique history (scored snapshots)
└── .vercelignore        Keeps all docs off the public deployment — the deck ships alone
```

Division of labor: **STORY.md** owns what the deck argues and why each slide earns its
place; **DESIGN.md** owns how it looks, moves, and gets verified; **REFERENCES.md** +
**sources/claims.yaml** own every number's provenance. A change to the deck usually
touches slides.html plus whichever of those three owns the change.

## Working on it

- Every new number goes through `sources/claims.yaml` first (provenance + confidence),
  then REFERENCES.md, then — if printed — the slide and its Sources button panel.
- Screenshot every layout change with the headless harness before calling it done
  (recipe in DESIGN.md).
- Deploy: `vercel --prod --yes` from **this directory only** — never the decks repo root
  (see ../CLAUDE.md for why). One focused commit per logical change.
