import { next } from '@vercel/edge';

// Reachable without the gate.
const OPEN_PATHS = new Set(['/gate', '/gate.html', '/api/enter', '/favicon.ico']);

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

export default async function middleware(req) {
  // Only gated where AUTH_SECRET is configured; GATE_DISABLED=1 is an off-switch.
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1') return next();

  const url = new URL(req.url);
  const path = url.pathname;
  if (OPEN_PATHS.has(path) || path.startsWith('/_vercel/')) return next();

  if (path === '/') {
    const dest = new URL(url);
    dest.pathname = '/slides';
    return Response.redirect(dest, 302);
  }

  const token = getCookie(req, 'swdc_auth');
  if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const [emailB64, exp, sig] = parts;
      const expected = await hmacHex(`${emailB64}.${exp}`, process.env.AUTH_SECRET || '');
      if (sig === expected && Number(exp) > Date.now()) return next();
    }
  }
  // Serve the gate at the requested URL so the deep link survives sign-in.
  return Response.redirect(new URL('/gate', req.url), 302);
}
