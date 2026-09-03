# Multi-Deck Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the SUPERMILLS deck on `/stats` behind a deck switcher, with deck identity derived from the URL path instead of the deployment env, and slide order captured from the deck itself.

**Architecture:** The inline tracker in `index.html` moves into a shared `/deck-track.js` that also reports `deck` (from the path) and `order` (the deck's `data-nav` list); Alex's `slides.html` loads the same file via one line committed to his repo and synced in. The write-side APIs tag rows by path (`deckFromPath` from the registry built in the password-gate feature); `deck_slides` stores the latest observed slide order per deck. `/api/stats?deck=` filters by deck and `/stats` grows a tab switcher. GitHub issue #21.

**Tech Stack:** Vercel static + serverless `.mjs`, `@neondatabase/serverless` via `api/_db.mjs`, hand-built DOM in `stats.html`, git subtree for Alex's repo.

**Spec:** `docs/superpowers/specs/2026-09-03-multi-deck-stats-design.md`

## Global Constraints

- **Never run `vercel` from the repo root.** Deploys only via `npm run deploy:stage-open` / `deploy:stage` / `deploy:prod` from `superwood-presentation/`; expect the matching alias line, never `decks-*` (STOP/BLOCKED).
- **Pull-only rule:** nothing under `superwood-presentation/supermills-america-overview/` is edited in this repo. The one-line tracker change goes into Alex's repo (`../supermills-america`, i.e. `/Users/sklop/build/inventwood/alau-hi/supermills-america`) and arrives via `npm run sync:supermills` (needs a clean tree).
- **Secrets:** never print `.env.check` or any secret; shell variables only; `rm .env.check` immediately. Never sign in via `/api/enter` on production; production checks are read-only.
- **`stats.html` has a ~57KB single line (the world-map SVG, `const WORLD_PATH=…`). Never print it or include it in an Edit anchor.**
- Schema: additive only — `CREATE TABLE IF NOT EXISTS deck_slides (deck text PRIMARY KEY, slides jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`. Applied to staging and production **before** deploying code that queries it.
- Deck ids are the keys of `DECKS` in `api/_decks.mjs` (`superwood`, `supermills`); anything else falls back to `DEFAULT_DECK`.
- `order` accepted only as an array of ≤ 80 strings, each trimmed to ≤ 60 chars, empties dropped, deduplicated (first occurrence wins).
- Vercel Analytics (`va`) events unchanged.
- Run git from the repo root (cwd persists). Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC`.

---

### Task 1: Shared tracker `/deck-track.js`; `index.html` loads it

**Files:**
- Create: `superwood-presentation/deck-track.js`
- Modify: `superwood-presentation/index.html` (the inline tracker `<script>…</script>` at the very end, immediately before `</body>`)

**Interfaces:**
- Produces: beacon body `{ viewer, session, deck, order, totals, scr }` POSTed to `/api/track` (Task 3 consumes `deck` and `order`). `/deck-track.js` is a static file at the site root.

- [ ] **Step 1: Create the tracker file**

```js
/* Shared engagement tracker for every deck on this site.
   Loaded by each deck's HTML as <script src="/deck-track.js" defer></script>.
   Counts go to Vercel Analytics (deck_open, section_view — 2 data props max on
   Pro); per-slide dwell seconds beacon to /api/track, cumulative per session so
   the server can overwrite one record per session without double-counting.
   The deck id comes from the URL path and the slide order from the DOM, so a
   deck never needs per-deck configuration here. Off this site (e.g. a deck's
   own staging host) the file 404s and nothing runs. */
(function(){
  var PREFIXES={supermills:'/supermills-america-overview'};
  var deck='superwood';
  for(var id in PREFIXES){ var p=PREFIXES[id]; if(location.pathname===p||location.pathname.indexOf(p+'/')===0){deck=id;} }
  var params=new URLSearchParams(location.search);
  var viewer=params.get('v')||params.get('to')||params.get('viewer')||'anonymous';
  var session=Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,10);
  function track(name,data){try{window.va&&window.va('event',{name:name,data:Object.assign({viewer:viewer},data||{})});}catch(e){}}
  track('deck_open',{ref:document.referrer||'direct'});
  var deckEl=document.getElementById('deck');
  var sections=document.querySelectorAll('section');
  var order=[],seen={};
  sections.forEach(function(s){ var n=(s.dataset.nav||s.id||'').trim().slice(0,60); if(n&&!seen[n]){seen[n]=1;order.push(n);} });
  var current=null,enterT=0,totals={};
  /* Idle cutoff: time on a slide only counts up to IDLE_MS after the last
     interaction, so an abandoned-but-visible tab stops inflating dwell. */
  var IDLE_MS=180000,lastActive=performance.now();
  function flush(){ if(current){ var end=Math.min(performance.now(),lastActive+IDLE_MS); var s=Math.round((end-enterT)/1000); if(s>0){ totals[current]=(totals[current]||0)+s; } enterT=performance.now(); } }
  function activity(){ if(performance.now()-lastActive>IDLE_MS){ flush(); } lastActive=performance.now(); }
  ['pointerdown','pointermove','wheel','keydown','touchstart'].forEach(function(ev){ document.addEventListener(ev,activity,{passive:true}); });
  var sio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting && e.intersectionRatio>=0.6){
        flush();
        current=(e.target.dataset.nav||e.target.id);
        enterT=performance.now();
        track('section_view',{section:current});
      }
    });
  },{root:deckEl,threshold:0.6});
  sections.forEach(function(s){sio.observe(s);});
  function scrNow(){ try{ return { w:innerWidth, h:innerHeight, sw:screen.width, sh:screen.height, dpr:devicePixelRatio||1, o:matchMedia('(orientation: portrait)').matches?'p':'l' }; }catch(e){ return null; } }
  function send(){
    flush();
    if(!Object.keys(totals).length)return;
    try{navigator.sendBeacon('/api/track',new Blob([JSON.stringify({viewer:viewer,session:session,deck:deck,order:order,totals:totals,scr:scrNow()})],{type:'application/json'}));}catch(e){}
  }
  setInterval(function(){ if(!document.hidden) send(); },30000);
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){ send(); } else { enterT=performance.now(); }
  });
  window.addEventListener('pagehide',send);
})();
```

- [ ] **Step 2: Replace the inline tracker in `index.html`**

Near the end of `index.html` there is this comment followed by a `<script>` block ending `})();` + `</script>` (the last `<script>` before `</body>`):

```html
<!-- Per-viewer + per-section engagement tracking.
     Counts go to Vercel Analytics (deck_open, section_view — 2 data props max on Pro);
     per-slide dwell seconds beacon to /api/track, cumulative per session so the
     server can overwrite one record per session without double-counting. -->
<script>
(function(){
  …
})();
</script>
```

Replace that whole comment + script block (from the `<!-- Per-viewer` line through its `</script>`) with:

```html
<!-- Per-viewer + per-section engagement tracking lives in the shared
     /deck-track.js (also loaded by the SUPERMILLS deck). -->
<script src="/deck-track.js" defer></script>
```

Leave the Vercel Analytics `<script>` lines above it untouched.

- [ ] **Step 3: Verify**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check deck-track.js && grep -c 'src="/deck-track.js"' index.html && grep -c "sendBeacon" index.html && grep -c "sendBeacon" deck-track.js && grep -c "order:order" deck-track.js && tail -3 index.html
```

Expected: `1`, `0`, `1`, `1`, and the tail shows the new `<script src>` line followed by `</body>` and `</html>`. Then deploy ungated staging and confirm the file serves and the deck references it:

```bash
npm run deploy:stage-open 2>&1 | tail -1; B=https://superwood-stage-open.vercel.app; echo "js: $(curl -s -o /dev/null -w '%{http_code} %{content_type}' $B/deck-track.js)  intro refs: $(curl -s $B/intro | grep -c 'deck-track.js')"
```

Expected: `js: 200 …javascript…  intro refs: 1`.

- [ ] **Step 4: Commit**

```bash
git add superwood-presentation/deck-track.js superwood-presentation/index.html && git commit -m "Shared deck tracker: /deck-track.js reports deck and slide order

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

---

### Task 2: One line in Alex's repo, then sync it in

**Files:**
- Modify (in the OTHER repo): `/Users/sklop/build/inventwood/alau-hi/supermills-america/slides.html`
- This repo: `superwood-presentation/supermills-america-overview/**` updated only by `npm run sync:supermills`

**Interfaces:**
- Produces: the synced `slides.html` loads `/deck-track.js`; Task 5's staging visit generates supermills dwell.

- [ ] **Step 1: Update Alex's repo (direct commit to main — Shaun's decision)**

```bash
cd /Users/sklop/build/inventwood/alau-hi/supermills-america && git status --porcelain | wc -l && git pull --ff-only && grep -c "deck-track.js" slides.html
```

Expected: `0` (clean), a fast-forward or "Already up to date", `0`. Then insert the line: the file ends with `</script>`, `</body>`, `</html>`. Replace the final `</body>` line with:

```html
<script src="/deck-track.js" defer></script>
</body>
```

```bash
grep -c 'src="/deck-track.js"' slides.html && tail -3 slides.html && git add slides.html && git commit -m "Load the site's shared engagement tracker (no-op off inventwood.net)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push origin main
```

Expected: `1`; tail shows the script line, `</body>`, `</html>`; push succeeds.

- [ ] **Step 2: Sync into the monorepo**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git status --porcelain | wc -l && cd superwood-presentation && npm run sync:supermills 2>&1 | tail -3 && grep -c 'src="/deck-track.js"' supermills-america-overview/slides.html && cd .. && git log --oneline -3 && git push
```

Expected: `0` (clean before syncing); the subtree pull reports a merge (this also brings Alex's commits since the import — expected); `1`; the top commit is the sync merge; push succeeds. If the pull reports conflicts: STOP and report BLOCKED (do not resolve by hand).

---

### Task 3: Write side — deck from path, `deck_slides`

**Files:**
- Modify: `superwood-presentation/scripts/schema.sql`
- Modify: `superwood-presentation/api/track.mjs`
- Modify: `superwood-presentation/api/enter.mjs`
- Modify: `superwood-presentation/api/gatehit.mjs`

**Interfaces:**
- Consumes: `DECKS`, `DEFAULT_DECK`, `deckFromPath` from `./_decks.mjs`; beacon fields `deck`, `order` from Task 1.
- Produces: `dwell_sessions.deck`, `signups.deck`, `gate_hits.deck` tagged by path; table `deck_slides(deck, slides, updated_at)` upserted from beacons. Task 4 reads all of these.

- [ ] **Step 1: Schema**

Append to `scripts/schema.sql`:

```sql
-- Latest observed slide order per deck (the tracker reports the DOM's
-- data-nav list on every beacon; newest deployment wins). Read by /api/stats
-- so the heatmap follows slide reorders without a hardcoded list.
CREATE TABLE IF NOT EXISTS deck_slides (
  deck       text PRIMARY KEY,
  slides     jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

- [ ] **Step 2: `api/track.mjs`**

Change the import line `import { sql, DECK } from './_db.mjs';` to:

```js
import { sql } from './_db.mjs';
import { DECKS, DEFAULT_DECK } from './_decks.mjs';
```

Add after the `cleanScr` function:

```js
// Slide order as reported by the deck's DOM: ≤80 names, ≤60 chars each,
// deduplicated, first occurrence wins. Anything malformed → null (no upsert).
export function cleanOrder(raw) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 80) return null;
  const out = [], seen = new Set();
  for (const v of raw) {
    const s = String(v ?? '').trim().slice(0, 60);
    if (s && !seen.has(s)) { seen.add(s); out.push(s); }
  }
  return out.length ? out : null;
}
```

In the handler, change `const { viewer, session, totals, scr } = req.body || {};` to:

```js
  const { viewer, session, totals, scr, deck: deckRaw, order } = req.body || {};
  const deck = Object.prototype.hasOwnProperty.call(DECKS, String(deckRaw)) ? String(deckRaw) : DEFAULT_DECK;
```

In the INSERT, replace `${DECK}` with `${deck}`. Then, inside the same `try` block, after the dwell upsert statement, add:

```js
    const slides = cleanOrder(order);
    if (slides) {
      await sql`
        INSERT INTO deck_slides (deck, slides, updated_at)
        VALUES (${deck}, ${JSON.stringify(slides)}::jsonb, now())
        ON CONFLICT (deck) DO UPDATE SET slides = EXCLUDED.slides, updated_at = now()`;
    }
```

- [ ] **Step 3: `api/enter.mjs`**

Change `import { sql, DECK } from './_db.mjs';` to:

```js
import { sql } from './_db.mjs';
import { deckFromPath } from './_decks.mjs';
```

After the line `const gid = /^[0-9a-f-]{36}$/.test(rawGid) ? rawGid : null;` add:

```js
  const deck = deckFromPath(safeNext(next)); // deck of entry: where the visitor was headed
```

and in the INSERT replace `${DECK}` with `${deck}`. (`safeNext` and `next` already exist in this file.)

- [ ] **Step 4: `api/gatehit.mjs`**

Change `import { sql, DECK } from './_db.mjs';` to:

```js
import { sql } from './_db.mjs';
import { deckFromPath } from './_decks.mjs';
```

and in the INSERT replace `${DECK}` with `${deckFromPath(path)}` (`path` is the sanitized variable already computed above the INSERT).

- [ ] **Step 5: Verify**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check api/track.mjs && node --check api/enter.mjs && node --check api/gatehit.mjs && grep -c "DECK}" api/track.mjs api/enter.mjs api/gatehit.mjs; grep -c "deck_slides" api/track.mjs scripts/schema.sql && node --input-type=module -e "
import { cleanOrder } from './api/track.mjs';
const t=(a,b,m)=>{ if(JSON.stringify(a)!==JSON.stringify(b)){console.error('FAIL',m,a,b);process.exit(1);} };
t(cleanOrder(['Cover','The Gap','The Gap','Old Mills']),['Cover','The Gap','Old Mills'],'dedupe');
t(cleanOrder([]),null,'empty'); t(cleanOrder('x'),null,'not array'); t(cleanOrder(new Array(81).fill('a')),null,'too long');
t(cleanOrder(['  ', 'x'.repeat(70)]),['x'.repeat(60)],'trim+cap');
console.log('cleanOrder ok');"
```

Expected: the first grep prints `0` for all three files (no `${DECK}` left); `deck_slides` counts ≥1 each; `cleanOrder ok`. (`grep -c` exits 1 when a count is 0 — that is the expected outcome for the first grep, hence the `;`.)

- [ ] **Step 6: Commit (no deploy — Task 5 deploys after the schema is applied)**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/scripts/schema.sql superwood-presentation/api/track.mjs superwood-presentation/api/enter.mjs superwood-presentation/api/gatehit.mjs && git commit -m "Analytics: tag rows by deck from the path; capture slide order

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

- [ ] **Step 7 (controller): Apply schema + backfill to staging DB**

```bash
psql "$STAGING_DB" -f superwood-presentation/scripts/schema.sql | tail -2 && psql "$STAGING_DB" -c "UPDATE gate_hits SET deck='supermills' WHERE path LIKE '/supermills-america-overview%'" -c "select deck, count(*) from gate_hits group by deck"
```

---

### Task 4: Read side — `/api/stats?deck=` and the switcher

**Files:**
- Modify: `superwood-presentation/api/stats.mjs`
- Modify: `superwood-presentation/stats.html` (never touch the `WORLD_PATH` line)

**Interfaces:**
- Consumes: `deck_slides`, per-deck `deck` tags (Task 3); `DECKS`, `DEFAULT_DECK` from `./_decks.mjs`.
- Produces: response gains `deck` (string) and `decks` (`[{id,label}]`); `slideOrder` is per deck. `/stats?deck=<id>` selects the deck.

- [ ] **Step 1: `api/stats.mjs` — deck selection and per-deck slide order**

Change `import { sql, iso, DECK } from './_db.mjs';` to:

```js
import { sql, iso } from './_db.mjs';
import { DECKS, DEFAULT_DECK } from './_decks.mjs';
```

Rename the module constant: change `const SLIDES = [` to `const FALLBACK_SLIDES = { superwood: [` and its closing `];` to `] };` (the superwood list is the only hardcoded fallback; other decks fall back to `[]`).

In the handler, right after the `keyOk` check, add:

```js
  const deckId = Object.prototype.hasOwnProperty.call(DECKS, String(req.query?.deck ?? '')) ? String(req.query.deck) : DEFAULT_DECK;
  const decks = Object.entries(DECKS).map(([id, d]) => ({ id, label: d.label }));
  const fallbackSlides = FALLBACK_SLIDES[deckId] || [];
```

In the `if (!sql)` early return, replace `slideOrder: SLIDES` with `deck: deckId, decks, slideOrder: fallbackSlides` (keep every other key).

Extend the parallel query block to four queries and filter by `deckId`:

```js
  const [signupRows, dwellRows, gateRows, slideRows] = await Promise.all([
    sql`SELECT email, ts, ua, ip, city, country, lat, lon, gid FROM signups WHERE deck = ${deckId}`,
    sql`SELECT session, viewer, totals, scr, ua, ip, city, country, lat, lon, ts FROM dwell_sessions WHERE deck = ${deckId}`,
    sql`SELECT ts, gid, ip, ua, city, country, lat, lon, team FROM gate_hits WHERE deck = ${deckId} ORDER BY ts`,
    sql`SELECT slides FROM deck_slides WHERE deck = ${deckId}`,
  ]);
  const SLIDES = (slideRows[0] && Array.isArray(slideRows[0].slides) && slideRows[0].slides.length) ? slideRows[0].slides : fallbackSlides;
```

(All later uses of `SLIDES` in the handler — the per-slide aggregates and drop-off — now refer to this handler-local constant; no other edits there.) In the final JSON, replace `slideOrder: SLIDES,` with:

```js
    deck: deckId,
    decks,
    slideOrder: SLIDES,
```

- [ ] **Step 2: `stats.html` — switcher, title, URL state**

Markup: change `<h1>SUPERWOOD deck — viewer stats</h1>` to `<h1 id="title">SUPERWOOD deck — viewer stats</h1>`. Inside `<div class="bar">`, before the Refresh button, insert:

```html
    <div class="devtabs" id="decktabs" style="margin:0"></div>
```

Script: after `let DATA=null,SLIDES=FALLBACK_SLIDES,selected=null;` add:

```js
let DECK=new URLSearchParams(location.search).get('deck')||'superwood';
function renderDeckTabs(){
  const box=document.getElementById('decktabs');box.textContent='';
  (DATA.decks||[]).forEach(d=>{
    const b=document.createElement('button');b.className='dtab'+(d.id===DATA.deck?' sel':'');b.textContent=d.label;b.dataset.deck=d.id;
    b.addEventListener('click',()=>{ if(d.id===DECK)return; DECK=d.id; selected=null; const u=new URL(location.href); u.searchParams.set('deck',DECK); history.replaceState(null,'',u); load(localStorage.getItem('sw_stats_key')||''); });
    box.append(b);
  });
  const cur=(DATA.decks||[]).find(d=>d.id===DATA.deck);
  document.getElementById('title').textContent=(cur?cur.label:'SUPERWOOD')+' deck — viewer stats';
  document.title=(cur?cur.label:'Deck')+' Stats — InventWood';
}
```

In `render(data)`, change `SLIDES=data.slideOrder||FALLBACK_SLIDES;` to `SLIDES=(data.slideOrder&&data.slideOrder.length)?data.slideOrder:(data.deck==='superwood'?FALLBACK_SLIDES:[]);` and add `renderDeckTabs();` immediately after `DATA=data;`.

In `load(key)`, change the fetch URL to `'/api/stats?key='+encodeURIComponent(key)+'&deck='+encodeURIComponent(DECK)`.

- [ ] **Step 3: Verify**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check api/stats.mjs && grep -c "FALLBACK_SLIDES\[deckId\]\|deck_slides\|decks," api/stats.mjs && grep -c "DECK}" api/stats.mjs; grep -c "renderDeckTabs\|decktabs\|&deck=" stats.html && node -e "const s=require('fs').readFileSync('stats.html','utf8');const m=s.match(/<script>([\s\S]*)<\/script>/);new Function(m[1].replace(/^const WORLD_PATH.*$/m,'const WORLD_PATH=\"\"'));console.log('script parses')"
```

Expected: stats.mjs grep ≥3, then `0` for `DECK}`; stats.html grep ≥5; `script parses`.

- [ ] **Step 4: Commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/api/stats.mjs superwood-presentation/stats.html && git commit -m "Stats: per-deck data and slide order, deck switcher on /stats

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

---

### Task 5: Docs, change log, staging end-to-end, production

**Files:**
- Modify: `CLAUDE.md`
- Modify: `superwood-presentation/changes.html` (`LOG` only)

- [ ] **Step 1: CLAUDE.md**

In the "Access gate & analytics (Vercel)" section, replace the sentence in the analytics paragraph that begins "Per-slide dwell time is first-party: the tracker script at the bottom of `index.html` beacons" with "Per-slide dwell time is first-party: the shared tracker `/deck-track.js` (loaded by every deck's HTML, including the SUPERMILLS deck via one line in Alex's repo; it 404s harmlessly off this site) beacons". Also replace "The stats API requires the `STATS_KEY` env var (separate from viewer auth) and returns `slideOrder` — the canonical slide-name list lives in `api/stats.mjs` and must match the `data-nav` names in `index.html` if slides are renamed/reordered." with:

"The stats API requires the `STATS_KEY` env var (separate from viewer auth). **Multi-deck:** every analytics row is tagged with a deck id derived from the URL path (`deckFromPath` in `api/_decks.mjs`: dwell from the deck the tracker runs on, signups from the `next` path the visitor was headed to, gate hits from their recorded path — `DECK_ID` is only the fallback). `/api/stats?deck=<id>` filters by deck and `/stats` has a deck switcher (tabs at the top; `?deck=` in the URL). `slideOrder` comes from the `deck_slides` table, which the tracker refreshes from the DOM's `data-nav` list on every beacon (latest deployment wins) — superwood keeps its hardcoded list in `api/stats.mjs` as the fallback, other decks show an empty heatmap until their first visit. Apply `scripts/schema.sql` before deploying code that queries `deck_slides`."

In the Neon Postgres section, extend the schema table list "(`signups` …, `dwell_sessions`, `change_requests`, `gate_hits`)" to add `deck_slides`.

- [ ] **Step 2: Change log**

Append to `LOG` in `changes.html` (after the 'Shared password on the SUPERMILLS deck' entry, before `];`):

```js
 {iso:'2026-09-03',date:'Sep 3',topic:'Analytics',title:'Both decks on the stats page',slides:[],req:'Incorporate the new deck into the stats page with a deck switcher at the top.',items:[
  ['A deck switcher on /stats: every card (viewers, heatmap, charts, devices, map, gate watch) now renders per deck',''],
  ['Engagement rows are attributed to a deck by URL path rather than by deployment; the SUPERMILLS deck loads the same tracker as the main deck',''],
  ['Slide order for the heatmap is captured from the deck itself, so reorders show up without code changes','']]}
```

- [ ] **Step 3: Verify + commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && grep -c "deck-track.js" CLAUDE.md && grep -c "deck_slides" CLAUDE.md && node -e "const s=require('fs').readFileSync('superwood-presentation/changes.html','utf8');const m=s.match(/const LOG=\[([\s\S]*?)\n\];/);new Function('return ['+m[1]+']')();console.log('LOG parses')" && git add CLAUDE.md superwood-presentation/changes.html && git commit -m "Docs + change log: multi-deck stats

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

Expected: `≥1`, `≥1`, `LOG parses`.

- [ ] **Step 4 (controller): Staging end-to-end**

Schema already applied to staging (Task 3 Step 7). `npm run deploy:stage`. Then:
1. Mint `sw_auth` + `sw_deck_supermills` (preview `AUTH_SECRET`, secret protocol) and POST a synthetic dwell beacon to `/api/track` with `deck:'supermills'`, `order:['Cover','The Gap','Old Mills']`, `totals:{Cover:5}`, a fresh 16-char session — expect 204; then `select deck, slides from deck_slides` and `select deck,count(*) from dwell_sessions group by deck` on `$STAGING_DB` show a `supermills` row and order.
2. `/api/stats?key=…&deck=supermills` (with `sw_auth`) → `deck:'supermills'`, `decks` has 2 entries, `slideOrder` = the posted order, `viewers` includes `watchman-test@example.com`; `&deck=superwood` → unchanged shape, `slideOrder` = the 14-name list; `&deck=bogus` → falls back to superwood.
3. Real-browser check (Chrome tools or Shaun): open the staging supermills deck, scroll; `/stats?deck=supermills` shows the tab active, heatmap columns = Alex's real section order.
4. Signup attribution: POST `/api/enter` on staging with `next:'/supermills-america-overview/'` → `select deck from signups order by ts desc limit 1` = `supermills`; gate hit with browser UA at `path:'/supermills-america-overview/'` → `gate_hits.deck='supermills'`.

- [ ] **Step 5 (controller): Production**

Apply schema + backfill to the production DB (`$PROD_DB`, provided by Shaun earlier — same two statements as Task 3 Step 7). `git pull --ff-only`, `npm run deploy:prod` → `Aliased https://sw.inventwood.net`. Read-only checks: `/deck-track.js` 200; with a minted production `sw_auth`, `/api/stats?key=…&deck=supermills` returns `deck:'supermills'` and 2 `decks` (STATS_KEY pulled via secret protocol); `/intro` unchanged. No sign-in, no beacon posted to production.

- [ ] **Step 6 (controller): Close**

```bash
gh issue close 21 --repo alau-hi/decks --comment "Live: /stats has a deck switcher (SUPERWOOD | SUPERMILLS America); rows are attributed by path; the SUPERMILLS deck loads the shared /deck-track.js (one line in alau-hi/supermills-america, synced in); slide order is captured from the deck into deck_slides. Plan: docs/superpowers/plans/2026-09-03-multi-deck-stats.md"
```
