import { timingSafeEqual } from 'node:crypto';
import { sql, iso } from './_db.mjs';
import { DECKS, DEFAULT_DECK } from './_decks.mjs';

// Canonical slide order (matches data-nav in index.html). Shared with
// stats.html via the response so the client doesn't hardcode it. Only
// superwood has a hardcoded fallback; other decks fall back to [].
const FALLBACK_SLIDES = { superwood: ['Cover', 'The Moment', 'The Problem', 'The Opportunity', 'Breakthrough', 'The Technology', 'SUPERWOOD', 'The Market', 'Roadmap', 'Traction', 'The Team', 'The Moat', 'In the Press', 'Join Us'] };

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

// Device class + OS from a stored user-agent. Known accepted limitation:
// iPadOS 13+ presents a Mac UA, so modern iPads count as desktop·Mac.
export function deviceFromUa(ua) {
  const s = String(ua || '');
  if (/iPhone|iPod/.test(s)) return { cls: 'phone', os: 'iOS' };
  if (/iPad/.test(s)) return { cls: 'tablet', os: 'iOS' };
  if (/Android/.test(s)) return /Mobile/.test(s) ? { cls: 'phone', os: 'Android' } : { cls: 'tablet', os: 'Android' };
  if (/Macintosh/.test(s)) return { cls: 'desktop', os: 'Mac' };
  if (/Windows/.test(s)) return { cls: 'desktop', os: 'Windows' };
  if (/Linux|X11/.test(s)) return { cls: 'desktop', os: 'Linux' };
  return { cls: 'unknown', os: 'other' };
}

// Glanceable screen-format bucket. scr is forward-only (older sessions have
// none), so 'unknown' is a first-class bucket, never dropped.
export function formatBucket(scr, cls) {
  if (!scr || !scr.w || !scr.h) return 'unknown';
  if (cls === 'phone') return (scr.o === 'l' || scr.w > scr.h) ? 'phone-landscape' : 'phone-portrait';
  if (cls === 'tablet') return 'tablet';
  return scr.w >= 1440 ? 'desktop' : 'laptop';
}

// Closest deck media tier for a session. The deck's width queries are all
// pointer:coarse-gated, so only touch sessions (phone/tablet) ever bucket;
// desktop windows get the base layout regardless of width.
const BREAKS = [560, 700, 820, 900, 980, 1080];
const BREAK_ORDER = ['≤560', '≤700', '≤820', '≤900', '≤980', '≤1080', '>1080', 'Desktop (no break)', 'unknown'];
export function breakBucket(scr, cls) {
  if (!scr || !scr.w) return 'unknown';
  if (cls !== 'phone' && cls !== 'tablet') return 'Desktop (no break)';
  const b = BREAKS.find(x => scr.w <= x);
  return b ? `≤${b}` : '>1080';
}

function deviceLabel(d, scr) {
  const base = d.cls === 'phone' ? (d.os === 'iOS' ? 'iPhone' : d.os === 'Android' ? 'Android phone' : 'Phone')
    : d.cls === 'tablet' ? (d.os === 'iOS' ? 'iPad' : d.os === 'Android' ? 'Android tablet' : 'Tablet')
    : d.cls === 'desktop' ? d.os + ' desktop'
    : 'Unknown device';
  if (!scr) return base;
  const dpr = scr.dpr && scr.dpr !== 1 ? ` @${scr.dpr}x` : '';
  return `${base} · ${scr.w}×${scr.h}${dpr}`;
}

function keyOk(given, expected) {
  if (!given || !expected) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (!keyOk(req.query?.key, process.env.STATS_KEY)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const deckId = Object.prototype.hasOwnProperty.call(DECKS, String(req.query?.deck ?? '')) ? String(req.query.deck) : DEFAULT_DECK;
  const decks = Object.entries(DECKS).map(([id, d]) => ({ id, label: d.label }));
  const fallbackSlides = FALLBACK_SLIDES[deckId] || [];
  // Storage-less deployment (staging-open, collaborators): valid key, but nothing recorded here.
  if (!sql) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ generatedAt: new Date().toISOString(), deck: deckId, decks, slideOrder: fallbackSlides, viewers: [], slides: [], dropoff: [], totalSessions: 0, locations: [], deviceMix: [], formatMix: [], breakMix: [], gate: { funnel: { visits: 0, converted: 0, bounced: 0 }, locations: [], ips: [] } });
  }

  const [signupRows, dwellRows, gateRows, slideRows] = await Promise.all([
    sql`SELECT email, ts, ua, ip, city, country, lat, lon, gid FROM signups WHERE deck = ${deckId}`,
    sql`SELECT session, viewer, totals, scr, ua, ip, city, country, lat, lon, ts FROM dwell_sessions WHERE deck = ${deckId}`,
    sql`SELECT ts, gid, ip, ua, city, country, lat, lon, team FROM gate_hits WHERE deck = ${deckId} ORDER BY ts`,
    sql`SELECT slides FROM deck_slides WHERE deck = ${deckId}`,
  ]);
  const SLIDES = (slideRows[0] && Array.isArray(slideRows[0].slides) && slideRows[0].slides.length) ? slideRows[0].slides : fallbackSlides;
  // Rows carry the same fields the blobs did; normalize timestamps back to
  // the ISO strings the aggregation below compares lexicographically.
  const signups = signupRows.map(r => ({ ...r, ts: iso(r.ts) }));
  const dwells = dwellRows.map(r => ({ ...r, ts: iso(r.ts) }));
  const gateHits = gateRows.map(r => ({ ...r, ts: iso(r.ts) }));

  const viewers = new Map();
  function ensure(email) {
    let v = viewers.get(email);
    if (!v) {
      v = { email, opens: 0, sessions: 0, totalSeconds: 0, firstSeen: null, lastSeen: null, sections: {}, ips: [], devices: [] };
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
  function addDevice(v, rec) {
    if (!rec.ua) return;
    const d = deviceFromUa(rec.ua);
    const scr = rec.scr || null;
    const key = `${d.cls}|${d.os}|${scr ? `${scr.w}x${scr.h}@${scr.dpr || 1}` : ''}`;
    let e = v.devices.find(x => x.key === key);
    if (!e) {
      e = { key, cls: d.cls, os: d.os, scr, label: deviceLabel(d, scr), lastSeen: null };
      v.devices.push(e);
    }
    if (!e.lastSeen || (rec.ts && rec.ts > e.lastSeen)) e.lastSeen = rec.ts || e.lastSeen;
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
  const deviceMix = new Map(), formatMix = new Map(), breakMix = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const s of signups) {
    if (!s?.email) continue;
    const v = ensure(s.email);
    v.opens += 1;
    seen(v, s.ts);
    addIp(v, s);
    addDevice(v, s);
  }
  for (const d of dwells) {
    if (!d?.viewer || !d.totals) continue;
    const v = ensure(d.viewer);
    v.sessions += 1;
    seen(v, d.ts);
    addIp(v, d);
    addLocation(d);
    addDevice(v, d);
    const dev = deviceFromUa(d.ua);
    bump(deviceMix, dev.cls === 'unknown' ? 'unknown' : `${dev.cls} · ${dev.os}`);
    bump(formatMix, formatBucket(d.scr, dev.cls));
    bump(breakMix, breakBucket(d.scr, dev.cls));
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

  /* ---- Gate watch: bounce/conversion funnel + per-IP roll-up ---------- */
  const VISIT_GAP = 30 * 60 * 1000; // hits within 30 min = one visit
  const gidEmail = new Map(); // converted browsers
  for (const s of signups) if (s.gid) gidEmail.set(s.gid, s.email);

  const byGid = new Map();
  for (const h of gateHits) {
    let g = byGid.get(h.gid);
    if (!g) { g = { hits: [], team: true }; byGid.set(h.gid, g); }
    g.hits.push(h);
    if (!h.team) g.team = false; // a browser is team only if every hit was flagged
  }
  const countVisits = hits => {
    let visits = 0, last = -Infinity;
    for (const h of hits) {
      const ms = Date.parse(h.ts);
      if (ms - last > VISIT_GAP) visits++;
      last = ms;
    }
    return visits;
  };

  const nonTeamGids = [...byGid.entries()].filter(([, g]) => !g.team);
  const gateFunnel = {
    visits: nonTeamGids.length,
    converted: nonTeamGids.filter(([gid]) => gidEmail.has(gid)).length,
  };
  gateFunnel.bounced = gateFunnel.visits - gateFunnel.converted;

  // Map dots: location + outcome (uses the same centroid fallback as visits).
  const gateLocs = new Map();
  for (const [gid, g] of byGid) {
    if (g.team) continue;
    const converted = gidEmail.has(gid);
    for (const h of g.hits) {
      if (!h.city && !h.country) continue;
      const key = `${h.city || ''}|${h.country || ''}|${converted}`;
      let loc = gateLocs.get(key);
      if (!loc) {
        const c = COUNTRY_CENTROIDS[h.country] || [null, null];
        loc = { city: h.city || '', country: h.country || '', lat: c[0], lon: c[1], visits: 0, converted };
        gateLocs.set(key, loc);
      }
      if (Number.isFinite(h.lat) && Number.isFinite(h.lon)) { loc.lat = h.lat; loc.lon = h.lon; }
      loc.visits += 1;
    }
  }

  // IP rows, browsers within.
  const byIp = new Map();
  for (const [gid, g] of byGid) {
    for (const h of g.hits) {
      const ip = h.ip || 'unknown';
      let row = byIp.get(ip);
      if (!row) { row = { ip, city: '', country: '', firstSeen: null, lastSeen: null, team: true, gids: new Map() }; byIp.set(ip, row); }
      let b = row.gids.get(gid);
      if (!b) { b = { hits: [], team: g.team, email: gidEmail.get(gid) || null }; row.gids.set(gid, b); }
      b.hits.push(h);
      if (!h.team) row.team = false;
      if (!row.firstSeen || h.ts < row.firstSeen) row.firstSeen = h.ts;
      if (!row.lastSeen || h.ts > row.lastSeen) { row.lastSeen = h.ts; if (h.city) row.city = h.city; if (h.country) row.country = h.country; }
    }
  }
  const gateIps = [...byIp.values()].map(row => {
    const detail = [...row.gids.entries()].map(([gid, b]) => {
      const d = deviceFromUa(b.hits[b.hits.length - 1].ua);
      return {
        gid8: gid.slice(0, 8),
        hits: b.hits.length,
        firstSeen: b.hits[0].ts,
        lastSeen: b.hits[b.hits.length - 1].ts,
        device: d.cls === 'unknown' ? 'unknown device' : `${d.cls} · ${d.os}`,
        email: b.email,
      };
    }).sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
    return {
      ip: row.ip, city: row.city, country: row.country,
      firstSeen: row.firstSeen, lastSeen: row.lastSeen,
      visits: [...row.gids.values()].reduce((a, b) => a + countVisits(b.hits), 0),
      browsers: row.gids.size,
      team: row.team,
      emails: [...new Set(detail.map(d => d.email).filter(Boolean))],
      detail,
    };
  }).sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));

  const out = [...viewers.values()].sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  for (const v of out) v.ips.sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  for (const v of out) v.devices.sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    generatedAt: new Date().toISOString(),
    deck: deckId,
    decks,
    slideOrder: SLIDES,
    viewers: out,
    slides,
    dropoff,
    totalSessions: nSessions,
    locations: [...locations.values()].filter(l => Number.isFinite(l.lat) && Number.isFinite(l.lon)),
    deviceMix: [...deviceMix].map(([key, sessions]) => ({ key, sessions })).sort((a, b) => b.sessions - a.sessions),
    formatMix: [...formatMix].map(([key, sessions]) => ({ key, sessions })).sort((a, b) => b.sessions - a.sessions),
    breakMix: [...breakMix].map(([key, sessions]) => ({ key, sessions })).sort((a, b) => BREAK_ORDER.indexOf(a.key) - BREAK_ORDER.indexOf(b.key)),
    gate: {
      funnel: gateFunnel,
      locations: [...gateLocs.values()].filter(l => Number.isFinite(l.lat) && Number.isFinite(l.lon)),
      ips: gateIps,
    },
  });
}
