# Stats Devices & Screen Formats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/stats` shows which devices (retroactively, from stored user-agents) and screen formats (forward-only, from a new `scr` beacon field) viewers use — per-viewer chips plus an aggregate breakdown. Spec: `docs/superpowers/specs/2026-08-15-stats-devices-design.md`. GitHub issue #6.

**Architecture:** The deck's tracker beacon gains a `scr` object (viewport/screen/dpr/orientation) stored on each dwell blob by `api/track.mjs`. `api/stats.mjs` derives device class/OS from the `ua` string already on every record and buckets screen formats, returning per-viewer `devices` plus top-level `deviceMix`/`formatMix`. `stats.html` renders a device line per roster row and a new "Devices & formats" card. No new endpoints, no dependencies.

**Tech Stack:** Plain ES modules on Vercel serverless (`api/*.mjs`), vanilla JS/HTML/CSS (`index.html`, `stats.html`), Vercel Blob storage. No test framework exists: tests are temporary Node harness scripts run with `node`, deleted before commit.

## Global Constraints

- **Never run `vercel` from the repo root.** All deploys: `cd superwood-presentation && npm run deploy:prod` in one shell command.
- No new npm dependencies; no chart libraries — hand-built HTML/SVG only.
- All file paths below are relative to `superwood-presentation/` unless they start with `docs/` or say repo root.
- Vercel custom events (`deck_open`, `section_view`) must keep ≤2 data properties — do not touch them.
- Reuse CSS custom properties from `:root` (`--wood`, `--muted`, `--grid`, `--cream-dim`, `--line`); no hardcoded colors.
- Commit messages: short imperative description + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Node ≥18 locally (`node --version` to confirm); `@vercel/blob` is already in `node_modules`, so `api/*.mjs` modules import cleanly in harnesses.

---

### Task 1: Capture and store `scr` (tracker beacon + track API)

**Files:**
- Modify: `index.html` (tracker script, ~lines 1410–1414: the `send()` function)
- Modify: `api/track.mjs` (add exported `cleanScr`, store `scr` on the record)
- Test: `check-scr.mjs` (temporary harness at `superwood-presentation/check-scr.mjs`, deleted before commit)

**Interfaces:**
- Consumes: existing beacon payload `{viewer, session, totals}`; existing dwell record shape in `api/track.mjs`.
- Produces: beacon payload gains `scr: {w,h,sw,sh,dpr,o} | null`; dwell blobs gain an optional `scr` field with that shape (`w`/`h` always present when `scr` exists; `sw`/`sh`/`dpr`/`o` optional). Exported `cleanScr(raw) -> object|null` from `api/track.mjs`. Task 2 reads `rec.scr` with exactly these key names.

- [ ] **Step 1: Write the failing harness test**

Create `superwood-presentation/check-scr.mjs`:

```js
// Temporary verification harness for cleanScr — run: node check-scr.mjs
import { cleanScr } from './api/track.mjs';

let fail = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
  if (!ok) fail++;
}

check('full valid object round-trips',
  cleanScr({ w: 390, h: 844, sw: 390, sh: 844, dpr: 3, o: 'p' }),
  { w: 390, h: 844, sw: 390, sh: 844, dpr: 3, o: 'p' });

check('numeric strings coerce',
  cleanScr({ w: '1512', h: '982', dpr: '2', o: 'l' }),
  { w: 1512, h: 982, dpr: 2, o: 'l' });

check('missing w rejects whole object',
  cleanScr({ h: 844, o: 'p' }),
  null);

check('null/absent rejects',
  cleanScr(undefined),
  null);

check('array rejects',
  cleanScr([390, 844]),
  null);

check('out-of-range values dropped, valid core kept',
  cleanScr({ w: 390, h: 844, sw: 999999, dpr: 40, o: 'x' }),
  { w: 390, h: 844 });

check('fractional dpr rounds to 2 places',
  cleanScr({ w: 800, h: 600, dpr: 1.3333333 }),
  { w: 800, h: 600, dpr: 1.33 });

process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd superwood-presentation && node check-scr.mjs`
Expected: FAIL — `SyntaxError: ... does not provide an export named 'cleanScr'`

- [ ] **Step 3: Implement `cleanScr` in `api/track.mjs`**

Add above the `export default` handler:

```js
// Screen/viewport capture from the deck tracker. Reject-don't-guess: a record
// with no usable viewport stores no scr at all.
export function cleanScr(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const dim = v => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) && n > 0 && n <= 20000 ? n : null;
  };
  const w = dim(raw.w), h = dim(raw.h), sw = dim(raw.sw), sh = dim(raw.sh);
  if (!w || !h) return null;
  const out = { w, h };
  if (sw) out.sw = sw;
  if (sh) out.sh = sh;
  const dpr = Number(raw.dpr);
  if (Number.isFinite(dpr) && dpr > 0 && dpr <= 10) out.dpr = Math.round(dpr * 100) / 100;
  if (raw.o === 'p' || raw.o === 'l') out.o = raw.o;
  return out;
}
```

Then wire it into the handler. Change the destructure line (currently line 30):

```js
  const { viewer, session, totals, scr } = req.body || {};
```

and in the `record` object insert one line after `totals: clean,`:

```js
    scr: cleanScr(scr) || undefined,
```

(`undefined` serializes away in `JSON.stringify`, so pre-existing record shape is unchanged when no `scr` arrives.)

- [ ] **Step 4: Run harness to verify it passes**

Run: `cd superwood-presentation && node check-scr.mjs`
Expected: 7× PASS, exit 0.

- [ ] **Step 5: Add `scr` to the beacon in `index.html`**

In the tracker script, insert a helper directly above `function send(){` (~line 1410):

```js
  function scrNow(){ try{ return { w:innerWidth, h:innerHeight, sw:screen.width, sh:screen.height, dpr:devicePixelRatio||1, o:matchMedia('(orientation: portrait)').matches?'p':'l' }; }catch(e){ return null; } }
```

and change the beacon line (~1413) to include it (read at send time so a rotated phone reports its latest state):

```js
    try{navigator.sendBeacon('/api/track',new Blob([JSON.stringify({viewer:viewer,session:session,totals:totals,scr:scrNow()})],{type:'application/json'}));}catch(e){}
```

- [ ] **Step 6: Sanity-check the deck locally**

Run: `cd superwood-presentation && node --input-type=module -e "import('./api/track.mjs').then(()=>console.log('track.mjs imports OK'))"`
Expected: `track.mjs imports OK`. (The beacon itself is verified live in Task 3's deploy check; `npm run dev` has no API routes.)

- [ ] **Step 7: Delete the harness and commit**

```bash
cd superwood-presentation && rm check-scr.mjs && cd .. && \
git add superwood-presentation/index.html superwood-presentation/api/track.mjs && \
git commit -m "Track viewport/screen/orientation on dwell beacons

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Derive devices and formats in `api/stats.mjs`

**Files:**
- Modify: `api/stats.mjs`
- Test: `check-device.mjs` (temporary harness at `superwood-presentation/check-device.mjs`, deleted before commit)

**Interfaces:**
- Consumes: dwell records with `ua` (string, may be `''`) and optional `scr` (`{w,h,sw,sh,dpr,o}`, from Task 1); signup records with `ua`.
- Produces: exports `deviceFromUa(ua) -> {cls, os}` (`cls` ∈ `phone|tablet|desktop|unknown`, `os` ∈ `iOS|Android|Mac|Windows|Linux|other`) and `formatBucket(scr, cls) -> 'phone-portrait'|'phone-landscape'|'tablet'|'laptop'|'desktop'|'unknown'`. API response gains top-level `deviceMix: [{key, sessions}]` and `formatMix: [{key, sessions}]` (sorted by sessions desc), and each viewer gains `devices: [{cls, os, scr, label, lastSeen}]` sorted most-recent-first. Task 3 renders exactly these names.

- [ ] **Step 1: Write the failing harness test**

Create `superwood-presentation/check-device.mjs`:

```js
// Temporary verification harness — run: node check-device.mjs
import { deviceFromUa, formatBucket } from './api/stats.mjs';

let fail = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
  if (!ok) fail++;
}

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
const ANDROID_PHONE = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const ANDROID_TAB = 'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const LINUX = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

check('iPhone', deviceFromUa(IPHONE), { cls: 'phone', os: 'iOS' });
check('iPad', deviceFromUa(IPAD), { cls: 'tablet', os: 'iOS' });
check('Android phone', deviceFromUa(ANDROID_PHONE), { cls: 'phone', os: 'Android' });
check('Android tablet (no Mobile token)', deviceFromUa(ANDROID_TAB), { cls: 'tablet', os: 'Android' });
check('Mac', deviceFromUa(MAC), { cls: 'desktop', os: 'Mac' });
check('Windows', deviceFromUa(WIN), { cls: 'desktop', os: 'Windows' });
check('Linux', deviceFromUa(LINUX), { cls: 'desktop', os: 'Linux' });
check('empty UA', deviceFromUa(''), { cls: 'unknown', os: 'other' });
check('undefined UA', deviceFromUa(undefined), { cls: 'unknown', os: 'other' });

check('phone portrait', formatBucket({ w: 390, h: 844, o: 'p' }, 'phone'), 'phone-portrait');
check('phone landscape by o', formatBucket({ w: 844, h: 390, o: 'l' }, 'phone'), 'phone-landscape');
check('phone landscape by dims when o absent', formatBucket({ w: 844, h: 390 }, 'phone'), 'phone-landscape');
check('tablet', formatBucket({ w: 1024, h: 1366, o: 'p' }, 'tablet'), 'tablet');
check('laptop under 1440', formatBucket({ w: 1280, h: 800 }, 'desktop'), 'laptop');
check('desktop at 1440', formatBucket({ w: 1440, h: 900 }, 'desktop'), 'desktop');
check('no scr is unknown', formatBucket(undefined, 'desktop'), 'unknown');
check('unknown cls with scr uses width rule', formatBucket({ w: 1512, h: 982 }, 'unknown'), 'desktop');

process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd superwood-presentation && node check-device.mjs`
Expected: FAIL — `SyntaxError: ... does not provide an export named 'deviceFromUa'`

- [ ] **Step 3: Implement the pure functions in `api/stats.mjs`**

Add below the `COUNTRY_CENTROIDS` block:

```js
// Device class + OS from a stored user-agent. Known accepted limitation:
// iPadOS 13+ presents a Mac UA, so modern iPads count as desktop·Mac.
export function deviceFromUa(ua) {
  const s = String(ua || '');
  if (/iPhone|iPod/.test(s)) return { cls: 'phone', os: 'iOS' };
  if (/iPad/.test(s)) return { cls: 'tablet', os: 'iOS' };
  if (/Android/.test(s)) return /Mobile/.test(s) ? { cls: 'phone', os: 'Android' } : { cls: 'tablet', os: 'Android' };
  if (/Macintosh/.test(s)) return { cls: 'desktop', os: 'Mac' };
  if (/Windows/.test(s)) return { cls: 'desktop', os: 'Windows' };
  if (/Linux|X11/.test(s)) return { cls: 'desktop', os: 'Linux' };
  return { cls: 'unknown', os: 'other' };
}

// Glanceable screen-format bucket. scr is forward-only (older sessions have
// none), so 'unknown' is a first-class bucket, never dropped.
export function formatBucket(scr, cls) {
  if (!scr || !scr.w || !scr.h) return 'unknown';
  if (cls === 'phone') return (scr.o === 'l' || scr.w > scr.h) ? 'phone-landscape' : 'phone-portrait';
  if (cls === 'tablet') return 'tablet';
  return scr.w >= 1440 ? 'desktop' : 'laptop';
}

function deviceLabel(d, scr) {
  const base = d.cls === 'phone' ? (d.os === 'iOS' ? 'iPhone' : d.os === 'Android' ? 'Android phone' : 'Phone')
    : d.cls === 'tablet' ? (d.os === 'iOS' ? 'iPad' : d.os === 'Android' ? 'Android tablet' : 'Tablet')
    : d.cls === 'desktop' ? d.os + ' desktop'
    : 'Unknown device';
  if (!scr) return base;
  const dpr = scr.dpr && scr.dpr !== 1 ? ` @${scr.dpr}x` : '';
  return `${base} · ${scr.w}×${scr.h}${dpr}`;
}
```

- [ ] **Step 4: Run harness to verify it passes**

Run: `cd superwood-presentation && node check-device.mjs`
Expected: 17× PASS, exit 0.

- [ ] **Step 5: Wire per-viewer devices and the two mixes into the handler**

Four edits inside `handler`:

(a) In `ensure()`, extend the initial viewer object (line ~74) with a `devices` array:

```js
      v = { email, opens: 0, sessions: 0, totalSeconds: 0, firstSeen: null, lastSeen: null, sections: {}, ips: [], devices: [] };
```

(b) Add a collector next to `addIp` (after line ~96):

```js
  function addDevice(v, rec) {
    if (!rec.ua) return;
    const d = deviceFromUa(rec.ua);
    const scr = rec.scr || null;
    const key = `${d.cls}|${d.os}|${scr ? `${scr.w}x${scr.h}@${scr.dpr || 1}` : ''}`;
    let e = v.devices.find(x => x.key === key);
    if (!e) {
      e = { key, cls: d.cls, os: d.os, scr, label: deviceLabel(d, scr), lastSeen: null };
      v.devices.push(e);
    }
    if (!e.lastSeen || (rec.ts && rec.ts > e.lastSeen)) e.lastSeen = rec.ts || e.lastSeen;
  }
```

(c) Count devices and formats. Declare beside `const sessionTotals = []` (line ~115):

```js
  const deviceMix = new Map(), formatMix = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
```

In the signups loop (after `addIp(v, s);`) add:

```js
    addDevice(v, s);
```

In the dwells loop (after `addLocation(d);`) add:

```js
    addDevice(v, d);
    const dev = deviceFromUa(d.ua);
    bump(deviceMix, dev.cls === 'unknown' ? 'unknown' : `${dev.cls} · ${dev.os}`);
    bump(formatMix, formatBucket(d.scr, dev.cls));
```

(d) Return them. Next to the existing `v.ips.sort(...)` line (~167) add device sorting:

```js
  for (const v of out) v.devices.sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
```

and in the response object (after `totalSessions: nSessions,`):

```js
    deviceMix: [...deviceMix].map(([key, sessions]) => ({ key, sessions })).sort((a, b) => b.sessions - a.sessions),
    formatMix: [...formatMix].map(([key, sessions]) => ({ key, sessions })).sort((a, b) => b.sessions - a.sessions),
```

Also add `deviceMix: [], formatMix: []` to the storage-less early return (line ~58) so the response shape is consistent on staging.

- [ ] **Step 6: Verify module still imports and harness still passes**

Run: `cd superwood-presentation && node check-device.mjs && node --input-type=module -e "import('./api/stats.mjs').then(()=>console.log('stats.mjs imports OK'))"`
Expected: 17× PASS then `stats.mjs imports OK`.

- [ ] **Step 7: Delete the harness and commit**

```bash
cd superwood-presentation && rm check-device.mjs && cd .. && \
git add superwood-presentation/api/stats.mjs && \
git commit -m "Stats API: derive device and screen-format mixes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Render on `/stats`, document, deploy, verify

**Files:**
- Modify: `stats.html` (new card markup + CSS + render function; roster device line)
- Modify: repo-root `CLAUDE.md` (analytics paragraph)
- Verify live: production deploy + curl

**Interfaces:**
- Consumes: `DATA.deviceMix`/`DATA.formatMix` (`[{key, sessions}]`) and `viewer.devices` (`[{cls, os, scr, label, lastSeen}]`, most recent first) from Task 2.
- Produces: user-visible feature; closes issue #6.

- [ ] **Step 1: Add the card markup**

In `stats.html`, after the Drop-off card's closing `</div>` (line ~100) and before the `card wide` Visit-map div, insert:

```html
    <div class="card wide" id="devcard">
      <h2>Devices &amp; formats</h2>
      <div class="chartsub" id="devsub">sessions by device and screen format</div>
      <div class="devgrid">
        <div id="c-dev"></div>
        <div id="c-fmt"></div>
      </div>
    </div>
```

- [ ] **Step 2: Add the CSS**

In the `<style>` block, after the `.blabel` rule (line ~69), insert:

```css
.devgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px 28px}
@media(max-width:700px){.devgrid{grid-template-columns:1fr}}
.hbar{display:flex;align-items:center;gap:10px;margin:5px 0;font-size:.72rem}
.hbar .lab{flex:none;width:128px;text-align:right;color:var(--cream-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hbar .trk{flex:1;height:13px;background:var(--grid);border-radius:4px;overflow:hidden}
.hbar .fill{height:100%;background:var(--wood);border-radius:4px}
.hbar.unk .fill{background:rgba(157,141,118,.55)}
.hbar .n{flex:none;width:30px;color:var(--muted);font-variant-numeric:tabular-nums}
.devchip{font-size:.66rem;color:var(--muted);margin-top:2px}
```

(`.hbar.unk` uses the muted token at reduced alpha so "unknown" reads as background, not data. `rgba(157,141,118,.55)` is `--muted`'s value — CSS `rgba()` can't take a hex token, and this is the one deliberate literal.)

- [ ] **Step 3: Add the render function and call it**

In the script, after `renderTable()`'s closing brace (line ~277), insert:

```js
function renderDevices(){
  const rows=(id,list)=>{
    const box=document.getElementById(id);box.textContent='';
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
  };
  rows('c-dev',DATA.deviceMix||[]);
  rows('c-fmt',DATA.formatMix||[]);
  document.getElementById('devsub').textContent='sessions by device and screen format · '+(DATA.totalSessions||0)+' visits';
}
```

In `render(data)` (line ~276), change the render call line to include it:

```js
  renderCharts();renderMap();renderTable();renderDevices();
```

- [ ] **Step 4: Add the per-viewer device line to the roster**

In `renderTable()`, directly after the `v.ips` block's closing `}` (the one appending `loc`), insert:

```js
    if(v.devices&&v.devices.length){
      const icon=c=>c==='phone'?'📱 ':c==='tablet'?'📱 ':c==='desktop'?'💻 ':'';
      const dv=document.createElement('div');dv.className='devchip';
      dv.textContent=icon(v.devices[0].cls)+v.devices[0].label+(v.devices.length>1?' +'+(v.devices.length-1)+' more':'');
      dv.title=v.devices.map(d=>d.label).join('\n');
      tdv.append(dv);
    }
```

(Exact viewports live in the `label` — e.g. `iPhone · 390×844 @3x` — with the full device history in the hover title, mirroring the `ips` pattern.)

- [ ] **Step 5: Update CLAUDE.md**

In repo-root `CLAUDE.md`, in the "Engagement analytics are two-layered" paragraph, extend the sentence about record contents. Replace:

```
Both record types include the viewer's IP and Vercel-provided geo (`x-vercel-ip-city`/`-country`/`-latitude`/`-longitude`).
```

with:

```
Both record types include the viewer's IP, user-agent, and Vercel-provided geo (`x-vercel-ip-city`/`-country`/`-latitude`/`-longitude`); dwell records also carry `scr` (viewport/screen size, pixel ratio, orientation) captured at beacon time. `/stats` derives device class/OS from the stored user-agents (retroactive) and screen-format buckets from `scr` (forward-only — older sessions show as "unknown"), rendered as per-viewer device lines plus a "Devices & formats" card.
```

- [ ] **Step 6: Deploy to production**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: output contains `Aliased https://sw.inventwood.net` on project `superwood-presentation` (NOT `decks-*`).

- [ ] **Step 7: Live verification**

```bash
cd superwood-presentation && vercel env pull --environment=production .env.check --scope inventwood && \
KEY=$(grep '^STATS_KEY=' .env.check | cut -d'"' -f2) && rm .env.check && \
curl -s "https://sw.inventwood.net/api/stats?key=$KEY" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log('deviceMix',JSON.stringify(j.deviceMix));console.log('formatMix',JSON.stringify(j.formatMix));console.log('viewer devices sample',JSON.stringify((j.viewers[0]||{}).devices||null));})"
```

Expected: `deviceMix` is a non-empty array (existing UAs make historical sessions count, e.g. `{"key":"desktop · Mac","sessions":N}`); `formatMix` contains an `unknown` entry covering pre-`scr` history; viewer sample shows `devices` with `label`s. Then confirm the page ships the new card:

```bash
curl -s https://sw.inventwood.net/stats.html | grep -c "devcard\|renderDevices"
```

Expected: a number ≥2 (markup id plus JS references), proving the new code is live.

- [ ] **Step 8: Commit and close the issue**

```bash
git add superwood-presentation/stats.html CLAUDE.md && \
git commit -m "Stats page: devices and screen formats card + roster chips

Closes #6

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

(Also push the Task 1–2 commits if not yet pushed; a single push here carries all three.)
