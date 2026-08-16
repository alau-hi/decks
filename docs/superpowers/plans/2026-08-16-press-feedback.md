# Press Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Alex's /press feedback: larger article titles, stat tiles gone, whole entries clickable. Spec: `docs/superpowers/specs/2026-08-16-press-feedback-design.md`. GitHub issue #11.

**Architecture:** All edits in `press.html`: one CSS size bump, one markup+CSS+script-block deletion, one appended click handler + two CSS rules.

**Tech Stack:** Static HTML/CSS/vanilla JS. Verification: grep + live curl (the page is ungated — no cookie needed).

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod`; expect `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- Paths relative to `superwood-presentation/`. Only `press.html` changes.
- The 48 `li.article` entries, tier sections, search/filter controls, foundational block, and footnote markup must be byte-identical before/after (verify via grep counts).
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Apply the three edits, deploy

**Files:**
- Modify: `press.html`

- [ ] **Step 1: Larger titles**

Change:
```css
.a-headline{display:block;font-size:.95rem;font-weight:500;color:var(--cream);text-decoration:none;line-height:1.4}
```
to:
```css
.a-headline{display:block;font-size:1.15rem;font-weight:500;color:var(--cream);text-decoration:none;line-height:1.35}
```

- [ ] **Step 2: Remove the stat tiles**

Three deletions:

(a) Markup — delete this entire block (between the masthead's closing `</header>` and `<div class="controls">`):
```html
  <div class="stats">
    <div class="stat"><div class="stat-num" id="stat-total">—</div><div class="stat-label">Items Listed</div></div>
    <div class="stat"><div class="stat-num" id="stat-tier1">—</div><div class="stat-label">Tier-1 Outlets</div></div>
    <div class="stat"><div class="stat-num" id="stat-trade">—</div><div class="stat-label">Trade &amp; Industry</div></div>
    <div class="stat"><div class="stat-num" id="stat-video">—</div><div class="stat-label">Video Features</div></div>
  </div>
```

(b) CSS — delete these four rules and the stats media rule:
```css
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:26px 0 18px}
@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{border:1px solid var(--line);border-radius:10px;padding:14px 16px;background:rgba(244,236,223,.02)}
.stat-num{font-family:'Fraunces',serif;font-size:1.7rem;color:var(--wood-bright)}
.stat-label{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:4px}
```
(Adjust `.controls` top margin so spacing stays sane: `margin:0 0 6px` → `margin:26px 0 6px`.)

(c) Script — inside the IIFE, delete the populate-stats block (these exact lines):
```js
  // Populate stats
  const total = articles.length;
  const tier1 = document.querySelectorAll('.article[data-tier="tier1"]').length;
  const tier2 = document.querySelectorAll('.article[data-tier="tier2"]').length;
  const video = document.querySelectorAll('.article[data-tier="video"]').length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-tier1').textContent = tier1;
  document.getElementById('stat-trade').textContent = tier2;
  document.getElementById('stat-video').textContent = video;
```
Everything else in the script stays byte-identical.

- [ ] **Step 3: Whole-row click**

(a) CSS — change:
```css
.article{display:grid;grid-template-columns:2.2rem 1fr auto auto;gap:14px;align-items:baseline;padding:16px 4px;border-bottom:1px solid var(--grid)}
```
to:
```css
.article{display:grid;grid-template-columns:2.2rem 1fr auto auto;gap:14px;align-items:baseline;padding:16px 4px;border-bottom:1px solid var(--grid);cursor:pointer}
.article:hover{background:rgba(244,236,223,.03)}
```

(b) Script — append inside the IIFE, directly before the closing `})();`:
```js
  // Whole-row click opens the article (native links and text selection win).
  document.querySelectorAll('.articles').forEach(list => {
    list.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const row = e.target.closest('.article');
      if (!row) return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      const link = row.querySelector('.a-headline');
      if (link) window.open(link.href, '_blank', 'noopener');
    });
  });
```

- [ ] **Step 4: Static verification**

```bash
cd superwood-presentation && grep -c 'class="article"' press.html; grep -c "stat-total\|stat-tier1\|stat-trade\|stat-video\|class=\"stats\"\|\.stat-num\|\.stat-label\|\.stats{" press.html; true; grep -c "font-size:1.15rem" press.html; grep -c "Whole-row click" press.html; grep -c "applyFilters" press.html
```

Expected, in order: `48`, `0`, `1`, `1`, `3` (the filter function definition, its call in the buttons handler, and the search listener — same 3 as before the edit; confirms the script survived).

- [ ] **Step 5: Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then (no cookie needed — /press is ungated):

```bash
curl -s https://sw.inventwood.net/press | grep -c 'class="article"' && curl -s https://sw.inventwood.net/press | grep -c "stat-total" && curl -s https://sw.inventwood.net/press | grep -c "Whole-row click"
```

Expected: `48`, `0`, `1`.

- [ ] **Step 6: Commit and close**

```bash
git add superwood-presentation/press.html && \
git commit -m "Press page: larger titles, drop stat tiles, whole-row click

Closes #11

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
