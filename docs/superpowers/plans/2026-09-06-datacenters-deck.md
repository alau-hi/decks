# SUPERWOOD for Data Centers deck at /datacenters — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve Alex's data center investor deck (already in this repo) at `investor.inventwood.net/datacenters` behind the email gate and the shared deck password, with the deck on `/stats`.

**Architecture:** The deck directory moves under the Vercel project root (`superwood-presentation/`) and is allowlisted so only `slides.html` + `assets/` ship. `vercel.json` maps `/datacenters/…` onto it exactly as `/supermills-deck/…` maps onto the supermills subtree. The deck registry gets a `datacenters` entry pointing at the existing `SUPERMILLS_PASSWORD` variable, and the password cookie is re-keyed from the deck id to the password variable so one entry unlocks every deck sharing it. Stats need only the registry entry, the tracker prefix mirror and one script tag in the deck.

**Tech Stack:** Static HTML on Vercel (`cleanUrls`), Edge middleware (`@vercel/edge`), Node serverless functions (`api/*.mjs`), Neon Postgres (no schema change), Node 22 for local unit tests (`node` scripts, no test framework in the repo).

**Spec:** `docs/superpowers/specs/2026-09-06-datacenters-deck-design.md` (GitHub issue #22).

## Global Constraints

- Repo root: `/Users/sklop/build/inventwood/alau-hi/decks`. Run git from the root; the Vercel project root is `superwood-presentation/`.
- **Never run `vercel` from the repo root or any deck subdirectory.** Deploys only via `cd superwood-presentation && npm run deploy:stage` / `deploy:prod`, in one shell command. Expected aliases: `superwood-stage.vercel.app`, `sw.inventwood.net`. Anything aliased `decks-*` is a disaster — stop.
- Never print, cat or echo `.env.check` or any secret; extract with `grep '^AUTH_SECRET=' .env.check | cut -d'"' -f2` into a shell variable, `rm .env.check` immediately, `unset` afterwards. Never paste cookie values into reports. Never POST to `/api/enter` on production.
- The directory keeps its name `superwood-datacenter-investor`; the public URL prefix is exactly `/datacenters`; home is `/datacenters/`.
- Registry entry verbatim: `datacenters: { label: 'SUPERWOOD for Data Centers', prefix: '/datacenters', home: '/datacenters/', password: 'SUPERMILLS_PASSWORD' }`.
- Password cookie: name `sw_pw_<env var name lowercased>` (`sw_pw_supermills_password`), value `<expiryMs>.<hmacSHA256hex("pw.<VAR>.<expiryMs>", AUTH_SECRET)>`, `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`, plus `; Domain=inventwood.net` on inventwood.net hosts. `sw_deck_*` cookies are no longer read anywhere.
- Never set `trailingSlash` in `vercel.json`.
- Only `slides.html` and `assets/` from the deck directory may reach the deployment.
- Do not edit anything under `superwood-presentation/supermills-america-overview/` (pull-only subtree).
- Commit messages: short imperative descriptions, as in `git log`.

---

### Task 1: Move the deck under the project root and wire the URL

**Files:**
- Move: `superwood-datacenter-investor/` → `superwood-presentation/superwood-datacenter-investor/` (git mv, whole directory)
- Modify: `superwood-presentation/.vercelignore` (append allowlist block)
- Modify: `superwood-presentation/vercel.json` (redirect, two rewrites, one header rule)

**Interfaces:**
- Produces: deployed paths `/superwood-datacenter-investor/slides` and `/superwood-datacenter-investor/assets/*`, reachable publicly as `/datacenters/` and `/datacenters/assets/*`. Task 2 and Task 5 rely on these exact paths.

- [ ] **Step 1: Move the directory (from the repo root)**

```bash
git mv superwood-datacenter-investor superwood-presentation/superwood-datacenter-investor && git status --short | wc -l && test -f superwood-presentation/superwood-datacenter-investor/slides.html && echo moved
```
Expected: a count in the hundreds (every file shows as renamed) and `moved`. `git status --short | grep -v '^R' | head` must print nothing (pure renames).

- [ ] **Step 2: Append the allowlist block to `.vercelignore`**

Append to `superwood-presentation/.vercelignore` (after the supermills block, before the `.env*` comment):

```
# Alex's data center deck (in-repo, co-owned) ships slides.html + assets/ only.
# His deck-local gate copies (gate.html, middleware.js, api/, vercel.json), the
# index.html stub, sources, prep/, archive/, media/, PDF and PPTX stay off the
# site. Same load-bearing index.html exclusion as above.
superwood-datacenter-investor/*
!superwood-datacenter-investor/slides.html
!superwood-datacenter-investor/assets
```

- [ ] **Step 3: Add routing to `vercel.json`**

Add to `redirects` (after the last supermills redirect):
```json
    {
      "source": "/datacenters",
      "destination": "/datacenters/",
      "permanent": false
    }
```
Add to `rewrites` (after the supermills rewrites):
```json
    {
      "source": "/datacenters/",
      "destination": "/superwood-datacenter-investor/slides"
    },
    {
      "source": "/datacenters/:path+",
      "destination": "/superwood-datacenter-investor/:path+"
    }
```
Add to `headers` (after the supermills header rule):
```json
    {
      "source": "/datacenters/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=604800"
        }
      ]
    }
```

- [ ] **Step 4: Verify the config parses and the allowlist reads as intended**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node -e "const v=require('./vercel.json');const r=v.redirects.find(x=>x.source==='/datacenters');const w=v.rewrites.filter(x=>x.source.startsWith('/datacenters'));const h=v.headers.find(x=>x.source==='/datacenters/assets/(.*)');console.log(r&&r.destination==='/datacenters/'&&w.length===2&&w[0].destination==='/superwood-datacenter-investor/slides'&&w[1].destination==='/superwood-datacenter-investor/:path+'&&!!h&&!('trailingSlash' in v)?'vercel.json OK':'vercel.json WRONG')" && grep -c '^!superwood-datacenter-investor/' .vercelignore && test -f superwood-datacenter-investor/index.html && echo "stub present in git (excluded by allowlist)"; cd ..
```
Expected: `vercel.json OK`, `2`, `stub present in git (excluded by allowlist)`.

- [ ] **Step 5: Commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add -A superwood-datacenter-investor superwood-presentation/superwood-datacenter-investor superwood-presentation/.vercelignore superwood-presentation/vercel.json && git commit -m "Data center deck moves under the site and is served at /datacenters"
```

---

### Task 2: Register the deck and load the tracker

**Files:**
- Modify: `superwood-presentation/api/_decks.mjs` (one registry line)
- Modify: `superwood-presentation/deck-track.js:11` (prefix mirror)
- Modify: `superwood-presentation/superwood-datacenter-investor/slides.html` (`<head>`, one script tag)

**Interfaces:**
- Produces: `DECKS.datacenters` with `password: 'SUPERMILLS_PASSWORD'`; `deckFromPath('/datacenters/…') === 'datacenters'`. Task 3 relies on `DECKS[id].password` being an env var name shared by supermills and datacenters.

- [ ] **Step 1: Write the failing test** (scratch file, not committed)

```bash
mkdir -p /tmp/dcdeck && cat > /tmp/dcdeck/registry.test.mjs <<'EOF'
import { DECKS, deckFromPath } from '/Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation/api/_decks.mjs';
import { readFileSync } from 'node:fs';
const fail = (m) => { console.error('FAIL', m); process.exit(1); };
const d = DECKS.datacenters;
if (!d) fail('no datacenters entry');
if (d.label !== 'SUPERWOOD for Data Centers' || d.prefix !== '/datacenters' || d.home !== '/datacenters/' || d.password !== 'SUPERMILLS_PASSWORD') fail('entry fields ' + JSON.stringify(d));
if (deckFromPath('/datacenters/') !== 'datacenters') fail('home path');
if (deckFromPath('/datacenters/assets/x.png') !== 'datacenters') fail('asset path');
if (deckFromPath('/datacenters') !== 'datacenters') fail('bare path');
if (deckFromPath('/datacentersx') !== 'superwood') fail('prefix must not match /datacentersx');
if (deckFromPath('/supermills-deck/') !== 'supermills') fail('supermills unchanged');
const base = '/Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation/';
const track = readFileSync(base + 'deck-track.js', 'utf8');
if (!/PREFIXES=\{supermills:'\/supermills-deck',datacenters:'\/datacenters'\}/.test(track)) fail('tracker prefix mirror');
const slides = readFileSync(base + 'superwood-datacenter-investor/slides.html', 'utf8');
const head = slides.slice(0, slides.indexOf('</head>'));
if ((head.match(/<script src="\/deck-track\.js" defer><\/script>/g) || []).length !== 1) fail('tracker tag in <head> exactly once');
console.log('registry + tracker OK');
EOF
node /tmp/dcdeck/registry.test.mjs
```
Expected: `FAIL no datacenters entry`.

- [ ] **Step 2: Add the registry line**

In `superwood-presentation/api/_decks.mjs`, inside `DECKS`, after the `supermills` line:
```js
  // Alex's data center deck lives in this repo (co-owned, no subtree). It shares
  // the supermills password variable on purpose: one password, one unlock.
  datacenters: { label: 'SUPERWOOD for Data Centers', prefix: '/datacenters', home: '/datacenters/', password: 'SUPERMILLS_PASSWORD' },
```

- [ ] **Step 3: Mirror the prefix in the tracker**

`superwood-presentation/deck-track.js` line 11 becomes:
```js
  var PREFIXES={supermills:'/supermills-deck',datacenters:'/datacenters'}; // mirror of api/_decks.mjs — update both
```

- [ ] **Step 4: Load the tracker in the deck**

In `superwood-presentation/superwood-datacenter-investor/slides.html`, insert directly after the `<meta name="viewport" …>` line in `<head>`:
```html
<script src="/deck-track.js" defer></script>
```
(The file 404s on Alex's own Vercel project; nothing else in the deck changes.)

- [ ] **Step 5: Run the test**

```bash
node /tmp/dcdeck/registry.test.mjs
```
Expected: `registry + tracker OK`.

- [ ] **Step 6: Commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/api/_decks.mjs superwood-presentation/deck-track.js superwood-presentation/superwood-datacenter-investor/slides.html && git commit -m "Register the data center deck; deck loads the shared tracker"
```

---

### Task 3: One password unlock per password variable

**Files:**
- Modify: `superwood-presentation/middleware.js:29-35, 97-99, 115-117`
- Modify: `superwood-presentation/api/enter.mjs:56-62, 64-72, 151-155`

**Interfaces:**
- Consumes: `DECKS[id].password` (env var name) from Task 2.
- Produces: cookie `sw_pw_<var lowercased>` set by `POST /api/enter`, read by `middleware.js` and `GET /api/enter?path=`. Function `passwordPassed(req, varName)` in both files (same semantics, different cookie accessors).

- [ ] **Step 1: Write the failing test** (scratch, not committed; exercises both files in-process)

```bash
cat > /tmp/dcdeck/pw.test.mjs <<'EOF'
process.env.AUTH_SECRET = 'test-secret';
process.env.SUPERMILLS_PASSWORD = 'open-sesame';
delete process.env.DATABASE_URL;
const base = '/Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation/';
const { createHmac } = await import('node:crypto');
const enter = (await import(base + 'api/enter.mjs')).default;
const middleware = (await import(base + 'middleware.js')).default;
const fail = (m) => { console.error('FAIL', m); process.exit(1); };
const h = (s) => createHmac('sha256', 'test-secret').update(s).digest('hex');
const exp = Date.now() + 3600e3;
const b64 = Buffer.from('t@example.com').toString('base64url');
const auth = `sw_auth=${b64}.${exp}.${h(`${b64}.${exp}`)}`;
const pw = `sw_pw_supermills_password=${exp}.${h(`pw.SUPERMILLS_PASSWORD.${exp}`)}`;
const oldDeck = `sw_deck_datacenters=${exp}.${h(`deck.datacenters.${exp}`)}`;
const oldSm = `sw_deck_supermills=${exp}.${h(`deck.supermills.${exp}`)}`;

// --- api/enter.mjs harness
function res() { const r = { code: 200, headers: {}, body: null }; r.status = (c) => { r.code = c; return r; }; r.json = (b) => { r.body = b; return r; }; r.setHeader = (k, v) => { r.headers[k.toLowerCase()] = v; }; return r; }
async function get(path, cookie) { const r = res(); await enter({ method: 'GET', headers: { cookie }, query: { path } }, r); return r.body.m; }
async function post(body, cookie) { const r = res(); await enter({ method: 'POST', headers: { cookie, host: 'investors.inventwood.net' }, body }, r); return r; }

if (await get('/datacenters/', '') !== 3) fail('GET no cookies -> 3');
if (await get('/datacenters/', auth) !== 2) fail('GET auth only -> 2');
if (await get('/datacenters/', `${auth}; ${oldDeck}`) !== 2) fail('old sw_deck cookie must not unlock');
if (await get('/datacenters/', `${auth}; ${pw}`) !== 0) fail('auth + sw_pw -> 0');
if (await get('/supermills-deck/', `${auth}; ${pw}`) !== 0) fail('same sw_pw unlocks supermills');
if (await get('/supermills-deck/', `${auth}; ${oldSm}`) !== 2) fail('old supermills cookie must not unlock');
if (await get('/intro', auth) !== 0) fail('superwood needs no password');

let r = await post({ password: 'wrong', next: '/datacenters/' }, auth);
if (r.code !== 401 || r.headers['set-cookie']) fail('wrong password -> 401, no cookie');
r = await post({ password: 'open-sesame', next: '/datacenters/' }, auth);
if (r.code !== 200) fail('right password -> 200');
const sc = (r.headers['set-cookie'] || []).join('\n');
if (!/^sw_pw_supermills_password=\d+\.[0-9a-f]{64}; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Domain=inventwood\.net$/m.test(sc)) fail('cookie shape: ' + sc);
if (/sw_deck_/.test(sc)) fail('must not set sw_deck_*');
if (r.body.redirect !== '/datacenters/?v=t%40example.com') fail('redirect ' + r.body.redirect);
const [name, val] = sc.split(';')[0].split('=');
if (await get('/supermills-deck/', `${auth}; ${name}=${val}`) !== 0) fail('freshly minted cookie unlocks the other deck');

// --- middleware.js harness
async function mw(path, cookie) { const out = await middleware(new Request('https://investors.inventwood.net' + path, { headers: cookie ? { cookie } : {} })); return { swx: (out.headers.get('set-cookie') || '').match(/_swx=(\d)/)?.[1] ?? null, rewrite: out.headers.get('x-middleware-rewrite'), next: out.headers.get('x-middleware-next') }; }
let m = await mw('/datacenters/', '');
if (m.swx !== '3') fail('mw no cookies -> _swx=3, got ' + JSON.stringify(m));
m = await mw('/datacenters/', auth);
if (m.swx !== '2') fail('mw auth only -> _swx=2');
m = await mw('/datacenters/assets/x.png', `${auth}; ${oldDeck}`);
if (m.swx !== '2') fail('mw old sw_deck must not unlock');
m = await mw('/datacenters/', `${auth}; ${pw}`);
if (m.swx !== null || !m.next) fail('mw auth + sw_pw -> next(), got ' + JSON.stringify(m));
m = await mw('/supermills-deck/assets/y.png', `${auth}; ${pw}`);
if (m.swx !== null || !m.next) fail('mw same cookie unlocks supermills');
m = await mw('/%64atacenters/', auth);
if (m.swx !== '2') fail('mw decoded-path check still holds');
console.log('password cookie OK');
EOF
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node /tmp/dcdeck/pw.test.mjs; cd ..
```
Expected: `FAIL old sw_deck cookie must not unlock` (the old code still honors `sw_deck_*` and knows nothing of `sw_pw_*`). If the middleware import itself fails because `@vercel/edge` cannot run in Node, report NEEDS_CONTEXT — do not delete the middleware assertions.

- [ ] **Step 2: Re-key the cookie in `middleware.js`**

Replace lines 29-35 (`deckPassed`) with:
```js
// True when this browser already passed the shared password stored in the
// named env var. Keyed to the variable, not the deck: every deck that names
// the same variable is unlocked by one entry (like sw_auth covers the site).
async function passwordPassed(req, varName) {
  const parts = String(getCookie(req, `sw_pw_${varName.toLowerCase()}`) || '').split('.');
  if (parts.length !== 2) return false;
  const sig = await hmacHex(`pw.${varName}.${parts[0]}`, process.env.AUTH_SECRET || '');
  return sig === parts[1] && Number(parts[0]) > Date.now();
}
```
Line 99 becomes:
```js
        if (deckPw && !(await passwordPassed(req, deck.password))) return toGate(req, NEED_PASSWORD);
```
Line 117 becomes:
```js
  return toGate(req, NEED_EMAIL | (deckPw && !(await passwordPassed(req, deck.password)) ? NEED_PASSWORD : 0));
```

- [ ] **Step 3: Re-key the cookie in `api/enter.mjs`**

Replace lines 56-62 (`deckPassed`) with:
```js
// True when this browser already passed the shared password stored in the
// named env var (cookie keyed to the variable so decks sharing a password
// share the unlock).
async function passwordPassed(req, varName) {
  const parts = String(getCookie(req, `sw_pw_${varName.toLowerCase()}`) || '').split('.');
  if (parts.length !== 2) return false;
  const sig = await hmacHex(`pw.${varName}.${parts[0]}`, process.env.AUTH_SECRET || '');
  return sig === parts[1] && Number(parts[0]) > Date.now();
}
```
In `needFor` (lines 64-72), change the `needPassword` line and return the variable name:
```js
async function needFor(req, target) {
  const deckId = deckFromPath(target);
  const deck = DECKS[deckId];
  const pwVar = deck && deck.password ? deck.password : '';
  const deckPw = pwVar ? (process.env[pwVar] || '') : '';
  const knownEmail = await authedEmail(req);
  const needPassword = !!deckPw && !(await passwordPassed(req, pwVar));
  return { deckId, pwVar, deckPw, knownEmail, needPassword };
}
```
Line 95 destructures the extra field:
```js
  const { deckId, pwVar, deckPw, knownEmail, needPassword } = await needFor(req, target);
```
Replace lines 151-155 (the `sw_deck_` cookie block) with:
```js
  if (needPassword) {
    const exp = Date.now() + MAX_AGE * 1000;
    const sig = await hmacHex(`pw.${pwVar}.${exp}`, process.env.AUTH_SECRET);
    cookies.push(`sw_pw_${pwVar.toLowerCase()}=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}${domain}`);
  }
```
Update the file header comment (line 6) from `the deck's shared password (sw_deck_<id>)` to `the deck's shared password (sw_pw_<var>)`.

- [ ] **Step 4: Run the test**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node /tmp/dcdeck/pw.test.mjs && ! grep -rn 'sw_deck_\|deckPassed' middleware.js api/enter.mjs && echo "no sw_deck_ left"; cd ..
```
Expected: `password cookie OK` and `no sw_deck_ left`.

- [ ] **Step 5: Commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/middleware.js superwood-presentation/api/enter.mjs && git commit -m "One password unlock covers every deck sharing the variable"
```

---

### Task 4: Docs and change log

**Files:**
- Modify: `CLAUDE.md` (deck list bullet after line 10; the "Per-deck shared password" bullet at line 42)
- Modify: `superwood-presentation/changes.html` (append one `LOG` entry before the closing `];` at line 525)

- [ ] **Step 1: Add the deck bullet to `CLAUDE.md`**

Insert after the `supermills-america-overview` bullet (line 10):
```markdown
- `superwood-presentation/superwood-datacenter-investor/` — Alex's SUPERWOOD for Data Centers deck, served at `/datacenters` (`vercel.json` redirects `/datacenters` → `/datacenters/`, rewrites `/datacenters/` → its `slides` page and `/datacenters/…` onto its files) behind the email gate plus the shared deck password. Unlike supermills this deck is **in-repo and co-owned**: Alex commits to it here (no subtree, no sync script) and we may edit it too (the tracker line). Only `slides.html` + `assets/` deploy — the root `.vercelignore` allowlist keeps his `prep/`, `archive/`, `media/`, PDF/PPTX and his deck-local gate copies (`gate.html`, `middleware.js`, `api/`, `vercel.json`, the `index.html` stub) off the site; those exist for his own Vercel project `superwood-datacenter-investor` (`superwood-datacenter-investor.vercel.app`), which is his staging — he deploys it from inside this directory. A symlink from `superwood-presentation/` to a root-level directory does not deploy (the CLI uploads the link, not the files; tested 2026-09-06), which is why the directory lives here.
```

- [ ] **Step 2: Update the password bullet in `CLAUDE.md`**

In the `**Per-deck shared password.**` bullet (line 42): replace `(supermills: \`SUPERMILLS_PASSWORD\`, in production + preview)` with `(supermills and datacenters both name \`SUPERMILLS_PASSWORD\`, set in production + preview — one password for all gated decks for now)`, and replace `sets \`sw_auth\` and/or the signed \`sw_deck_<id>\` cookie (30 days, same HMAC/domain rules as \`sw_auth\`)` with `sets \`sw_auth\` and/or the signed \`sw_pw_<env var name, lowercased>\` cookie (30 days, same HMAC/domain rules as \`sw_auth\`; keyed to the password *variable*, so every deck naming the same variable is unlocked by one entry — give a deck its own variable to give it its own unlock)`.

- [ ] **Step 3: Append the LOG entry in `changes.html`**

Before the closing `];` of `const LOG` (line 525), after the `2026-09-04` entry, add:
```js
 {iso:'2026-09-06',date:'Sep 6',topic:'Decks',title:'SUPERWOOD for Data Centers deck joins the site',slides:[],req:'Alex: deploy the new data center investor deck to investor.inventwood.net/datacenters, behind the password.',items:[
  ['Served at /datacenters behind the email gate and the shared deck password; on /stats with its own tab',''],
  ['One password entry now unlocks every deck that shares it (SUPERMILLS viewers enter it once more)','']]},
```

- [ ] **Step 4: Verify the LOG still parses and the docs mention the new paths**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && node -e "const s=require('fs').readFileSync('superwood-presentation/changes.html','utf8');const m=s.match(/const LOG=\[([\s\S]*?)\n\];/);const l=new Function('return ['+m[1]+']')();console.log('LOG parses,',l.length,'entries, last:',l[l.length-1].title)" && grep -c 'superwood-datacenter-investor' CLAUDE.md && grep -c 'sw_pw_' CLAUDE.md && ! grep -n 'sw_deck_' CLAUDE.md && echo "no sw_deck_ in docs"
```
Expected: `LOG parses, N entries, last: SUPERWOOD for Data Centers deck joins the site`, a count ≥ 2, a count ≥ 1, `no sw_deck_ in docs`.

- [ ] **Step 5: Commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add CLAUDE.md superwood-presentation/changes.html && git commit -m "Docs + change log: data center deck at /datacenters, password-keyed unlock"
```

---

### Task 5: Gated staging deploy and acceptance checks (controller-run — needs the preview secret)

**Files:** none modified.

- [ ] **Step 1: Deploy to gated staging**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && npm run deploy:stage 2>&1 | tail -3
```
Expected: `Aliased https://superwood-stage.vercel.app → …`. Wait 20 s before probing.

- [ ] **Step 2: Pull the preview secrets into shell variables (never printed)**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && vercel env pull --environment=preview .env.check >/dev/null 2>&1 && export SECRET=$(grep '^AUTH_SECRET=' .env.check | cut -d'"' -f2) && export PW=$(grep '^SUPERMILLS_PASSWORD=' .env.check | cut -d'"' -f2) && rm .env.check && echo "secret len ${#SECRET}, pw set: $([ -n "$PW" ] && echo yes || echo NO)"
```
Expected: a non-zero length and `pw set: yes`.

- [ ] **Step 3: Run the acceptance checks**

```bash
G=https://superwood-stage.vercel.app && EXP=$(( $(date +%s) * 1000 + 3600000 )) && \
AUTH=$(AUTH_SECRET="$SECRET" node -e "const c=require('crypto');const p=Buffer.from('dc-test@example.com').toString('base64url')+'.'+$EXP;console.log(p+'.'+c.createHmac('sha256',process.env.AUTH_SECRET).update(p).digest('hex'))") && \
PWC=$(AUTH_SECRET="$SECRET" node -e "const c=require('crypto');console.log($EXP+'.'+c.createHmac('sha256',process.env.AUTH_SECRET).update('pw.SUPERMILLS_PASSWORD.'+$EXP).digest('hex'))") && \
OLD=$(AUTH_SECRET="$SECRET" node -e "const c=require('crypto');console.log($EXP+'.'+c.createHmac('sha256',process.env.AUTH_SECRET).update('deck.datacenters.'+$EXP).digest('hex'))") && \
echo "1 redirect: $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' $G/datacenters)" && \
echo "2 no cookies: $(curl -s -D - -o /dev/null $G/datacenters/ | grep -i -E '^(HTTP|set-cookie: _swx|cache-control)' | tr -d '\r' | tr '\n' ' ')" && \
echo "3a auth only: $(curl -s -D - -o /dev/null -H "Cookie: sw_auth=$AUTH" $G/datacenters/ | grep -i '^set-cookie: _swx' | tr -d '\r')" && \
echo "3b old sw_deck: $(curl -s -D - -o /dev/null -H "Cookie: sw_auth=$AUTH; sw_deck_datacenters=$OLD" $G/datacenters/ | grep -i '^set-cookie: _swx' | tr -d '\r')" && \
echo "4a deck: $(curl -s -w ' [%{http_code}]' -H "Cookie: sw_auth=$AUTH; sw_pw_supermills_password=$PWC" $G/datacenters/ | grep -o '<title>[^<]*\|\[[0-9]*\]$' | tr '\n' ' ')" && \
echo "4b asset: $(curl -s -D - -o /dev/null -H "Cookie: sw_auth=$AUTH; sw_pw_supermills_password=$PWC" "$G/datacenters/assets/inventwood_logo.png?v=29cddb1d" | grep -i -E '^(HTTP|content-type|cache-control)' | tr -d '\r' | tr '\n' ' ')" && \
echo "4c tracker: $(curl -s -H "Cookie: sw_auth=$AUTH; sw_pw_supermills_password=$PWC" $G/datacenters/ | grep -c 'src="/deck-track.js"')" && \
for p in /datacenters/PRODUCT.md /datacenters/gate /datacenters/middleware.js /datacenters/index /superwood-datacenter-investor/index.html; do echo "5 $p: $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sw_auth=$AUTH; sw_pw_supermills_password=$PWC" $G$p)"; done && \
echo "6a supermills same cookie: $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sw_auth=$AUTH; sw_pw_supermills_password=$PWC" $G/supermills-deck/)" && \
echo "6b supermills auth only: $(curl -s -D - -o /dev/null -H "Cookie: sw_auth=$AUTH" $G/supermills-deck/ | grep -i '^set-cookie: _swx' | tr -d '\r')" && \
echo "6c intro: $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sw_auth=$AUTH" '$G/intro?v=x')" && \
echo "7 wrong pw: $(curl -s -o /dev/null -w '%{http_code}' -X POST $G/api/enter -H 'Content-Type: application/json' -H "Cookie: sw_auth=$AUTH" -d '{"password":"nope","next":"/datacenters/"}')" && \
echo "7 right pw sets: $(curl -s -D - -o /dev/null -X POST $G/api/enter -H 'Content-Type: application/json' -H "Cookie: sw_auth=$AUTH" -d "$(PW="$PW" node -e 'console.log(JSON.stringify({password:process.env.PW,next:"/datacenters/"}))')" | grep -i -o '^set-cookie: sw_[a-z_]*=' | tr -d '\r')"; unset AUTH PWC OLD
```
Expected:
1. `307 https://superwood-stage.vercel.app/datacenters/`
2. `HTTP/2 200`, `set-cookie: _swx=3…`, `cache-control: no-store`
3a. `_swx=2`; 3b. `_swx=2`
4a. `<title>InventWood — SUPERWOOD for Data Centers [200]`; 4b. `200`, `content-type: image/png`, cache-control with `max-age=86400`; 4c. `1`
5. every line `404` (the `/datacenters/index` line may be `308`; none may be `200`)
6a. `200`; 6b. `_swx=2`; 6c. `200`
7. `401`, then `set-cookie: sw_pw_supermills_password=` (staging signups are allowed; this one is a password step only, no signup row)

- [ ] **Step 4: Stats API sees the deck**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && vercel env pull --environment=preview .env.check >/dev/null 2>&1 && export SK=$(grep '^STATS_KEY=' .env.check | cut -d'"' -f2) && rm .env.check && curl -s "https://superwood-stage.vercel.app/api/stats?deck=datacenters&key=$SK" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log('deck',j.deck,'decks',j.decks.map(d=>d.id).join(','),'slides',(j.slideOrder||[]).length)})"; unset SK SECRET PW; cd ..
```
Expected: `deck datacenters decks superwood,supermills,datacenters slides 0` (0 until a real browser visit; the stats API takes the key as the `key` query parameter, see `api/stats.mjs:78`). Then Shaun opens `https://superwood-stage.vercel.app/datacenters/` in a browser, signs in, and `/stats?deck=datacenters` should show 19 slides after one visit.

- [ ] **Step 5: Record the results in the ledger** (no commit; the acceptance evidence goes in the SDD ledger and the final report).

---

### Task 6: Production deploy, read-only verification, close out (controller-run)

- [ ] **Step 1: Push and deploy**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git push origin main && cd superwood-presentation && npm run deploy:prod 2>&1 | tail -3
```
Expected: `Aliased https://sw.inventwood.net` (never `decks-*`). Wait 20 s.

- [ ] **Step 2: Read-only production checks (no POST, no signup)**

```bash
G=https://investors.inventwood.net && echo "redirect: $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' $G/datacenters)" && echo "gate: $(curl -s -D - -o /dev/null $G/datacenters/ | grep -i -E '^(HTTP|set-cookie: _swx|cache-control)' | tr -d '\r' | tr '\n' ' ')" && echo "supermills gate: $(curl -s -D - -o /dev/null $G/supermills-deck/ | grep -i '^set-cookie: _swx' | tr -d '\r')" && echo "intro gate: $(curl -s -D - -o /dev/null $G/intro | grep -i '^set-cookie: _swx' | tr -d '\r')" && for p in /datacenters/PRODUCT.md /datacenters/gate /superwood-datacenter-investor/index.html; do echo "$p: $(curl -s -o /dev/null -w '%{http_code}' $G$p)"; done
```
Expected: `307 …/datacenters/`; gate `200` + `_swx=3` + `no-store`; supermills `_swx=3`; intro `_swx=1`; the three excluded paths never `200` with content (they return the gate page for unauthenticated requests — confirm with the production `AUTH_SECRET` minted cookie only if Shaun wants; otherwise rely on the staging result from Task 5). Then Shaun opens `/datacenters/` in his browser: email (if needed) + password once, deck renders, and `/stats` shows the third tab.

- [ ] **Step 3: Close the issue and hand Shaun the Slack note**

```bash
gh issue close 22 --repo alau-hi/decks --comment "Live at https://investors.inventwood.net/datacenters (email gate + shared password, on /stats). Directory moved under superwood-presentation/; one password unlock now covers every deck sharing the variable."
```
Then give Shaun the Slack note for Alex (the `.vercel` move command) — it only works once Alex has pulled the move commit.
