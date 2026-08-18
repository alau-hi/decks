# Press Controls Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Search input on its own full-width row; all seven filter buttons on one line. Spec: `docs/superpowers/specs/2026-08-18-press-controls-layout-design.md`. GitHub issue #15.

**Architecture:** One CSS value change in `press.html`.

**Tech Stack:** Static CSS. Verification: grep + live curl (/press is ungated).

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod`; expect `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- Only `press.html` changes; this one CSS value only — no markup, label, padding, or media-query edits.
- Run git from the repo root (shell cwd persists).
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Widen the search field, deploy

**Files:**
- Modify: `press.html`

- [ ] **Step 1: Edit the `.search` flex value**

Change:
```css
.search{flex:1 1 240px;padding:10px 14px;background:rgba(244,236,223,.04);border:1px solid var(--line);border-radius:8px;color:var(--cream);font-family:'Inter',sans-serif;font-size:.85rem;outline:none}
```
to:
```css
.search{flex:1 1 100%;padding:10px 14px;background:rgba(244,236,223,.04);border:1px solid var(--line);border-radius:8px;color:var(--cream);font-family:'Inter',sans-serif;font-size:.85rem;outline:none}
```

- [ ] **Step 2: Static verification**

```bash
cd superwood-presentation && grep -c "flex:1 1 100%" press.html; grep -c "flex:1 1 240px" press.html; grep -c 'class="article"' press.html
```

Expected: `1`, `0`, `48`.

- [ ] **Step 3: Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then:

```bash
curl -s https://sw.inventwood.net/press | grep -c "flex:1 1 100%"
```

Expected: `1`.

- [ ] **Step 4: Commit and close**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/press.html && \
git commit -m "Press page: search on its own row so buttons fit one line

Closes #15

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
