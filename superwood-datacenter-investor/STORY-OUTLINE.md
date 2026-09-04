# SUPERWOOD for Data Centers — investor companion, story outline

Status: 2026-09-04 — REBUILT from the fresh-look review ([reviews/FRESH-LOOK-2026-09-04.md](reviews/FRESH-LOOK-2026-09-04.md)).
Deck: `SUPERWOOD-for-Data-Centers-Companion.pptx` / `.pdf` (20 slides, no dividers; `node gen.js` rebuilds; PDF via Keynote).
Web: `slides.html` + `assets/`, deployed to https://superwood-datacenter-investor.vercel.app (email gate → /slides).
The 2026-09-02 version is archived in `archive/` (source, PPTX, PDF, HTML).

## Thesis (2026-09-04)

Data centers are the customer that turns SUPERWOOD from a premium skin into a structural material, and the
demand anchor for SuperMill Two. Every title is a claim. Company, team, mills, cost roadmap and the raise stay in
Super Mills America.

## Decisions from Alex, 2026-09-04

- Structural is NOT gated on SuperMill Two: work has started; structural sales expected on the way there (slide 13).
- Long-term vision of prefabricated envelopes and foundations gets its own slide (14), labeled technical potential.
- No approvals / standards detail anywhere: qualification described in plain words only (slide 12 gates, slide 13 band).
- No dated milestones: slide 19 is the undated path to first projects; ladder next steps are undated.
- Carbon: Canva set (0.5 kg CO2e/kg manufactured, 1.3 kg/kg biogenic stored, steel 1.8), pre-LCA, Prof. Ming Hu named.
  A single investor-data register for the September 2026 SAFE round is being assembled at `../investor-data/`.
- Fire: Class A is a demonstrated capability, not a per-board guarantee; "far better in fire than ordinary wood".

## Built slide map (2026-09-04)

1 Cover · 2 Thesis · 3 The buyer (steel intensity, reported shortage, basis of design) · 4 Hyperscalers are already
building with wood; we turbocharge wood (public record + what SUPERWOOD adds, incl. mass-timber enhancement) · 5 What a gigawatt campus is made of (model chart) · 6 What one gigawatt is worth
(kt, plant-years, illustrative $ at SMA price bases) · 7 Process (+ three manufacturing specifics) · 8 Strength, one
number set (500 production / 600+ lab / A36 400–550 range; 7–9× derived) · 9 Properties (no unsourced multipliers) ·
10 Speed and modularity (prefab render; ULI schedule analogy) · 11 Now · 12 Next (gates in plain words; backplanes
moved here) · 13 Structural: starting now, scaling with SuperMill Two (+ qualification band) · 14 Where this goes:
prefabricated envelopes, then foundations · 15 Every account on one ladder · 16 Microsoft and Meta on the record ·
17 The carbon claim, sized and labeled (BF-BOF and EAF baselines; functional-unit derivation) · 18 Risks · 19 Path to
first projects (undated) · 20 Close.

New imagery (Higgsfield nano_banana_pro, prompts in `render/dc-steel-frame-construction.md`,
`render/dc-prefab-panel-lift.md`). Charts: `prep/charts/make_charts.py` (matplotlib, brand palette) → slides 5, 6, 8.

## Decisions from Alex, 2026-09-04 (second pass)

- No dollars per gigawatt: slide 6 shows incumbent mass, SUPERWOOD required and plant-years only.
- Structural under way from today's boards: truss design starting; mass-timber enhancement (SUPERWOOD laminations
  on glulam/CLT-type members) under way. Printed on slides 2 and 13.
- Partners: Fast + Epp has run over a thousand small-scale experiments on SUPERWOOD, funded by the Canadian
  government (program not named); HITT and Turner are contractor advocates, they do not specify. Printed on slide 15.
- Density: 1.3 t/m³ is the typical number to use (register: material.density_t_per_m3).
- SuperMill Two volume: 36M sf at 7.2 mm, so ~24,000 m³/yr. SMA appendix still prints 20,000 — update there.
- SuperMill Two prices: $8,222/m³ is the structural-steel-replacement price; $14,950/m³ the premium-market price.

- Slide 4 (Alex 2026-09-04, second pass): Microsoft and Meta logos on the public-record cards; a glulam beam for mass
  timber and a SUPERWOOD hybrid beam plus a thin SUPERWOOD beam for SUPERWOOD (renders, prompts in
  `render/beams-glulam-hybrid-thin.md`); code path row reads "certifiable under wood standards today; SUPERWOOD-specific
  standards are the goal".
- Slide 5 (Alex 2026-09-04): title "What a GW data center is made of"; mass and embodied-carbon views (PPTX side by side,
  web toggle with M/C keys); print "50–80% of the above-ground portion of a data center is steel" [company estimate];
  do NOT mention concrete's 83–87% share of total mass, the 5%-of-total line, or "only the long-term vision moves the total".
  Carbon view: steel ~60% of building-materials embodied carbon at 1.8 kg/kg (about a third with recycled steel); steel
  above the slab ~37%; equipment not estimated. Factors and derivation in `prep/charts/make_charts.py`.

- Racks and server boxes (Alex 2026-09-04): racks are "soon" — a few months of development (slide 12 tile, "next"
  horizon on slides 5 and 6); server enclosures eventually (long-term vision, 40% of IT mass as an estimate); electronics
  never. An earlier same-day move of racks to "now" was reversed.

- Slide 4 photos (Alex 2026-09-04): the Microsoft Source construction photo (CLT panel set on the Northern Virginia
  frame) and Meta's interior shot of the Aiken timber structure, each credited "Photo: Microsoft / Meta" and sourced
  to the cited publications. Third-party press photos — confirm use is acceptable before wide distribution.

- Slide 4 title (Alex 2026-09-04): "Hyperscalers are already building structures with wood. We turbocharge wood."
  Beams re-rendered with one camera, very long and fading into the distance; the thin SUPERWOOD beam is shown as a
  laminated assembly of 1/4-inch boards.

- New slide 17, the vision (Alex 2026-09-04): "Can the world's data centers be big, beautiful carbon sinks?" — three
  cards (Big, Beautiful, Carbon sinks) over the campus hero, with the LCA caveat in the footer; the carbon slide follows
  it. Deck is 21 slides; web nav for the envelopes/foundations slide renamed "Long game".

## Still open

- Slide 4 (Alex 2026-09-04): story is "hyperscalers are already ready to work with wood; we turbocharge wood" —
  reframed from "why not CLT"; hybrid-beam gains (~75% stiffness, ~100% strength at ~10% SUPERWOOD laminations)
  printed as derived, write-up pending.
- Slide 7 (process): kept to the 2026-09-02 wording (Alex 2026-09-04); the three manufacturing specifics from the
  original deck were removed.
- Fast + Epp funding program name and dates before wide distribution.
- Steel share estimate ([analyses/steel-share-above-ground.md](analyses/steel-share-above-ground.md)): not printed;
  70–80% of above-ground mass incl. contents, metal-panel-wall case [conf: L].

---

# Previous version (2026-09-01/02) — superseded, kept for the record

Status: 2026-09-01 — arc approved by Alex and BUILT. Deck: `SUPERWOOD-for-Data-Centers-Companion.pptx`
(27 slides, `node gen.js` rebuilds it; PDF exported via Keynote).

## Decisions from Alex, 2026-09-01

- Arc approved. Lead the wedge with what customers say first: supply chain and timeline — construction
  is backlogged and operators report a shortage of structural steel. Printed as "what customers tell us".
- Naming Microsoft, Meta, Google: OK. Naming Microsoft's architecture and engineering firms: OK in
  principle; not printed because the firms were not named to us — slide says "their principal
  architecture and engineering firms". Add names when supplied.
- Meta: engaged for over a year; broad engagement across the data center ecosystem; facade applications
  and backplanes under way; structural applications and racking planned over time.
- Google: engagement just begun; initial focus on replacement of structural steel.
- Also engaged (slide 22): Vertiv, Wooden Data Center, data center operators focused on security
  fencing. Construction partners with enthusiastic support: HITT and Turner (Alex wrote "HIIT";
  printed as HITT, matching the customer deck — confirm).
- Certification: nothing started. Trusses carry no fire-resistance requirement. Backplanes: UL 94
  yellow card. Printed as "not yet started" in the roadmap row.
- Carbon figures: the Canva set (0.5 kg CO2e/kg manufactured, 1.3 kg/kg biogenic stored; steel 1.8),
  labeled pre-LCA with Prof. Ming Hu, Notre Dame, in body copy.
- Per-MW steel/concrete quantities: no answer given; printed with the arXiv secondary citation
  [conf: M]. The 60% stat is not printed. Say so if you want either changed.
- DCII: not in the deck; spoken to live.

## Built slide map

1 Cover · 2 What's inside · 3 Divider · 4 Why data centers (four pillars: fast-growing and hungry for materials; large-volume offtake; low carbon and community acceptance; wedge into structural — refined per Alex 09-01) · 5 Where SUPERWOOD fits in a campus ·
6 Divider · 7 Process · 8 Strength · 9 Properties · 10 Capabilities & certification roadmap ·
11 Divider · 12 Carbon-sink question · 13 Steel vs SUPERWOOD · 14 Carbon engine · 15 Feedstock ·
16 Divider · 17 How data centers benefit · 18 Available now · 19 Certification-gated · 20 Structural ·
21 Divider · 22 Engagement at a glance · 23 Microsoft · 24 Meta · 25 Google · 26 Path to first projects ·
27 Close.

New imagery (Higgsfield, prompts in `render/dc-*.md`, served as nano_banana_2): security fence at a
transformer yard, staff courtyard fence, equipment backplane, entitlement-view facade, biophilic lobby.

---

# Original proposal (v2, as approved)

Status: 2026-09-01 proposal.

Purpose: the data-center story for readers who have already seen the Super Mills America deck
(https://super-mills-america.vercel.app/slides.html). That deck carries the company, team, mills,
cost roadmap, demand, financing, and the raise. This one does not repeat them. It answers one
question: **why are data centers the application that pulls SUPERWOOD into structural markets, and
who is already engaged?**

Built on `../superwood-datacenter/gen.js` (30-slide customer deck). Changes: drop the Company
section and the Potential Projects / DCII section, add a Customers section (Microsoft, Meta,
Google), keep the July-review fixes that still apply. DCII is spoken to, not printed (Alex, 09-01).

## Arc

1. Why data centers (the wedge into structural).
2. The technology fit (strength, properties, roadmap — the standards a specifier asks about).
3. The impact (carbon, labeled as pre-LCA projections).
4. Applications, staged honestly: skins now → certification-gated → structural.
5. Customers: who is engaged and what they are doing with us.
6. Close.

## Slide-by-slide (24 slides)

### Open
1. **Cover** — campus hero. "SUPERWOOD for Data Centers" · companion to *Super Mills America* ·
   September 2026.
2. **What's inside** — Why data centers · Technology fit · Impact · Applications · Customers.
   Right column: SUPERWOOD board photo (retire the wood-floored server-hall render).

### Section 01 · Why data centers
3. **Divider.**
4. **The wedge** — one slide, replaces the Company section. Data centers are the buyer that (a) has
   embodied-carbon commitments and reports on EC3 [Davies co-created it, conf: H]; (b) faces
   community opposition on noise and visual mass; (c) pays a premium today for skins and screens;
   (d) will co-develop the certification that opens structural; (e) sizes at SuperMill Two: one
   campus's envelope program is roughly SuperMill One's whole annual output [derived in the July
   review, conf: M]. Footer links the reader back to the mills story for capacity and cost.
5. **What a campus is made of** — steel-heavy elements SUPERWOOD addresses now (facades, screens,
   louvers, fencing, mezzanine and platform skins) vs later (joists, deck, trusses, enclosures,
   racking). Per-MW quantities if Alex approves: structural steel 500–1,000 t and concrete
   5,000–10,000 m³ per 10 MW [arXiv 2509.21312, secondary, conf: M]. The 60%-steel stat appears
   only with its denominator ("building and contents by mass, excluding foundations" — as the
   Super Mills deck now prints it) and as a company estimate [conf: L].

### Section 02 · The technology fit
6. **Divider.**
7. **The process** — three steps, SEM before/after; chemistry wording per the 08-22 call
   ("environmentally benign process; chemistry common to food and pulp processing"), not "no
   toxic chemicals".
8. **The strength of SUPERWOOD** — one canonical formulation, stated once: samples demonstrated
   more than 50% stronger than ASTM A36 steel in tension at one-sixth the weight; up to 10×
   strength-to-weight [internal; Jon 08-21]. Bar chart 600 / 400 / 310 MPa (native bar chart).
9. **Properties for data centers** — fire, durability, moisture, thermal and electrical insulation,
   acoustic (promoted), RF (demoted to niche), beauty. Each tile carries its test standard or
   "data package on request".
10. **Certification and capabilities roadmap** — merge of the customer deck's roadmap table with a
    fire/code row: E84 Class A today → E119 (pursuing for certain applications, per the Meta deck
    2025-10) → NFPA 285 for exterior assemblies → FM acceptance → ICC-ES / mass-timber-style
    qualification for structural. **Status, labs, and dates from Alex** [needs source]. Production
    vs lab values as in the customer deck.

### Section 03 · The impact
11. **Divider.**
12. **Can data centers be a carbon sink?** — keep the question; "POWERED / CONSTRUCTED" cards;
    drop the two bottom fact bands (the 60% band moves to slide 5 with its denominator; "strength
    of steel from wood chips" conflates today's board with ChipMill).
13. **Steel vs SUPERWOOD, full-bleed head-to-head** — kept. Body copy states "TEM projection,
    pre-LCA — LCA under way with Prof. Ming Hu, University of Notre Dame". Steel baseline shown
    as BF-BOF average and EAF. Figures: choose TEM (0.39 emitted / 1.8 stored per t) or Canva
    (0.5 / −1.3 per kg) — see Conflicts.
14. **The carbon engine** — kept; ">1,000 years" softened to "long-term storage in foundations and
    roads" (CSO: landscape claim, not a product attribute).
15. **Feedstock supply** — kept, sources printed on slide.

### Section 04 · Applications
16. **Divider.**
17. **How data centers benefit** — four pillars (speed, safety, community/biophilic, carbon).
    Carbon pillar reworded to "lower embodied carbon per element, verified when the LCA lands".
    Replace the server-hall render with an entitlement-facing render (facade or substation screen).
18. **Available now** — facades and cladding, biophilic interior paneling, louvers, sub-framing,
    trim and door kicks, fencing for staff outdoor spaces, security fencing around outdoor
    infrastructure such as transformers (the last two are new, from the Microsoft near-term list).
    Tiles from `prep/tiles/`; new fencing tile needed.
19. **Certification-gated (next)** — acoustic barrier walls and equipment screens (STC/OITC path),
    walkways and platforms, railings, mullions, interior doors. Column labeled with what gates it.
20. **Structural (medium and longer term)** — building enclosures and structural components
    (the Microsoft co-development target), CLT-type floor/roof/wall assemblies, HVAC enclosures and
    separations (not in-airstream ducting), fire/ballistic elements, racking supports, optimized
    shells and foundations. "Qualification runs in parallel" sentence expanded with the standards
    from slide 10.

### Section 05 · Customers (new)
21. **Divider** — "Who is already building with us".
22. **Hyperscaler engagement at a glance** — three columns Microsoft · Meta · Google, one line each
    on stage of engagement, plus a row for other data-center developers if Alex wants them named
    (Sansone Group has a data-center platform per the Aug investor deck [approval pending]).
    **Naming Microsoft, Meta, Google in a distributed investor deck needs an NDA/permission check
    before it prints** — flag, do not assume.
23. **Microsoft** — profile card. Content as Alex stated 09-01, all [conf per Alex]:
    - Has built data centers with CLT floors. Public backup: Microsoft Source, Nov 2024 — two
      Northern Virginia datacenters, conventional concrete foundation and steel frame with CLT
      panels replacing slab-on-metal-deck floors; estimated embodied-carbon reduction 35% vs
      conventional steel construction and 65% vs typical precast concrete; design by Gensler,
      structural engineer Thornton Tomasetti [published, conf: H]. The Aug investor deck's
      "two-thirds" figure is the 65%-vs-precast number, not a vs-steel number — fix there too.
    - Interested in SUPERWOOD becoming part of the basis of design for future data centers.
    - Working with their principal architecture and engineering firms on structural solutions for
      building enclosures. [Firm names — printable? needs Alex]
    - Near-term skin projects under discussion: building facades; biophilic interiors for office
      spaces; fencing for staff outdoor spaces; security fencing around critical outdoor
      infrastructure such as transformers.
    - Visual: facade or transformer-yard security-fence render (new, prompt saved to `render/`).
24. **Meta** — profile card. Public backup: Meta Sustainability blog, 31 Jul 2025 — piloting mass
    timber for data-center administrative buildings; first completed 2025 at Aiken, SC (DPR,
    SmartLam); further projects at Cheyenne, WY and Montgomery, AL; embodied carbon of the
    substituted materials reduced ~41% [published, conf: H]. On file: a Meta-specific InventWood
    deck (`meta-dc-2025-10-27.pptx`, "Meta's Goals for Data Centers", tour agenda) — a meeting or
    site visit in Oct 2025 [conf: M]. **Needs Alex**: stage, what they asked for, applications in
    discussion, timeline.
25. **Google** — profile card. Nothing on file beyond Don Davies having been engineer of record for
    tech HQs (advisor credential, not engagement). **Needs Alex**: stage and content. If the
    engagement is thin, one honest line beats a padded card.
26. **A concrete path to first projects** — generalized from customer-deck slide 27, no DCII:
    (1) skins on one building or yard, (2) joint testing toward the standard the application needs,
    (3) basis-of-design work with the customer's architect and engineer, (4) measure the carbon
    delta with a baseline bill of materials. Speaker note: DCII status spoken to live.

### Close
27. **Close** — "Let's build what's next." Contact Alex Lau; Lex Harris for IR.

(27 slides including 5 dividers; 22 content slides.)

## Numbers and facts needed from Alex before building

| # | Slide | What |
|---|---|---|
| 1 | 22–25 | Permission to name Microsoft, Meta, Google (and any developers) in a distributed deck |
| 2 | 23 | Microsoft: names of the architecture and engineering firms, if printable; any dates or project names |
| 3 | 24 | Meta: stage of engagement, applications in discussion, what came out of the Oct 2025 meeting |
| 4 | 25 | Google: stage of engagement and content |
| 5 | 10 | Certification status: E119 program scope, NFPA 285, FM, labs, dates |
| 6 | 5 | OK to use the per-MW steel/concrete quantities [conf: M], and whether to print the 60% stat with denominator |
| 7 | 13 | Which carbon figure set: TEM (0.39 / 1.8 per t) or Canva (0.5 / −1.3 per kg) |
| 8 | 23–24 | Microsoft and Meta public sources found (see slides 23, 24); confirm you want them cited on-slide |

## Conflicts between sources (surfacing, not resolving)

- Carbon per t product: TEM Jan 2026 says 0.39 emitted / 1.8 biogenic stored; Canva and customer
  deck say 0.5 / −1.3. Pick one.
- Strength stated five ways across decks; Jon's 08-21 wording used once here.
- SuperMill One capacity 1.3M (customer deck) vs 1M sf/yr (Super Mills deck). Use 1M where it appears.
- Dai: "key co-inventor on core patents", not "protégé" (Jon). Only relevant if a team slide returns.

## Carried-over open items

- 60%-steel: no published source on any basis (traced 08-27). Printed only with denominator and as
  company estimate, or not at all.
- "90% emissions reduction": per kg it is 72–78% vs average steel (0.39–0.5 vs 1.8); 90% only per
  functional unit at ~0.5 substitution factor, and far less vs EAF steel. Not used as a bare headline.
- All carbon figures labeled pre-LCA; Prof. Ming Hu, Notre Dame, named in body copy.
- Hu H-index 198 if the founder appears anywhere (he does not in this outline).

## Production

- Copy `gen.js`, `prep/`, `media/`, `render/` from `../superwood-datacenter/` (customer project
  untouched); output `SUPERWOOD-for-Data-Centers-Companion.pptx`.
- Bar charts native; any line chart via matplotlib PNG. PDF via Keynote AppleScript. Validate with
  the pptx skill's `validate.py` (Python 3.12 venv). Visual QA with `pdftoppm` per slide.
- New imagery: fencing tile, transformer-yard security fence, facade/entitlement render — Higgsfield
  nano_banana_pro, prompts saved to `render/`.
- Deliverables to Google Drive: sibling folder to `Elemental DCII presentation/`.

## Sources located 2026-09-01

- Microsoft Source, "Microsoft builds first datacenters with wood to slash carbon emissions" —
  https://news.microsoft.com/source/features/sustainability/microsoft-builds-first-datacenters-with-wood-to-slash-carbon-emissions/
- Thornton Tomasetti project page, Microsoft Mass Timber Data Centers —
  https://www.thorntontomasetti.com/project/microsoft-mass-timber-data-centers
- Meta Sustainability, "Meta pilots mass timber for more sustainable data center construction" (2025-07-31) —
  https://sustainability.atmeta.com/blog/2025/07/31/meta-pilots-mass-timber-for-more-sustainable-data-center-construction/
- Google: no public mass-timber data-center statement found in this pass [needs source].

## Analyses

- [analyses/materials-mass-and-replacement.md](analyses/materials-mass-and-replacement.md) — mass of a 1 GW campus by component and the SUPERWOOD-replaceable share by horizon (estimate, 2026-09-01).

## HTML version (2026-09-02)

`slides.html` (single file; `index.html` redirects to it) with `assets/` — the same 27 slides as the pptx.
Right-hand keyword dock with live scroll-spy (dividers are hidden from the dock and highlight the section they
introduce), prev/next buttons that name the destination slide, ←/→ · PageUp/PageDown · Home/End · digit keys to
jump. Up/down stay native scrolling. Desktop slides shrink to fit (floor 0.6); phones scroll instead. Brand fonts
via Google Fonts (Fraunces, Inter). Preview locally with any static server, e.g. `python3 -m http.server 3199`
from this folder. Not deployed anywhere yet; the sibling decks live on Vercel if a hosted copy is wanted.
