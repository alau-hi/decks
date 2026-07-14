import { next, rewrite } from '@vercel/edge';

// Paths reachable without authentication. og-cover.jpg stays open so link
// previews render in email clients and chat apps.
const OPEN_PATHS = new Set(['/gate', '/gate.html', '/api/enter', '/favicon.ico', '/assets/og-cover.jpg']);

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

export default async function middleware(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  if (OPEN_PATHS.has(path) || path.startsWith('/_vercel/')) return next();

  const token = getCookie(req, 'sw_auth');
  if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const [emailB64, exp, sig] = parts;
      const expected = await hmacHex(`${emailB64}.${exp}`, process.env.AUTH_SECRET || '');
      if (sig === expected && Number(exp) > Date.now()) {
        // Keep the viewer identity on the URL so the deck's per-slide
        // analytics (?v=) attribute return visits too.
        if (path === '/' && !url.searchParams.has('v')) {
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
  return rewrite(new URL('/gate', req.url));
}
