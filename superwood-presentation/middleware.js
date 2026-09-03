import { next, rewrite } from '@vercel/edge';
import { DECKS, deckFromPath } from './api/_decks.mjs';

// Paths reachable without authentication. og-cover.jpg stays open so link
// previews render in email clients and chat apps.
const OPEN_PATHS = new Set(['/gate', '/gate.html', '/api/enter', '/api/gatehit', '/favicon.ico', '/assets/og-cover.jpg', '/press', '/press.html']);

const enc = new TextEncoder();
async function hmacHex(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

function b64urlDecode(s) {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  return atob(padded);
}

// True when this browser already passed the deck's shared password.
async function deckPassed(req, deckId) {
  const parts = String(getCookie(req, `sw_deck_${deckId}`) || '').split('.');
  if (parts.length !== 2) return false;
  const sig = await hmacHex(`deck.${deckId}.${parts[0]}`, process.env.AUTH_SECRET || '');
  return sig === parts[1] && Number(parts[0]) > Date.now();
}

// Send the visitor to the one gate screen, telling it what is still owed for
// the page they asked for (email | password | both) via a short-lived,
// JS-readable cookie; the page clears it after reading.
function toGate(req, need) {
  return rewrite(new URL('/gate', req.url), {
    headers: {
      'Set-Cookie': `sw_need=${need}; Path=/; Secure; SameSite=Lax`,
      // Never let a browser or cache keep a gate page for a deck URL: a
      // revalidated 304 would replay a stale mode without this cookie.
      'Cache-Control': 'no-store',
    },
  });
}

export default async function middleware(req) {
  // Env-aware gate: only deployments with AUTH_SECRET configured are gated
  // (i.e. the production project). Staging/preview projects with no env vars
  // serve the deck open; GATE_DISABLED=1 is an explicit off-switch.
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1') return next();

  const url = new URL(req.url);
  // Compare the DECODED path: Vercel serves files by decoded path, so an
  // undecoded compare lets /%73upermills… slip past prefix-based rules.
  // Malformed escapes fail closed to the gate.
  let path;
  try { path = decodeURIComponent(url.pathname); } catch { return toGate(req, 'email'); }
  if (OPEN_PATHS.has(path) || path.startsWith('/_vercel/')) return next();

  // Canonical deck URL is /intro. Fallback in case platform routing order
  // ever changes — in practice vercel.json's redirect wins (307) before the
  // middleware runs, so this branch stays dormant on Vercel.
  if (path === '/') {
    const dest = new URL(url);
    dest.pathname = '/intro';
    return Response.redirect(dest, 302);
  }

  const deckId = deckFromPath(path);
  const deck = DECKS[deckId];
  const deckPw = deck && deck.password ? process.env[deck.password] : '';

  const token = getCookie(req, 'sw_auth');
  if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const [emailB64, exp, sig] = parts;
      const expected = await hmacHex(`${emailB64}.${exp}`, process.env.AUTH_SECRET || '');
      if (sig === expected && Number(exp) > Date.now()) {
        // /changes is team-only: it additionally needs the sw_admin cookie
        // (set by /api/adminkey after entering the stats key).
        if (path === '/changes' || path === '/changes.html') {
          const admin = getCookie(req, 'sw_admin');
          const aParts = (admin || '').split('.');
          if (aParts.length === 2) {
            const aSig = await hmacHex(`admin.${aParts[0]}`, process.env.AUTH_SECRET || '');
            if (aSig === aParts[1] && Number(aParts[0]) > Date.now()) return next();
          }
          return rewrite(new URL('/key', req.url));
        }
        // Per-deck shared password (see api/_decks.mjs): only decks that
        // declare a password env var, and only where that var is set.
        if (deckPw && !(await deckPassed(req, deckId))) return toGate(req, 'password');
        // Keep the viewer identity on the URL so the deck's per-slide
        // analytics (?v=) attribute return visits too.
        if (path === '/intro' && !url.searchParams.has('v')) {
          try {
            const dest = new URL(url);
            dest.searchParams.set('v', b64urlDecode(emailB64));
            return Response.redirect(dest, 302);
          } catch {
            return next();
          }
        }
        return next();
      }
    }
  }
  // Not signed in: ask for the email, plus the deck password if this deck has
  // one and the browser has not passed it yet.
  return toGate(req, deckPw && !(await deckPassed(req, deckId)) ? 'both' : 'email');
}
