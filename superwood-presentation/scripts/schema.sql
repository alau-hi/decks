-- Idempotent schema for the deck's analytics + /changes board.
-- Applied by scripts/backfill.mjs (never at request time).
-- Multi-deck: every table carries a deck discriminator; deployments identify
-- themselves via the DECK_ID env var (default 'superwood').

CREATE TABLE IF NOT EXISTS signups (
  id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deck    text NOT NULL DEFAULT 'superwood',
  email   text NOT NULL,
  ts      timestamptz NOT NULL,
  ua      text DEFAULT '',
  ip      text DEFAULT '',
  city    text DEFAULT '',
  country text DEFAULT '',
  lat     double precision,
  lon     double precision,
  -- (deck, email, ts) uniqueness makes the blob backfill safely re-runnable.
  UNIQUE (deck, email, ts)
);

CREATE TABLE IF NOT EXISTS dwell_sessions (
  session text PRIMARY KEY,
  deck    text NOT NULL DEFAULT 'superwood',
  viewer  text NOT NULL,
  totals  jsonb NOT NULL DEFAULT '{}'::jsonb,
  scr     jsonb,
  ua      text DEFAULT '',
  ip      text DEFAULT '',
  city    text DEFAULT '',
  country text DEFAULT '',
  lat     double precision,
  lon     double precision,
  ts      timestamptz
);

CREATE INDEX IF NOT EXISTS dwell_sessions_deck_idx ON dwell_sessions (deck);

CREATE TABLE IF NOT EXISTS change_requests (
  deck       text NOT NULL DEFAULT 'superwood',
  id         text NOT NULL,
  title      text DEFAULT '',
  summary    text DEFAULT '',
  detail     text DEFAULT '',
  status     text NOT NULL DEFAULT 'submitted',
  author     text DEFAULT '',
  logged     text DEFAULT '',
  deleted    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (deck, id)
);

-- Gate watchman: one row per gate-page beacon. gid is the anonymous browser
-- cookie; a gid that later appears on signups.gid marks conversion.
CREATE TABLE IF NOT EXISTS gate_hits (
  id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deck    text NOT NULL DEFAULT 'superwood',
  ts      timestamptz NOT NULL,
  gid     text NOT NULL,
  ip      text DEFAULT '',
  ua      text DEFAULT '',
  city    text DEFAULT '',
  country text DEFAULT '',
  lat     double precision,
  lon     double precision,
  path    text DEFAULT '',
  scr     jsonb,
  team    boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS gate_hits_deck_idx ON gate_hits (deck);

-- Conversion link: which anonymous browser this signup came from.
ALTER TABLE signups ADD COLUMN IF NOT EXISTS gid text;
