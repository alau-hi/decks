# Conflicts and open decisions - as of 2026-09-04

GENERATED from `SAFE-2026-09.yaml` by `build.py`. Every cluster of facts linked by `conflicts_with`, then every `status: open` fact. A `Decision:` line is filled from the YAML `decision` / `decided_by` fields; otherwise it reads `OPEN - Alex`.

## Conflicts (14 clusters)

### C1. Carbon set - Canva (0.5 / 1.3 per kg) vs TEM Jan 2026 (0.39 / 1.8 per t)

- `carbon.superwood_biogenic_stored_kgco2e_per_kg` [canonical, internal, M] **0.5-1.5 (1.3 in the Canva set)** kg CO2e / kg SUPERWOOD - SUPERWOOD stores 0.5-1.5 kg CO2e per kg as biogenic carbon (Alex 2026-09-05; Canva set says 1.3) - reported separately, and released in module C under EN 15804; printed in: superwood-datacenter-investor
  - Under reporting standards all biogenic carbon is released in module C, so the product is net zero on biogenic and must win on manufacturing emissions. Never net storage against manufacturing in a headline. Range 0.5-1.5 from Alex 2026-09-05 for the datacenter investor deck; the Canva set prints 1.3 - reconcile before wide distribution.
- `carbon.superwood_manufacturing_kgco2e_per_kg` [canonical, internal, M] **0.5** kg CO2e / kg SUPERWOOD - SUPERWOOD manufacturing emissions are projected at 0.5 kg CO2e per kg at a full-scale plant (pre-LCA projection); printed in: superwood-datacenter-investor
  - Confidence not labeled in the source registers (the overview register has only "net carbon sink... an LCA would be the backup" at internal M); recorded M. Always print with carbon.lca_status.
- `carbon.tem_jan2026_set` [superseded, internal, L] **0.39 emitted / 1.8 stored (per t, as written)** as written in the TEM review - TEM Jan 2026 carbon figures - 0.39 emitted / 1.8 stored per t; printed in: -
  - Superseded by the Canva set on 2026-09-04. Units as written in the source ("per t"); not reconciled to per-kg here - do not convert without reading the TEM.

**Decision:** Alex Lau 2026-09-04 - Canva set for all investor materials; TEM Jan-2026 figures superseded. Label pre-LCA in body copy.

### C2. ChipMill cost and price - overview ($1,525 / $4,485 per m3) vs SMA ($1,310/m3, 60% GM, $2.19/sf)

- `cost_price.chipmill_price_per_m3_overview` [canonical, internal, H] **4485** USD/m3 - ChipMill price $4,485/m3 ($3.00/sf) - investor-overview table; printed in: investor-overview
  - Fresh Look lists the ChipMill price/cost ratio as 2.4-2.5, which matches the SMA pair, not this one (2.94).
- `cost_price.chipmill_cost_per_m3` [open, internal, L] **1525 (overview) / 1310 (SMA)** USD/m3 - ChipMill manufacturing cost - investor-overview Cost Roadmap table $1,525/m3 (single ChipMill column, price $4,485); super-mills-america Cost Roadmap $1,841/m3 (ChipMill batch, price $4,485) and $1,310/m3 (ChipMill continuous, price $3,275); printed in: investor-overview, super-mills-america
  - SMA continuous set is internally consistent with the 60% GM decision ($1,310 x 2.5 = $3,275). The overview's $1,525 has no counterpart in SMA.

**Decision:** OPEN - Alex. The two decks are investor-overview (one ChipMill column - $4,485 price, $1,525 cost) and super-mills-america (two ChipMill columns - batch $4,485 / $1,841 and continuous $3,275 / $1,310). Same $4,485 price, different cost ($1,525 vs $1,841). Either the overview adopts SMA's batch cost, or SMA's batch column takes $1,525.

### C3. Price ladder relabel vs Jon's $25/sf exterior

- `cost_price.exterior_per_sf_context` [canonical, asserted-internal, M] **25** USD/sf - Exterior board holds at $25/sf (Jon Strimling) - context only, never printed; printed in: -
  - Registered only as context. Fresh Look derives $35-78M per GW of data-center skins at this price; not for print.
- `cost_price.sm1_price_basis_per_sf` [canonical, internal, H] **15.0** USD/sf - Cost-roadmap SuperMill One price basis $15.00/sf (premium applications - mullions, blinds, luxury furniture structures); printed in: investor-overview, super-mills-america
  - $15.00 x 1,495 = $22,425/m3 (cost_price.sm1_price_per_m3). Jon Strimling 2026-08-29 - "$15 out of the gate for structural boards is aggressive - that price has been proposed to customers and they are walking away." Alex's answer was that prices are per-market, not one product at three prices.

**Decision:** Alex Lau 2026-08-29 - RELABEL the ladder by market rather than reduce; 2026-09-02 bases fixed at $15.00 SM One premium / $5.50 SM Two interior structural; $25/sf exterior is context only, never printed.

### C4. SuperMill Two roadmap price - $8,222/m3 ($5.50/sf, SMA) vs $14,950/m3 (investor-overview table)

- `cost_price.sm2_price_basis_per_sf` [canonical, internal, H] **5.5** USD/sf - Cost-roadmap SuperMill Two price basis $5.50/sf (interior structural board); printed in: super-mills-america
  - $5.50 x 1,495 = $8,222/m3 (cost_price.sm2_price_per_m3). 36M sf x $5.50 = $198M, below the $320M projected revenue - reconciled by economics.sm2_blended_price.

**Decision:** Alex Lau 2026-09-02 fixed the SMA basis at $5.50/sf. OPEN - Alex - whether the investor-overview Cost Roadmap table ($14,950/m3 = $10/sf) moves to the same basis.

### C5. Meta/Microsoft CLT carbon reduction - "two-thirds" (overview) vs 35%/65% and ~41% (published)

- `datacenter.meta_clt` [canonical, published, H] **Aiken SC 2025; Cheyenne WY; Montgomery AL; ~41% on materials substituted** % embodied-carbon reduction - Meta - mass timber data centers at Aiken SC (2025), Cheyenne WY, Montgomery AL; ~41% embodied-carbon reduction on materials substituted; printed in: superwood-datacenter-investor
- `datacenter.microsoft_clt` [canonical, published, H] **two Northern Virginia data centers; CLT floors on steel frame; 35% vs steel, 65% vs precast** % embodied-carbon reduction - Microsoft - two Northern Virginia data centers with CLT floors on a steel frame; 35% embodied-carbon reduction vs steel, 65% vs precast (Gensler, Thornton Tomasetti); printed in: superwood-datacenter-investor
  - CLT replaces concrete floors; nothing yet replaces the steel - the pivot to SUPERWOOD.
- `datacenter.meta_microsoft_two_thirds` [superseded, unverified, M] **two-thirds** carbon reduction - Meta and Microsoft demonstrated a two-thirds carbon reduction using mass timber (CLT) floors; printed in: investor-overview
  - Matches only Microsoft's 65%-vs-precast figure. Replace with the per-company published figures.

**Decision:** Use the published per-company figures (Microsoft 35% vs steel / 65% vs precast; Meta ~41% on materials substituted). The overview's single "two-thirds" line is superseded. "Reported through EC3" is asserted [needs source] - cut or source.

### C6. 60%-steel data-center stat (unsourced, ex-concrete basis)

- `datacenter.steel_share_ex_concrete` [canonical, asserted-internal, L] **~60** % of building and contents by mass, EXCLUDING concrete - About 60% of a US data center (building and contents, excluding concrete) is steel; printed in: investor-overview, super-mills-america
  - NO PUBLISHED SOURCE STATES A STEEL SHARE ON ANY BASIS (searched 2026-08-27 - LCA literature, Schneider Electric, Gensler 2023, Vertiv, WEF). On an all-in mass basis it is almost certainly wrong - concrete is 83-87% of everything. A "~250 t/MW" figure circulates with no traceable origin [L, do not print].
- `datacenter.steel_share_model_derivation` [canonical, estimated, L] **~70** % of ex-concrete mass - Excluding concrete, steel in all forms comes out near 70% of what is left on the model's assumptions - a derivation, not a source; printed in: -
  - Consistent in order of magnitude with the ~60% framing.

**Decision:** Alex Lau 2026-08-27/29 - print with the ex-concrete basis stated (tooltip). Sourcing still OPEN - Alex - either source it, derive it bottom-up with stated assumptions (the model lands near 70%), or drop it. Not printed in the datacenter companion.

### C7. Paid deposits 700+ vs 800+

- `economics.deposits_paid` [canonical, internal, H] **700+** paid online deposits - 700+ paid online deposits (reservations); printed in: investor-overview, super-mills-america
  - Count moved 650+ -> 800+ -> 700+. Confirm the live CRM figure before each send; this is the number a reader is most likely to ask about.
- `economics.deposits_paid_800` [superseded, internal, M] **800+** paid online deposits - 800+ paid online deposits (earlier figure); printed in: aaron-deck
  - SMA register - "Parent decks (investor-overview, aaron-deck) still print 800+ - flag for alignment."

**Decision:** Alex Lau 2026-08-25 - 700+ everywhere; 800+ superseded. Registers disagree on whether investor-overview still prints 800+ (SMA note says parent decks and aaron-deck still do; overview register says 700+ set 2026-08-24 on all three slides) - verify the live decks.

### C8. Aluminum import share 85% vs 60% (resolved - different bases)

- `market.us_aluminum_import_reliance_all_forms` [canonical, published, H] **60** % of apparent consumption (2025e) - US net import reliance for aluminum (all forms) is 60% of apparent consumption (62% 2024, 63% 2023); printed in: investor-overview, super-mills-america
  - MCS 2026 stopped netting exported scrap (footnote 3), so 2024 reads 62% here and 47% in MCS 2025 - do not mix series. Aluminum is on the USGS Critical Minerals List.
- `market.us_aluminum_primary_import_share` [canonical, derived, H] **~85** % of primary (unwrought) aluminum used - About 85% of the primary (unwrought) aluminum the US uses is imported; printed in: super-mills-america
  - Provenance label in source is "derived from published". MUST be labeled primary/new aluminum. Corroboration - USGS MCS 2026 660 kt primary production vs 4,400 kt crude-and-semifab imports; the white paper's "around 4 million t" gap reads ~90%; honest band 85-90%, 85% is the conservative end. Local copy - super-mills-america/sources/PoweringUpAluminum_WhitePaper_2025.pdf.

**Decision:** RESOLVED 2026-08-26 - 85% is the PRIMARY-aluminum share (SMA, labeled "primary"); 60% is net import reliance across all forms (overview Vs Steel row). Both stand; label the basis every time.

### C9. Cement import reliance 21% vs ~22% (different USGS vintages)

- `market.us_cement_import_reliance` [canonical, published, H] **21% (2025e, MCS 2026) / 22% (2024e, MCS 2025)** % of apparent consumption - About one-fifth of US cement consumption is met by imports - 21% (USGS MCS 2026, 2025e) or 22% (USGS MCS 2025, 2024e); printed in: investor-overview, super-mills-america
  - Added to SMA per Alex 2026-08-26 ("America imports over 20% of the cement it uses").

**Decision:** OPEN - Alex. Overview prints 21% (MCS 2026), SMA prints ~22% (MCS 2025). Pick one vintage; MCS 2026 is newer.

### C10. Chemistry wording - "no toxic chemicals" vs "non-toxic chemicals"

- `material.no_glues_binders_toxics` [canonical, internal, H] **no added glues, no polymer binders, no toxic chemicals** - No added glues, no polymer binders, no toxic chemicals; printed in: investor-overview
  - Both can be true but the pairing invites a question.
- `process.lignin_breakdown` [canonical, internal, H] **temperature, pressure and non-toxic chemicals** - The process breaks down lignin using temperature, pressure and non-toxic chemicals; printed in: investor-overview
  - Datacenter deck reduces this to "chemistry common to food and pulp processing".

**Decision:** OPEN - Alex. The 2026-08-22 call suggested "environmentally benign process" and "modifies molecular bonding".

### C11. Strength stated five ways on four bases

- `material.strength_50pct_stronger_one_sixth_weight` [canonical, internal, M] **>50% stronger; 1/6 weight** - More than 50% stronger than steel, at one-sixth the weight (Conversion step 03); printed in: investor-overview
  - Formulation (4).
- `material.strength_about_10x` [canonical, internal, M] **~10** x - About 10x strength (Conversion step 02); printed in: investor-overview
  - Formulation (3). Does not say strength of what, relative to what.
- `material.strength_increase_over_wood` [canonical, internal, L] **5-12** x - SUPERWOOD increases wood's strength by 5-12x; printed in: investor-overview
  - Formulation (5).
- `material.strength_to_weight_vs_steel` [canonical, internal, M] **up to 10** x - Up to 10x the strength-to-weight ratio of steel; printed in: investor-overview, superwood-datacenter-investor
  - Formulation (2). Fresh Look - 1.5 x 6 = 9 at lab values; 500/400 x 6 = 7.5 at production values. Print the derivation or the production figure.
- `material.strength_vs_a36` [canonical, internal, M] **stronger than ASTM A36** - SUPERWOOD is stronger than ASTM A36 structural steel (footnoted to A36); printed in: investor-overview, super-mills-america
  - Formulation (1). Vs Steel slide - steel "1.5x weaker" and "6x heavier" vs SUPERWOOD, revised by Alex 2026-08-24 ("comparable" then back to "Stronger" footnoted to A36). ASTM A36 is the only test basis stated anywhere. SMA prints it in "stronger than steel, half the weight of aluminum, scalable to half the cost of steel" (conf L there).
- `material.strength_canonical_formulation` [open, internal, L] ***null*** - ONE canonical strength formulation with its test basis, to be used everywhere - not yet chosen; printed in: -
  - Strength-to-weight and absolute strength are different quantities; none of the five printed formulations states a test standard. The deck's single largest diligence exposure - a consistency problem, not a data problem.
- `material.tensile_strength_mpa` [open, internal, L] **production 500; lab 600+** MPa (tensile, parallel to grain) - SUPERWOOD tensile strength - 500 MPa in production, 600+ MPa in the lab; printed in: superwood-datacenter-investor
  - Current datacenter deck contradicts itself ("600 MPa in production today" vs "production 500 MPa; lab 600+"). Fresh Look proposes production 500 / lab 600+ with A36 shown as its 400-550 MPa range and 6061-T6 at 310 MPa. "Design values and methods on request."

**Decision:** OPEN - Alex. Pick one formulation, state its test basis once, build it as a reusable component, use only that in all places.

### C12. SuperMill One capacity 1M vs 1.3M sf/yr

- `mills.sm1.capacity_sf_yr` [canonical, internal, H] **1000000** sf/yr - SuperMill One capacity is 1M sf/yr (across all markets); printed in: investor-overview, super-mills-america, superwood-datacenter-investor
  - Datacenter capacity sentence per Fresh Look - "SuperMill One is ~1M sf/yr across all markets".
- `mills.sm1.capacity_sf_yr_customer_deck` [superseded, internal, L] **1300000** sf/yr - SuperMill One capacity printed as 1.3M sf/yr in the customer data-center deck (and the stale Opus8 deck); printed in: -
  - Unit-economics note lists 1.3M sf/yr among four stale Opus8 figures (1.3M sf/yr, $34M, $220M, $360M). Do not print.

**Decision:** Alex Lau 2026-09-04 - 1M sf/yr in all investor materials; datacenter deck to use 1M or none.

### C13. SuperMill Two volume - 20,000 vs 24,000 m3/yr and the 36M sf / 7.2 mm identity

- `mills.sm2.capacity_sf_yr` [canonical, internal, H] **36000000** sf/yr - SuperMill Two output 36M sf/yr; printed in: investor-overview, super-mills-america
  - 36M sf at 7.2 mm = 24,077 m3. Printing 20,000 m3 alongside 36M sf breaks the identity.
- `mills.sm2.volume_m3_yr_derived` [canonical, derived, H] **24000** m3/yr - SuperMill Two ~24,000 m3/yr (36M sf at 7.2 mm average board thickness); printed in: -
  - Was superseded by 20,000 m3/yr on 2026-08-29; reinstated as canonical 2026-09-04 when Alex confirmed 36M sf at 7.2 mm. Consistent with the $/sf to $/m3 ladder (x1,495).
- `mills.sm2.volume_m3_yr` [superseded, internal, M] **20000** m3/yr - SuperMill Two volume output is about 20,000 m3/yr - SUPERSEDED 2026-09-04; printed in: super-mills-america
  - UNRESOLVED ARITHMETIC. 24,000 was derived (36M sf x 7.2 mm = 24,077 m3). At 20,000 m3 one of the other two must move - either output is ~30M sf at 7.2 mm, or 36M sf at ~6.0 mm. The second cascades: 7.2 mm converts the whole $/sf ladder to $/m3 ($5.50/sf = $8,222/m3 only at 7.2 mm). Appendix prints 20,000 with "(36M sf)" removed; 36M sf still prints on Cost Roadmap and The Fleet. Also the anchor for the >7,000-mill fleet figure.

**Decision:** RESOLVED - Alex Lau 2026-09-04 - 36M sf at 7.2 mm stands, so volume is ~24,000 m3/yr (mills.sm2.volume_m3_yr_derived). The 20,000 figure is superseded. ACTION - super-mills-america Appendix comparison still prints 20,000 m3; update it to ~24,000 (and the >7,000-mill fleet anchor inherits the change).

### C14. SuperMill Two capex $300M vs $300-400M vs $325M

- `mills.sm2.capex_range` [canonical, internal, H] **300-400** USD million - SuperMill Two capex $300-400M; printed in: super-mills-america, superwood-datacenter-investor
  - investor-overview still carries the $300M point figure (unit-economics note, Cost Roadmap table, Demand note) - align.
- `mills.sm2.capex_325` [retired, internal, L] **325000000** USD - SuperMill Two capex $325M (earlier Scaling-slide figure); printed in: -
  - Reconciled down to $300M on 2026-08-23. Do not print.
- `mills.sm2.capex_point` [superseded, internal, H] **300000000** USD - SuperMill Two capex $300M (point figure); printed in: investor-overview, super-mills-america
  - Still the basis of the $300M / $208M = 1.44x capex-to-EBITDA line and the 69% cash-yield endpoint.

**Decision:** Alex Lau 2026-09-03 - print the $300-400M range; $300M was the earlier point figure; $325M reconciled down 2026-08-23.

## Open facts (17)

- `mills.chipmill.capex_revenue_ebitda` - ChipMill capex, revenue and EBITDA - no figures exist in the underlying model. Candidate value: *null*. The three em-dashes on the Cost Roadmap table are deliberate. Do not fill in without a real number.
  - **Decision:** OPEN - Alex
- `cost_price.chipmill_cost_per_m3` - ChipMill manufacturing cost - investor-overview Cost Roadmap table $1,525/m3 (single ChipMill column, price $4,485); super-mills-america Cost Roadmap $1,841/m3 (ChipMill batch, price $4,485) and $1,310/m3 (ChipMill continuous, price $3,275). Candidate value: 1525 (overview) / 1310 (SMA). SMA continuous set is internally consistent with the 60% GM decision ($1,310 x 2.5 = $3,275). The overview's $1,525 has no counterpart in SMA.
  - **Decision:** OPEN - Alex. The two decks are investor-overview (one ChipMill column - $4,485 price, $1,525 cost) and super-mills-america (two ChipMill columns - batch $4,485 / $1,841 and continuous $3,275 / $1,310). Same $4,485 price, different cost ($1,525 vs $1,841). Either the overview adopts SMA's batch cost, or SMA's batch column takes $1,525.
- `economics.sm1_allocation` - Three-way allocation plan for SuperMill One output; the pie chart is drawn as equal thirds with no real percentages. Candidate value: three-way allocation; percentages not defined. FLAGGED - supply actual percentages or drop the graphic. Replaced an equally notional bar 2026-08-24.
  - **Decision:** OPEN - Alex
- `material.strength_canonical_formulation` - ONE canonical strength formulation with its test basis, to be used everywhere - not yet chosen. Candidate value: *null*. Strength-to-weight and absolute strength are different quantities; none of the five printed formulations states a test standard. The deck's single largest diligence exposure - a consistency problem, not a data problem.
  - **Decision:** OPEN - Alex. Pick one formulation, state its test basis once, build it as a reusable component, use only that in all places.
- `material.tensile_strength_mpa` - SUPERWOOD tensile strength - 500 MPa in production, 600+ MPa in the lab. Candidate value: production 500; lab 600+. Current datacenter deck contradicts itself ("600 MPa in production today" vs "production 500 MPa; lab 600+"). Fresh Look proposes production 500 / lab 600+ with A36 shown as its 400-550 MPa range and 6061-T6 at 310 MPa. "Design values and methods on request."
  - **Decision:** OPEN - Alex
- `material.hardness_vs_oak` - 3x harder than oak. Candidate value: 3. Datacenter deck prints it as "3x more dent-resistant than oak" - unsourced [needs source]; Fresh Look asks Alex for the method or permission to drop (item 8).
  - **Decision:** OPEN - Alex
- `material.thermal_insulation_multipliers` - 100x better thermal insulation than steel; 400x better than aluminum. Candidate value: 100x vs steel; 400x vs aluminum. Fresh Look marks it [needs source] in the datacenter deck; Alex to source or drop (item 8). Record the conductivity values and the arithmetic here when sourced.
  - **Decision:** OPEN - Alex
- `material.durability_pests` - Protects against termites, mold and fungus. Candidate value: protects against termites, mold and fungus (no standard named). No standard named; confidence not stated in source. Name the test or say "data package on request".
  - **Decision:** OPEN - Alex
- `process.manufacturing_specifics` - Off-the-shelf equipment common to lumber treatment and wood panel industries; food-grade solution; near-zero process wastewater. Candidate value: equipment common to lumber treatment and wood-panel plants; food-grade process solution; near-zero process wastewater. Fresh Look item 7 - Alex to confirm the three specifics still hold for SuperMill One as built before they are restored to the datacenter deck.
  - **Decision:** Not printed in the data center deck - Alex 2026-09-04 kept slide 7 to the 2026-09-02 wording. Confirm as-built before any deck uses it.
- `market.application_market_dots` - Per-application market sizes shown as $1B to $100B+ scale dots. Candidate value: $1B to $100B+ scale dots. Also - Applications and Markets slides use two different market taxonomies (code pathway vs phase/application). Reconcile (cross_slide open issue).
  - **Decision:** OPEN - Alex
- `customers.datacenter_engagement_ladder` - Stage (conversation / samples / mockup / paid pilot / PO / basis of design) and next milestone for Microsoft, Meta, Google, Vertiv, Wooden Data Center, security-fencing operators; one concrete statement each for HITT, Turner, Fast + Epp, Timber Engineering. Candidate value: *null*. Current deck prints "engaged for over a year", "broad engagement" - undated, unverifiable. Also open - whether "customer names used with permission" is true (Alex approved naming; that is not customer permission), and what HITT / Turner's "enthusiastic support" consisted of.
  - **Decision:** OPEN - Alex
- `datacenter.construction_spending_surge` - US data center construction spending surged roughly 5x in two years. Candidate value: ~5x in two years. Fresh Look ask 9 - whether to print the trend in the companion; if yes, a source.
  - **Decision:** OPEN - Alex
- `datacenter.value_per_gw_immediate` - One gigawatt of campus is worth $27-59M to InventWood in immediate skins at $19/sf realized interior price (or $35-78M at the $25/sf exterior context price). Candidate value: $27-59M at $19/sf (1.4-3.1M sf); $35-78M at $25/sf. Alex to confirm the price basis for data center skins and for SuperMill Two structural ($/sf or $/t; realized or roadmap) and whether to print dollars per GW (ask 1). Medium term 16-65 kt x [$/t at SuperMill Two] also open.
  - **Decision:** OPEN - Alex
- `datacenter.qualification_program_scope` - Lab, budget, scope and owner for the E119 / NFPA 285 / UL 94 / STC test programs. Candidate value: *null*. Register-only; per datacenter.no_approvals_standards_detail none of this prints. Backplanes need a UL 94 yellow card before an electrical room.
  - **Decision:** OPEN - Alex
- `financing.safe_close_date` - SAFE round close date. Candidate value: *null*. 
  - **Decision:** OPEN - Alex
- `financing.safe_minimum_check` - SAFE minimum check size. Candidate value: *null*. 
  - **Decision:** OPEN - Alex
- `financing.investors_individual` - Individual investor biographies (Rockwell, McGlashan, Ganz, Sansone, Bosa, Koerner, Sant, Stotmeister). Candidate value: John Rockwell (Element Partners, $800M VC/PE - unverified M); Bill McGlashan (TPG Growth / TPG Rise - published H; keep/remove OPEN); Suzy Ganz (Lion Brothers ~$65M revenue, 450 employees, sold to Avery Dennison 2023; Baltimore Fed branch chair - triangulated M; OPEN vs restoring Scott Jacobs); Nick Sansone (Sansone Group "#5-ranked" - unverified L, NEEDS SOURCE); Colin Bosa (co-founder Axiom; CEO Bosa Properties - published M); Koerner, Sant, Stotmeister (unverified M). OPEN DECISIONS - (a) McGlashan - Jon Strimling's written feedback recommends removing him; the 2026-08-22 Granola call says fine to keep. (b) Ganz - the Granola call prefers restoring Scott Jacobs in her place. Bosa corrected 2026-08-24 - Paul Bosa (nephew) is CEO of Axiom. Sansone ranking has no publisher - source or soften. Re-capture Ganz source URLs.
  - **Decision:** OPEN - Alex
