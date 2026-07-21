#!/usr/bin/env node
// One-time (but safely re-runnable) migration: copies every deck-signups/ and
// deck-dwell/ blob into Neon Postgres, applies scripts/schema.sql first, and
// seeds the /changes request board. Existing rows are never overwritten, so
// re-running after the cutover only picks up stragglers.
//
// Run locally from superwood-presentation/ with prod Blob credentials and the
// target DATABASE_URL (either in the shell or in a pulled .env.check):
//   vercel env pull --environment=production .env.check
//   DATABASE_URL='postgres://…' node scripts/backfill.mjs
//   rm .env.check

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { list } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { SEED_REQUESTS } from '../api/changes.mjs';

const here = dirname(fileURLToPath(import.meta.url));

// Pick up vercel env pull output (KEY="value" lines) without a dotenv dep.
const envFile = join(here, '..', '.env.check');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)="(.*)"$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { DATABASE_URL, BLOB_READ_WRITE_TOKEN } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is required (vercel env pull --environment=production .env.check)');

const sql = neon(DATABASE_URL);

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

// Schema (idempotent CREATE TABLE IF NOT EXISTS statements).
const schema = readFileSync(join(here, 'schema.sql'), 'utf8');
for (const stmt of schema.split(/;\s*\n/).map(s => s.trim()).filter(s => s && !s.startsWith('--'))) {
  await sql.query(stmt);
}
console.log('schema applied');

// Signups: one row per gate entry; UNIQUE(email, ts) makes this re-runnable.
const signupBlobs = await listAll('deck-signups/');
let inserted = 0;
for (const b of signupBlobs) {
  const s = await fetchJson(b.url);
  if (!s?.email || !s.ts) continue;
  const r = await sql`
    INSERT INTO signups (email, ts, ua, ip, city, country, lat, lon)
    VALUES (${s.email}, ${s.ts}, ${s.ua || ''}, ${s.ip || ''}, ${s.city || ''}, ${s.country || ''}, ${s.lat ?? null}, ${s.lon ?? null})
    ON CONFLICT (email, ts) DO NOTHING`;
  inserted += r.length ?? 0;
}
console.log(`signups: ${signupBlobs.length} blobs scanned`);

// Dwell sessions: DO NOTHING (never clobber a row the live app has updated).
const dwellBlobs = await listAll('deck-dwell/');
for (const b of dwellBlobs) {
  const d = await fetchJson(b.url);
  if (!d?.session || !d.viewer) continue;
  await sql`
    INSERT INTO dwell_sessions (session, viewer, totals, ua, ip, city, country, lat, lon, ts)
    VALUES (${d.session}, ${d.viewer}, ${JSON.stringify(d.totals || {})}::jsonb, ${d.ua || ''}, ${d.ip || ''}, ${d.city || ''}, ${d.country || ''}, ${d.lat ?? null}, ${d.lon ?? null}, ${d.ts || null})
    ON CONFLICT (session) DO NOTHING`;
}
console.log(`dwell sessions: ${dwellBlobs.length} blobs scanned`);

// Seed the /changes board with the original hardcoded requests.
for (const r of SEED_REQUESTS) {
  await sql`
    INSERT INTO change_requests (id, title, summary, detail, status, logged)
    VALUES (${r.id}, ${r.title}, ${r.summary}, ${r.detail}, ${r.status}, ${r.logged})
    ON CONFLICT (id) DO NOTHING`;
}
console.log('change_requests seeded');

const [counts] = await sql`
  SELECT (SELECT count(*) FROM signups) AS signups,
         (SELECT count(*) FROM dwell_sessions) AS dwell,
         (SELECT count(*) FROM change_requests) AS requests`;
console.log('db now holds:', counts);
