# Supermills Password Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After the email gate, require a single shared password (env `SUPERMILLS_PASSWORD`) to view anything under `/supermills-america-overview`, enforced server-side by the middleware.

**Architecture:** A dependency-free deck registry (`api/_decks.mjs`) says which URL prefix belongs to which deck and which env var holds its password. The Edge middleware, inside its already-authenticated branch, rewrites password-less requests for such a deck to `deckpass.html`; that page POSTs the password to `api/deckpass.mjs`, which constant-time-compares it and sets an HMAC-signed `sw_deck_<id>` cookie (30 days) using the same signing scheme and cookie rules as `sw_auth`. GitHub issue #20.

**Tech Stack:** Vercel Edge middleware (`@vercel/edge`), Vercel serverless `.mjs` (Node `crypto.timingSafeEqual`), static HTML. No database.

**Spec:** `docs/superpowers/specs/2026-09-03-supermills-password-gate-design.md`

## Global Constraints

- **Never run `vercel` from the repo root.** Deploys only via `npm run deploy:stage` / `npm run deploy:stage-open` / `npm run deploy:prod` from `superwood-presentation/`; expect `superwood-stage.vercel.app` / `superwood-stage-open.vercel.app` / `sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- **Pull-only rule:** nothing under `superwood-presentation/supermills-america-overview/` is touched.
- **Secrets:** never print `.env.check` or any secret/password value; extract with `grep`/`cut` into shell variables, `rm .env.check` immediately. The password value itself is set by Shaun in Vercel; it never enters the repo or chat.
- **Never sign in via `/api/enter` on production.** Production checks are read-only with minted cookies.
- Cookie: name `sw_deck_<deckId>`, value `<expiry-ms>.<hmacSHA256hex("deck.<deckId>.<expiry-ms>", AUTH_SECRET)>`, `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000` (30 days), plus `; Domain=inventwood.net` only when the request host ends in `inventwood.net` (identical rule to `api/enter.mjs`).
- Env-aware: no `AUTH_SECRET`, or `GATE_DISABLED=1`, or the deck's password env var unset → no password step anywhere.
- `api/_decks.mjs` must stay dependency-free (plain data + one function) — the Edge middleware imports it.
- Run git from the repo root (shell cwd persists). Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC`.

---

### Task 1: Deck registry, password endpoint, password page

**Files:**
- Create: `superwood-presentation/api/_decks.mjs`
- Create: `superwood-presentation/api/deckpass.mjs`
- Create: `superwood-presentation/deckpass.html`

**Interfaces:**
- Produces: `DECKS` (object keyed by deck id: `{ label, prefix, home, password? }`), `DEFAULT_DECK` (string), `deckFromPath(path) → deckId` — Task 2's middleware imports all three. `POST /api/deckpass {password, path}` → `200 {ok:true}` (cookie set when a check applied) or `401 {error}`. The page is served at `/deckpass` (cleanUrls).

- [ ] **Step 1: Registry**

```js
// Deck registry — the one place deck identity is defined. Dependency-free on
// purpose: the Edge middleware imports it as well as the Node APIs.
export const DECKS = {
  superwood:  { label: 'SUPERWOOD',          prefix: '/intro',                       home: '/intro' },
  supermills: { label: 'SUPERMILLS America', prefix: '/supermills-america-overview', home: '/supermills-america-overview/', password: 'SUPERMILLS_PASSWORD' },
};

// The deployment's own deck; rows with no better attribution belong to it.
export const DEFAULT_DECK = process.env.DECK_ID || 'superwood';

// Longest matching non-default prefix wins; anything else is the default deck.
export function deckFromPath(path) {
  const p = String(path || '');
  let best = null;
  for (const [id, d] of Object.entries(DECKS)) {
    if (id === DEFAULT_DECK) continue;
    const hit = p === d.prefix || p.startsWith(d.prefix + '/');
    if (hit && (!best || d.prefix.length > DECKS[best].prefix.length)) best = id;
  }
  return best || DEFAULT_DECK;
}
```

- [ ] **Step 2: Endpoint**

```js
import { timingSafeEqual } from 'node:crypto';
import { DECKS, deckFromPath } from './_decks.mjs';

const MAX_AGE = 30 * 24 * 3600; // 30 days, like sw_auth

const enc = new TextEncoder();
async function hmacHex(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function passwordOk(given, expected) {
  if (!given || !expected) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { password, path } = req.body || {};
  const id = deckFromPath(path);
  const deck = DECKS[id];
  const expected = deck && deck.password ? process.env[deck.password] || '' : '';
  // Ungated deployment, or a deck without a configured password: nothing to check.
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1' || !expected) {
    return res.status(200).json({ ok: true });
  }
  if (String(password || '').length > 200 || !passwordOk(password, expected)) {
    return res.status(401).json({ error: 'That password isn’t right.' });
  }
  const exp = Date.now() + MAX_AGE * 1000;
  const sig = await hmacHex(`deck.${id}.${exp}`, process.env.AUTH_SECRET);
  // Same cross-subdomain scoping as sw_auth (see api/enter.mjs).
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const domain = /(^|\.)inventwood\.net$/.test(host.split(':')[0]) ? '; Domain=inventwood.net' : '';
  res.setHeader('Set-Cookie', `sw_deck_${id}=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}${domain}`);
  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 3: Page**

Create `superwood-presentation/deckpass.html` — a copy of `gate.html`'s document with the form swapped. Exactly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>InventWood — Deck password</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#1f150c;--ink2:#2a1d11;
  --cream:#f4ecdf;--cream-dim:#cdbfa9;--muted:#9d8d76;
  --wood:#b87d44;--wood-bright:#cda165;--wood-deep:#8a4f23;
  --line:rgba(228,210,180,.16);
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:radial-gradient(120% 120% at 50% 0%,var(--ink2) 0%,var(--ink) 60%);color:var(--cream);-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:6vh 6vw}
.card{width:100%;max-width:320px}
h1{font-family:'Fraunces',serif;font-weight:400;letter-spacing:-.01em;line-height:1.05;font-size:clamp(2rem,5vw,2.6rem);margin-bottom:10px}
.sub{font-size:.95rem;line-height:1.6;color:var(--cream-dim);font-weight:300;margin-bottom:34px}
label{display:block;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin:0 0 8px 2px}
input{width:100%;padding:13px 15px;margin-bottom:20px;background:rgba(244,236,223,.04);border:1px solid var(--line);border-radius:8px;color:var(--cream);font-family:'Inter',sans-serif;font-size:.95rem;outline:none;transition:border-color .2s,background .2s}
input:focus{border-color:var(--wood);background:rgba(244,236,223,.07)}
input::placeholder{color:var(--muted);opacity:.6}
button{width:100%;padding:14px;border:none;border-radius:8px;background:linear-gradient(135deg,var(--wood-deep),var(--wood));color:var(--cream);font-family:'Inter',sans-serif;font-weight:600;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:filter .2s,opacity .2s;margin-top:4px}
button:hover{filter:brightness(1.12)}
button:disabled{opacity:.55;cursor:default}
.err{min-height:22px;font-size:.82rem;color:#d9906b;margin:14px 2px 0;opacity:0;transition:opacity .25s}
.err.show{opacity:1}
</style>
</head>
<body>
<div class="card">
  <h1>INVENTWOOD</h1>
  <p class="sub">This deck is shared with a password. Enter the password Alex or Shaun gave you.</p>
  <form id="f" novalidate>
    <input id="pw" type="password" name="password" placeholder="Password" aria-label="Password" autocomplete="current-password" required autofocus>
    <button id="go" type="submit">Open the deck</button>
    <div id="err" class="err"></div>
  </form>
</div>
<script>
const f=document.getElementById('f'),go=document.getElementById('go'),err=document.getElementById('err');
f.addEventListener('submit',async e=>{
  e.preventDefault();
  err.classList.remove('show');
  const password=document.getElementById('pw').value;
  if(!password){err.textContent='Please enter the password.';err.classList.add('show');return;}
  go.disabled=true;go.textContent='Checking…';
  try{
    const r=await fetch('/api/deckpass',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password,path:location.pathname})});
    const d=await r.json().catch(()=>({}));
    if(r.ok&&d.ok){location.reload();return;}
    err.textContent=d.error||'Something went wrong. Please try again.';
    err.classList.add('show');
  }catch(_){
    err.textContent='Network error. Please try again.';
    err.classList.add('show');
  }
  go.disabled=false;go.textContent='Open the deck';
});
</script>
</body>
</html>
```

- [ ] **Step 4: Unit check of the registry + endpoint logic (no deploy)**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check api/deckpass.mjs && node --input-type=module -e "
import { DECKS, DEFAULT_DECK, deckFromPath } from './api/_decks.mjs';
const t=(a,b,m)=>{ if(a!==b){console.error('FAIL',m,a,b);process.exit(1);} };
t(DEFAULT_DECK,'superwood','default');
t(deckFromPath('/supermills-america-overview'),'supermills','bare');
t(deckFromPath('/supermills-america-overview/'),'supermills','slash');
t(deckFromPath('/supermills-america-overview/assets/x.jpg'),'supermills','asset');
t(deckFromPath('/supermills-america-overviewX'),'superwood','no-false-prefix');
t(deckFromPath('/intro'),'superwood','intro');
t(deckFromPath('/deckpass'),'superwood','deckpass page is default deck');
t(deckFromPath(''),'superwood','empty');
t(DECKS.supermills.password,'SUPERMILLS_PASSWORD','env name');
console.log('registry ok');
" && node --input-type=module -e "
import handler from './api/deckpass.mjs';
const mk=(body,env)=>{ for(const k of ['AUTH_SECRET','GATE_DISABLED','SUPERMILLS_PASSWORD']) delete process.env[k]; Object.assign(process.env,env);
  const res={code:200,headers:{},status(c){this.code=c;return this;},json(o){this.body=o;return this;},setHeader(k,v){this.headers[k]=v;}};
  return handler({method:'POST',body,headers:{host:'sw.inventwood.net'}},res).then(()=>res); };
const t=(c,m)=>{ if(!c){console.error('FAIL',m);process.exit(1);} };
let r=await mk({password:'x',path:'/supermills-america-overview/'},{}); t(r.code===200&&r.body.ok&&!r.headers['Set-Cookie'],'ungated → ok, no cookie');
r=await mk({password:'x',path:'/supermills-america-overview/'},{AUTH_SECRET:'s'}); t(r.code===200&&!r.headers['Set-Cookie'],'no password configured → ok, no cookie');
r=await mk({password:'wrong',path:'/supermills-america-overview/'},{AUTH_SECRET:'s',SUPERMILLS_PASSWORD:'right'}); t(r.code===401,'wrong → 401');
r=await mk({password:'right',path:'/supermills-america-overview/'},{AUTH_SECRET:'s',SUPERMILLS_PASSWORD:'right'}); t(r.code===200&&/^sw_deck_supermills=\d+\.[0-9a-f]{64}; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Domain=inventwood\.net$/.test(r.headers['Set-Cookie']),'right → cookie: '+r.headers['Set-Cookie']);
r=await mk({password:'right',path:'/intro'},{AUTH_SECRET:'s',SUPERMILLS_PASSWORD:'right'}); t(r.code===200&&!r.headers['Set-Cookie'],'superwood path → nothing to check');
console.log('endpoint ok');
"
```

Expected: `registry ok`, `endpoint ok`.

- [ ] **Step 5: Commit**

```bash
git add superwood-presentation/api/_decks.mjs superwood-presentation/api/deckpass.mjs superwood-presentation/deckpass.html && git commit -m "Deck registry, shared-password endpoint and page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

---

### Task 2: Middleware enforcement + staging deploy

**Files:**
- Modify: `superwood-presentation/middleware.js`

**Interfaces:**
- Consumes: `DECKS`, `deckFromPath` from `./api/_decks.mjs` (Task 1); cookie format from Global Constraints.
- Produces: authenticated requests under a password-protected deck without a valid `sw_deck_<id>` cookie are rewritten to `/deckpass`.

- [ ] **Step 1: Import the registry**

At the top of `superwood-presentation/middleware.js`, after `import { next, rewrite } from '@vercel/edge';` add:

```js
import { DECKS, deckFromPath } from './api/_decks.mjs';
```

- [ ] **Step 2: Enforce inside the authenticated branch**

In the `if (sig === expected && Number(exp) > Date.now()) {` block, immediately after the `/changes` admin block (the one ending `return rewrite(new URL('/key', req.url));` + its closing `}`) and before the `// Keep the viewer identity on the URL…` comment, insert:

```js
        // Per-deck shared password (see api/_decks.mjs): only decks that
        // declare a password env var, and only where that var is set.
        const deckId = deckFromPath(path);
        const deck = DECKS[deckId];
        const deckPw = deck && deck.password ? process.env[deck.password] : '';
        if (deckPw) {
          const dParts = (getCookie(req, `sw_deck_${deckId}`) || '').split('.');
          let deckOk = false;
          if (dParts.length === 2) {
            const dSig = await hmacHex(`deck.${deckId}.${dParts[0]}`, process.env.AUTH_SECRET || '');
            deckOk = dSig === dParts[1] && Number(dParts[0]) > Date.now();
          }
          if (!deckOk) return rewrite(new URL('/deckpass', req.url));
        }
```

- [ ] **Step 3: Static check**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check middleware.js && grep -c "sw_deck_" middleware.js && grep -c "_decks.mjs" middleware.js
```

Expected: `1`, `1`.

- [ ] **Step 4: Deploy gated staging**

```bash
npm run deploy:stage 2>&1 | tail -1
```

Expected: `▲ Aliased https://superwood-stage.vercel.app → …`. Then an unauthenticated smoke check that the middleware still boots and gates:

```bash
G=https://superwood-stage.vercel.app; echo "gate: $(curl -s $G/supermills-america-overview/ | grep -c 'View the deck')  intro: $(curl -s -o /dev/null -w '%{http_code}' $G/intro)  deckpass page: $(curl -s -o /dev/null -w '%{http_code}' $G/deckpass)"
```

Expected: `gate: 2  intro: 200  deckpass page: 200` (the third is the gate page too — `/deckpass` is behind the email gate — any 200 is fine here). Cookie-based verification is controller-run (needs secrets): see Step 6.

- [ ] **Step 5: Commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/middleware.js && git commit -m "Middleware: shared password step for password-protected decks

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

- [ ] **Step 6 (controller): Verify on gated staging with minted cookies**

Requires `SUPERMILLS_PASSWORD` in the **preview** env (`vercel env ls preview | grep -c SUPERMILLS_PASSWORD` → 1; if 0, BLOCKED until Shaun sets it). Then, secrets in shell vars only:

```bash
cd superwood-presentation && vercel env pull --environment=preview .env.check >/dev/null 2>&1 && SECRET=$(grep '^AUTH_SECRET=' .env.check | cut -d'"' -f2) && PW=$(grep '^SUPERMILLS_PASSWORD=' .env.check | cut -d'"' -f2) && rm .env.check && \
AUTH=$(AUTH_SECRET="$SECRET" node -e "const c=require('crypto');const p=Buffer.from('watchman-test@example.com').toString('base64url')+'.'+(Date.now()+3600000);console.log(p+'.'+c.createHmac('sha256',process.env.AUTH_SECRET).update(p).digest('hex'))") && G=https://superwood-stage.vercel.app && \
echo "deck w/o pw cookie → password page: $(curl -s $G/supermills-america-overview/ -H "Cookie: sw_auth=$AUTH" | grep -c 'Open the deck')" && \
echo "asset w/o pw cookie → password page: $(curl -s $G/supermills-america-overview/assets/cube-hero.jpg -H "Cookie: sw_auth=$AUTH" | grep -c 'Open the deck')" && \
echo "wrong pw: $(curl -s -o /dev/null -w '%{http_code}' -X POST $G/api/deckpass -H 'Content-Type: application/json' -H "Cookie: sw_auth=$AUTH" -d '{"password":"nope","path":"/supermills-america-overview/"}')" && \
DC=$(curl -s -D - -o /dev/null -X POST $G/api/deckpass -H 'Content-Type: application/json' -H "Cookie: sw_auth=$AUTH" -d "$(PW="$PW" node -e 'console.log(JSON.stringify({password:process.env.PW,path:"/supermills-america-overview/"}))')" | grep -i '^set-cookie: sw_deck_supermills=' | sed 's/^[Ss]et-[Cc]ookie: //; s/;.*//') && echo "right pw set cookie: $([ -n "$DC" ] && echo yes || echo NO)" && \
echo "deck with both cookies: $(curl -s $G/supermills-america-overview/ -H "Cookie: sw_auth=$AUTH; $DC" | grep -c 'SUPERMILLS')" && \
echo "asset with both: $(curl -s -o /dev/null -w '%{http_code}' $G/supermills-america-overview/assets/cube-hero.jpg -H "Cookie: sw_auth=$AUTH; $DC")" && \
echo "superwood untouched: $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' $G/intro -H "Cookie: sw_auth=$AUTH")" && unset SECRET PW AUTH DC
```

Expected: `1`, `1`, `401`, `yes`, `≥1`, `200`, `302 …/intro?v=watchman-test%40example.com`. Also staging-open (no env vars): `curl -s https://superwood-stage-open.vercel.app/supermills-america-overview/ | grep -c SUPERMILLS` → ≥1 after `npm run deploy:stage-open` (no password page anywhere).

---

### Task 3: Docs, change log, production

**Files:**
- Modify: `CLAUDE.md`
- Modify: `superwood-presentation/changes.html` (`LOG` only)

- [ ] **Step 1: CLAUDE.md**

In the "Access gate & analytics (Vercel)" section, after the `middleware.js` bullet, add a bullet:

```markdown
- **Per-deck shared password.** `api/_decks.mjs` is the deck registry (id → label, URL prefix, home, optional `password` env-var name); `deckFromPath()` maps any path to a deck. A deck whose password env var is set (supermills: `SUPERMILLS_PASSWORD`, in production + preview) gets a second step after the email gate: the middleware rewrites password-less requests under its prefix to `deckpass.html`, which POSTs to `api/deckpass.mjs`; a correct password sets a signed `sw_deck_<id>` cookie (30 days, same HMAC/domain rules as `sw_auth`). Changing the password does not expire existing cookies. Unset var → no password step (collaborators, staging-open). The registry is dependency-free because the Edge middleware imports it.
```

Also change the sentence in the `superwood-presentation/supermills-america-overview/` bullet from "served, gated, at `/supermills-america-overview`" to "served at `/supermills-america-overview` behind the email gate plus a shared password (`SUPERMILLS_PASSWORD`)".

- [ ] **Step 2: Change log**

Append to `LOG` in `superwood-presentation/changes.html` (before the closing `];`, after the 'SUPERMILLS America deck joins the site' entry):

```js
 {iso:'2026-09-03',date:'Sep 3',topic:'Access',title:'Shared password on the SUPERMILLS deck',slides:[],req:'Password-protect the new deck with a single password for all users, after the email gate.',items:[
  ['After signing in with an email, visitors to /supermills-america-overview enter a shared password once per browser (30 days); the main deck is unchanged',''],
  ['Enforced server-side by the middleware via a small deck registry, so future decks can opt in with one line','']]}
```

- [ ] **Step 3: Verify, commit, push**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && grep -c "sw_deck_" CLAUDE.md && node -e "const s=require('fs').readFileSync('superwood-presentation/changes.html','utf8');const m=s.match(/const LOG=\[([\s\S]*?)\n\];/);new Function('return ['+m[1]+']')();console.log('LOG parses')" && git add CLAUDE.md superwood-presentation/changes.html && git commit -m "Docs + change log: shared password on the supermills deck

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

- [ ] **Step 4 (controller): Production** — requires `SUPERMILLS_PASSWORD` in the production env (`vercel env ls production | grep -c SUPERMILLS_PASSWORD` → 1).

```bash
cd superwood-presentation && npm run deploy:prod 2>&1 | grep -iE "aliased|decks-"
```

Read-only check with a minted production `sw_auth` (secret protocol as in Task 2 Step 6, `--environment=production`): deck path → password page (`Open the deck` = 1); `/intro` → 302 to `/intro?v=…`; no sign-in, no password POST on production.

- [ ] **Step 5 (controller): Close**

```bash
gh issue close 20 --repo alau-hi/decks --comment "Live: /supermills-america-overview now asks for the shared password after the email gate (signed sw_deck_supermills cookie, 30 days; env SUPERMILLS_PASSWORD). Registry: api/_decks.mjs. Plan: docs/superpowers/plans/2026-09-03-supermills-password-gate.md"
```
