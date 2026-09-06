# Foundations, slabs and pads for the assumed footprint — bottom-up cross-check

Date: 2026-09-06. Asked by Alex: what are the total foundation requirements for the assumed building footprint. Status: analysis only; the model still uses the per-MW concrete intensity.

## Footprint assumed (workbook Inputs)

1 GW of IT load; 5,000–10,000 sf of building per MW, so 5–10 million sf; 5–10 single-story halls of about 1 million sf each, 1,000 ft on a side, 40 ft to the eave. Site area, parking and roads are not in the model.

## Bottom-up concrete for that footprint (all estimates, conf L unless noted)

| Element | Assumption | Low, m³ | High, m³ |
|---|---|---|---|
| Hall slab on grade | 6–8 in over the full floor | 71,000 | 189,000 |
| Thickened slab | 10–12 in over 15–25% of the floor (electrical rooms, dense rack rows) | 7,000 | 24,000 |
| Column footings | 40 ft bays; 8x8x2 ft to 10x10x2.5 ft spread footings | 11,000 | 44,000 |
| Perimeter grade beams | 4 x 1,000 ft per hall; 2x3 ft to 2.5x3.5 ft | 3,000 | 10,000 |
| Generator pads | 2.5–3 MW gensets, N+1 to N+25%; 40x12x1 ft to 45x14x1.25 ft | 5,000 | 11,000 |
| Transformer and switchgear pads | one per two gensets, 20x15x1 ft to 25x18x1.25 ft | 2,000 | 5,000 |
| Mechanical equipment pads | 5–8% of floor area at 8–10 in | 5,000 | 19,000 |
| **Building and equipment, total** | | **104,000** | **301,000** |
| Site paving, roads, yards, parking | 0.8–1.5 x building footprint at 6–8 in | 57,000 | 283,000 |
| **All-in with site work** | | **160,000** | **585,000** |

Building and equipment pads alone: 250,000–720,000 tons of concrete, 104–301 m³ per MW. Rebar at 60–100 kg/m³ adds 6,000–30,000 tons.

## Finding

The model's concrete row, 500–1,000 m³ per MW from the Schneider WP99 reference design, is 2–4 times the bottom-up figure for the building alone and 1–3 times the all-in figure with site work. Two explanations, probably both:

1. WP99 is a 13,000 sf/MW design at 6 kW per rack, and its 0.23 t CO₂e/m² core-and-shell intensity comes from the EC3 database, which for a concrete-heavy shell (tilt-up walls, thick slabs, precast) carries far more concrete per square foot than a steel-frame, metal-panel hall.
2. Hyperscale sites carry site work the bottom-up only sketches: substation yards, retention, roads and generator farms.

## Recommendation

Add a footprint-based concrete path to the workbook alongside the per-MW path, with the seven elements above as inputs, and let the slide 6 foundation group print the bottom-up range with the per-MW figure as the upper bound until a real takeoff replaces both. Not applied; Alex to decide.

## Geotechnical allowance (added 2026-09-06 at Alex's request)

The base bottom-up assumes good soils: spread footings on a 40 ft grid and a slab on grade. Two allowance cases on top of it, all estimates [conf: L]:

| Case | What changes | Allowance, m³ low | high |
|---|---|---|---|
| A — good soils | none; spread footings and slab on grade as modeled | 0 | 0 |
| B — moderate soils | over-excavate and replace with lean concrete or controlled low-strength material, 6–12 in under 30–60% of the footprint; footings and grade beams 30% larger | 29,000 | 197,000 |
| C — poor soils | everything in case B, plus 3–4 drilled piers or driven piles per column, 18–24 in diameter, 40–60 ft long (3,100–6,300 columns); pile caps in place of spread footings; a pier every 15–20 ft under the grade beams; the hall slab becomes a structural slab 2–4 in thicker | 89,000 | 484,000 |
| Substation and transformer yard mats | 18–24 in mats over 10–20 acres per GW, counted with site work | 19,000 | 49,000 |

Totals by case:

| Case | Building and pads, m³ | With site work and yard mats, m³ |
|---|---|---|
| A — good soils | 104,000 – 301,000 | 179,000 – 634,000 |
| B — moderate soils | 133,000 – 498,000 | 208,000 – 831,000 |
| C — poor soils | 164,000 – 588,000 | 238,000 – 921,000 |

Reading: on poor soils with full site work the bottom-up reaches the model's 500,000–1,000,000 m³ per GW; on good soils it is a third to a half of it. The per-MW figure is therefore a poor-soils, heavy-site-work case, not a typical one. Geotechnical conditions are also where a lightweight SUPERWOOD foundation system would matter most: case C is 1.5–2 times case A in concrete, and every ton of that is load the ground must carry.

## Wall system: tilt-up versus insulated metal panel (added 2026-09-06)

The workbook carries this as the `walls_precast` switch (default 0, metal panel), and the steel-share sheet reports both cases. For the assumed footprint:

| Wall system | Concrete | Steel | Where it lands in the model |
|---|---|---|---|
| Insulated metal panel (default) | none in the walls | 3,300–12,000 tons of steel-faced panel over 0.8–1.6 million sf of wall | Immediate: SUPERWOOD rain screen area for area |
| Tilt-up or precast concrete | 8–9 in panels over the same wall area: 15,000–34,000 m³, 36,000–82,000 tons, plus 60–100 kg/m³ of rebar and heavier panel-line footings | metal panel row drops to zero | Medium term: hybrid SUPERWOOD wall panel, gated by NFPA 285 and ASTM E119 assemblies |

Tilt-up therefore adds about 5–10% to the building-and-pads concrete above and moves the facade from an immediate SUPERWOOD skin to a medium-term structural panel. It is also why the steel share of the above-ground building spans 56–66% for tilt-up against 69–79% for metal panel (steel-share sheet). Which system Microsoft's and Meta's standard designs use is still the open item that decides this.

## Scenario sheet in the workbook (added 2026-09-06)

The Foundations sheet of `materials-mass-and-replacement.xlsx` now carries every element above as an input, with `concrete_basis` (0 = published per-MW intensity, the deck's default; 1 = footprint bottom-up) and `soil_case` (1 good, 2 moderate, 3 poor) on the Inputs sheet. Wall system stays on `walls_precast`. Evaluated at the current inputs:

| Scenario | Slab and paving, tons | Foundations and pads, tons | Rebar, tons | Long-term SUPERWOOD, tons |
|---|---|---|---|---|
| Per-MW basis (deck today) | 720,000 – 1,200,000 | 480,000 – 1,200,000 | 30,000 – 100,000 | 57,000 – 359,000 |
| Footprint, good soils | 323,000 – 1,189,000 | 107,000 – 332,000 | 11,000 – 63,000 | 21,000 – 223,000 |
| Footprint, moderate soils | 323,000 – 1,189,000 | 176,000 – 804,000 | 12,000 – 83,000 | 25,000 – 296,000 |
| Footprint, poor soils | 379,000 – 1,416,000 | 193,000 – 794,000 | 14,000 – 92,000 | 28,000 – 324,000 |

Reading: the footprint basis on good soils halves the long-term SUPERWOOD range at the low end; on poor soils with full site work the high end approaches the per-MW figure. The slide 6 and 7 figures still print the per-MW basis until Alex chooses a scenario.


Case nesting (2026-09-06, after Alex asked why moderate soils showed more foundation concrete than poor): case 3 now includes the case 2 ground replacement and enlarged elements, so foundations rise monotonically from good to moderate to poor. Before the change, case 3 replaced the lean concrete with piles and put its structural-slab thickening under slab and paving, which left the foundations line slightly below case 2 at the high end.
