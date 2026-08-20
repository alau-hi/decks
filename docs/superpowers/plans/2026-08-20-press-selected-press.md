# Selected Press Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trim the press-page header, rename the title to "Selected Press", drop the year filters, and correct article dates against their live source pages. Spec: `docs/superpowers/specs/2026-08-20-press-selected-press-design.md`. GitHub issue #16.

**Architecture:** Task 1 is three mechanical edits in `press.html` (commit, no deploy). Task 2 is controller-orchestrated: parallel research agents verify all 48 article dates via the live web, then an implementer applies the confirmed corrections, deploys once, and closes the issue. Unverifiable entries are reported to Shaun in chat, never guessed.

**Tech Stack:** Static HTML/JS; WebFetch-based research subagents. Verification: grep + live curl (/press is ungated).

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod`; expect `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- Only `press.html` changes across both tasks.
- Date edits change only `.a-date` text (and the same entry's `data-year` when the year moved). A date may be changed only on a confirmed source-page date; no guesses.
- The 48 `li.article` entries' other content (headlines, notes, URLs, tiers) must be byte-identical throughout.
- Run git from the repo root (shell cwd persists).
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Header trim, rename, year filters out

**Files:**
- Modify: `press.html`

- [ ] **Step 1: Delete the kicker**

Delete the markup line:
```html
    <div class="kicker">InventWood × Superwood</div>
```
and the CSS rule:
```css
.kicker{font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--wood-bright);margin-bottom:12px}
```

- [ ] **Step 2: Rename the title**

Change:
```html
    <h1 class="title">Press Coverage Dossier</h1>
```
to:
```html
    <h1 class="title">Selected Press</h1>
```
The `<title>` tag ("In the Press — InventWood") stays unchanged.

- [ ] **Step 3: Remove the year filters**

Delete the two buttons:
```html
    <button class="filter-btn" data-filter="2025">2025</button>
    <button class="filter-btn" data-filter="2026">2026</button>
```
and the two dead lines in the script's `applyFilters`:
```js
      if (activeFilter === '2025' && year !== '2025') visible = false;
      if (activeFilter === '2026' && year !== '2026') visible = false;
```
Leave `const year = a.dataset.year;` and all `data-year` attributes in place.

- [ ] **Step 4: Static verification**

```bash
cd superwood-presentation && grep -c "kicker" press.html; grep -c "Press Coverage Dossier" press.html; grep -c ">Selected Press<" press.html; grep -c 'data-filter="2025"\|data-filter="2026"' press.html; grep -c "activeFilter === '2025'\|activeFilter === '2026'" press.html; grep -c 'class="article"' press.html; grep -c "applyFilters" press.html
```

Expected, in order: `0`, `0`, `1`, `0`, `0`, `48`, `3`.

- [ ] **Step 5: Commit (no deploy — Task 2 deploys once for both)**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/press.html && \
git commit -m "Press page: Selected Press title, trim header, drop year filters

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

---

### Task 2: Validate and correct article dates

**Interfaces:**
- Consumes: Task 1's committed `press.html` (48 entries unchanged by Task 1).
- Produces: corrected `.a-date`/`data-year` values, one production deploy, chat report of unverifiables.

- [ ] **Step 1 (controller): Extract the entry inventory**

From `press.html`, build a work file listing all 48 entries: index, outlet, headline, `.a-headline` URL, current `.a-date` text, current `data-year`. Store under the plan's SDD workspace.

- [ ] **Step 2 (controller): Parallel research fan-out**

Dispatch 4 parallel read-only research agents (general-purpose, sonnet), each owning ~12 entries. Each agent, per URL, uses WebFetch (and WebSearch as fallback for obvious blocks) to find the publication date from the page itself: article byline, `article:published_time`/JSON-LD meta, or YouTube upload date. Each returns one line per entry:
`<index> | VERIFIED <Mon D, YYYY or Mon YYYY> | <evidence source>` or
`<index> | UNVERIFIABLE | <reason: paywall / 404 / homepage-link / no date found>`
A date counts as VERIFIED only if the page (or its metadata) states it; search-result snippets alone are corroboration, not proof. Dead links (404/redirect-to-home) are UNVERIFIABLE with reason even if the current date seems plausible.

- [ ] **Step 3 (controller): Build the corrections list**

Compare VERIFIED dates against current `.a-date` values. Mismatches (including precision upgrades, e.g. `Dec 2025` → `Dec 4, 2025`) become the corrections file: index, old date, new date, new `data-year` if changed. Entries already correct: no edit.

- [ ] **Step 4 (implementer): Apply corrections**

Edit `press.html` per the corrections file only — `.a-date` text and, where the year moved, that entry's `data-year`. Verify after: `grep -c 'class="article"'` = 48; each new date string present; no other diff lines beyond the corrected entries (`git diff --stat` shows press.html only).

- [ ] **Step 5 (implementer): Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```
Expected: `Aliased https://sw.inventwood.net`. Then:
```bash
curl -s https://sw.inventwood.net/press | grep -c ">Selected Press<"; curl -s https://sw.inventwood.net/press | grep -c 'class="article"'; curl -s https://sw.inventwood.net/press | grep -c 'data-filter="2025"'
```
Expected: `1`, `48`, `0`.

- [ ] **Step 6 (implementer): Commit and close**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/press.html && \
git commit -m "Press page: correct article dates against source pages

Closes #16

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
(If Step 3 produced zero corrections, skip the edit/commit, still deploy Task 1's changes, and close #16 via `gh issue close 16 --comment "No date corrections needed."`.)

- [ ] **Step 7 (controller): Report to Shaun in chat**

Final message lists every UNVERIFIABLE entry — outlet, headline, clickable URL, current date, reason — plus a summary of corrections applied. Follow-up manual corrections from Shaun are applied as a patch commit on request.
