import { createHmac, timingSafeEqual } from 'node:crypto';
import { sql } from './_db.mjs';

const STATUSES = new Set(['submitted', 'consideration', 'planned', 'rejected']);

// Static fallback for deployments without a database (collaborator projects,
// staging-open): the board renders these and edits stay in localStorage.
// The same four rows are seeded into change_requests by scripts/backfill.mjs.
export const SEED_REQUESTS = [
  { id: 'r1', title: 'SuperMills focus', summary: 'Make the deck more focused on the SuperMills', detail: 'Shift the narrative weight of the deck toward the SuperMills — the mills as the story, not just one roadmap slide.', status: 'submitted', logged: 'Jul 16' },
  { id: 'r2', title: 'Market categories', summary: 'Reorganize the markets by category rather than timeline', detail: 'The market slide currently groups applications into Phase 01/02/03 timeline columns; regroup them by market category instead.', status: 'submitted', logged: 'Jul 16' },
  { id: 'r3', title: 'Entry portal', summary: 'Make a simpler but slightly dramatic email entry portal', detail: 'Redesign the email gate into a simpler, slightly dramatic entry experience in keeping with the deck aesthetic.', status: 'submitted', logged: 'Jul 16' },
  { id: 'r4', title: 'Contact info', summary: 'Think about who to include on the contact info', detail: 'Decide who should be listed on the closing contact slide (currently Alex Lau only).', status: 'submitted', logged: 'Jul 16' },
];

// The board is team-only: every operation needs the sw_admin cookie the
// middleware requires for /changes itself (same HMAC scheme, same secret).
// Ungated deployments (no AUTH_SECRET / GATE_DISABLED) skip the check.
function adminOk(req) {
  if (!process.env.AUTH_SECRET || process.env.GATE_DISABLED === '1') return true;
  const header = req.headers.cookie || '';
  for (const part of header.split(/;\s*/)) {
    if (!part.startsWith('sw_admin=')) continue;
    const [exp, sig] = part.slice('sw_admin='.length).split('.');
    if (!exp || !sig) return false;
    const expected = createHmac('sha256', process.env.AUTH_SECRET).update(`admin.${exp}`).digest('hex');
    const a = Buffer.from(String(sig));
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b) && Number(exp) > Date.now();
  }
  return false;
}

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : undefined);

// Accepts the patch shape the board's saveOverride() produces; unknown fields
// are dropped, absent fields stay undefined so upsert() keeps existing values.
function cleanPatch(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || '').trim() || crypto.randomUUID();
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(id)) return null;
  const status = STATUSES.has(raw.status) ? raw.status : undefined;
  const deleted = raw.deleted === true || raw._deleted === true ? true : (raw.deleted === false ? false : undefined);
  return {
    id,
    title: str(raw.title, 120),
    summary: str(raw.summary, 300),
    detail: str(raw.detail, 5000),
    status,
    author: str(raw.author, 120),
    logged: str(raw.logged, 40),
    deleted,
  };
}

async function upsert(p) {
  const [existing] = await sql`SELECT * FROM change_requests WHERE id = ${p.id}`;
  const m = {
    title: p.title ?? existing?.title ?? '',
    summary: p.summary ?? existing?.summary ?? '',
    detail: p.detail ?? existing?.detail ?? '',
    status: p.status ?? existing?.status ?? 'submitted',
    author: p.author ?? existing?.author ?? '',
    logged: p.logged ?? existing?.logged ?? '',
    deleted: p.deleted ?? existing?.deleted ?? false,
  };
  await sql`
    INSERT INTO change_requests (id, title, summary, detail, status, author, logged, deleted)
    VALUES (${p.id}, ${m.title}, ${m.summary}, ${m.detail}, ${m.status}, ${m.author}, ${m.logged}, ${m.deleted})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title, summary = EXCLUDED.summary, detail = EXCLUDED.detail,
      status = EXCLUDED.status, author = EXCLUDED.author, logged = EXCLUDED.logged,
      deleted = EXCLUDED.deleted, updated_at = now()`;
}

const listRequests = () =>
  sql`SELECT id, title, summary, detail, status, author, logged FROM change_requests WHERE NOT deleted ORDER BY created_at`;

export default async function handler(req, res) {
  if (!adminOk(req)) return res.status(401).json({ error: 'Unauthorized' });
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    if (!sql) return res.status(200).json({ requests: SEED_REQUESTS, fallback: true });
    return res.status(200).json({ requests: await listRequests(), fallback: false });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!sql) return res.status(204).end();

  const body = req.body || {};
  const patches = (Array.isArray(body.bulk) ? body.bulk : [body]).map(cleanPatch).filter(Boolean);
  if (!patches.length || patches.length > 200) return res.status(400).json({ error: 'Bad request' });
  try {
    for (const p of patches) await upsert(p);
  } catch (err) {
    console.log('change-request write failed:', err.message);
    return res.status(500).json({ error: 'Store failed' });
  }
  return res.status(200).json({ requests: await listRequests(), fallback: false });
}
