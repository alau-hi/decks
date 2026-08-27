# References

Every source and piece of commentary behind [slides.html](slides.html), indexed by slide.
Maintained by hand alongside [sources/claims.yaml](sources/claims.yaml) — the register is the
authority on provenance and confidence; this document is the readable companion. Claims not
listed here (capex, EBITDA, ROE, deposits, cost roadmap, properties, team bios) inherit from
[../investor-overview/sources/claims.yaml](../investor-overview/sources/claims.yaml).

Deck narrative and slide-by-slide rationale: [STORY.md](STORY.md).

On-slide, sources live behind a **Sources button** at the bottom right of each data-heavy slide
(The Gap, Old Mills, Fast × Fast, Appendix) — click to open a panel listing the sources for that
slide's key data. This document is the fuller companion.

Last reconciled against the deck: **2026-08-26** (19 slides).

## 02 · The Gap

**Headline stat row** (3 stats):

| Stat | Printed | Source |
|---|---|---|
| **Steel** Imports | 20% | [AISI, "Steel Imports Down 12.6% in 2025" (Feb 2026)](https://www.steel.org/2026/02/steel-imports-down-12-6-in-2025/) — 18% of apparent consumption 2025, 23% in 2024. The 2025 fall is tariff-driven (Section 232: 25% Mar 2025, 50% Jun 2025). **Printed as 20% per Alex 2026-08-27** — the round midpoint of the 2024–25 pair, honest as a recent-period figure but not the 2025 number. Cite 18% with its year if a single year is ever named. |
| Primary **Aluminum** Imports | 85% | [Aluminum Association / Wittsend, "Powering Up American Aluminum" (May 2025)](https://www.aluminum.org/sites/default/files/2025-05/PoweringUpAluminum_WhitePaper_2025.pdf) ([local copy](sources/PoweringUpAluminum_WhitePaper_2025.pdf)) — US primary aluminum demand 4.4M t/yr against 683,500 t from the four remaining smelters → imports cover 84.5%. Same paper carries the 4-smelters-from-33-in-1980 figure, no longer printed as its own stat. **Label matters: this is primary (new) metal only** — see the correction note below. |
| Steel in a **Data Center** | 60% | Inherited from the investor-overview register (conf L — flagged there as unverified). |

#### Correction, 2026-08-26 — the aluminum stat was mislabeled

The deck printed "Aluminum met by imports — ~85%" and sourced it to the Aluminum
Association. Alex flagged it as a probable misread of the referenced document, and it was.

- **What the Association actually says at that number**: "recycled or 'secondary' production
  now accounts for ~85% of U.S.-made aluminum" ([aluminum.org/PowerUp](https://www.aluminum.org/PowerUp);
  the white paper phrases it "over 80% of total raw aluminum supply produced in the U.S. today").
  That is a *composition-of-domestic-output* statistic. It is close to the opposite of an import
  share — it describes what America **does** make. Checks out against USGS 2025e: 3,600 kt
  secondary vs 660 kt primary = 84.5% of domestic output.
- **The number the deck wanted, sourced properly**: US **primary** aluminum demand is 4.4M t/yr
  and the four remaining US smelters produce 683,500 t — so imports cover **84.5%** of the primary
  aluminum America uses ([PowerUp white paper](https://www.aluminum.org/sites/default/files/2025-05/PoweringUpAluminum_WhitePaper_2025.pdf),
  pp. 3, [local copy](sources/PoweringUpAluminum_WhitePaper_2025.pdf)) [derived from published, conf: H].
  The same paper states the gap as "around 4 million metric tons of raw (or unwrought) aluminum,"
  which reads ~90% on the same denominator — the honest band is **85–90%**, and ~85% (the
  conservative end) is what ships.
- **All aluminum, not just primary**: US net import reliance is **60%** of apparent consumption
  (2025e), 62% in 2024 ([USGS MCS 2026 — Aluminum](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-aluminum.pdf),
  [local copy](sources/mcs2026-aluminum.pdf)) [published, conf: H]. Recycling is the whole
  difference between 85% and 60%. Both figures now sit in the slide's Sources panel so the
  distinction is visible without leaving the deck.
  - *Basis warning*: MCS 2026 stopped netting exported scrap out of the calculation (its footnote
    3), so the same 2024 year reads 62% there and 47% in MCS 2025. Do not mix the two series.
- **Resolves an open question elsewhere**: `../investor-overview/REFERENCES.md` recorded on
  2026-08-24 that the 85% "COULD NOT BE SOURCED" and asked whether it referred to primary
  aluminum. It did. That deck's printed 60% (labeled as net import reliance) is correct as it
  stands — the two decks measure different things and are now both right.
- **Corroboration on the smelter count**: USGS MCS 2026 lists six US smelters in five States with
  Hawesville KY (2022) and New Madrid MO (2024) idled — four operating, matching the Association.
  The White House Section 232 proclamation (Feb 2025) gives 52% capacity utilization for 2024
  against the Association's 53%. Mt. Holly SC announced a >50,000 t/yr restart in Aug 2025 for
  mid-2026; recheck "four" after that.
- **Conflict left standing, not averaged**: the Association puts 2024 US scrap recovery "above
  5 million metric tons"; USGS puts aluminum recovered from *purchased* scrap at 3.6M t. Different
  scopes (the Association appears to include runaround/home scrap). Neither figure is printed.

**"Also imported" aside table** (bottom right):

| Row | Source |
|---|---|
| Titanium >95% | [USGS MCS 2024 — Titanium](https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-titanium.pdf) — sponge net import reliance >95% since 2021; record ~42,000 t imported 2023, 77–86% from Japan; majority of US titanium metal use is aerospace. USGS holds at >95% (not 100%) because one small electronic-grade sponge plant (~500 t/yr, Salt Lake City) still operates; Henderson NV idled 2020, Rowley UT idle since 2016. |
| Carbon fiber 66–86% | [ORNL/NREL 2016 (Das et al.)](https://docs.nrel.gov/docs/fy16osti/66071.pdf) ([local copy](sources/Pub61706.pdf)) — USITC data, imports met 66–86% of North American CF demand 2008–2012; 2012-vintage, and the HTS code bundles fiber with intermediates (share likely overstated) — caveat carried in the on-slide sources panel. |
| Cement ~22% | [USGS MCS 2025 — Cement](https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-cement.pdf) — net import reliance 22% of apparent consumption 2022–24e; ~25M t/yr imported, led by Turkey and Canada. |

**Per-stat footnotes** (moved under their own number, Alex 2026-08-27; the shared note line is gone):
aluminum carries "* Now on the federal Critical Minerals List" — [Federal Register, Nov 2025](https://www.federalregister.gov/documents/2025/11/07/2025-19813/final-2025-list-of-critical-minerals);
the data-center stat carries "* data center developers flagging structural steel shortages" (inherited, conf L).

**Sources panel** (the bottom-right Sources button) lists: AISI 2026 · Aluminum Association 2025 ·
USGS MCS 2025 Cement · USGS MCS 2024 Titanium · USGS MCS 2026 · ORNL/NREL 2016 · Lexington
Institute 2025 · Federal Register Nov 2025.

### Background notes — researched, register-only

- **Carbon fiber, current era** — no primary current-year series. Corroboration: ~30 kt/yr imports,
  ~40% of consumption (Astute Analytica, market-research grade); outside Hexcel, "most of the
  remaining critical aerospace carbon fiber market is served by Japanese firms"
  ([Lexington Institute, Apr 2025](https://lexingtoninstitute.org/american-advantage/)); aerospace-grade
  small-tow production "most concentrated in Japan," Toray dominant incl. the $6B Boeing 787 prepreg
  deal (ORNL/NREL); defense reliance on Japanese/European proprietary fibers and a GAO visibility gap
  ([Nandina REM, Oct 2025](https://www.nandinarem.com/post/carbon-fibre-a-core-us-defence-supply-chain-vulnerability)).
- **Critical minerals, broad trend** — imports exceeded half of apparent consumption for **54
  nonfuel mineral commodities in 2025 (100% reliant for 16)**, up from 46 (100% for 15) in 2024.
  [USGS MCS 2026](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf) vs MCS 2025, both quoted
  verbatim [conf: H]. On the Critical Minerals List basis: 13 at 100% plus 20 more at ≥50% — use
  one basis consistently if printed. (E&E News / Politico Pro covered the release Feb 9, 2026.)
- **Cement volume** — ~25M t/yr imported against ~110M t shipments (2022–24e), same USGS sheet. [conf: H]
- **Titanium sponge context** — all primary (new) titanium metal routes through sponge (Kroll
  process); mill products blend sponge with recycled scrap (US 2023: ~42 kt sponge + ~26 kt
  imported scrap; the split is withheld by USGS). ~90%+ of titanium mineral consumption goes to
  TiO2 pigment, not metal.

## 03 · Old Mills

Column cards, each fact tooltip-sourced on-slide:

- **~$4B Inola smelter (Century Aluminum / EGA JV)** — first US primary smelter since 1980;
  $500M DOE award; >1 GW continuous power; still waiting on a power deal.
  [US DOE (2025)](https://www.energy.gov/articles/energy-department-awardee-build-first-american-aluminum-smelter-1980) ·
  [Canary Media (2026)](https://www.canarymedia.com/articles/clean-aluminum/americas-new-aluminum-smelter-needs-power)
- **Nucor Apple Grove sheet mill** — $4.0B, 2021→2027 announce-to-ship (mills repo comparison.csv; Nucor updates).
- **US mine development ~29 years** discovery-to-production, second-longest in the world —
  [S&P Global (Jul 2024)](https://press.spglobal.com/2024-07-18-United-States-Ranks-Next-to-Last-in-Development-Time-for-New-Mines-that-Produce-Critical-Minerals-for-Energy-Transition,-S-P-Global-Finds)
- **Power-driven closures** — Hawesville idled Jul 2022 ("soaring energy prices"), Ravenswood
  closed 2015, Mt. Holly halved 2015 —
  [Mining.com, "Power trumps tariffs…" (2026)](https://www.mining.com/web/column-power-trumps-tariffs-as-another-us-aluminum-smelter-shuts/)
- **Imported feedstock** — Inola runs on Guinean bauxite via the port of New Orleans; EGA (UAE
  state-owned) holds 60%. "Vertically integrated, an ocean away" is framing of this sourced
  supply chain.
- **Community pushback** — Oklahoma AG petition to block Inola (Rogers County District Court,
  Jun 2026): "A primary aluminum smelter does not belong in a community's backyard"; 3,400+
  petition signatures; unanimous Muscogee (Creek) Nation resolution; permitted >1 t/day hydrogen
  fluoride. [Oklahoma AG (2026)](https://oklahoma.gov/oag/news/newsroom/2026/june/drummond-files-action-to-block-inola-aluminum-smelter.html).
  Petition counts move — refresh before print use; HF figure should be verified against the air permit.
- Payoff line ("small enough to site easily, fast enough to scale to the need, using raw materials
  that continuously grow everywhere" — Alex's wording, 2026-08-27) — the siting/scaling contrast is
  the deck's own framing; feedstock ubiquity inherits the 48-states claim (register: unverified,
  conf L). "Continuously grow" is a renewability claim, not just an availability one, and is
  likewise unsourced framing rather than a registered number.

## 04 · SUPERMILLS

Unit economics ($300M capex, 65% EBITDA, 175–200% ROE, >7,000 SUPERMILLS of demand) —
all deck-canonical, inherited from the investor-overview register (internal model figures;
the >7,000 is estimated, conf L). On-slide note about separate financeability (~75% project
debt) and the repeatable template: internal framing.

## 05 · Fast × Fast

- **Mass-timber schedules 20–30% faster** than concrete and steel —
  [ULI Urban Land case-study reviews](https://urbanland.uli.org/development-business/faster-project-delivery-hidden-features-sustainable-mass-timber)
  (avg ~20% across seven case studies; other studies to 25–30%; 40% claims exist but are not
  used). SUPERWOOD is analogized to mass timber (prefab, light, timber detailing). [conf: triangulated]
- **Light site asks** — <4 MW grid draw at standard industrial service, process heat self-fueled
  by wood residues, no smelter-class emissions to permit (internal, consistent with FEL2 mass &
  energy balance; "no smelter-class emissions" is comparative — the residue boiler still needs a
  minor-source state air permit).
- **Long-lead equipment ~18 months; construction 6–12 months; <3 years develop + build** (Alex, 2026-08-25).
- **Excess sawmill capacity** — asserted (Alex, industry knowledge); plausible given 2023–25
  curtailments, but find a utilization figure before print use. [needs source]
- Feedstock in 48 states — inherited (register: unverified, conf L).

## 06 · Properties / 07 · Cost Roadmap / 08 · SuperMill One

All inherited from the investor-overview register (material properties, cost-curve assumptions,
plant status). New here: SuperMill One building is 90,000 sf, ramping to 1M sf/yr of capacity
(Alex, 2026-08-25). Cost Roadmap chart note spells out the price assumptions: structural-board
$15.00 / $5.50 / $3.00 per sf; ChipMill continuous at an assumed 60% gross margin ($2.19/sf);
7.2mm average board thickness conversion.

## 09 · Demand

15,000+ inquiries, 700+ paid deposits (canonical for this deck since 2026-08-25 — parent decks
still print 800+ and need aligning), $140M+ SuperMill One pipeline vs $20M capacity, $2.0B+
SuperMill Two pipeline vs $360M capacity ($320M projected) — all internal (CRM/model).
Path-to-structural: hybrid SUPERWOOD-glulam beams (~10% of section) add ~75% bending stiffness /
~100% bending strength (inherited, lab data); structural application engineering with Fast + Epp
and Don Davies (asserted — confirm the Fast + Epp engagement is public/citable before wide
distribution).

## 10 · Customers

Ported from the investor-overview Customers slide; logo wall and pipeline staging inherit from
the parent register (customer names and engagement stages are internal CRM facts). The 700+
reservations line matches this deck's canonical figure. On-slide commentary about focusing
execution on near-term opportunities: internal framing.

## 11 · Scaling / 12 · The Fleet

Capital flywheel ($900M free cash flow from <$200M corporate equity) and fleet economics —
internal model, inherited. Fleet slide commentary (JV structure: technology & setup fee,
operating fee, brand/marketing fee; modular construction; ChipMill continuous processing on
chips and waste) — internal strategy. Global demand potential >7,000 SUPERMILL TWO equivalents —
estimated, conf L ("a matter of time" framing per Alex).

## 13 · Team / 14 · Investors

Bios and investor descriptions inherit from the investor-overview register (several are flagged
unverified there — Element Partners $800M, Sansone #5 ranking). Shaun Klopfenstein is Head of AI
(was CIO) per Alex 2026-08-25.

## 15 · Journey

Timeline facts (2016–18 UMD invention by Dr. Liangbing Hu; 2018–22 IP & commercialization;
2022–25 SuperMill One built in Frederick MD, shipments Dec '25; SuperMill Two ships 2029) —
inherited from the parent register (Nature publication, patent portfolio, plant milestones).

## 16 · Financing

Valuation chart and milestones — internal cap-table facts and targets: $26M Series A · 2025
($62M post, plus $20M non-dilutive), $18M Series AA · 2026 ($129M post), $10M SAFEs now
($170–200M cap), Series B 2027 target $75–100M at $400–800M. Forward valuations are targets,
not commitments (the slide's chart labels them as such).

## 17 · The Opportunity

Terms (internal): $10M SAFE, issued by InventWood, $170–200M cap, open now. Use of proceeds is
deliberately prose, not a segmented bar — the workstreams overlap (production ramp informs
SuperMill Two engineering; customer engagement serves both). IP note: portfolio detail lives in
the data room; the deck states no patent counts.

## 19 · Appendix — Materials manufacturing comparison

Per-cell provenance and confidence live in the register (Economics/Appendix entries). Key sources:

- **Minimill** — SDI Sinton ($1.9B, 3.0 Mtpa, 2019–2022 build; SDI PR / BuildSteel); Nucor Apple
  Grove ($2.7B → ~$4.0B, 2021–2027); SDI per-ton EBITDA $197–411/t across the cycle
  (company-wide margin used as single-plant proxy — flag if challenged). EAF grid connection
  ~300 MVA-class, 200–300 MVA per furnace with severe flicker (Primetals / MHI Spectra / trade
  engineering sources).
- **Smelter** — Century/EGA Inola (~$4B, >1 GW, first metal ~end of decade);
  [Century Aluminum FY2025 results](https://centuryaluminum.com/investors/press-releases/press-release-details/2026/Century-Aluminum-Company-Reports-Fourth-Quarter-2025-Results/default.aspx)
  (net sales $2.5B, adj EBITDA $425M → ~17% record-year margin, tariff-supported; through-cycle
  margins swing to near-zero).
- **SUPERMILL** — internal TEM; $208M/yr plant EBITDA is 65% of $320M projected (projection, not
  actuals); develop+build <3 yrs (Alex). Do NOT print a specific SUPERMILL MW figure — the
  TEM-vs-FEL2 energy reconciliation is open; "MW-class" holds under either basis.
- **Unlevered cash yield** (EBITDA ÷ capex): SUPERMILL ~69% (model) · minimill ~15–30% at $4B ·
  smelter ~9% record year — arithmetic on the registered figures; bases labeled per cell on-slide.

## Open items

- Fast + Epp engagement — confirm public/citable before wide distribution.
- "Excess sawmill capacity" — needs a utilization figure.
- Inola HF permit figure — verify against the actual air permit before print use.
- Petition signature count — moves; refresh before print use.
- 4-vs-5 smelter count — four is the Aluminum Association figure; one source says five.
- ~60% steel share of a data center — inherited conf L, unverified.
- Parent decks (investor-overview, aaron-deck) still print 800+ deposits; this deck's canonical is 700+.
- Carbon fiber import tonnage — market-research only; find primary data before printing.
