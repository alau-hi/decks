import { list } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

function keyOk(given, expected) {
  if (!given || !expected) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

async function listAll(prefix) {
  const blobs = [];
  let cursor;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...r.blobs);
    cursor = r.cursor;
  } while (cursor);
  return blobs;
}

async function fetchJson(url) {
  try {
    const r = await fetch(url);
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (!keyOk(req.query?.key, process.env.STATS_KEY)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const [signupBlobs, dwellBlobs] = await Promise.all([
    listAll('deck-signups/'),
    listAll('deck-dwell/'),
  ]);
  const [signups, dwells] = await Promise.all([
    Promise.all(signupBlobs.map(b => fetchJson(b.url))),
    Promise.all(dwellBlobs.map(b => fetchJson(b.url))),
  ]);

  const viewers = new Map();
  function ensure(email) {
    let v = viewers.get(email);
    if (!v) {
      v = { email, opens: 0, sessions: 0, totalSeconds: 0, firstSeen: null, lastSeen: null, sections: {}, ips: [] };
      viewers.set(email, v);
    }
    return v;
  }
  function seen(v, ts) {
    if (!ts) return;
    if (!v.firstSeen || ts < v.firstSeen) v.firstSeen = ts;
    if (!v.lastSeen || ts > v.lastSeen) v.lastSeen = ts;
  }
  function addIp(v, rec) {
    if (!rec.ip) return;
    let entry = v.ips.find(e => e.ip === rec.ip);
    if (!entry) {
      entry = { ip: rec.ip, city: '', country: '', lastSeen: null };
      v.ips.push(entry);
    }
    if (!entry.lastSeen || (rec.ts && rec.ts > entry.lastSeen)) {
      entry.lastSeen = rec.ts || entry.lastSeen;
      if (rec.city) entry.city = rec.city;
      if (rec.country) entry.country = rec.country;
    }
  }

  for (const s of signups) {
    if (!s?.email) continue;
    const v = ensure(s.email);
    v.opens += 1;
    seen(v, s.ts);
    addIp(v, s);
  }
  for (const d of dwells) {
    if (!d?.viewer || !d.totals) continue;
    const v = ensure(d.viewer);
    v.sessions += 1;
    seen(v, d.ts);
    addIp(v, d);
    for (const [section, secs] of Object.entries(d.totals)) {
      const s = Number(secs) || 0;
      v.sections[section] = (v.sections[section] || 0) + s;
      v.totalSeconds += s;
    }
  }

  const out = [...viewers.values()].sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  for (const v of out) v.ips.sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ generatedAt: new Date().toISOString(), viewers: out });
}
