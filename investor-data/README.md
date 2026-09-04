# investor-data - single source of truth for InventWood investor numbers

Master register for the **September 2026 SAFE round**. Every number, named entity or
attributed position that appears in any investor deck has exactly one entry here.

## The rule

**Every number in any investor deck traces to an id in `SAFE-2026-09.yaml`. Decks reference
ids; they never redefine values.** If a deck needs a figure that is not here, add the fact
here first (with basis, confidence and source), then reference it. If two decks disagree,
the disagreement is recorded here as a conflict and Alex decides once, for all decks.

## Files

| File | Role |
|---|---|
| `SAFE-2026-09.yaml` | The authority. Organized by fact, not by slide. Hand-edited. |
| `SAFE-2026-09.md` | Generated human-readable sheet, one table per group. |
| `CONFLICTS.md` | Generated. Every conflict cluster and every `status: open` fact, each with a `Decision:` line. |
| `build.py` | Validates the YAML (required fields, id uniqueness, allowed labels, dangling `conflicts_with`) and writes the two `.md` files. |
| `check_decks.py` | Matches each claim in the per-deck registers to a master id (`ref:` if present, else fuzzy) and prints what a human still has to link. Read-only on the registers. |

## Fact schema

```yaml
- id: carbon.superwood_manufacturing_kgco2e_per_kg   # stable dotted id, group.name
  value: 0.5                                          # null when not yet decided
  unit: kg CO2e / kg SUPERWOOD
  statement: one sentence a slide could print
  basis: internal | published | derived | triangulated | estimated | asserted-internal | unverified
  confidence: H | M | L                               # never upgraded from the source register
  confidence_label: M-H                               # optional - the source's exact label if not a plain letter
  source: who/what/when                               # url / url2 / url3 optional
  as_of: 2026-09-04
  decided_by: Alex Lau 2026-09-04                     # when a human decision pins the value
  status: canonical | superseded | retired | open
  printed_in: [investor-overview, super-mills-america, superwood-datacenter-investor]
  slides: {deck: [slide nav names]}                   # optional tracing
  notes: caveats, arithmetic, what not to do with it
  conflicts_with: [other.id]                          # optional
  conflict_topic: short title for CONFLICTS.md        # optional, one per cluster is enough
  decision: who decided what, when - or an explicit "OPEN - Alex ..."   # optional
```

Groups (id prefixes): `company team ip mills cost_price economics material process carbon
market feedstock customers datacenter financing advisors collaborators comparison`.

Conventions:
- Values are copied verbatim from the source registers. No invented numbers; unknown = `value: null`, `status: open`.
- `superseded` and `retired` facts stay in the file so the history is traceable; they must not print.
- Basis and confidence labels come from the source registers. When the two registers label the same
  fact differently, the lower confidence is kept and the other is noted.
- Where a source (Fresh Look, analyses) gave no confidence, the entry says so in `notes` and uses L or M conservatively.

## Add or change a fact

1. Edit `SAFE-2026-09.yaml`. New fact: pick the group, write a stable id, fill every field. Changed
   value: set the old entry to `status: superseded`, add the new one, `decided_by` with the date,
   and link them with `conflicts_with` if a deck still prints the old value.
2. Regenerate:
   ```
   cd /Users/test/Git/decks/investor-data
   python build.py          # validates, writes SAFE-2026-09.md and CONFLICTS.md
   python check_decks.py    # prints per-deck claims that still lack a ref (add --all to see every match)
   ```
   Needs Python 3 with `pyyaml` only.
3. Update the deck to print the id's value. Never edit the generated `.md` files.

## How per-deck registers adopt `ref:`

The per-deck registers (`../investor-overview/sources/claims.yaml`,
`../super-mills-america/sources/claims.yaml`) keep their own shape and slide mapping. Each claim
gains one field:

```yaml
- claim: 700+ paid online deposits
  ref: economics.deposits_paid
  slide: Running, Demand
```

`check_decks.py` then verifies the id exists. Until every claim has a `ref:`, the script's fuzzy
match suggests the best candidate; a score below 0.5 means a human should look. Once a claim has a
`ref:`, its value/basis/confidence fields in the per-deck register become redundant and can be
dropped - the master carries them. New decks should start with `ref:` on every claim.

Note: `../super-mills-america/sources/claims.yaml` is currently not valid YAML (line 551, an
unquoted `(model: ~$208M ...` colon inside a plain scalar). `check_decks.py` falls back to a
line-based reader for it; fix the quoting in that register when it is next edited.
