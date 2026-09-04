# analyses/

- `materials-mass-and-replacement.xlsx` — live model (Inputs → Derived → Mass build-up → Carbon). Yellow cells are inputs.
- `materials-mass-and-replacement.md` — narrative; every table is generated from the workbook.
- `mass-buildup-and-replacement.png` — the two-panel chart used in the narrative.

Regeneration (scripts in this folder; run with a Python 3.12 venv holding openpyxl, pycel, matplotlib, lxml):
1. `build_model.py` writes the workbook with formulas.
2. `gen_md.py` evaluates it with pycel, writes the chart and the Markdown.
3. A post-process embeds computed values beside every formula (openpyxl writes none), so Drive preview and QuickLook show numbers. Excel recalculates on open regardless.
