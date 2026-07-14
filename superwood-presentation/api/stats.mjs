import { list } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

// Canonical slide order (matches data-nav in index.html). Shared with
// stats.html via the response so the client doesn't hardcode it.
const SLIDES = ['Cover', 'The Moment', 'The Problem', 'The Opportunity', 'Breakthrough', 'The Technology', 'SUPERWOOD', 'The Market', 'Roadmap', 'Traction', 'The Team', 'The Moat', 'In the Press', 'Join Us'];

// Fallback coordinates for records written before lat/lon capture.
const COUNTRY_CENTROIDS = {
  US: [39.8, -98.6], GB: [54.0, -2.5], JP: [36.2, 138.3], IN: [21.0, 78.0],
  CA: [56.1, -106.3], DE: [51.2, 10.4], FR: [46.6, 2.2], AU: [-25.3, 133.8],
  CN: [35.9, 104.2], KR: [36.5, 127.9], BR: [-14.2, -51.9], MX: [23.6, -102.5],
  NL: [52.1, 5.3], CH: [46.8, 8.2], SE: [60.1, 18.6], NO: [60.5, 8.5],
  DK: [56.3, 9.5], FI: [61.9, 25.7], IE: [53.4, -8.2], ES: [40.5, -3.7],
  IT: [41.9, 12.6], PT: [39.4, -8.2], PL: [51.9, 19.1], AT: [47.5, 14.5],
  BE: [50.5, 4.5], IL: [31.0, 34.9], AE: [23.4, 53.8], SA: [23.9, 45.0],
  SG: [1.35, 103.8], HK: [22.3, 114.2], TW: [23.7, 121.0], TH: [15.9, 101.0],
  VN: [14.1, 108.3], ID: [-0.8, 113.9], MY: [4.2, 102.0], PH: [12.9, 121.8],
  NZ: [-40.9, 174.9], ZA: [-30.6, 22.9], NG: [9.1, 8.7], EG: [26.8, 30.8],
  AR: [-38.4, -63.6], CL: [-35.7, -71.5], CO: [4.6, -74.3], PE: [-9.2, -75.0],
  RU: [61.5, 105.3], UA: [48.4, 31.2], TR: [39.0, 35.2],
};

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

  const locations = new Map();
  function addLocation(rec) {
    if (!rec.city && !rec.country) return;
    const key = `${rec.city || ''}|${rec.country || ''}`;
    let loc = locations.get(key);
    if (!loc) {
      const centroid = COUNTRY_CENTROIDS[rec.country] || [null, null];
      loc = { city: rec.city || '', country: rec.country || '', lat: centroid[0], lon: centroid[1], visits: 0 };
      locations.set(key, loc);
    }
    if (Number.isFinite(rec.lat) && Number.isFinite(rec.lon)) {
      loc.lat = rec.lat;
      loc.lon = rec.lon;
    }
    loc.visits += 1;
  }

  const sessionTotals = [];
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
    addLocation(d);
    sessionTotals.push(d.totals);
    for (const [section, secs] of Object.entries(d.totals)) {
      const s = Number(secs) || 0;
      v.sections[section] = (v.sections[section] || 0) + s;
      v.totalSeconds += s;
    }
  }
  // Signup-only locations (viewers who logged in before dwell tracking existed).
  for (const s of signups) {
    if (!s?.email) continue;
    const key = `${s.city || ''}|${s.country || ''}`;
    if (!locations.has(key)) addLocation(s);
  }

  // Per-slide aggregates over dwell sessions, in deck order.
  const nSessions = sessionTotals.length;
  const slides = SLIDES.map(name => {
    const times = sessionTotals.map(t => Number(t[name]) || 0).filter(s => s > 0);
    return {
      name,
      visits: times.length,
      avgSeconds: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    };
  });
  // Drop-off: % of sessions that reached slide i (recorded time on it or any later slide).
  const reachedIdx = sessionTotals.map(t => {
    let r = -1;
    SLIDES.forEach((name, i) => { if ((Number(t[name]) || 0) > 0) r = i; });
    return r;
  });
  const dropoff = SLIDES.map((name, i) => ({
    name,
    pct: nSessions ? Math.round(reachedIdx.filter(r => r >= i).length / nSessions * 100) : 0,
    visits: reachedIdx.filter(r => r >= i).length,
  }));

  const out = [...viewers.values()].sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  for (const v of out) v.ips.sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    generatedAt: new Date().toISOString(),
    slideOrder: SLIDES,
    viewers: out,
    slides,
    dropoff,
    totalSessions: nSessions,
    locations: [...locations.values()].filter(l => Number.isFinite(l.lat) && Number.isFinite(l.lon)),
  });
}
