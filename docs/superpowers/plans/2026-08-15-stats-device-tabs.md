# Stats Device Card Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The `/stats` "Devices & formats" card becomes tabbed — **Devices | Formats | Breaks** — one list at a time, with the new Breaks view showing the closest deck media-query tier each session used. Spec: `docs/superpowers/specs/2026-08-15-stats-device-tabs-design.md`. GitHub issue #7.

**Architecture:** `api/stats.mjs` gains a pure `breakBucket(scr, cls)` and a `breakMix` response field (tier-ordered), computed in the existing dwell loop from already-captured `scr` data — fully retroactive, no tracker changes. `stats.html` swaps the card's two-column `devgrid` for a tab strip plus a single list container reusing the existing `.hbar` rows.

**Tech Stack:** Plain ES modules on Vercel serverless (`api/stats.mjs`), vanilla JS/HTML/CSS (`stats.html`). No test framework: tests are temporary Node harness scripts run with `node`, deleted before commit.

## Global Constraints

- **Never run `vercel` from the repo root.** All deploys: `cd superwood-presentation && npm run deploy:prod` in one shell command.
- No new npm dependencies; no chart libraries.
- All paths below are relative to `superwood-presentation/` unless they start with `docs/`.
- Reuse CSS custom properties from `:root` (`--wood`, `--wood-deep`, `--muted`, `--line`, `--cream`, `--cream-dim`); no new hardcoded colors.
- The desktop label is exactly **`Desktop (no break)`** (user-specified wording).
- `stats.html` line 114 area contains a ~57KB single line (embedded world-map SVG path) — never print or read that whole line; anchor edits by unique content strings.
- Tracker (`index.html`), `api/track.mjs`, dwell blobs, other charts/map/roster: untouched.
- Commit messages: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: `breakBucket` + `breakMix` in the stats API

**Files:**
- Modify: `api/stats.mjs`
- Test: `check-break.mjs` (temporary harness at `superwood-presentation/check-break.mjs`, deleted before commit)

**Interfaces:**
- Consumes: dwell records with optional `scr` (`{w,h,sw,sh,dpr,o}`) and the existing `deviceFromUa(ua) -> {cls, os}` (`cls` ∈ `phone|tablet|desktop|unknown`), both already in `api/stats.mjs`.
- Produces: exported `breakBucket(scr, cls) -> '≤560'|'≤700'|'≤820'|'≤900'|'≤980'|'≤1080'|'>1080'|'Desktop (no break)'|'unknown'`; API response gains `breakMix: [{key, sessions}]` sorted in tier order (ladder, then `Desktop (no break)`, then `unknown`; zero-session tiers omitted). Task 2 renders `DATA.breakMix` exactly.

- [ ] **Step 1: Write the failing harness test**

Create `superwood-presentation/check-break.mjs`:

```js
// Temporary verification harness — run: node check-break.mjs
import { breakBucket } from './api/stats.mjs';

let fail = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
  if (!ok) fail++;
}

check('iPhone portrait 390w', breakBucket({ w: 390, h: 844 }, 'phone'), '≤560');
check('exact boundary 560', breakBucket({ w: 560, h: 800 }, 'phone'), '≤560');
check('just past boundary 561', breakBucket({ w: 561, h: 800 }, 'phone'), '≤700');
check('phone landscape 844w', breakBucket({ w: 844, h: 390 }, 'phone'), '≤900');
check('tablet 1024w', breakBucket({ w: 1024, h: 1366 }, 'tablet'), '≤1080');
check('tablet beyond ladder 1366w', breakBucket({ w: 1366, h: 1024 }, 'tablet'), '>1080');
check('desktop never buckets', breakBucket({ w: 390, h: 844 }, 'desktop'), 'Desktop (no break)');
check('unknown cls treated as desktop', breakBucket({ w: 390, h: 844 }, 'unknown'), 'Desktop (no break)');
check('no scr is unknown', breakBucket(undefined, 'phone'), 'unknown');
check('scr without w is unknown', breakBucket({ h: 844 }, 'phone'), 'unknown');

process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd superwood-presentation && node check-break.mjs`
Expected: FAIL — `SyntaxError: ... does not provide an export named 'breakBucket'`

- [ ] **Step 3: Implement `breakBucket` in `api/stats.mjs`**

Insert directly after the existing `formatBucket` function's closing brace:

```js
// Closest deck media tier for a session. The deck's width queries are all
// pointer:coarse-gated, so only touch sessions (phone/tablet) ever bucket;
// desktop windows get the base layout regardless of width.
const BREAKS = [560, 700, 820, 900, 980, 1080];
const BREAK_ORDER = ['≤560', '≤700', '≤820', '≤900', '≤980', '≤1080', '>1080', 'Desktop (no break)', 'unknown'];
export function breakBucket(scr, cls) {
  if (!scr || !scr.w) return 'unknown';
  if (cls !== 'phone' && cls !== 'tablet') return 'Desktop (no break)';
  const b = BREAKS.find(x => scr.w <= x);
  return b ? `≤${b}` : '>1080';
}
```

- [ ] **Step 4: Run harness to verify it passes**

Run: `cd superwood-presentation && node check-break.mjs`
Expected: 10× PASS, exit 0.

- [ ] **Step 5: Wire `breakMix` into the handler**

Three edits inside `handler`:

(a) The Map declaration line (currently `const deviceMix = new Map(), formatMix = new Map();`) becomes:

```js
  const deviceMix = new Map(), formatMix = new Map(), breakMix = new Map();
```

(b) In the dwells loop, directly after `bump(formatMix, formatBucket(d.scr, dev.cls));` add:

```js
    bump(breakMix, breakBucket(d.scr, dev.cls));
```

(c) In the response object, after the `formatMix:` line, add (tier order, not count order):

```js
    breakMix: [...breakMix].map(([key, sessions]) => ({ key, sessions })).sort((a, b) => BREAK_ORDER.indexOf(a.key) - BREAK_ORDER.indexOf(b.key)),
```

And in the storage-less early return (the `res.status(200).json({ generatedAt: ..., deviceMix: [], formatMix: [] })` line), append `breakMix: []` so the empty shape stays consistent.

- [ ] **Step 6: Verify harness still passes and module imports**

Run: `cd superwood-presentation && node check-break.mjs && node --input-type=module -e "import('./api/stats.mjs').then(()=>console.log('stats.mjs imports OK'))"`
Expected: 10× PASS then `stats.mjs imports OK`.

- [ ] **Step 7: Delete the harness and commit**

```bash
cd superwood-presentation && rm check-break.mjs && cd .. && \
git add superwood-presentation/api/stats.mjs && \
git commit -m "Stats API: breakMix — closest deck breakpoint per session

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Tab the card, deploy, verify

**Files:**
- Modify: `stats.html` (card markup, CSS, `renderDevices`)
- Verify live: production deploy + curl

**Interfaces:**
- Consumes: `DATA.deviceMix` / `DATA.formatMix` / `DATA.breakMix` (`[{key, sessions}]`; breakMix from Task 1, already tier-sorted server-side — render in given order).
- Produces: user-visible feature; closes issue #7.

- [ ] **Step 1: Replace the card's two-column markup with tabs**

In `stats.html`, find the `devcard` block:

```html
      <div class="devgrid">
        <div id="c-dev"></div>
        <div id="c-fmt"></div>
      </div>
```

and replace it with:

```html
      <div class="devtabs" id="devtabs">
        <button class="dtab sel" data-tab="dev">Devices</button>
        <button class="dtab" data-tab="fmt">Formats</button>
        <button class="dtab" data-tab="brk">Breaks</button>
      </div>
      <div id="c-mix" class="mixlist"></div>
```

- [ ] **Step 2: Swap the CSS**

Replace these two rules:

```css
.devgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px 28px}
@media(max-width:700px){.devgrid{grid-template-columns:1fr}}
```

with:

```css
.devtabs{display:flex;gap:8px;margin:0 0 12px}
.dtab{padding:6px 14px;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;background:transparent;border:1px solid var(--line);border-radius:8px;color:var(--cream-dim);cursor:pointer}
.dtab.sel{background:linear-gradient(135deg,var(--wood-deep),var(--wood));border-color:transparent;color:var(--cream)}
.mixlist{max-width:560px}
```

(The `.dtab` class selector out-specifies the page's global `button` element rule, so every visual property the global rule sets — padding, font-size, background, color — must be restated here, and is. The `.hbar` row rules stay untouched.)

- [ ] **Step 3: Rework `renderDevices` for tabs**

Replace the entire existing `renderDevices` function with:

```js
let mixTab='dev';
function renderDevices(){
  const box=document.getElementById('c-mix');box.textContent='';
  const list=mixTab==='fmt'?(DATA.formatMix||[]):mixTab==='brk'?(DATA.breakMix||[]):(DATA.deviceMix||[]);
  const max=Math.max(1,...list.map(r=>r.sessions));
  list.forEach(r=>{
    const row=document.createElement('div');row.className='hbar'+(r.key==='unknown'?' unk':'');
    const lab=document.createElement('div');lab.className='lab';lab.textContent=r.key;row.append(lab);
    const trk=document.createElement('div');trk.className='trk';
    const fill=document.createElement('div');fill.className='fill';fill.style.width=(r.sessions/max*100)+'%';trk.append(fill);row.append(trk);
    const n=document.createElement('div');n.className='n';n.textContent=r.sessions;row.append(n);
    box.append(row);
  });
  if(!list.length){const d=document.createElement('div');d.className='hbar';d.textContent='no data yet';d.style.color='var(--muted)';box.append(d);}
  const subs={dev:'sessions by device',fmt:'sessions by screen format',brk:'sessions by closest deck breakpoint'};
  document.getElementById('devsub').textContent=subs[mixTab]+' · '+(DATA.totalSessions||0)+' visits';
}
document.getElementById('devtabs').addEventListener('click',e=>{
  const b=e.target.closest('.dtab');if(!b)return;
  mixTab=b.dataset.tab;
  document.querySelectorAll('.dtab').forEach(t=>t.classList.toggle('sel',t===b));
  renderDevices();
});
```

(The `render(data)` call chain already ends with `renderDevices()` — unchanged. Tab clicks re-render from the in-memory `DATA`; Refresh re-fetches and lands on whichever tab is selected.)

- [ ] **Step 4: Static sanity check**

Run: `cd superwood-presentation && grep -c "devtabs\|c-mix\|breakMix" stats.html && grep -c "devgrid\|c-dev\b\|c-fmt" stats.html; true`
Expected: first count ≥ 4 (new markup + JS present), second count `0` (old two-column structure fully gone).

- [ ] **Step 5: Deploy to production**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: output contains `Aliased https://sw.inventwood.net` on project `superwood-presentation` (NOT `decks-*`). If it says "Failed to link alau-hi/decks" or aliases to `decks-*.vercel.app`, STOP — report BLOCKED.

- [ ] **Step 6: Live verification (no signup pollution)**

`/api/stats` sits behind the viewer gate, so mint a valid `sw_auth` cookie locally from the pulled `AUTH_SECRET` instead of logging in through `/api/enter` (which would write a signup record):

```bash
cd superwood-presentation && vercel env pull --environment=production .env.check --scope inventwood && \
KEY=$(grep '^STATS_KEY=' .env.check | cut -d'"' -f2) && \
SECRET=$(grep '^AUTH_SECRET=' .env.check | cut -d'"' -f2) && rm .env.check && \
COOKIE=$(node --input-type=module -e "
import { createHmac } from 'node:crypto';
const email='verify@inventwood.net';
const payload=Buffer.from(email,'utf8').toString('base64url')+'.'+(Date.now()+3600000);
const sig=createHmac('sha256',process.env.SECRET).update(payload).digest('hex');
console.log('sw_auth='+payload+'.'+sig);
" SECRET="$SECRET") && \
curl -s -H "Cookie: $COOKIE" "https://sw.inventwood.net/api/stats?key=$KEY" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log('breakMix',JSON.stringify(j.breakMix));console.log('deviceMix len',(j.deviceMix||[]).length);})"
```

Note: `node` doesn't read env assignments placed after the script argument — if `SECRET="$SECRET"` positioning trips it, use `SECRET="$SECRET" node --input-type=module -e "..."` (env prefix before the command). Expected: `breakMix` prints as an array — containing at least `{"key":"Desktop (no break)","sessions":N}` and/or `{"key":"unknown",...}` given existing data (phone tiers appear only if phone sessions with `scr` exist yet); `deviceMix len` ≥ 1. Then:

```bash
curl -s https://sw.inventwood.net/stats.html | grep -c "devtabs"
```

Expected: ≥2 (markup + JS listener), proving the new page is live. (`/stats.html` may 308-redirect under cleanUrls — if the count is 0, retry with `curl -sL` or `/stats`.)

- [ ] **Step 7: Commit and close the issue**

```bash
git add superwood-presentation/stats.html && \
git commit -m "Stats page: tabbed device card with Breaks view

Closes #7

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

(The push carries Task 1's commit too — expected.)
