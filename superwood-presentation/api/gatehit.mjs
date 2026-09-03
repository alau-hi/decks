import { randomUUID } from 'node:crypto';
import { sql } from './_db.mjs';
import { deckFromPath } from './_decks.mjs';
import { cleanScr } from './track.mjs';

const GID_MAX_AGE = 400 * 24 * 3600; // 400 days — matches sw_admin's lifetime
const BOT_UA = /bot|crawl|spider|preview|scan|fetch|monitor|curl|wget|python|headless|slurp|facebookexternal|whatsapp|telegram|slack|discord/i;

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

// A browser carrying a valid sw_admin cookie is the team: record, flag, never drop.
async function isTeam(req) {
  const admin = getCookie(req, 'sw_admin');
  const parts = (admin || '').split('.');
  if (parts.length !== 2 || !process.env.AUTH_SECRET) return false;
  const sig = await hmacHex(`admin.${parts[0]}`, process.env.AUTH_SECRET);
  return sig === parts[1] && Number(parts[0]) > Date.now();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // Storage-less deployment (collaborators, staging-open): accept and drop silently.
  if (!sql) return res.status(204).end();

  const ua = req.headers['user-agent'] || '';
  if (BOT_UA.test(ua)) return res.status(204).end();

  let gid = String(getCookie(req, 'sw_gid') || '');
  if (!/^[0-9a-f-]{36}$/.test(gid)) {
    gid = randomUUID();
    // Same cross-subdomain scoping as sw_auth: shared on inventwood.net hosts,
    // host-only elsewhere (*.vercel.app rejects a Domain=inventwood.net cookie).
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
    const domain = /(^|\.)inventwood\.net$/.test(host.split(':')[0]) ? '; Domain=inventwood.net' : '';
    res.setHeader('Set-Cookie', `sw_gid=${gid}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${GID_MAX_AGE}${domain}`);
  }

  const body = req.body || {};
  let path = String(body.path || '').slice(0, 200);
  if (!path.startsWith('/')) path = '';
  const scr = cleanScr(body.scr);
  const record = {
    ts: new Date().toISOString(),
    gid,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    ua,
    city: decodeURIComponent(req.headers['x-vercel-ip-city'] || ''),
    country: req.headers['x-vercel-ip-country'] || '',
    lat: Number(req.headers['x-vercel-ip-latitude']) || null,
    lon: Number(req.headers['x-vercel-ip-longitude']) || null,
    path,
    team: await isTeam(req),
  };
  try {
    await sql`
      INSERT INTO gate_hits (deck, ts, gid, ip, ua, city, country, lat, lon, path, scr, team)
      VALUES (${deckFromPath(path.split('?')[0])}, ${record.ts}, ${record.gid}, ${record.ip}, ${record.ua}, ${record.city}, ${record.country}, ${record.lat}, ${record.lon}, ${record.path}, ${scr ? JSON.stringify(scr) : null}::jsonb, ${record.team})`;
  } catch (err) {
    console.log('gate-hit write failed:', JSON.stringify(record), err.message);
  }
  return res.status(204).end();
}
