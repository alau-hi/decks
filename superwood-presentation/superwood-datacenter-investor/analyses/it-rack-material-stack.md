# What a server rack is made of — material stack for the "IT — servers and racks" row

Date: 2026-09-06. Asked by Alex: why only 40% steel, and what is the rest. Status: recommendation applied 2026-09-06 at Alex's direction (IT 50% steel / 8% plastic / 42% other; rack cabinets 18% soon, server enclosures 30% long).

## 1. Published bills of materials

**Average 2U rack server, EU Ecodesign Lot 9 preparatory study, Task 4 (2015), Table 24** — 27.7 kg shipped, 23.0 kg product without packaging. Regrouped by material [conf: H on the source figures, M on my regrouping]:

| Material | g | Share of product |
|---|---|---|
| Ferrous (galvanized sheet chassis, fan and PSU steel, cast iron, stainless) | 14,288 | 62% |
| Printed circuit boards and electronics (mainboard, PSU electronics, expansion cards, memory, CPUs) | 3,961 | 17% |
| Aluminum (drives, PSU housings, chassis parts) | 2,076 | 9% |
| Plastics, paper, rubber (fan housings, cable jackets, PSU insulation) | 1,716 | 7.5% |
| Copper, brass, zinc (heat sink, cables, fan windings, connectors) | 979 | 4.3% |

**Dell PowerEdge R740, full LCA (thinkstep for Dell, 2019), Tables 3-1 and 3-2** — 29.5 kg shipped, 22.4 kg product. By component [conf: H]:

| Component | kg | Share of product |
|---|---|---|
| Chassis (sheet steel body) | 11.50 | 51% |
| Two power supplies (steel cases, electronics) | 2.99 | 13% |
| Mainboard incl. two CPUs, frame, heatsinks | 2.65 | 12% |
| Mixed boards (risers, NICs, memory) | 2.43 | 11% |
| Six fans incl. cases | 1.59 | 7% |
| Nine SSDs | 1.20 | 5% |

**Dell R6515 / R7515 / R6525 / R7525 LCA (2020)** — chassis 41–46% of shipped weight incl. packaging, i.e. roughly half of product weight [conf: H].

**Rack cabinet** — APC NetShelter SX 42U, 600 x 1,200 mm: 161 kg empty, steel construction, static load 1,360 kg [conf: H, vendor spec].

**AI rack** — NVIDIA GB200 NVL72: 1.36 t (3,000 lb) per rack, about 2 miles (3.2 km) of passive copper NVLink cabling, copper bus bar, liquid-cooling manifolds and cold plates, 18 compute trays and 9 switch trays [conf: H on mass and cable length; NVIDIA does not publish a material split].

Analog: HP's material content disclosure puts a commercial desktop tower at 53% steel and an all-in-one at 61% [conf: H, HP 2019]. Server chassis are heavier-gauge and denser in steel than desktops.

## 2. What a loaded rack looks like

| Scenario | Total | Cabinet | Steel | Server chassis sheet metal | Copper | Aluminum | PCB and silicon | Plastics |
|---|---|---|---|---|---|---|---|---|
| Enterprise / cloud general-purpose: 42U cabinet + 20 x 2U servers at 23 kg + 40 kg PDUs and cabling | ~660 kg | 24% | ~66% | ~35% | ~5% | ~7% | ~13% | ~7% |
| AI training rack of the GB200 class | ~1,360 kg | ~15% | ~35–40% | ~20–25% | ~25–30% | ~10% | ~15% | ~10% incl. coolant |

Enterprise-rack shares follow from the Lot 9 and Dell figures above [conf: M]. The AI-rack column is my estimate from the published mass, cable length and component list; nobody publishes the split [conf: L].

## 3. Findings

1. **40% steel is too low for general-purpose racks and about right for AI racks.** A general-purpose loaded rack is roughly two-thirds steel: the cabinet is nearly all steel and each server is 50–62% steel. Dense AI racks trade steel for copper (cable spines, bus bars, cold plates) and land near 35–40%.
2. **The rest** is copper (cables, bus bars, heat sinks, windings), aluminum (drive bodies, heat sinks, PSU housings), printed circuit boards with their silicon and memory, and plastics (fan housings, cable jackets, connectors), plus coolant in liquid-cooled racks.
3. **Where SUPERWOOD could go.** The rack cabinet frame and panels (15–24% of a loaded rack, all steel) are the soon item Alex named. The server chassis body, the sheet-steel tray and lid, is the enclosure item for the long term and is larger than the deck assumes: about 35% of a general-purpose loaded rack, 20–25% of an AI rack, against the 22% now in the model.

## 4. Recommendation for the model and the deck

| Parameter | Now in the model | Proposed | Basis |
|---|---|---|---|
| IT steel share of mass | 40% | 50% (blend of ~65% general-purpose and ~38% AI racks) | Section 2 |
| IT plastic share | 10% | 8% | Lot 9 7.5%, more in liquid-cooled racks |
| IT other (copper, aluminum, PCB, silicon, coolant) | 50% | 42% | remainder |
| Rack cabinets substitutable, Soon | 18% | 18% (keep) | 24% enterprise, ~15% AI |
| Server enclosures substitutable, Long | 22% | 30% | ~35% enterprise, ~22% AI |

Effect if applied: the IT row's embodied carbon rises (more steel valued at 1.8 kg/kg), the Soon row on slide 7 is unchanged, the Long row rises by about 70,000 x 0.08 x 0.3–0.6 = 1,700–3,400 tons of SUPERWOOD per GW, within rounding of the printed range. Applied 2026-09-06.

## Sources

- EU DG ENTR Lot 9, Enterprise servers and data equipment, Task 4 Technologies (Bio Intelligence Service, 31 Jul 2015), Table 24 and Annex Table 33. https://www.eceee.org/static/media/uploads/site-2/ecodesign/bio_entr_lot_9_task_4_fv_20150731.pdf
- thinkstep for Dell, Life Cycle Assessment of the Dell PowerEdge R740 (2019), Tables 3-1, 3-2, 3-6. https://www.delltechnologies.com/asset/en-us/products/servers/technical-support/Full_LCA_Dell_R740.pdf
- Dell, LCA of PowerEdge R6515, R7515, R6525, R7525 (2020). https://www.delltechnologies.com/asset/en-us/products/servers/technical-support/full-lca-of-dell-severs-r6515-r7515-r6525-r7525.pdf
- APC NetShelter SX 42U AR3350 series vendor specifications (161 kg, 1,360 kg static load).
- NVIDIA, GB200 NVL72 technical blog and DGX GB200 user guide (1.36 t; copper NVLink spine); The Register, 21 Mar 2024 (2 miles of copper cabling).
- HP, Product Material Content Information (May 2019): desktop 53% steel, all-in-one 61%.
