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
    console.log('deck-password rejected:', JSON.stringify({ deck: id, ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() }));
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
