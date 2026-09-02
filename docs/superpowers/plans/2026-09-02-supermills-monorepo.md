# Supermills Deck Monorepo Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring Alex's SUPERMILLS America deck into the decks monorepo via `git subtree` and serve it, gated, at `/supermills-america-overview`, with the email gate returning visitors to the deck they came for.

**Architecture:** The deck is imported (with history) as ordinary files under `superwood-presentation/supermills-america-overview/`; a root `.vercelignore` keeps its docs off the deployment. `vercel.json` redirects the bare path to a trailing-slash URL and rewrites that to the deck's `slides` page so relative asset paths resolve under the prefix. `gate.html` sends the requested path as `next`; `api/enter.mjs` redirects there after sign-in (sanitized, default `/intro`). A sync script bridges the period when Alex still commits to his old repo. GitHub issue #19.

**Tech Stack:** git subtree; Vercel static hosting + `vercel.json` routing; Vercel serverless `.mjs`; Node ≥ 18 for the new deploy helper script.

**Spec:** `docs/superpowers/specs/2026-09-01-supermills-monorepo-design.md`

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy only via the `superwood-presentation/package.json` scripts, run from `superwood-presentation/` (`npm run deploy:stage-open`, `npm run deploy:stage`, `npm run deploy:prod`). Expected alias lines: `superwood-stage-open.vercel.app`, `superwood-stage.vercel.app`, `sw.inventwood.net`. If output mentions `decks-*`: STOP, report BLOCKED.
- **Pull-only rule:** never create, edit, or delete any file under `superwood-presentation/supermills-america-overview/` — that directory is Alex's subtree and is updated only by `git subtree add/pull`.
- **Never log in via `/api/enter` on production.** Sign-in checks run on gated staging only (`superwood-stage.vercel.app`, backed by the Neon staging branch). Production checks are read-only curls.
- **Never print secrets:** no `cat`/`echo` of `.env.check` or any key/URL containing credentials. This plan needs no secrets.
- Run `git` from the repo root (`/Users/sklop/build/inventwood/alau-hi/decks`); shell cwd persists between commands — check `pwd` before relative paths.
- Directory name and URL are fixed: `supermills-america-overview` (spec).
- `next` sanitizer regex is exactly `^/(?!/)[A-Za-z0-9_\-./]*$`; anything else falls back to `/intro`.
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC`.

---

### Task 1: Fix the staging deploy scripts (current Vercel CLI emits JSON to non-TTY stdout)

**Files:**
- Create: `superwood-presentation/scripts/alias-deploy.mjs`
- Modify: `superwood-presentation/package.json` (the `deploy:stage` and `deploy:stage-open` scripts only)

**Interfaces:**
- Produces: `npm run deploy:stage` → deploys preview and aliases `superwood-stage.vercel.app`; `npm run deploy:stage-open` → deploys `--target=staging-open` and aliases `superwood-stage-open.vercel.app`. Tasks 3–4 call these.

- [ ] **Step 1: Create the helper**

```js
#!/usr/bin/env node
// Deploy with the Vercel CLI and alias the result. The CLI now prints a JSON
// document to a non-TTY stdout (and a bare URL to a TTY), so the old
// `$(cat /tmp/url)` shell trick fed garbage to `vercel alias`. This parses both.
// Usage: node scripts/alias-deploy.mjs <alias-host> [extra `vercel deploy` args]
import { execFileSync } from 'node:child_process';

const [alias, ...extra] = process.argv.slice(2);
if (!alias) {
  console.error('usage: node scripts/alias-deploy.mjs <alias-host> [vercel deploy args]');
  process.exit(2);
}

const out = execFileSync('vercel', ['deploy', '--yes', '--scope', 'inventwood', ...extra], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
}).trim();

let url = null;
try {
  url = JSON.parse(out).deployment.url;
} catch {
  const lines = out.split('\n').map(l => l.trim()).filter(l => /^https:\/\/\S+$/.test(l));
  url = lines.pop() || null;
}
if (!url) {
  console.error('alias-deploy: could not find a deployment URL in vercel output');
  process.exit(1);
}
execFileSync('vercel', ['alias', 'set', url, alias, '--scope', 'inventwood'], { stdio: 'inherit' });
console.log(`▲ Aliased https://${alias} → ${url}`);
```

- [ ] **Step 2: Point the scripts at it**

In `superwood-presentation/package.json`, replace the two lines:

```json
    "deploy:stage": "vercel deploy --yes --scope inventwood > /tmp/sw-stage-url && vercel alias set $(cat /tmp/sw-stage-url) superwood-stage.vercel.app --scope inventwood",
    "deploy:stage-open": "vercel deploy --target=staging-open --yes --scope inventwood > /tmp/sw-stage-open-url && vercel alias set $(cat /tmp/sw-stage-open-url) superwood-stage-open.vercel.app --scope inventwood"
```

with:

```json
    "deploy:stage": "node scripts/alias-deploy.mjs superwood-stage.vercel.app",
    "deploy:stage-open": "node scripts/alias-deploy.mjs superwood-stage-open.vercel.app --target=staging-open"
```

`deploy:prod` and `dev` are untouched.

- [ ] **Step 3: Verify**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check scripts/alias-deploy.mjs && node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json parses')" && node scripts/alias-deploy.mjs; echo "exit=$?"
```

Expected: `package.json parses`; the bare run prints the usage line and `exit=2`. Then a real run:

```bash
npm run deploy:stage-open 2>&1 | tail -3
```

Expected: last line `▲ Aliased https://superwood-stage-open.vercel.app → https://superwood-presentation-….vercel.app`. Then `curl -s -o /dev/null -w "%{http_code}\n" https://superwood-stage-open.vercel.app/intro` → `200`.

- [ ] **Step 4: Commit**

```bash
git add superwood-presentation/scripts/alias-deploy.mjs superwood-presentation/package.json && git commit -m "Deploy scripts: parse the CLI's JSON output before aliasing

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

---

### Task 2: Import the deck as a subtree; keep its docs off the deployment; add the sync script

**Files:**
- Create (by git): `superwood-presentation/supermills-america-overview/**` — via `git subtree add`, never by hand
- Create: `superwood-presentation/.vercelignore`
- Modify: `superwood-presentation/package.json` (add one script)

**Interfaces:**
- Produces: `superwood-presentation/supermills-america-overview/slides.html` + `assets/` on disk; deployment excludes everything listed in `.vercelignore`; `npm run sync:supermills` pulls Alex's new commits.

- [ ] **Step 1: Preconditions**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git status --porcelain | wc -l && git subtree -h 2>&1 | head -1 && git ls-remote git@github.com:alau-hi/supermills-america.git main | cut -c1-12
```

Expected: `0` (clean tree — subtree add refuses otherwise), a usage line starting `usage: git subtree`, and a 12-char commit id. If `git subtree` is missing or the remote is unreachable: report BLOCKED.

- [ ] **Step 2: Import with history**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git subtree add --prefix=superwood-presentation/supermills-america-overview git@github.com:alau-hi/supermills-america.git main
```

This creates the merge commit itself. Verify:

```bash
ls superwood-presentation/supermills-america-overview | tr '\n' ' '; echo; git log --oneline -- superwood-presentation/supermills-america-overview | wc -l
```

Expected: the listing includes `slides.html index.html assets DESIGN.md STORY.md REFERENCES.md README.md sources`; the count is ≥ 145.

- [ ] **Step 3: Deployment ignore file**

Create `superwood-presentation/.vercelignore` with exactly:

```
# Alex's supermills deck ships slides.html + assets/ only. Its docs, sources,
# critique history, alt slides and redirect stub stay in git, off the deployment.
# (Only this root-level file applies to the Vercel project; the subtree's own
# .vercelignore is inert here.)
supermills-america-overview/README.md
supermills-america-overview/STORY.md
supermills-america-overview/DESIGN.md
supermills-america-overview/REFERENCES.md
supermills-america-overview/sources
supermills-america-overview/.impeccable
supermills-america-overview/feedback
supermills-america-overview/render
supermills-america-overview/alt-slide2.html
supermills-america-overview/alt-datacenter.html
supermills-america-overview/index.html
supermills-america-overview/.vercelignore
supermills-america-overview/.gitignore
```

(`index.html` is excluded so no filesystem match can pre-empt Task 3's rewrite — Alex's stub meta-refreshes to an absolute `/slides.html` that does not exist in this project.)

- [ ] **Step 4: Sync script**

Add to the `scripts` block of `superwood-presentation/package.json` (after `deploy:stage-open`):

```json
    "sync:supermills": "cd .. && git subtree pull --prefix=superwood-presentation/supermills-america-overview git@github.com:alau-hi/supermills-america.git main -m 'Sync supermills deck from alau-hi/supermills-america'"
```

(`git subtree` must run from the repo root, hence the `cd ..`; the prefix is repo-root-relative.)

- [ ] **Step 5: Verify**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'));console.log('ok')" && npm run sync:supermills 2>&1 | tail -2
```

Expected: `ok`, then subtree reports nothing new (a line containing `Already up to date` or `no new revisions were found` — wording varies by git version). Then `git -C .. status --porcelain` shows only `.vercelignore` and `package.json` as changes (the subtree merge is already committed).

- [ ] **Step 6: Commit and push**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/.vercelignore superwood-presentation/package.json && git commit -m "Supermills deck: deployment ignore list and sync script

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

(The push carries the subtree merge commit too.)

---

### Task 3: Routing + gate return-path, verified on both staging environments

**Files:**
- Modify: `superwood-presentation/vercel.json`
- Modify: `superwood-presentation/gate.html` (form submit handler only)
- Modify: `superwood-presentation/api/enter.mjs`

**Interfaces:**
- Consumes: Task 2's on-disk deck; Task 1's deploy scripts.
- Produces: `GET /supermills-america-overview` → 302 → `/supermills-america-overview/` → serves `slides.html`; `POST /api/enter {email, next}` → `{redirect: "<safeNext>?v=<email>"}`.

- [ ] **Step 1: Routing**

Replace the whole of `superwood-presentation/vercel.json` with:

```json
{
  "cleanUrls": true,
  "redirects": [
    { "source": "/", "destination": "/intro", "permanent": false },
    { "source": "/supermills-america-overview", "destination": "/supermills-america-overview/", "permanent": false }
  ],
  "rewrites": [
    { "source": "/intro", "destination": "/" },
    { "source": "/supermills-america-overview/", "destination": "/supermills-america-overview/slides" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=604800"
        }
      ]
    },
    {
      "source": "/supermills-america-overview/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=604800"
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Gate sends the requested path**

In `superwood-presentation/gate.html`, change the fetch line inside the submit handler from:

```js
    const r=await fetch('/api/enter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
```

to:

```js
    const r=await fetch('/api/enter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,next:location.pathname+location.search})});
```

(The middleware rewrites to `/gate` without changing the address bar, so `location.pathname` is the page the visitor asked for.) No markup or style changes.

- [ ] **Step 3: Enter honors `next`**

In `superwood-presentation/api/enter.mjs`, add after the `getCookie` helper (which Task 1 of the gate-watchman feature already added):

```js
// Same-site relative path only (no scheme, no host, no protocol-relative
// '//'); anything else lands on the deck's canonical entry.
function safeNext(raw) {
  const s = String(raw || '');
  return /^\/(?!\/)[A-Za-z0-9_\-./]*$/.test(s) ? s : '/intro';
}
```

Change the ungated short-circuit from:

```js
    return res.status(200).json({ redirect: '/intro' });
```

to:

```js
    return res.status(200).json({ redirect: safeNext((req.body || {}).next) });
```

Change the destructuring line from `const { email } = req.body || {};` to:

```js
  const { email, next } = req.body || {};
```

and the final return from:

```js
  return res.status(200).json({ redirect: `/intro?v=${encodeURIComponent(cleanEmail)}` });
```

to:

```js
  return res.status(200).json({ redirect: `${safeNext(next)}?v=${encodeURIComponent(cleanEmail)}` });
```

- [ ] **Step 4: Static checks**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && node --check api/enter.mjs && node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'));console.log('vercel.json parses')" && grep -c "safeNext" api/enter.mjs && grep -c "next:location.pathname" gate.html
```

Expected: `vercel.json parses`, `3` (the definition line plus its two call sites), `1`.

- [ ] **Step 5: Routing check on ungated staging**

```bash
npm run deploy:stage-open 2>&1 | tail -1
B=https://superwood-stage-open.vercel.app
echo "redirect: $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' $B/supermills-america-overview)"
echo "deck: $(curl -s $B/supermills-america-overview/ | grep -c 'SUPERMILLS')"
echo "asset: $(curl -s -o /dev/null -w '%{http_code}' $B/supermills-america-overview/assets/cube-hero.jpg)"
echo "docs hidden: $(curl -s -o /dev/null -w '%{http_code}' $B/supermills-america-overview/STORY.md) $(curl -s -o /dev/null -w '%{http_code}' $B/supermills-america-overview/index.html)"
echo "main deck intact: $(curl -s $B/intro | grep -c 'award-winning artist')"
```

Expected: `redirect: 30x https://superwood-stage-open.vercel.app/supermills-america-overview/` (302 or 307/308 — any redirect whose target ends in `/`); `deck: ` ≥ 1; `asset: 200`; `docs hidden: 404 404`; `main deck intact: 1`.

If `deck:` is `0`, fetch `curl -sI $B/supermills-america-overview/ | head -5` and report BLOCKED with the status/location — the trailing-slash source or the `.html`-less destination needs the controller's ruling (fallback documented in the spec: rewrite to `/supermills-america-overview/slides.html`).

- [ ] **Step 6: Return-path check on gated staging** (writes a test signup to the staging DB only — allowed)

```bash
npm run deploy:stage 2>&1 | tail -1
G=https://superwood-stage.vercel.app
curl -s -X POST $G/api/enter -H 'Content-Type: application/json' -A 'Mozilla/5.0 (Macintosh) Chrome/128.0' -d '{"email":"returnpath-test@example.com","next":"/supermills-america-overview/"}'; echo
curl -s -X POST $G/api/enter -H 'Content-Type: application/json' -A 'Mozilla/5.0 (Macintosh) Chrome/128.0' -d '{"email":"returnpath-test@example.com","next":"//evil.example/x"}'; echo
curl -s -X POST $G/api/enter -H 'Content-Type: application/json' -A 'Mozilla/5.0 (Macintosh) Chrome/128.0' -d '{"email":"returnpath-test@example.com"}'; echo
echo "gate shows for deck: $(curl -s -o /dev/null -w '%{http_code}' $G/supermills-america-overview/) $(curl -s $G/supermills-america-overview/ | grep -c 'View the deck')"
```

Expected, in order: `{"redirect":"/supermills-america-overview/?v=returnpath-test%40example.com"}`, `{"redirect":"/intro?v=returnpath-test%40example.com"}`, `{"redirect":"/intro?v=returnpath-test%40example.com"}`, `gate shows for deck: 200 1`.

- [ ] **Step 7: Commit and push**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && git add superwood-presentation/vercel.json superwood-presentation/gate.html superwood-presentation/api/enter.mjs && git commit -m "Serve the supermills deck at /supermills-america-overview; gate returns to the requested page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

---

### Task 4: Docs, change log, production rollout, close #19

**Files:**
- Modify: `CLAUDE.md` (repo root)
- Modify: `superwood-presentation/changes.html` (`LOG` array only)

- [ ] **Step 1: CLAUDE.md**

In the "What this repo is" bullet list near the top, after the `superwood-presentation/` bullet, add:

```markdown
- `superwood-presentation/supermills-america-overview/` — Alex's SUPERMILLS America deck, imported from `alau-hi/supermills-america` with `git subtree` (full history) and served, gated, at `/supermills-america-overview` (`vercel.json` redirects the bare path to the trailing-slash URL and rewrites it to `slides`; the deck's relative `assets/…` paths resolve under the prefix). Only `slides.html` + `assets/` deploy — the root `.vercelignore` keeps its docs, sources and Alex's `index.html` stub off the site. **Transition rule:** while Alex still commits to his original repo, that directory is pull-only in this repo — never edit it here; bring his changes in with `npm run sync:supermills` (from `superwood-presentation/`), then deploy. His `super-mills-america.vercel.app` deployment is his staging; production is whatever was synced and deployed here. Once he works in the monorepo, the sync script retires and the old repo is archived.
```

In the "Access gate & analytics" section, after the sentence describing `api/enter.mjs`, add one sentence:

```markdown
The gate remembers where the visitor was headed: `gate.html` posts the requested path as `next`, and `api/enter.mjs` redirects there (same-site relative paths only, else `/intro`) with `?v=<email>` appended — so a `/supermills-america-overview` link lands on that deck after sign-in.
```

- [ ] **Step 2: Change log**

In `superwood-presentation/changes.html`, append to the `LOG` array (before the closing `];`), after the `Gate watchman` entry:

```js
 {iso:'2026-09-02',date:'Sep 2',topic:'Decks',title:'SUPERMILLS America deck joins the site',slides:[],req:'Put Alex’s SUPERMILLS deck at investors.inventwood.net/supermills-america-overview, behind the same gate.',items:[
  ['The deck moved into this repo with its full history (git subtree) and is served at /supermills-america-overview; Alex’s own deployment stays his staging',''],
  ['The email gate now returns you to the page you asked for after signing in, instead of always landing on the main deck',''],
  ['Staging deploy scripts repaired for the current Vercel CLI','']]}
```

- [ ] **Step 3: Verify and commit**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks && grep -c "sync:supermills" CLAUDE.md && grep -c "supermills-america-overview" superwood-presentation/changes.html && node -e "const s=require('fs').readFileSync('superwood-presentation/changes.html','utf8');const m=s.match(/const LOG=\[([\s\S]*?)\n\];/);new Function('return ['+m[1]+']')();console.log('LOG parses')" && git add CLAUDE.md superwood-presentation/changes.html && git commit -m "Docs + change log: supermills deck in the monorepo

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013jCyQtjJLzJicDBW44CqKC" && git push
```

Expected: `1` (or more), `1` (or more), `LOG parses`.

- [ ] **Step 4 (controller): Production deploy and read-only check**

```bash
cd /Users/sklop/build/inventwood/alau-hi/decks/superwood-presentation && npm run deploy:prod 2>&1 | grep -iE "aliased|decks-" 
P=https://sw.inventwood.net
echo "redirect: $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' $P/supermills-america-overview)"
echo "gated: $(curl -s $P/supermills-america-overview/ | grep -c 'View the deck')"
echo "docs hidden: $(curl -s -o /dev/null -w '%{http_code}' $P/supermills-america-overview/STORY.md)"
echo "main deck gate intact: $(curl -s -o /dev/null -w '%{http_code}' $P/intro)"
```

Expected: `▲ Aliased https://sw.inventwood.net`; `redirect: 30x …/supermills-america-overview/`; `gated: 1` (unauthenticated → gate page); `docs hidden: 404`; `200`. No sign-in on production.

- [ ] **Step 5 (controller): Close the issue**

```bash
gh issue close 19 --repo alau-hi/decks --comment "Live: investors.inventwood.net/supermills-america-overview (gated; sign-in returns to the deck). Deck imported via git subtree at superwood-presentation/supermills-america-overview/ — pull-only while Alex still commits upstream; npm run sync:supermills brings his changes in. Plan: docs/superpowers/plans/2026-09-02-supermills-monorepo.md"
```
