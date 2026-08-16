# Press Page (/press) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve Alex's press dossier at `/press` on the deck's domains, restyled to the deck's design language, gate-free; then (after human visual approval) point the deck's "View press highlights" button at it. Spec: `docs/superpowers/specs/2026-08-15-press-page-design.md`. GitHub issue #8.

**Architecture:** New self-contained `press.html` in `superwood-presentation/` (cleanUrls serves it at `/press`). The source page's semantic markup and filter JS are kept verbatim — only the `<style>` block and page chrome (document shell, header row) are new. One-line `OPEN_PATHS` addition in `middleware.js`. The deck button flip is a separate task gated on human review.

**Tech Stack:** Static HTML/CSS/vanilla JS, Vercel (cleanUrls), Edge middleware. No build step, no dependencies, no test framework — verification is scripted `node`/`grep` checks plus live curls.

## Global Constraints

- **Never run `vercel` from the repo root.** Deploys: `cd superwood-presentation && npm run deploy:prod` in one shell command. If output says "Failed to link alau-hi/decks" or aliases to `decks-*.vercel.app` — STOP, report BLOCKED.
- All paths relative to `superwood-presentation/` unless they start with `docs/`.
- No new npm dependencies. No external assets beyond the Google Fonts link already used by `stats.html`.
- Source content migrates **1:1** — 48 `class="article"` entries, 4 tier sections, stat tiles, search + 7 filter buttons, foundational-paper block, footnote. No editorial changes, no dropped entries.
- The source's `<script>` block (stat population + search/filter logic) is kept **verbatim**.
- **Task 2 must not start until the human has approved the live page.** This is a plan-mandated stop.
- Commit messages: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Build `press.html`, open the path, deploy for review

**Files:**
- Create: `press.html`
- Modify: `middleware.js` (the `OPEN_PATHS` set)
- Source: fetch `https://bucolic-paletas-474eff.netlify.app` (a session snapshot may exist at `/private/tmp/claude-501/-Users-sklop-build-inventwood-alau-hi-decks/5ff2dd24-731d-419a-a949-c635a4040904/scratchpad/press-netlify.html`; prefer a fresh fetch)

**Interfaces:**
- Consumes: the Netlify page's markup — wrapper `div.pc-root` containing `header.masthead` (`.kicker`, `h1.title`, `p.deck`, `.byline`), `.stats` (4 `.stat` tiles with ids `stat-total`/`stat-tier1`/`stat-trade`/`stat-video`), `.controls` (`input#search.search` + 7 `button.filter-btn` with `data-filter` values `all|tier1|tier2|tier3|video|2025|2026`), `#empty.empty`, four `section.tier[data-tier="tier1|tier2|tier3|video"]` each with `.tier-head` (`.tier-num`, `.tier-label` > `h2.tier-title` + `.tier-sub`) and `ol.articles` > `li.article[data-tier][data-year]` (`.a-rank`, `.a-main` > `.a-outlet` + `a.a-headline` + `.a-note`, `.a-date`, `a.a-link`), then `.foundational` and `.footnote`, then the `<script>`. The JS toggles `.article.hidden`, `.empty.show`, `.filter-btn.active`, and hides empty tier sections via inline style.
- Produces: `/press` live and ungated; Task 2 relies only on the URL `/press` existing.

- [ ] **Step 1: Fetch the source**

```bash
cd superwood-presentation && curl -s https://bucolic-paletas-474eff.netlify.app -o /tmp/press-src.html && grep -c 'class="article"' /tmp/press-src.html
```

Expected: `48`. If the fetch fails, use the session snapshot path above; if that's gone too, report BLOCKED.

- [ ] **Step 2: Assemble `press.html`**

Structure of the new file, in order:

1. Document shell + new style (below).
2. A new header row (below), inserted as the first child of `.pc-root`.
3. **Everything from the source between `<div class="pc-root">` and the final `</script>` inclusive, verbatim** — masthead through footnote plus the script — except the source's leading HTML comment and its entire `<style>…</style>` block, which are dropped (replaced by ours). Do not edit any article/tier markup or the script.

Document shell — the file starts with exactly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>In the Press — InventWood</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
```

then the complete CSS below, then `</style></head><body>`, then the content, then `</body></html>`.

The complete CSS (this replaces the source's `<style>` block entirely; class names match the source markup):

```css
:root{
  --ink:#1f150c;--ink2:#2a1d11;
  --cream:#f4ecdf;--cream-dim:#cdbfa9;--muted:#9d8d76;
  --wood:#b87d44;--wood-bright:#cda165;--wood-deep:#8a4f23;
  --teal:#2fa38f;
  --line:rgba(228,210,180,.16);--grid:rgba(228,210,180,.08);
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--ink);color:var(--cream);-webkit-font-smoothing:antialiased;min-height:100vh}
.pc-root{max-width:960px;margin:0 auto;padding:6vh 5vw 60px}
.backrow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:30px;font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
.backrow a{color:var(--cream-dim);text-decoration:none;letter-spacing:.12em;font-size:.72rem;text-transform:none}
.backrow a:hover{color:var(--cream)}
.masthead{margin-bottom:26px}
.kicker{font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--wood-bright);margin-bottom:12px}
.title{font-family:'Fraunces',serif;font-weight:400;font-size:clamp(1.9rem,4.5vw,2.9rem);line-height:1.05;margin-bottom:14px}
.deck{font-size:.95rem;line-height:1.65;color:var(--cream-dim);max-width:640px}
.byline{font-size:.68rem;color:var(--muted);margin-top:12px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:26px 0 18px}
@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{border:1px solid var(--line);border-radius:10px;padding:14px 16px;background:rgba(244,236,223,.02)}
.stat-num{font-family:'Fraunces',serif;font-size:1.7rem;color:var(--wood-bright)}
.stat-label{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:4px}
.controls{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 6px}
.search{flex:1 1 240px;padding:10px 14px;background:rgba(244,236,223,.04);border:1px solid var(--line);border-radius:8px;color:var(--cream);font-family:'Inter',sans-serif;font-size:.85rem;outline:none}
.search:focus{border-color:var(--wood)}
.search::placeholder{color:var(--muted)}
.filter-btn{padding:8px 14px;font-family:'Inter',sans-serif;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;background:transparent;border:1px solid var(--line);border-radius:8px;color:var(--cream-dim);cursor:pointer}
.filter-btn:hover{color:var(--cream)}
.filter-btn.active{background:linear-gradient(135deg,var(--wood-deep),var(--wood));border-color:transparent;color:var(--cream)}
.empty{display:none;padding:34px;text-align:center;color:var(--muted)}
.empty.show{display:block}
.tier{margin-top:40px}
.tier[data-tier="tier1"]{--acc:var(--wood-bright)}
.tier[data-tier="tier2"]{--acc:var(--teal)}
.tier[data-tier="tier3"]{--acc:var(--cream-dim)}
.tier[data-tier="video"]{--acc:var(--wood)}
.tier-head{display:flex;gap:14px;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:12px}
.tier-num{font-family:'Fraunces',serif;font-size:1.5rem;color:var(--acc);min-width:1.6em}
.tier-title{font-family:'Fraunces',serif;font-weight:500;font-size:1.15rem}
.tier-sub{font-size:.68rem;color:var(--muted);margin-top:3px}
.articles{list-style:none}
.article{display:grid;grid-template-columns:2.2rem 1fr auto auto;gap:14px;align-items:baseline;padding:16px 4px;border-bottom:1px solid var(--grid)}
.article.hidden{display:none}
.a-rank{font-family:'Fraunces',serif;font-size:.85rem;color:var(--acc)}
.a-outlet{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.a-headline{display:block;font-size:.95rem;font-weight:500;color:var(--cream);text-decoration:none;line-height:1.4}
.a-headline:hover{color:var(--wood-bright)}
.a-note{font-size:.78rem;line-height:1.6;color:var(--cream-dim);margin-top:6px;max-width:620px}
.a-date{font-size:.7rem;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.a-link{font-size:.72rem;color:var(--wood-bright);text-decoration:none;white-space:nowrap}
.a-link:hover{color:var(--cream)}
@media(max-width:700px){
  .article{grid-template-columns:1.6rem 1fr;row-gap:6px}
  .a-date{grid-column:2}
  .a-link{grid-column:2}
}
.foundational{margin-top:48px;border:1px solid var(--line);border-radius:10px;padding:20px 22px;background:rgba(244,236,223,.02)}
.foundational h3{font-family:'Fraunces',serif;font-weight:500;font-size:1rem;margin-bottom:10px;color:var(--wood-bright)}
.foundational p{font-size:.82rem;line-height:1.65;color:var(--cream-dim);margin-bottom:8px}
.foundational a{color:var(--wood-bright);text-decoration:none}
.foundational a:hover{color:var(--cream)}
.foundational em{color:var(--cream)}
.footnote{margin-top:26px;font-size:.7rem;line-height:1.7;color:var(--muted)}
```

Note: the source's `.foundational` block contains one inline `style="font-size: 13px; color: var(--muted);"` — leave it; `--muted` resolves against our tokens.

The new header row (insert directly after `<div class="pc-root">`, before `<header class="masthead">`):

```html
  <div class="backrow">
    <span>InventWood — SUPERWOOD</span>
    <a href="/intro">← Back to the deck</a>
  </div>
```

- [ ] **Step 3: Verify content parity**

```bash
cd superwood-presentation && grep -c 'class="article"' press.html && grep -c 'tier-title' press.html && grep -c 'target="_blank"' press.html && grep -c "netlify" press.html; node -e "const s=require('fs').readFileSync('press.html','utf8'); console.log('doctype', s.startsWith('<!DOCTYPE html>')); console.log('script kept', s.includes('applyFilters')); console.log('old style gone', !s.includes('Iowan Old Style')); console.log('backrow', s.includes('Back to the deck'));"
```

Expected: `48`, `4`, a number ≥ 96 (each article has 2 targeted links, plus the DOI link), `0` netlify references, then `doctype true`, `script kept true`, `old style gone true`, `backrow true`.

- [ ] **Step 4: Open the path in `middleware.js`**

Find the `OPEN_PATHS` definition (a Set or array containing `'/gate'`, `'/gate.html'`, `'/api/enter'`, `'/favicon.ico'`, `'/assets/og-cover.jpg'`) and add two entries, matching the existing literal style exactly:

```js
'/press', '/press.html',
```

- [ ] **Step 5: Deploy to production**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net` on project `superwood-presentation` (NOT `decks-*`).

- [ ] **Step 6: Live verification — ungated, complete**

```bash
curl -s -o /dev/null -w "press: %{http_code}\n" https://sw.inventwood.net/press && \
curl -s https://sw.inventwood.net/press | grep -c 'class="article"' && \
curl -s https://sw.inventwood.net/press | grep -c "email\|gate.html"
```

Expected: `press: 200`; `48` (a cookie-less request gets the real page, not the gate — this is the open-path proof); final count `0` (no gate markup leaked in). Also confirm the deck itself is untouched: `curl -s -o /dev/null -w "%{http_code}\n" https://sw.inventwood.net/intro` → 200.

- [ ] **Step 7: Commit and push**

```bash
git add superwood-presentation/press.html superwood-presentation/middleware.js && \
git commit -m "Press dossier at /press, deck-styled, gate-free

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

- [ ] **Step 8: STOP — human visual review**

Task 1 ends here. Report the live URL (`https://sw.inventwood.net/press`) for Shaun and Alex to eyeball on desktop and phone. **Do not begin Task 2 until the human approves the look.**

---

### Task 2: Flip the deck button (ONLY after human approval)

**Files:**
- Modify: `index.html` (one line, the "In the Press" slide CTA)

**Interfaces:**
- Consumes: `/press` live from Task 1.
- Produces: deck button opens `/press` on the viewer's current domain; closes issue #8.

- [ ] **Step 1: Change the button href**

In `index.html`, find:

```html
<a class="btn" href="https://bucolic-paletas-474eff.netlify.app/" target="_blank" rel="noopener">View press highlights →</a>
```

and change only the href:

```html
<a class="btn" href="/press" target="_blank" rel="noopener">View press highlights →</a>
```

- [ ] **Step 2: Verify no other Netlify references remain**

```bash
cd superwood-presentation && grep -rn "netlify" index.html press.html gate.html stats.html changes.html; echo "exit=$?"
```

Expected: no matches, `exit=1`.

- [ ] **Step 3: Deploy and verify**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then:

```bash
curl -s https://sw.inventwood.net/intro | grep -o 'href="[^"]*"[^>]*>View press highlights' 
```

Expected: `href="/press" …>View press highlights` (note: an unauthenticated `/intro` serves the gate, so run the curl with any valid `sw_auth` cookie — mint one locally from `AUTH_SECRET` exactly as the previous plan's verification did: `vercel env pull --environment=production .env.check --scope inventwood`, extract `AUTH_SECRET`, delete `.env.check`, build `sw_auth=<base64url(email)>.<expiry-ms>.<hmacSHA256hex(payload, secret)>` with Node's `createHmac`, and pass `-H "Cookie: sw_auth=..."`).

- [ ] **Step 4: Commit and close the issue**

```bash
git add superwood-presentation/index.html && \
git commit -m "Deck press button points to /press

Closes #8

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
