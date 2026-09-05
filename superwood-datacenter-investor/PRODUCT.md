# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Investors in InventWood's September 2026 SAFE round: family offices, ultra-high-net-worth individuals and institutional
investors who have already read the SUPERMILLS Investor Overview and are deciding whether to invest. They open this
deck to answer one question: does the data center opportunity de-risk SuperMill Two and the company's path from premium
skins into structural markets? Investors only (Alex Lau, 2026-09-04); the deck is not tuned for hyperscaler contacts,
press or the public.

Primary use is read-alone: sent by gated link or PDF and read without a presenter, so every slide must stand on its own.
A live-presentation variant (sparser slides, detail spoken) must remain easy to produce from the same source
(Alex, 2026-09-04).

## Product Purpose

A 20-slide companion to the SUPERMILLS Investor Overview covering one application: data centers. It makes the case that
data centers are the customer that turns SUPERWOOD from a premium skin into a structural material and the demand anchor
for SuperMill Two. Success: a reader can restate the thesis in a sentence, knows what ships now, soon, structurally and
long term, sees the customer engagement honestly, and finds no number they cannot trace.

## Positioning

"Hyperscalers are already building structures with wood. We turbocharge wood." Mass timber replaces concrete floors;
SUPERWOOD adds the steel: members, skins, screens and fences, and strengthens the mass timber itself. Thesis (Alex):
"We help data centers decarbonize and improve their impact on communities, while they accelerate SUPERWOOD's journey from
premium skins into structural applications."

## Operating Context

- Two synchronized outputs from one folder: `slides.html` (web, gated at superwood-datacenter-investor.vercel.app, deployed
  on every change) and `gen.js` → PPTX → Keynote PDF (rebuilt only on request).
- Sibling decks are separate projects with separate audiences: the SUPERMILLS Investor Overview (company, mills, cost
  roadmap, raise) and the customer/DCII deck. This deck never repeats company-level content.
- Every number traces to `../investor-data/SAFE-2026-09.yaml`; the data center mass and carbon model lives in
  `analyses/`; per-slide intent and decisions in `SLIDE-NOTES.md`.

## Capabilities and Constraints

- Claims discipline: no invented numbers, quotes, market sizes or named-person positions; projections labeled; sources
  on the slide; company estimates marked as such.
- Units in tons or '000s of tons, never kt; "data center", never "campus"; plain language, no fluff.
- Carbon figures are the Canva set (0.5 kg CO₂e/kg manufactured, 1.3 kg/kg biogenic stored, steel 1.8), pre-LCA, with
  Prof. Ming Hu, University of Notre Dame, named. Fire: Class A is a demonstrated capability, not a per-board guarantee.
- No approvals or standards detail; no dated milestones; no dollar values per gigawatt. Horizons (Alex, 2026-09-05): Immediate =
  shipping from SuperMill One; Soon = 1–3 years, straightforward applications engineering (racks, platforms, barriers,
  doors, mullions); Medium term = complex applications engineering such as full building systems, new form factors or
  materials engineering (structure, enclosures); Long term = technical potential with no design or code pathway yet
  (foundations, slabs). IT equipment, including server enclosures, never. Same names as the analyses workbook.
- Web navigation: fixed right-hand keyword dock with live scroll-spy, named prev/next, left/right arrow section jumps,
  digit jumps, M/C toggle on slide 5. Slides fit to the viewport on desktop and scroll on phones.
- Undecided: which wall system Microsoft's and Meta's standard designs use (drives the steel-share estimate);
  clearance for third-party press photos and the Fast + Epp funding program name before wide distribution.

## Brand Commitments

InventWood brand (`inventwood-brand` skill): espresso ink, cream, wood and gold palette; Fraunces display with an italic
gold accent word, Inter body; InventWood mark on the cover, aligned with the SUPERMILLS Investor Overview cover. Voice:
verifiable claims, titles that state a claim, no self-grading adjectives.

## Evidence on Hand

- `analyses/materials-mass-and-replacement.xlsx` and `.md`: 1 GW data center mass, embodied carbon and replacement
  model with a wall-system toggle; `analyses/steel-share-above-ground.md`.
- `../investor-data/`: 231-fact register with conflicts and decisions for the SAFE round.
- Public sources cited on slides: Microsoft Source (Nov 2024), Thornton Tomasetti, Meta Sustainability (31 Jul 2025),
  arXiv 2509.21312, ULI Urban Land. Their project photographs and logos appear on slide 4 with credit.
- Renders (Higgsfield, prompts in `render/`), application tiles in `prep/tiles/`, charts from `prep/charts/make_charts.py`.
- Absent, must not be fabricated: purchase orders, pilot results, certification listings, dated milestones, LCA results.

## Product Principles

1. Every slide title is a claim the reader can check; support lines add mechanism, not adjectives.
2. Show the derivation: bases, factors and sources sit on the slide, not in a hidden appendix.
3. Stage honestly: now, soon, structural, long term, and say what gates each without promising dates.
4. Keep the companion a companion: point to the SUPERMILLS Investor Overview rather than repeat it.
5. One source of truth per number; deck copy follows the register, never the other way round.
