# Stats Mix Percent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The /stats Devices & formats card hides `unknown` rows and shows a percent next to each count, computed over the visible (non-unknown) sessions only. Spec: `docs/superpowers/specs/2026-08-15-stats-mix-percent-design.md`. GitHub issue #9.

**Architecture:** Display-only: three edits in `stats.html` (the `renderDevices()` function and two CSS rules). `api/stats.mjs` keeps returning `unknown` in all mixes.

**Tech Stack:** Vanilla JS/CSS in `stats.html`. No test framework — verification is grep checks plus a live deploy curl.

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod` in one shell command; expect `Aliased https://sw.inventwood.net`, never `decks-*`.
- Paths relative to `superwood-presentation/`.
- `stats.html` contains a ~57KB single line (world-map SVG path) — anchor edits by unique content strings, never print that line.
- `api/stats.mjs`, tracker, roster device lines, other charts: untouched.
- Commit message: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Filter unknown, add percents, deploy

**Files:**
- Modify: `stats.html`

**Interfaces:**
- Consumes: `DATA.deviceMix`/`DATA.formatMix`/`DATA.breakMix` (`[{key, sessions}]`) and `DATA.totalSessions` — unchanged API shape.
- Produces: user-visible change; closes issue #9.

- [ ] **Step 1: Replace the `renderDevices` function body**

In `stats.html`, replace the entire existing `renderDevices` function (it currently builds `list` from the three mixes, assigns `.hbar unk` classes, and sets the subtitle from `DATA.totalSessions` alone) with:

```js
function renderDevices(){
  const box=document.getElementById('c-mix');box.textContent='';
  const src=mixTab==='fmt'?(DATA.formatMix||[]):mixTab==='brk'?(DATA.breakMix||[]):(DATA.deviceMix||[]);
  const list=src.filter(r=>r.key!=='unknown');
  const total=list.reduce((a,r)=>a+r.sessions,0);
  const max=Math.max(1,...list.map(r=>r.sessions));
  list.forEach(r=>{
    const row=document.createElement('div');row.className='hbar';
    const lab=document.createElement('div');lab.className='lab';lab.textContent=r.key;row.append(lab);
    const trk=document.createElement('div');trk.className='trk';
    const fill=document.createElement('div');fill.className='fill';fill.style.width=(r.sessions/max*100)+'%';trk.append(fill);row.append(trk);
    const n=document.createElement('div');n.className='n';n.textContent=r.sessions+' · '+Math.round(r.sessions/total*100)+'%';row.append(n);
    box.append(row);
  });
  if(!list.length){const d=document.createElement('div');d.className='hbar';d.textContent='no data yet';d.style.color='var(--muted)';box.append(d);}
  const subs={dev:'sessions by device',fmt:'sessions by screen format',brk:'sessions by closest deck breakpoint'};
  document.getElementById('devsub').textContent=subs[mixTab]+' · '+total+' of '+(DATA.totalSessions||0)+' visits';
}
```

(Leave the `let mixTab='dev';` line above it and the `devtabs` click listener below it untouched. Note `total` can't divide by zero: the `forEach` body only runs when `list` is non-empty, and any non-empty list has `sessions ≥ 1`.)

- [ ] **Step 2: CSS — widen the number column, drop the dead unk rule**

In the `<style>` block:

Change:
```css
.hbar .n{flex:none;width:30px;color:var(--muted);font-variant-numeric:tabular-nums}
```
to:
```css
.hbar .n{flex:none;width:64px;color:var(--muted);font-variant-numeric:tabular-nums}
```

Delete the now-unused rule:
```css
.hbar.unk .fill{background:rgba(157,141,118,.55)}
```

- [ ] **Step 3: Static verification**

```bash
cd superwood-presentation && grep -c "hbar.unk\|hbar'+(r.key" stats.html; true; grep -c "r.key!=='unknown'" stats.html; grep -c "width:64px" stats.html; grep -c "' of '" stats.html
```

Expected, in order: `0` (no unk class rule or conditional class assignment left), `1` (the filter), `1` (widened column), `1` (the "N of M visits" subtitle concatenation).

- [ ] **Step 4: Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then (the page is gated — mint a cookie exactly as before: `vercel env pull --environment=production .env.check --scope inventwood`, extract `AUTH_SECRET`, `rm .env.check`, build `sw_auth=<base64url(email)>.<expiry-ms>.<hmacSHA256hex>` via Node `createHmac`, pass as `-H "Cookie: ..."`):

```bash
curl -s -H "Cookie: $COOKIE" https://sw.inventwood.net/stats.html | grep -c "r.key!=='unknown'"
```

Expected: `1` — the filter is live.

- [ ] **Step 5: Commit and close**

```bash
git add superwood-presentation/stats.html && \
git commit -m "Devices card: hide unknown rows, show percents

Closes #9

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
