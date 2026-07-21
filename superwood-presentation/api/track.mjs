import { sql } from './_db.mjs';

// The gate cookie is the authoritative viewer identity; the payload viewer is
// only a fallback (middleware already blocks unauthenticated requests).
function cookieEmail(req) {
  const header = req.headers.cookie || '';
  for (const part of header.split(/;\s*/)) {
    if (part.startsWith('sw_auth=')) {
      const pieces = part.slice('sw_auth='.length).split('.');
      if (pieces.length === 3) {
        try {
          return Buffer.from(pieces[0], 'base64url').toString('utf8');
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Storage-less deployment (staging-open, collaborators): accept and drop beacons silently.
  if (!sql) {
    return res.status(204).end();
  }
  const { viewer, session, totals } = req.body || {};
  if (!/^[a-z0-9]{8,32}$/.test(String(session || ''))) {
    return res.status(400).json({ error: 'Bad session' });
  }
  if (!totals || typeof totals !== 'object' || Array.isArray(totals)) {
    return res.status(400).json({ error: 'Bad totals' });
  }
  const clean = {};
  let count = 0;
  for (const [section, secs] of Object.entries(totals)) {
    if (++count > 30) break;
    const s = Math.min(7200, Math.max(0, Math.round(Number(secs) || 0)));
    if (s > 0) clean[String(section).slice(0, 60)] = s;
  }

  const email = String(cookieEmail(req) || viewer || 'anonymous').slice(0, 254).toLowerCase();
  const record = {
    viewer: email,
    session,
    totals: clean,
    ua: req.headers['user-agent'] || '',
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    city: decodeURIComponent(req.headers['x-vercel-ip-city'] || ''),
    country: req.headers['x-vercel-ip-country'] || '',
    lat: Number(req.headers['x-vercel-ip-latitude']) || null,
    lon: Number(req.headers['x-vercel-ip-longitude']) || null,
    ts: new Date().toISOString(),
  };
  try {
    // Upsert on session: each flush overwrites the running totals, so repeat
    // beacons never double-count (same semantics as the old per-session blob).
    await sql`
      INSERT INTO dwell_sessions (session, viewer, totals, ua, ip, city, country, lat, lon, ts)
      VALUES (${session}, ${email}, ${JSON.stringify(clean)}::jsonb, ${record.ua}, ${record.ip}, ${record.city}, ${record.country}, ${record.lat}, ${record.lon}, ${record.ts})
      ON CONFLICT (session) DO UPDATE SET
        viewer = EXCLUDED.viewer, totals = EXCLUDED.totals, ua = EXCLUDED.ua, ip = EXCLUDED.ip,
        city = EXCLUDED.city, country = EXCLUDED.country, lat = EXCLUDED.lat, lon = EXCLUDED.lon, ts = EXCLUDED.ts`;
  } catch (err) {
    console.log('deck-dwell write failed:', JSON.stringify(record), err.message);
    return res.status(500).json({ error: 'Store failed' });
  }
  return res.status(204).end();
}
