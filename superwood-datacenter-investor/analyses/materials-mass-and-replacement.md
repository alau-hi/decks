# Material mass in a data center — the build-up, and how much SUPERWOOD can replace

Date: 2026-09-01 (v4: long-term concrete shares set to Alex's stated technical potential). Status: **estimate**.
Every table below is generated from the live model [materials-mass-and-replacement.xlsx](materials-mass-and-replacement.xlsx)
— change an input there and regenerate rather than hand-edit. Labels: published / derived / estimated; confidence
`[conf: H|M|L]`. Treat everything as `[conf: L]` unless marked.

Reference unit: **1 GW of IT load** — a campus of roughly 5–10 hyperscale buildings on the assumptions below.
Low and high columns are whole scenarios (all-low inputs, all-high inputs), not a distribution.

![Mass build-up and replacement](mass-buildup-and-replacement.png)

## The four horizons

| Horizon | What it means | Product and plant | Gate |
|---|---|---|---|
| **Immediate** | Replacements shipping now | SuperMill One boards to 8" × 16' × 3/8" | None beyond E84 Class A where a finish rating applies |
| **Soon** | Non-structural items behind one scoped test or listing | SuperMill One, then SuperMill Two | Design values, STC/OITC, IBC 1607, UL 10C, seismic qualification |
| **Medium term** | Structural steel (primary and roof), roof trusses and roofs, ducting, enclosures | SuperMill Two boards and veneers | Mass-timber qualification pathway, ICC-ES, E119, NFPA 285, FM acceptance; NFPA 90A / UL 181 for ducting |
| **Long term** | Concrete: 75% of slab-on-grade and paving, 90% of foundations, footings, piers and pads, with the rebar in each | ChipMill-scale products | Stated technical potential (Alex, 2026-09-01); no design or code pathway yet |

## 1. Assumptions that drive the build-up

| Item | Low | High | Label |
|---|---|---|---|
| Building area per MW | 5,000 sf | 10,000 sf | estimated |
| Buildings per GW (1M sf footprint each) | 5 | 10 | derived |
| Exterior wall area (4 × 1,000 ft × 40 ft per building) | 0.8M sf | 1.6M sf | derived |
| Perimeter walls | metal panel / IMP (switch to precast in the model) | | choice |
| Concrete intensity, all concrete | 500 m³/MW | 1,000 m³/MW | published, secondary [M] — arXiv 2509.21312 citing Hasan 2022 / Sharma 2023 |
| Share of concrete in foundations, footings, piers, pads | 40% | 50% | estimated |
| Structural steel intensity | 50 t/MW | 100 t/MW | same source [M] |
| Roof-and-secondary share of structural steel (trusses, joists, deck, girts) | 40% | 60% | estimated |
| Rebar | 60 kg/m³ | 100 kg/m³ | estimated |
| Ducting and air-distribution sheet metal | 3 t/MW | 8 t/MW | estimated |
| Electrical / mechanical / IT | 50 / 20 / 15 t/MW | 100 / 50 / 70 t/MW | estimated from unit masses; GB200 NVL72 rack 1.36 t [H] |
| SUPERWOOD board | 7.2 mm × 1.3 t/m³ = 0.87 kg/sf; SuperMill One ≈ 0.9 kt/yr, SuperMill Two ≈ 31 kt/yr | | internal TEM basis |
| Substitution, steel | 0.3 kg SUPERWOOD per kg steel | 0.6 kg/kg | estimated — to be engineering-stamped per element |
| Long-term technical potential, concrete | 75% of slab and paving; 90% of foundations, footings, piers, pads | same | asserted-internal (Alex, 2026-09-01) |
| Substitution, concrete | 0.05 kg SUPERWOOD per kg concrete | 0.15 kg/kg | estimated — lightweight insulated wood-foundation concept, no design exists |

## 2. The build-up: what goes into a 1 GW campus

Read top to bottom. Building structure and envelope first, then contents. The cumulative column is the running total.

### 2a. Building — structure and envelope

| Component | Mass per campus | Cumulative |
|---|---|---|
| Concrete: slab on grade, paving, yard | 720–1,200 kt | 720–1,200 kt |
| Concrete: foundations, footings, piers, equipment pads | 480–1,200 kt | 1,200–2,400 kt |
| Precast / tilt-up perimeter walls (precast case) | — | 1,200–2,400 kt |
| Rebar in all concrete | 30–100 kt | 1,230–2,500 kt |
| Structural steel — primary frame (columns, girders) | 30–40 kt | 1,260–2,540 kt |
| Structural steel — roof trusses, joists, roof deck, girts | 20–60 kt | 1,280–2,600 kt |
| Exterior skins — metal panel / IMP (metal-panel case) | 1.9–7.4 kt | 1,282–2,607 kt |
| Louvers and yard / mechanical screens | 0.2–0.9 kt | 1,282–2,608 kt |
| Security and staff-area fencing | 0.3–1.0 kt | 1,282–2,609 kt |

### 2b. Contents — fit-out and equipment

| Component | Mass per campus | Cumulative |
|---|---|---|
| Platforms, walkways, mezzanines, railings, tray supports | 5.0–15 kt | 1,287–2,624 kt |
| Acoustic barriers, enclosures, HVAC separations | 2.0–5.0 kt | 1,289–2,629 kt |
| Racking and equipment supports | 2.0–5.0 kt | 1,291–2,634 kt |
| Other tray, containment, doors, misc. metals | 5.0–10 kt | 1,296–2,644 kt |
| Ducting, plenums and air-distribution sheet metal | 3.0–8.0 kt | 1,299–2,652 kt |
| Interior finishes, backplanes, trim (admin / office) | 1.0–3.0 kt | 1,300–2,655 kt |
| Electrical equipment and conductors | 50–100 kt | 1,350–2,755 kt |
| Mechanical equipment, piping, loop water | 20–50 kt | 1,370–2,805 kt |
| IT — servers and racks | 15–70 kt | 1,385–2,875 kt |

**Total mass, building and contents: 1,385–2,875 kt** (about 1.4–2.9 Mt).
**Excluding concrete: 185–475 kt** — concrete is 83–87% of everything by mass.

Two consequences follow before any SUPERWOOD arithmetic:

- Any "share of a data center" statement must say whether concrete is in the denominator.
- Excluding concrete, steel in all forms (structural, rebar, roughly 60% of equipment mass as enclosures and cores,
  racks, tray, ducting) comes out near 70% of what is left on these assumptions — consistent in order of magnitude
  with the company's ex-concrete "~60% steel" framing, but a derivation, not a source.

## 3. How much of it SUPERWOOD can replace — component by component

Same rows as Section 2, with the share of each component SUPERWOOD can address in each horizon (a row may split across
horizons; these are the editable columns on the workbook sheet *1 GW data center*), the incumbent mass replaced, and
the SUPERWOOD mass required.

### 3a. Building — structure and envelope

| Component | Immediate | Soon | Medium term | Long term | Incumbent replaced | SUPERWOOD required | Gate / basis |
|---|---|---|---|---|---|---|---|
| Concrete: slab on grade, paving, yard | — | — | — | 75% | 540–900 kt | 27–135 kt | Technical potential per Alex (75%); no design or code pathway yet. arXiv 2509.21312 [M] for total concrete |
| Concrete: foundations, footings, piers, equipment pads | — | — | — | 90% | 432–1,080 kt | 22–162 kt | Technical potential per Alex (90%); lightweight insulated SUPERWOOD foundations — geotechnical, durability and code pathway all open |
| Precast / tilt-up perimeter walls (precast case) | — | — | 100% | — | — | — | Hybrid SUPERWOOD wall panels; NFPA 285 + E119 assemblies. Active when Inputs walls_precast = 1 |
| Rebar in all concrete | — | — | — | 81% | 24–81 kt | 7.3–49 kt | Rebar follows the concrete it sits in: foundation share × 90% + slab share × 75% |
| Structural steel — primary frame (columns, girders) | — | — | 100% | — | 30–40 kt | 9.0–24 kt | ICC-ES via the mass-timber qualification pathway; FM acceptance; E119 |
| Structural steel — roof trusses, joists, roof deck, girts | — | — | 100% | — | 20–60 kt | 6.0–36 kt | Design values and connection data; trusses carry no fire-resistance requirement |
| Exterior skins — metal panel / IMP (metal-panel case) | 100% | — | — | — | 1.9–7.4 kt | 0.7–1.4 kt | Shipping now; area-for-area rain screen |
| Louvers and yard / mechanical screens | 100% | — | — | — | 0.2–0.9 kt | 0.2–0.4 kt | Shipping now |
| Security and staff-area fencing | 100% | — | — | — | 0.3–1.0 kt | 0.2–0.5 kt | Shipping now — the Microsoft near-term list |

### 3b. Contents — fit-out and equipment

| Component | Immediate | Soon | Medium term | Long term | Incumbent replaced | SUPERWOOD required | Gate / basis |
|---|---|---|---|---|---|---|---|
| Platforms, walkways, mezzanines, railings, tray supports | — | 100% | — | — | 5.0–15 kt | 1.5–9.0 kt | Published design values; IBC 1607 for railings |
| Acoustic barriers, enclosures, HVAC separations | — | 100% | — | — | 2.0–5.0 kt | 0.6–3.0 kt | STC / OITC lab and field data |
| Racking and equipment supports | — | 100% | — | — | 2.0–5.0 kt | 0.6–3.0 kt | Design values, seismic qualification |
| Other tray, containment, doors, misc. metals | — | 50% | — | — | 2.5–5.0 kt | 0.8–3.0 kt | Partial; UL 10C for rated doors |
| Ducting, plenums and air-distribution sheet metal | — | — | 100% | — | 3.0–8.0 kt | 0.9–4.8 kt | NFPA 90A / UL 181 noncombustibility expectations for in-airstream components — the hardest gate in this row set |
| Interior finishes, backplanes, trim (admin / office) | 100% | — | — | — | 1.0–3.0 kt | 0.1–0.4 kt | E84 Class A finish; backplanes UL 94 yellow card (not yet started) |
| Electrical equipment and conductors | — | — | — | — | — | — | Gensets, transformers, switchgear, batteries, copper |
| Mechanical equipment, piping, loop water | — | — | — | — | — | — | Chillers, fan walls, coolers, piping (ductwork is its own row) |
| IT — servers and racks | — | — | — | — | — | — | Rack masses [H]; aggregate [L] |

## 4. Roll-up by horizon (per 1 GW campus)

| Horizon | Incumbent mass replaced | SUPERWOOD required | Plant-years |
|---|---|---|---|
| Immediate — skins, screens, fences, interiors, backplanes | 3.3–12 kt | 1.2–2.7 kt (1.4–3.1M sf) | 1.4–3.1 yr of SuperMill One |
| Soon — platforms, railings, barriers, racking, doors | 12–30 kt | 3.5–18 kt | 0.1–0.6 yr of SuperMill Two |
| Medium term — structural steel, roof trusses and roofs, ducting, enclosures | 53–108 kt | 16–65 kt | 0.5–2.1 yr of SuperMill Two |
| Long term — slab, paving, foundations and their rebar (technical potential) | 996–2,061 kt | 56–346 kt | 1.8–11.0 yr of SuperMill Two |
| **Cumulative** | **1,064–2,211 kt** | **76–431 kt** | **2.4–13.8 yr of SuperMill Two** |
| Not replaced by SUPERWOOD | 321–664 kt | | about 23% of total mass |

- Through the medium term SUPERWOOD addresses **68–150 kt** of incumbent
  material — essentially all the steel above the slab, about
  4.9–5.2% of total campus mass.
  The long-term concrete rows are what move the total: with them, the ceiling is **76.8–76.9% of total
  campus mass**. Those shares (75% of slab and paving, 90% of foundations) are stated technical potential, not an
  engineered plan, and the whole difference between the two figures rests on them.
- What stays: the remaining concrete, servers, gensets, transformers, switchgear, batteries, chillers, copper, loop
  water — about 23% of total mass.
- Plant math: one gigawatt campus's immediate skins are 1.4–3.1M sf, **1.4–3.1 years
  of SuperMill One's entire output**. The medium-term structural horizon alone is 0.5–2.1 years of SuperMill
  Two per gigawatt — two or three gigawatts of campus absorb the plant for years, which is the offtake argument and
  the capacity risk in one number. The long-term concrete rows, if they ever became real, are a ChipMill-scale market on their own.

## 5. Embodied-carbon effect (pre-LCA, per GW)

Deck figures: steel 1.8 kg CO₂e/kg (global BF-BOF average), concrete 0.12 kg/kg, SUPERWOOD 0.5 kg/kg manufactured and
1.3 kg/kg biogenic carbon stored — **pre-LCA projections at scale; LCA under way with Prof. Ming Hu, University of Notre
Dame.** Biogenic storage reported separately (EN 15804 module C). The long-term row values concrete and its rebar at
the concrete factor, which is conservative.

| Horizon | Incumbent emissions avoided | SUPERWOOD manufacturing | Net reduction | Net vs EAF steel | Biogenic stored (separate) |
|---|---|---|---|---|---|
| Immediate (steel) | 6.0–22 kt CO₂e | 0.6–1.3 kt | **5.4–21 kt** | 0.7–7.3 kt | 1.6–3.5 kt |
| Soon (steel) | 21–54 kt CO₂e | 1.7–9.0 kt | **19–45 kt** | 2.9–12 kt | 4.5–23 kt |
| Medium term (steel) | 95–194 kt CO₂e | 8.0–32 kt | **87–162 kt** | 13–43 kt | 21–84 kt |
| Long term (foundation concrete) | 120–247 kt CO₂e | 28–173 kt | **92–75 kt** | n/a | 73–449 kt |

Against recycled (EAF) steel the avoided figure is far lower, so any claim must state its baseline.

## 6. Sensitivities — what moves the answer most

1. **Long-term concrete.** The long-term rows are 996–2,061 kt of concrete and rebar on stated technical
   potential (75% of slab and paving, 90% of foundations) and a 0.05–0.15 substitution factor, none of it engineered.
   They are the only rows that change the total-mass share materially, and the least evidenced. Present them as
   technical potential and say so on the slide.
2. **Precast vs metal-panel walls.** Decides whether facades are a 1.9–7.4 kt metal replacement now or a
   concrete-panel replacement in the medium term behind NFPA 285 and E119.
3. **Structural steel intensity.** The 50–100 t/MW range is a factor of two; one real takeoff from HITT, Turner or
   Fast + Epp collapses it.
4. **Substitution factor.** 0.3–0.6 kg per kg is the whole medium-term SUPERWOOD demand number; Fast + Epp can stamp
   it per element.
5. **Ducting.** In-airstream components face NFPA 90A / UL 181 noncombustibility expectations; the July reviewers
   flagged this as the hardest sell in the set. Enclosures and separations are the safer framing.
6. **AI halls.** Higher rack density means fewer buildings per GW, less structure and skin per MW, more electrical and
   mechanical mass; the replaceable share falls.

## 7. Gaps and next steps

- One building's material takeoff (structure, envelope, foundations, fencing) from a construction partner.
- Read Hasan et al. 2022 and Sharma et al. 2023 directly; the arXiv preprint is a secondary citation.
- Fix the TEM thickness mix so plant output in tonnes is one number.
- Fast + Epp to state substitution factors for two or three elements (truss, joist, wall panel), and a first opinion
  on whether a SUPERWOOD foundation system is even a sensible engineering target.
- Confirm with Microsoft and Meta whether their standard design uses precast or metal-panel walls.

## Sources

- arXiv 2509.21312 (Sep 2025), citing Hasan et al. 2022 and Sharma et al. 2023 — structural steel 500–1,000 t and
  concrete 5,000–10,000 m³ per 10 MW [secondary, conf: M].
- NVIDIA GB200 NVL72 rack mass ~1,360 kg — NVIDIA published specification [conf: H].
- Internal: SUPERWOOD Structural and Cladding TEMs (Jan 2026); 7.2 mm average thickness basis
  (`../../investor-overview/sources/notes/superwood-unit-economics.md`).
- Internal: carbon figures per the Canva DCII deck (0.5 / −1.3 kg CO₂e per kg SUPERWOOD; steel 1.8), pre-LCA.
  Concrete 0.12 kg CO₂e/kg is a typical ready-mix cradle-to-gate value [conf: M].
- Unit masses for gensets, UPS, transformers, chillers, metal panel, fencing, ducting, rebar ratios, foundation share:
  general industry ranges, not individually sourced [conf: L]. Replace with vendor or takeoff data before external use.
