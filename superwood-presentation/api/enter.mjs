import { timingSafeEqual } from 'node:crypto';
import { sql } from './_db.mjs';
import { DECKS, deckFromPath } from './_decks.mjs';

// One gate endpoint for everything the visitor still owes for the page they
// asked for: their email (sw_auth), the deck's shared password (sw_deck_<id>),
// or both. What is needed is computed here from the cookies + `next`, never
// trusted from the page. Nothing is written until every needed field passes.

const MAX_AGE = 30 * 24 * 3600; // 30 days — sw_auth and sw_deck_* alike

const enc = new TextEncoder();
async function hmacHex(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

// Same-site relative path only (no scheme, no host, no protocol-relative
// '//'); never the gate/key/api routes themselves (a visitor who typed /gate
// would otherwise bounce straight back to the gate). Anything else lands on
// the deck's canonical entry.
function safeNext(raw) {
  const s = String(raw || '');
  if (!/^\/(?!\/)[A-Za-z0-9_\-./]*$/.test(s)) return '/intro';
  if (/^\/(gate|gate\.html|key|api)(\/|$)/.test(s)) return '/intro';
  return s;
}

function passwordOk(given, expected) {
  if (!given || !expected) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

// Email from a valid sw_auth cookie, else null.
async function authedEmail(req) {
  const parts = String(getCookie(req, 'sw_auth') || '').split('.');
  if (parts.length !== 3) return null;
  const [emailB64, exp, sig] = parts;
  const expected = await hmacHex(`${emailB64}.${exp}`, process.env.AUTH_SECRET || '');
  if (sig !== expected || Number(exp) <= Date.now()) return null;
  try { return Buffer.from(emailB64, 'base64url').toString('utf8'); } catch { return null; }
}

// True when this browser already passed the deck's shared password.
async function deckPassed(req, deckId) {
  const parts = String(getCookie(req, `sw_deck_${deckId}`) || '').split('.');
  if (parts.length !== 2) return false;
  const sig = await hmacHex(`deck.${deckId}.${parts[0]}`, process.env.AUTH_SECRET || '');
  return sig === parts[1] && Number(parts[0]) > Date.now();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password, next } = req.body || {};
  const target = safeNext(next);
  // Ungated deployment (no AUTH_SECRET / gate disabled): no cookie to sign,
  // nothing to record — just send the visitor into the deck.
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1') {
    return res.status(200).json({ redirect: target });
  }

  const deckId = deckFromPath(target);
  const deck = DECKS[deckId];
  const deckPw = deck && deck.password ? (process.env[deck.password] || '') : '';
  const knownEmail = await authedEmail(req);
  const needEmail = !knownEmail;
  const needPassword = !!deckPw && !(await deckPassed(req, deckId));

  // Validate everything before writing anything: a wrong password must not
  // leave a signup behind or hand out a cookie.
  let cleanEmail = knownEmail;
  if (needEmail) {
    cleanEmail = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  if (needPassword && (String(password || '').length > 200 || !passwordOk(password, deckPw))) {
    console.log('deck-password rejected:', JSON.stringify({ deck: deckId, ip }));
    return res.status(401).json({ error: 'That password isn’t right.' });
  }

  // Share cookies across all inventwood.net subdomains (sw, investor, …).
  // On other hosts (*.vercel.app) a Domain=inventwood.net cookie would be
  // rejected by the browser, so fall back to a host-only cookie there.
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const domain = /(^|\.)inventwood\.net$/.test(host.split(':')[0]) ? '; Domain=inventwood.net' : '';
  const cookies = [];

  if (needEmail) {
    const ts = new Date().toISOString();
    const rawGid = String(getCookie(req, 'sw_gid') || '');
    const gid = /^[0-9a-f-]{36}$/.test(rawGid) ? rawGid : null;
    const record = {
      email: cleanEmail,
      ts,
      ua: req.headers['user-agent'] || '',
      ip,
      city: decodeURIComponent(req.headers['x-vercel-ip-city'] || ''),
      country: req.headers['x-vercel-ip-country'] || '',
      lat: Number(req.headers['x-vercel-ip-latitude']) || null,
      lon: Number(req.headers['x-vercel-ip-longitude']) || null,
    };
    try {
      if (!sql) throw new Error('DATABASE_URL not configured');
      // deck = deck of entry: where the visitor was headed.
      await sql`
        INSERT INTO signups (deck, email, ts, ua, ip, city, country, lat, lon, gid)
        VALUES (${deckId}, ${record.email}, ${record.ts}, ${record.ua}, ${record.ip}, ${record.city}, ${record.country}, ${record.lat}, ${record.lon}, ${gid})
        ON CONFLICT (deck, email, ts) DO NOTHING`;
    } catch (err) {
      // DB unavailable — keep the signup in function logs and let the viewer in.
      console.log('deck-signup (db write failed):', JSON.stringify(record), err.message);
    }
    const exp = Date.now() + MAX_AGE * 1000;
    const payload = `${Buffer.from(cleanEmail, 'utf8').toString('base64url')}.${exp}`;
    const sig = await hmacHex(payload, process.env.AUTH_SECRET);
    cookies.push(`sw_auth=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}${domain}`);
  }

  if (needPassword) {
    const exp = Date.now() + MAX_AGE * 1000;
    const sig = await hmacHex(`deck.${deckId}.${exp}`, process.env.AUTH_SECRET);
    cookies.push(`sw_deck_${deckId}=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}${domain}`);
  }

  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  return res.status(200).json({ redirect: `${target}?v=${encodeURIComponent(cleanEmail)}` });
}
