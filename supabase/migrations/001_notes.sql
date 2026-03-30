-- Migration: 001_notes
-- Creates the notes table, enables RLS, adds per-user policies,
-- and installs an updated_at trigger.

-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE notes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL DEFAULT '',
  body        jsonb       NOT NULL DEFAULT '{}',
  body_text   text        NOT NULL DEFAULT '',
  is_pinned   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

-- ─── Row-level security ───────────────────────────────────────────────────────

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes: select own" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notes: insert own" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes: update own" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notes: delete own" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER notes_set_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
