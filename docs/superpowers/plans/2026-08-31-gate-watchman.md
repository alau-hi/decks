# Gate Watchman Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record gate-page visits (bounces and conversions) with anonymous browser IDs, and surface a "Gate watch" card on /stats: funnel headline, map, per-IP drill-down, team filter. Spec: `docs/superpowers/specs/2026-08-16-gate-watchman-design.md`. GitHub issue #13.

**Architecture:** A JS beacon in `gate.html` posts to new `api/gatehit.mjs`, which sets a 400-day anonymous `sw_gid` cookie and inserts one row per hit into new Postgres table `gate_hits` (following the merged multi-deck conventions: `deck` column, `sql`/`DECK` from `api/_db.mjs`). `api/enter.mjs` stamps the visitor's `gid` onto the signup row (new nullable `signups.gid` column), linking bounces to later conversions. `api/stats.mjs` aggregates hits into a funnel + per-IP rows; `stats.html` renders the card.

**Tech Stack:** Vercel serverless (`.mjs`), `@neondatabase/serverless` via `api/_db.mjs`, hand-built SVG/DOM on stats.html (no libraries). Staging DB = Neon `staging` branch (gated-staging deployment's `DATABASE_URL`).

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:stage` (staging) / `npm run deploy:prod` (production); expect `Aliased https://superwood-stage.vercel.app` / `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- **Secrets:** never echo/cat/print `.env.check` or any secret value. Extract to a shell variable with `grep`/`cut`, `rm .env.check` immediately, pass via env-var. The staging `DATABASE_URL` is available in the controller's session; implementers receive it only as an env var name to use, never a value to print.
- **Never log in through `/api/enter` on production** (it writes a real signup). Production verification is read-only (curl + psql SELECT).
- **`stats.html` line 134 is a single ~57KB line (the world-map SVG path). Never print it, never include it in an Edit old_string. Anchor all edits on short unique strings elsewhere.**
- Schema changes are additive only: `CREATE TABLE IF NOT EXISTS gate_hits`, `CREATE INDEX IF NOT EXISTS`, `ALTER TABLE signups ADD COLUMN IF NOT EXISTS gid text`. No other table changes. (The spec's column name `lng` is deliberately `lon` here, matching every merged table.)
- New table rows carry `deck` (default `'superwood'`), keyed by `DECK` from `api/_db.mjs` — same as all merged tables.
- No `DATABASE_URL` → `api/gatehit.mjs` responds 204 and records nothing (collaborator-safe, same as `api/track.mjs`).
- Gate UX must be visually and behaviorally unchanged; the beacon is invisible and failure-silent.
- Run git from the repo root (shell cwd persists between commands).
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Capture — schema, gatehit endpoint, beacon, conversion stamp

**Files:**
- Modify: `superwood-presentation/scripts/schema.sql`
- Create: `superwood-presentation/api/gatehit.mjs`
- Modify: `superwood-presentation/gate.html`
- Modify: `superwood-presentation/api/enter.mjs`
- Modify: `superwood-presentation/middleware.js`

**Interfaces:**
- Consumes: `sql`, `DECK` from `api/_db.mjs`; `cleanScr` (exported by `api/track.mjs`).
- Produces: table `gate_hits(id, deck, ts, gid, ip, ua, city, country, lat, lon, path, scr, team)`; column `signups.gid` (nullable text); cookie `sw_gid` (UUID, 400-day). Task 2 reads all three.

- [ ] **Step 1: Extend the schema**

Append to `scripts/schema.sql`:

```sql
-- Gate watchman: one row per gate-page beacon. gid is the anonymous browser
-- cookie; a gid that later appears on signups.gid marks conversion.
CREATE TABLE IF NOT EXISTS gate_hits (
  id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deck    text NOT NULL DEFAULT 'superwood',
  ts      timestamptz NOT NULL,
  gid     text NOT NULL,
  ip      text DEFAULT '',
  ua      text DEFAULT '',
  city    text DEFAULT '',
  country text DEFAULT '',
  lat     double precision,
  lon     double precision,
  path    text DEFAULT '',
  scr     jsonb,
  team    boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS gate_hits_deck_idx ON gate_hits (deck);

-- Conversion link: which anonymous browser this signup came from.
ALTER TABLE signups ADD COLUMN IF NOT EXISTS gid text;
```

- [ ] **Step 2: Apply to the staging database**

The controller provides `STAGING_DB` in the environment. Run:

```bash
psql "$STAGING_DB" -f superwood-presentation/scripts/schema.sql
psql "$STAGING_DB" -c '\d gate_hits' -c "select column_name from information_schema.columns where table_name='signups' and column_name='gid'"
```

Expected: `gate_hits` table described with the 13 columns above; the second query returns one row `gid`.

- [ ] **Step 3: Create `api/gatehit.mjs`**

```js
import { randomUUID } from 'node:crypto';
import { sql, DECK } from './_db.mjs';
import { cleanScr } from './track.mjs';

const GID_MAX_AGE = 400 * 24 * 3600; // 400 days — matches sw_admin's lifetime
const BOT_UA = /bot|crawl|spider|preview|scan|fetch|monitor|curl|wget|python|headless|slurp|facebookexternal|whatsapp|telegram|slack|discord/i;

const enc = new TextEncoder();
async function hmacHex(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

// A browser carrying a valid sw_admin cookie is the team: record, flag, never drop.
async function isTeam(req) {
  const admin = getCookie(req, 'sw_admin');
  const parts = (admin || '').split('.');
  if (parts.length !== 2 || !process.env.AUTH_SECRET) return false;
  const sig = await hmacHex(`admin.${parts[0]}`, process.env.AUTH_SECRET);
  return sig === parts[1] && Number(parts[0]) > Date.now();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // Storage-less deployment (collaborators, staging-open): accept and drop silently.
  if (!sql) return res.status(204).end();

  const ua = req.headers['user-agent'] || '';
  if (BOT_UA.test(ua)) return res.status(204).end();

  let gid = String(getCookie(req, 'sw_gid') || '');
  if (!/^[0-9a-f-]{36}$/.test(gid)) {
    gid = randomUUID();
    // Same cross-subdomain scoping as sw_auth: shared on inventwood.net hosts,
    // host-only elsewhere (*.vercel.app rejects a Domain=inventwood.net cookie).
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
    const domain = /(^|\.)inventwood\.net$/.test(host.split(':')[0]) ? '; Domain=inventwood.net' : '';
    res.setHeader('Set-Cookie', `sw_gid=${gid}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${GID_MAX_AGE}${domain}`);
  }

  const body = req.body || {};
  let path = String(body.path || '').slice(0, 200);
  if (!path.startsWith('/')) path = '';
  const scr = cleanScr(body.scr);
  const record = {
    ts: new Date().toISOString(),
    gid,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    ua,
    city: decodeURIComponent(req.headers['x-vercel-ip-city'] || ''),
    country: req.headers['x-vercel-ip-country'] || '',
    lat: Number(req.headers['x-vercel-ip-latitude']) || null,
    lon: Number(req.headers['x-vercel-ip-longitude']) || null,
    path,
    team: await isTeam(req),
  };
  try {
    await sql`
      INSERT INTO gate_hits (deck, ts, gid, ip, ua, city, country, lat, lon, path, scr, team)
      VALUES (${DECK}, ${record.ts}, ${record.gid}, ${record.ip}, ${record.ua}, ${record.city}, ${record.country}, ${record.lat}, ${record.lon}, ${record.path}, ${scr ? JSON.stringify(scr) : null}::jsonb, ${record.team})`;
  } catch (err) {
    console.log('gate-hit write failed:', JSON.stringify(record), err.message);
  }
  return res.status(204).end();
}
```

- [ ] **Step 4: Open the endpoint in the middleware**

In `middleware.js`, the gate page beacons while unauthenticated, so the endpoint must be reachable without a cookie. Change the `OPEN_PATHS` line to include it:

```js
const OPEN_PATHS = new Set(['/gate', '/gate.html', '/api/enter', '/api/gatehit', '/favicon.ico', '/assets/og-cover.jpg', '/press', '/press.html']);
```

- [ ] **Step 5: Add the beacon to `gate.html`**

In `gate.html`, inside the existing `<script>` block, insert at the top (before `const f=document.getElementById('f')…`):

```js
// Watchman beacon: one fire per gate view. JS-only (curl/crawlers never run
// it); skipped for declared automation; failure-silent everywhere.
try{
  if(!navigator.webdriver){
    const payload=JSON.stringify({path:location.pathname+location.search,scr:{w:innerWidth,h:innerHeight,sw:screen.width,sh:screen.height,dpr:devicePixelRatio,o:matchMedia('(orientation: portrait)').matches?'p':'l'}});
    if(!(navigator.sendBeacon&&navigator.sendBeacon('/api/gatehit',new Blob([payload],{type:'application/json'}))))
      fetch('/api/gatehit',{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:payload}).catch(()=>{});
  }
}catch(_){}
```

No markup or style changes — the form is untouched.

- [ ] **Step 6: Stamp the gid on signups in `api/enter.mjs`**

Add a cookie reader (below the `hmacHex` helper):

```js
function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}
```

In the handler, after `const ts = new Date().toISOString();` add:

```js
  const rawGid = String(getCookie(req, 'sw_gid') || '');
  const gid = /^[0-9a-f-]{36}$/.test(rawGid) ? rawGid : null;
```

and change the INSERT to include it:

```js
    await sql`
      INSERT INTO signups (deck, email, ts, ua, ip, city, country, lat, lon, gid)
      VALUES (${DECK}, ${record.email}, ${record.ts}, ${record.ua}, ${record.ip}, ${record.city}, ${record.country}, ${record.lat}, ${record.lon}, ${gid})
      ON CONFLICT (deck, email, ts) DO NOTHING`;
```

(Leave the `record` object and everything else as is.)

- [ ] **Step 7: Static verification**

```bash
cd superwood-presentation && node --check api/gatehit.mjs && node --check api/enter.mjs && grep -c "api/gatehit" middleware.js gate.html && grep -c "sw_gid" api/enter.mjs api/gatehit.mjs && grep -c "gate_hits" scripts/schema.sql
```

Expected: both `--check`s silent (exit 0); `middleware.js:1`, `gate.html:2` (beacon has two references: sendBeacon + fetch fallback); `api/enter.mjs:1`, `api/gatehit.mjs:2`; `scripts/schema.sql:2` (CREATE TABLE + index).

- [ ] **Step 8: Commit (no deploy yet)**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/scripts/schema.sql superwood-presentation/api/gatehit.mjs superwood-presentation/api/enter.mjs superwood-presentation/gate.html superwood-presentation/middleware.js && \
git commit -m "Gate watchman capture: beacon, gate_hits table, conversion gid

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

---

### Task 2: Stats API — gate aggregation

**Files:**
- Modify: `superwood-presentation/api/stats.mjs`

**Interfaces:**
- Consumes: `gate_hits` table and `signups.gid` from Task 1; existing `deviceFromUa`, `COUNTRY_CENTROIDS`, `iso`.
- Produces: a `gate` object in the `/api/stats` response, exactly this shape (Task 3 renders it):

```
gate: {
  funnel: { visits: int, converted: int, bounced: int },   // unique non-team browsers
  locations: [{ city, country, lat, lon, visits, converted: bool }],
  ips: [{
    ip, city, country, firstSeen, lastSeen,               // ISO strings
    visits: int, browsers: int, team: bool,
    emails: [string],                                      // converted emails at this IP ([] = bounced)
    detail: [{ gid8, hits, firstSeen, lastSeen, device, email }]  // per-browser history
  }]
}
```

- [ ] **Step 1: Query the new table**

In the handler, extend the parallel query block — change the signups SELECT to include `gid` and add the gate query:

```js
  const [signupRows, dwellRows, gateRows] = await Promise.all([
    sql`SELECT email, ts, ua, ip, city, country, lat, lon, gid FROM signups WHERE deck = ${DECK}`,
    sql`SELECT session, viewer, totals, scr, ua, ip, city, country, lat, lon, ts FROM dwell_sessions WHERE deck = ${DECK}`,
    sql`SELECT ts, gid, ip, ua, city, country, lat, lon, team FROM gate_hits WHERE deck = ${DECK} ORDER BY ts`,
  ]);
```

and below the existing normalizers add:

```js
  const gateHits = gateRows.map(r => ({ ...r, ts: iso(r.ts) }));
```

- [ ] **Step 2: Aggregate**

Insert before the final `res.status(200).json({…})`, this whole block:

```js
  /* ---- Gate watch: bounce/conversion funnel + per-IP roll-up ---------- */
  const VISIT_GAP = 30 * 60 * 1000; // hits within 30 min = one visit
  const gidEmail = new Map(); // converted browsers
  for (const s of signups) if (s.gid) gidEmail.set(s.gid, s.email);

  const byGid = new Map();
  for (const h of gateHits) {
    let g = byGid.get(h.gid);
    if (!g) { g = { hits: [], team: true }; byGid.set(h.gid, g); }
    g.hits.push(h);
    if (!h.team) g.team = false; // a browser is team only if every hit was flagged
  }
  const countVisits = hits => {
    let visits = 0, last = -Infinity;
    for (const h of hits) {
      const ms = Date.parse(h.ts);
      if (ms - last > VISIT_GAP) visits++;
      last = ms;
    }
    return visits;
  };

  const nonTeamGids = [...byGid.entries()].filter(([, g]) => !g.team);
  const gateFunnel = {
    visits: nonTeamGids.length,
    converted: nonTeamGids.filter(([gid]) => gidEmail.has(gid)).length,
  };
  gateFunnel.bounced = gateFunnel.visits - gateFunnel.converted;

  // Map dots: location + outcome (uses the same centroid fallback as visits).
  const gateLocs = new Map();
  for (const [gid, g] of byGid) {
    if (g.team) continue;
    const converted = gidEmail.has(gid);
    for (const h of g.hits) {
      if (!h.city && !h.country) continue;
      const key = `${h.city || ''}|${h.country || ''}|${converted}`;
      let loc = gateLocs.get(key);
      if (!loc) {
        const c = COUNTRY_CENTROIDS[h.country] || [null, null];
        loc = { city: h.city || '', country: h.country || '', lat: c[0], lon: c[1], visits: 0, converted };
        gateLocs.set(key, loc);
      }
      if (Number.isFinite(h.lat) && Number.isFinite(h.lon)) { loc.lat = h.lat; loc.lon = h.lon; }
      loc.visits += 1;
    }
  }

  // IP rows, browsers within.
  const byIp = new Map();
  for (const [gid, g] of byGid) {
    for (const h of g.hits) {
      const ip = h.ip || 'unknown';
      let row = byIp.get(ip);
      if (!row) { row = { ip, city: '', country: '', firstSeen: null, lastSeen: null, team: true, gids: new Map() }; byIp.set(ip, row); }
      let b = row.gids.get(gid);
      if (!b) { b = { hits: [], team: g.team, email: gidEmail.get(gid) || null }; row.gids.set(gid, b); }
      b.hits.push(h);
      if (!h.team) row.team = false;
      if (!row.firstSeen || h.ts < row.firstSeen) row.firstSeen = h.ts;
      if (!row.lastSeen || h.ts > row.lastSeen) { row.lastSeen = h.ts; if (h.city) row.city = h.city; if (h.country) row.country = h.country; }
    }
  }
  const gateIps = [...byIp.values()].map(row => {
    const detail = [...row.gids.entries()].map(([gid, b]) => {
      const d = deviceFromUa(b.hits[b.hits.length - 1].ua);
      return {
        gid8: gid.slice(0, 8),
        hits: b.hits.length,
        firstSeen: b.hits[0].ts,
        lastSeen: b.hits[b.hits.length - 1].ts,
        device: d.cls === 'unknown' ? 'unknown device' : `${d.cls} · ${d.os}`,
        email: b.email,
      };
    }).sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
    return {
      ip: row.ip, city: row.city, country: row.country,
      firstSeen: row.firstSeen, lastSeen: row.lastSeen,
      visits: [...row.gids.values()].reduce((a, b) => a + countVisits(b.hits), 0),
      browsers: row.gids.size,
      team: row.team,
      emails: [...new Set(detail.map(d => d.email).filter(Boolean))],
      detail,
    };
  }).sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
```

- [ ] **Step 3: Extend the response**

Add to the final JSON object (after `breakMix: …`):

```js
    gate: {
      funnel: gateFunnel,
      locations: [...gateLocs.values()].filter(l => Number.isFinite(l.lat) && Number.isFinite(l.lon)),
      ips: gateIps,
    },
```

And extend the storage-less early return (the `if (!sql)` branch) with the same key:

```js
gate: { funnel: { visits: 0, converted: 0, bounced: 0 }, locations: [], ips: [] }
```

(add it inside that response object, keeping every existing key).

- [ ] **Step 4: Verify and commit**

```bash
cd superwood-presentation && node --check api/stats.mjs && grep -c "gate_hits\|gateFunnel\|gateIps" api/stats.mjs
```

Expected: check silent; grep ≥ 5. Then:

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/api/stats.mjs && \
git commit -m "Stats API: gate-watch funnel, locations, per-IP roll-up

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

---

### Task 3: Stats UI — "Gate watch" card

**Files:**
- Modify: `superwood-presentation/stats.html` (**reminder: never touch or print line 134, the 57KB `WORLD_PATH` line; anchor edits on short unique strings**)

**Interfaces:**
- Consumes: `DATA.gate` shaped as Task 2's `gate` object; existing helpers `el()`, `showTip`/`hideTip`, `when()`, `WORLD_PATH`, and CSS (`.card`, `.legend`, `.dtab`, `.hbar` conventions).
- Produces: the visible card; `renderGate()` wired into `render()`.

- [ ] **Step 1: Markup**

In the `.cards` grid, immediately after the closing `</div>` of the "Visit map" card (the div containing `<svg id="c-map"`), insert:

```html
    <div class="card wide">
      <h2>Gate watch</h2>
      <div class="chartsub" id="gatefunnel"></div>
      <div class="legend" id="gatelegend"><span><i class="dot conv"></i>Converted</span><span><i class="dot bnc"></i>Turned away</span><button id="gateteam" class="dtab" style="margin-left:auto">Show team</button></div>
      <svg id="c-gate" viewBox="0 40 1000 372" role="img" aria-label="World map of gate visits"></svg>
      <div id="gateips"></div>
    </div>
```

- [ ] **Step 2: CSS**

Append to the `<style>` block (before `</style>`):

```css
.legend .dot.conv{background:var(--wood-bright);border-color:var(--ink)}
.legend .dot.bnc{background:#6b5a45;border-color:var(--ink)}
.gaterow{border-top:1px solid var(--line);padding:9px 2px;font-size:.78rem;cursor:pointer}
.gaterow:hover{background:rgba(244,236,223,.03)}
.gaterow .line1{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}
.gaterow .ip{font-weight:600;font-variant-numeric:tabular-nums}
.gaterow .meta{color:var(--muted);font-size:.68rem}
.gaterow.team{opacity:.45}
.badge{font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;padding:2px 8px;border-radius:20px;border:1px solid}
.badge.bnc{color:#d9906b;border-color:rgba(217,144,107,.4)}
.badge.conv{color:var(--teal);border-color:rgba(47,163,143,.4)}
.badge.team{color:var(--cream-dim);border-color:var(--line)}
.gdetail{margin:6px 0 2px 12px;color:var(--cream-dim);font-size:.7rem}
.gdetail div{padding:2px 0}
#gateteam.sel{background:linear-gradient(135deg,var(--wood-deep),var(--wood));border-color:transparent;color:var(--cream)}
```

- [ ] **Step 3: Render function**

In the script, after `renderDevices()`'s closing brace and its `devtabs` listener, add:

```js
/* -- gate watch -------------------------------------------------------- */
let gateShowTeam=false,gateOpen=null;
function renderGate(){
  const g=DATA.gate||{funnel:{visits:0,converted:0,bounced:0},locations:[],ips:[]};
  const f=g.funnel;
  document.getElementById('gatefunnel').textContent=
    f.visits+' gate visit'+(f.visits===1?'':'s')+' · '+f.converted+' converted · '+f.bounced+' turned away — unique browsers, excluding team';
  const svg=document.getElementById('c-gate');
  svg.textContent='';
  svg.append(el('path',{d:WORLD_PATH,fill:'var(--ink2)',stroke:'var(--grid)','stroke-width':1}));
  const px=(lon,lat)=>[(lon+180)/360*1000,(90-lat)/180*500];
  (g.locations||[]).forEach(loc=>{
    const [cx,cy]=px(loc.lon,loc.lat);
    const r=Math.min(20,6+Math.sqrt(loc.visits)*3);
    const dot=el('g',{cursor:'pointer',tabindex:0});
    dot.append(el('circle',{cx,cy,r,fill:loc.converted?'var(--wood-bright)':'#6b5a45',stroke:'var(--ink)','stroke-width':2,opacity:.92}));
    const name=(loc.city?loc.city+', ':'')+loc.country;
    const enter=e=>showTip(e,loc.visits+' hit'+(loc.visits===1?'':'s')+(loc.converted?' · converted':' · turned away'),name);
    dot.addEventListener('pointermove',enter);
    dot.addEventListener('pointerleave',hideTip);
    svg.append(dot);
  });
  const box=document.getElementById('gateips');
  box.textContent='';
  const rows=(g.ips||[]).filter(r=>gateShowTeam||!r.team);
  if(!rows.length){const d=document.createElement('div');d.className='gaterow';d.style.cursor='default';d.textContent=g.ips&&g.ips.length?'only team traffic so far':'no gate traffic recorded yet';d.style.color='var(--muted)';box.append(d);return;}
  rows.forEach(r=>{
    const row=document.createElement('div');row.className='gaterow'+(r.team?' team':'');
    const l1=document.createElement('div');l1.className='line1';
    const ip=document.createElement('span');ip.className='ip';ip.textContent=r.ip;l1.append(ip);
    const badge=document.createElement('span');
    if(r.team){badge.className='badge team';badge.textContent='team';}
    else if(r.emails.length){badge.className='badge conv';badge.textContent='converted → '+r.emails.join(', ');}
    else{badge.className='badge bnc';badge.textContent='bounced';}
    l1.append(badge);
    const meta=document.createElement('span');meta.className='meta';
    meta.textContent=r.visits+' visit'+(r.visits===1?'':'s')+' · '+r.browsers+' browser'+(r.browsers===1?'':'s')
      +(r.city||r.country?' · '+(r.city?r.city+', ':'')+r.country:'')
      +' · first '+when(r.firstSeen)+' · last '+when(r.lastSeen);
    l1.append(meta);row.append(l1);
    if(gateOpen===r.ip){
      const det=document.createElement('div');det.className='gdetail';
      r.detail.forEach(b=>{
        const d=document.createElement('div');
        d.textContent='⌁ '+b.gid8+' · '+b.device+' · '+b.hits+' hit'+(b.hits===1?'':'s')+' · '+when(b.firstSeen)+' → '+when(b.lastSeen)+(b.email?' · '+b.email:'');
        det.append(d);
      });
      row.append(det);
    }
    row.addEventListener('click',()=>{gateOpen=(gateOpen===r.ip?null:r.ip);renderGate();});
    box.append(row);
  });
}
document.getElementById('gateteam').addEventListener('click',e=>{
  e.stopPropagation();
  gateShowTeam=!gateShowTeam;
  e.target.classList.toggle('sel',gateShowTeam);
  renderGate();
});
```

- [ ] **Step 4: Wire into `render()`**

Change the line `renderCharts();renderMap();renderTable();renderDevices();` to:

```js
  renderCharts();renderMap();renderTable();renderDevices();renderGate();
```

- [ ] **Step 5: Verify and commit**

```bash
cd superwood-presentation && grep -c "renderGate\|c-gate\|gateips\|gateteam" stats.html && node -e "const s=require('fs').readFileSync('stats.html','utf8');const m=s.match(/<script>([\s\S]*)<\/script>/);new Function(m[1].replace(/^const WORLD_PATH.*$/m,'const WORLD_PATH=\"\"'));console.log('script parses')"
```

Expected: grep ≥ 8; `script parses`. (The `node -e` only parses the inline script for syntax — it must not print the file.) Then:

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/stats.html && \
git commit -m "Stats page: Gate watch card — funnel, map, per-IP drill-down

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

---

### Task 4: Staging verification, production rollout, close #13

This task is controller-run (it needs the staging DB credential and browser checks) — do not dispatch the DB credential to a subagent.

- [ ] **Step 1: Deploy to gated staging**

```bash
cd superwood-presentation && npm run deploy:stage
```

Expected: `Aliased https://superwood-stage.vercel.app` (STOP if `decks-*`).

- [ ] **Step 2: Bot-immunity check (read-only)**

```bash
curl -s -o /dev/null -w "%{http_code}" https://superwood-stage.vercel.app/intro
curl -s -X POST https://superwood-stage.vercel.app/api/gatehit -H 'Content-Type: application/json' -d '{"path":"/x"}' -A "curl/8" -o /dev/null -w "%{http_code}"
psql "$STAGING_DB" -c "select count(*) from gate_hits"
```

Expected: `200` (gate page serves); `204` (bot UA accepted-and-dropped); count `0` — neither curl recorded anything.

- [ ] **Step 3: Real-browser check** — ask Shaun (or use the Chrome tools) to open `https://superwood-stage.vercel.app/intro` in a fresh/incognito browser window, then:

```bash
psql "$STAGING_DB" -c "select gid, ip, city, team, path from gate_hits order by ts desc limit 3"
```

Expected: one row, `team=false`, real geo, `path=/intro`. Optionally complete the staging signup (staging DB only — allowed) and confirm `signups.gid` matches and `/stats` on staging flips the row to `converted`.

- [ ] **Step 4: Team-flag check** — on a browser holding `sw_admin` (Shaun's normal browser, `/stats` visited before), load the staging gate once; the new row shows `team=true`.

- [ ] **Step 5: Apply schema to production DB** (secret protocol — no echoing):

```bash
cd superwood-presentation && vercel env pull --environment=production .env.check && \
PROD_DB=$(grep '^DATABASE_URL=' .env.check | cut -d'"' -f2) && rm .env.check && \
psql "$PROD_DB" -f scripts/schema.sql && psql "$PROD_DB" -c '\d gate_hits' | head -5 && unset PROD_DB
```

- [ ] **Step 6: Deploy production**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Read-only live check (no signup, no beacon):

```bash
curl -s https://sw.inventwood.net/intro | grep -c "api/gatehit"
```

Expected: `2` (the gate page's beacon script, served to unauthenticated visitors).

- [ ] **Step 7: Close the issue**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && gh issue close 13 --repo alau-hi/decks --comment "Gate watchman live: beacon on the gate, gate_hits in Postgres, Gate watch card on /stats (funnel, map, per-IP drill-down, team toggle). Plan: docs/superpowers/plans/2026-08-31-gate-watchman.md"
```

- [ ] **Step 8: Update the change log** — per the merged convention, every deck-affecting push extends the `LOG` array in `changes.html`. Add an entry dated today describing the gate watchman (stats-page feature; brief line). Commit with the Task 4 wrap-up if any file changed, push.
