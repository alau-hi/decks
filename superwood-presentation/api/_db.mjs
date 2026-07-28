import { neon } from '@neondatabase/serverless';

// Single source of truth for DB availability: null on deployments without
// DATABASE_URL (collaborator projects, staging-open) — callers take the same
// no-op paths the missing BLOB_READ_WRITE_TOKEN used to trigger.
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// Timestamps leave the DB as Date objects; the blobs stored ISO strings and
// all downstream aggregation/sorting assumes that format.
export const iso = (t) => (t == null ? null : new Date(t).toISOString());

// The database is shared by (future) multiple decks; each deployment tags and
// filters its rows by this identity.
export const DECK = process.env.DECK_ID || 'superwood';
