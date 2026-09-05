# How much of a data center's above-ground material is steel, including contents

Date: 2026-09-04. Status: **estimate** [conf: L]. The per-component fractions and totals are now a live sheet, *Steel share*, in
[materials-mass-and-replacement.xlsx](materials-mass-and-replacement.xlsx); this note is the narrative. Asked by Alex 2026-09-04 as an independent check on the
"~60% of a data center is steel" figure (ex-concrete basis). Inputs are the component masses from
[materials-mass-and-replacement.md](materials-mass-and-replacement.md) (v4, metal-panel-wall case); the steel
fractions per component are my assumptions, stated in the table, not sourced.

Scope: everything above the slab — structure, envelope, fit-out and all equipment (electrical, mechanical,
IT). Excluded: slab on grade, paving, foundations, footings and their rebar (at or below grade), and all
concrete. Per 1 GW of IT load, low and high scenarios.

| Component | Mass, kt | Steel fraction | Steel, kt | Basis for the fraction |
|---|---|---|---|---|
| Structural steel — primary frame | 30–40 | 100% | 30–40 | steel by definition |
| Structural steel — roof trusses, joists, deck, girts | 20–60 | 100% | 20–60 | steel by definition |
| Exterior skins — metal panel / IMP | 1.9–7.4 | 85–95% | 1.6–7.0 | steel-faced IMP; some aluminum |
| Louvers and yard / mechanical screens | 0.2–0.9 | 40–70% | 0.1–0.6 | aluminum common |
| Security and staff-area fencing | 0.3–1.0 | 90–100% | 0.3–1.0 | chain-link, palisade, posts |
| Platforms, walkways, mezzanines, railings, tray supports | 5–15 | 95–100% | 4.8–15 | structural and misc. steel |
| Acoustic barriers, enclosures, HVAC separations | 2–5 | 70–90% | 1.4–4.5 | steel panels with absorptive fill |
| Racking and equipment supports | 2–5 | 95–100% | 1.9–5.0 | steel |
| Other tray, containment, doors, misc. metals | 5–10 | 85–95% | 4.2–9.5 | mostly steel, some aluminum |
| Ducting, plenums, air-distribution sheet metal | 3–8 | 95–100% | 2.8–8.0 | galvanized steel |
| Interior finishes, backplanes, trim | 1–3 | 20–40% | 0.2–1.2 | gypsum, wood, steel studs |
| Electrical equipment and conductors | 50–100 | 50–65% | 25–65 | enclosures, cores, gensets, switchgear; rest copper, oil, batteries |
| Mechanical equipment, piping, loop water | 20–50 | 45–65% | 9–33 | chillers, piping steel; water, copper, refrigerant not |
| IT — servers and racks | 15–70 | 40–60% | 6–42 | steel chassis and racks; aluminum, PCBs, copper |
| **Total above ground** | **155–375** | | **107–291** | |

## Result

- **Steel share of above-ground mass, contents included: about 70–80%** (69% low scenario, 78% high; 66–80% across
  cross-scenarios). Central figure roughly **three-quarters**.
- Structure and envelope alone are ~99% steel in the metal-panel-wall case — that is the wrong basis for a
  "share of the data center" claim because it excludes what fills the building.
- Including the rebar in the slab (at grade, 30–100 kt) as steel raises the share to 74–82%.
- Equipment (electrical, mechanical, IT) is 55–59% of above-ground mass, so the answer is driven by how much of
  a genset, a switchgear lineup, a chiller and a server rack is steel. Those fractions are my estimates; if they
  are 40% instead of 50–65%, the share falls to about 60–65%.

## What this means for the "60%" figure

On the ex-concrete basis Alex stated (building and contents, foundations and slab out), **60% is a conservative
round figure — the estimate lands higher, at roughly 70–80%**. It should print as a company estimate with its
denominator: "roughly two-thirds to three-quarters of a data center's above-ground material, including contents,
is steel [company estimate]". It must not print as a share of total mass (concrete is 83–87% of that) — that is
the framing the July review called wrong.

## Sensitivities, in order

1. **Perimeter walls.** With precast or tilt-up concrete walls instead of metal panel, above-ground concrete enters
   the denominator (hundreds of kt per GW) and the steel share falls well below this band. Confirm which wall
   system the customers' standard designs use.
2. **Equipment steel fractions** (above).
3. **Structural steel intensity**, 50–100 t/MW (published, secondary): a factor of two, but it moves numerator and
   denominator together, so the share is less sensitive to it than the absolute tonnage is.
4. **AI halls**: denser racks mean less building and more equipment per MW, pushing the share toward the equipment
   fractions.

Not in the model: roofing membrane and insulation, glazing, gypsum, raised floor (legacy), cable — all small
against the rows above.

## Printed wording (Alex, 2026-09-04)

Slide 5 prints "50–80% of the above-ground portion of a data center is steel" as a company estimate — a wider, more conservative band than the 70–80% this note lands on, chosen by Alex.
