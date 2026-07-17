import { timingSafeEqual } from 'node:crypto';

const MAX_AGE = 30 * 24 * 3600; // 30 days

const enc = new TextEncoder();
async function hmacHex(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function keyOk(given, expected) {
  if (!given || !expected) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Ungated deployment: nothing to unlock.
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1') {
    return res.status(200).json({ ok: true });
  }
  if (!keyOk(req.body?.key, process.env.STATS_KEY)) {
    return res.status(401).json({ error: 'That key isn’t right.' });
  }
  const exp = Date.now() + MAX_AGE * 1000;
  const sig = await hmacHex(`admin.${exp}`, process.env.AUTH_SECRET);
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const domain = /(^|\.)inventwood\.net$/.test(host.split(':')[0]) ? '; Domain=inventwood.net' : '';
  res.setHeader('Set-Cookie', `sw_admin=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}${domain}`);
  return res.status(200).json({ ok: true });
}
