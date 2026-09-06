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
