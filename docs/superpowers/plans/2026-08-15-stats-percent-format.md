# Stats Percent-First Format Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Devices-card rows read `54.2% (123)` — percent first with one decimal, count in parentheses. Spec: `docs/superpowers/specs/2026-08-15-stats-percent-format-design.md`. GitHub issue #10.

**Architecture:** Two edits in `stats.html`, nothing else.

**Tech Stack:** Vanilla JS/CSS. Verification: grep + live curl.

## Global Constraints

- **Never run `vercel` from the repo root.** Deploy: `cd superwood-presentation && npm run deploy:prod`; expect `Aliased https://sw.inventwood.net`, never `decks-*` (STOP/BLOCKED if seen).
- Paths relative to `superwood-presentation/`. `stats.html` has a ~57KB single line (world map) — anchor edits by content, never print it.
- Only `stats.html` changes.
- Commit: short imperative + blank line + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Reformat the row number, deploy

**Files:**
- Modify: `stats.html`

- [ ] **Step 1: Edit the row-number expression**

In `renderDevices()`, change:

```js
    const n=document.createElement('div');n.className='n';n.textContent=r.sessions+' · '+Math.round(r.sessions/total*100)+'%';row.append(n);
```

to:

```js
    const n=document.createElement('div');n.className='n';n.textContent=(r.sessions/total*100).toFixed(1)+'% ('+r.sessions+')';row.append(n);
```

- [ ] **Step 2: Widen the number column**

In the `<style>` block, change:

```css
.hbar .n{flex:none;width:64px;color:var(--muted);font-variant-numeric:tabular-nums}
```

to:

```css
.hbar .n{flex:none;width:88px;color:var(--muted);font-variant-numeric:tabular-nums}
```

- [ ] **Step 3: Static verification**

```bash
cd superwood-presentation && grep -c "toFixed(1)+'% ('" stats.html; grep -c "width:88px" stats.html; grep -c "' · '+Math.round" stats.html
```

Expected: `1`, `1`, `0`.

- [ ] **Step 4: Deploy and verify live**

```bash
cd superwood-presentation && npm run deploy:prod
```

Expected: `Aliased https://sw.inventwood.net`. Then verify the code is live — `stats.html` is gated, so mint a `sw_auth` cookie from the pulled `AUTH_SECRET` (`vercel env pull --environment=production .env.check --scope inventwood`, extract, `rm .env.check`, `sw_auth=<base64url(email)>.<expiry-ms>.<hmacSHA256hex>` via Node `createHmac`). **Keep the secret in shell variables only — never echo/cat it to output, never write it into a script file.**

```bash
curl -s -H "Cookie: $COOKIE" https://sw.inventwood.net/stats.html | grep -c "toFixed(1)+'% ('"
```

Expected: `1`.

- [ ] **Step 5: Commit and close**

```bash
git add superwood-presentation/stats.html && \
git commit -m "Devices card rows read percent-first: 54.2% (123)

Closes #10

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```
