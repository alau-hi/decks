import { sql, DECK } from './_db.mjs';

const MAX_AGE = 30 * 24 * 3600; // 30 days

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
// '//'); anything else lands on the deck's canonical entry.
function safeNext(raw) {
  const s = String(raw || '');
  return /^\/(?!\/)[A-Za-z0-9_\-./]*$/.test(s) ? s : '/intro';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Ungated deployment (no AUTH_SECRET / gate disabled): no cookie to sign,
  // nothing to record — just send the visitor into the deck.
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1') {
    return res.status(200).json({ redirect: safeNext((req.body || {}).next) });
  }
  const { email, next } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const ts = new Date().toISOString();
  const rawGid = String(getCookie(req, 'sw_gid') || '');
  const gid = /^[0-9a-f-]{36}$/.test(rawGid) ? rawGid : null;

  const record = {
    email: cleanEmail,
    ts,
    ua: req.headers['user-agent'] || '',
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    city: decodeURIComponent(req.headers['x-vercel-ip-city'] || ''),
    country: req.headers['x-vercel-ip-country'] || '',
    lat: Number(req.headers['x-vercel-ip-latitude']) || null,
    lon: Number(req.headers['x-vercel-ip-longitude']) || null,
  };
  try {
    if (!sql) throw new Error('DATABASE_URL not configured');
    await sql`
      INSERT INTO signups (deck, email, ts, ua, ip, city, country, lat, lon, gid)
      VALUES (${DECK}, ${record.email}, ${record.ts}, ${record.ua}, ${record.ip}, ${record.city}, ${record.country}, ${record.lat}, ${record.lon}, ${gid})
      ON CONFLICT (deck, email, ts) DO NOTHING`;
  } catch (err) {
    // DB unavailable — keep the signup in function logs and let the viewer in.
    console.log('deck-signup (db write failed):', JSON.stringify(record), err.message);
  }

  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${Buffer.from(cleanEmail, 'utf8').toString('base64url')}.${exp}`;
  const sig = await hmacHex(payload, process.env.AUTH_SECRET || '');
  // Share the login across all inventwood.net subdomains (sw, investor, …).
  // On other hosts (*.vercel.app) a Domain=inventwood.net cookie would be
  // rejected by the browser, so fall back to a host-only cookie there.
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const domain = /(^|\.)inventwood\.net$/.test(host.split(':')[0]) ? '; Domain=inventwood.net' : '';
  res.setHeader(
    'Set-Cookie',
    `sw_auth=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}${domain}`
  );
  return res.status(200).json({ redirect: `${safeNext(next)}?v=${encodeURIComponent(cleanEmail)}` });
}
