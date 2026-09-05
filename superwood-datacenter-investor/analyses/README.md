# analyses/

- `materials-mass-and-replacement.xlsx` — live model (Inputs → Derived → 1 GW data center, with per-row embodied carbon in columns X–AB → Carbon by horizon → Steel share of above-ground mass). Yellow cells are inputs.
- `steel-share-above-ground.md` — narrative for the steel-share estimate behind the deck's 50–80% headline; the numbers now live on the *Steel share* sheet.
- `materials-mass-and-replacement.md` — narrative; every table is generated from the workbook.
- `mass-buildup-and-replacement.png` — the two-panel chart used in the narrative.

Regeneration (scripts in this folder; run with a Python 3.12 venv holding openpyxl, pycel, matplotlib, lxml; `build_model.py` writes `model_rows.json`, which `gen_md.py` reads):
1. `build_model.py` writes the workbook with formulas.
2. `gen_md.py` evaluates it with pycel, writes the chart and the Markdown.
3. openpyxl writes formulas without cached values, so Drive preview and QuickLook show blanks until Excel or Numbers recalculates on open; `gen_md.py` evaluates the same formulas with pycel for the narrative.
