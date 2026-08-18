# Press Tweaks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the back-to-deck row on /press and rename the three tier filter buttons to Mainstream / Industry / International. Spec: `docs/superpowers/specs/2026-08-18-press-remove-backlink-design.md`. GitHub issue #14.

**Architecture:** One markup deletion, three CSS-rule deletions, three button-label edits — all in `press.html`.

**Tech Stack:** Static HTML/CSS. Verification: grep + live curl (/press is ungated).

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod`; expect `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- Only `press.html` changes. `data-filter` attribute values and the filter script must remain byte-identical.
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Apply both edits, deploy

**Files:**
- Modify: `press.html`

- [ ] **Step 1: Delete the back row markup**

Delete this entire block (between `<div class="pc-root">` and `<header class="masthead">`), including its surrounding blank lines collapsing to one:

```html
  <div class="backrow">
    <span>InventWood — SUPERWOOD</span>
    <a href="/intro">← Back to the deck</a>
  </div>
```

- [ ] **Step 2: Delete the back row CSS**

Delete these three rules (consecutive lines in the `<style>` block):

```css
.backrow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:30px;font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
.backrow a{color:var(--cream-dim);text-decoration:none;letter-spacing:.12em;font-size:.72rem;text-transform:none}
.backrow a:hover{color:var(--cream)}
```

No spacing compensation — `.pc-root{...padding:6vh 5vw 60px}` stays as is.

- [ ] **Step 3: Rename the three tier buttons**

Change:
```html
    <button class="filter-btn" data-filter="tier1">Tier 1</button>
    <button class="filter-btn" data-filter="tier2">Tier 2</button>
    <button class="filter-btn" data-filter="tier3">Tier 3</button>
```
to:
```html
    <button class="filter-btn" data-filter="tier1">Mainstream</button>
    <button class="filter-btn" data-filter="tier2">Industry</button>
    <button class="filter-btn" data-filter="tier3">International</button>
```

Label text only — the `data-filter` values are load-bearing (the filter script keys off them) and must not change. The other four buttons (`all`, `video`, `2025`, `2026`) stay untouched.

- [ ] **Step 4: Static verification**

```bash
cd superwood-presentation && grep -c "backrow" press.html; grep -c "Back to the deck" press.html; grep -c '>Mainstream<' press.html; grep -c '>Industry<' press.html; grep -c '>International<' press.html; grep -c 'data-filter="tier1"' press.html; grep -c 'class="article"' press.html; grep -c "applyFilters" press.html
```

Expected, in order: `0`, `0`, `1`, `1`, `1`, `1`, `48`, `3`.

- [ ] **Step 5: Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then (no cookie needed — /press is ungated):

```bash
curl -s https://sw.inventwood.net/press | grep -c "backrow"; curl -s https://sw.inventwood.net/press | grep -c '>International<'; curl -s https://sw.inventwood.net/press | grep -c 'class="article"'
```

Expected: `0`, `1`, `48`.

- [ ] **Step 6: Commit and close**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/press.html && \
git commit -m "Press page: drop back-to-deck row, rename tier buttons

Closes #14

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
