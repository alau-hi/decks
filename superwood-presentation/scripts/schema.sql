-- Idempotent schema for the deck's analytics + /changes board.
-- Applied by scripts/backfill.mjs (never at request time).

CREATE TABLE IF NOT EXISTS signups (
  id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email   text NOT NULL,
  ts      timestamptz NOT NULL,
  ua      text DEFAULT '',
  ip      text DEFAULT '',
  city    text DEFAULT '',
  country text DEFAULT '',
  lat     double precision,
  lon     double precision,
  -- (email, ts) uniqueness makes the blob backfill safely re-runnable.
  UNIQUE (email, ts)
);

CREATE TABLE IF NOT EXISTS dwell_sessions (
  session text PRIMARY KEY,
  viewer  text NOT NULL,
  totals  jsonb NOT NULL DEFAULT '{}'::jsonb,
  ua      text DEFAULT '',
  ip      text DEFAULT '',
  city    text DEFAULT '',
  country text DEFAULT '',
  lat     double precision,
  lon     double precision,
  ts      timestamptz
);

CREATE TABLE IF NOT EXISTS change_requests (
  id         text PRIMARY KEY,
  title      text DEFAULT '',
  summary    text DEFAULT '',
  detail     text DEFAULT '',
  status     text NOT NULL DEFAULT 'submitted',
  author     text DEFAULT '',
  logged     text DEFAULT '',
  deleted    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
