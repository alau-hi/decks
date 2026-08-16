# Press Tier Headers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tier section headers on /press read a full step larger than article titles. Spec: `docs/superpowers/specs/2026-08-16-press-tier-headers-design.md`. GitHub issue #12.

**Architecture:** Three CSS value changes in `press.html`.

**Tech Stack:** Static CSS. Verification: grep + live curl (/press is ungated).

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod`; expect `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- Only `press.html` changes; CSS values only, no markup or script edits.
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Bump the three values, deploy

**Files:**
- Modify: `press.html`

- [ ] **Step 1: Edit the three CSS rules**

Change:
```css
.tier{margin-top:40px}
```
to:
```css
.tier{margin-top:56px}
```

Change:
```css
.tier-num{font-family:'Fraunces',serif;font-size:1.5rem;color:var(--acc);min-width:1.6em}
```
to:
```css
.tier-num{font-family:'Fraunces',serif;font-size:1.8rem;color:var(--acc);min-width:1.6em}
```

Change:
```css
.tier-title{font-family:'Fraunces',serif;font-weight:500;font-size:1.15rem}
```
to:
```css
.tier-title{font-family:'Fraunces',serif;font-weight:500;font-size:1.5rem}
```

- [ ] **Step 2: Static verification**

```bash
cd superwood-presentation && grep -c "margin-top:56px" press.html; grep -c "font-size:1.8rem" press.html; grep -c ".tier-title{font-family:'Fraunces',serif;font-weight:500;font-size:1.5rem}" press.html; grep -c 'class="article"' press.html
```

Expected: `1`, `1`, `1`, `48`.

- [ ] **Step 3: Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then:

```bash
curl -s https://sw.inventwood.net/press | grep -c "font-size:1.8rem"
```

Expected: `1`.

- [ ] **Step 4: Commit and close**

```bash
git add superwood-presentation/press.html && \
git commit -m "Press page: larger tier headers, more section air

Closes #12

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
