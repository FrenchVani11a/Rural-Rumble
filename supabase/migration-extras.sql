-- Extra tables for Rural Rumble
-- Run in Supabase SQL Editor after migration-courses.sql

-- Punishment log
CREATE TABLE IF NOT EXISTS punishments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  punishment_id text not null,
  course_id text not null default 'general',
  created_at timestamptz not null default now()
);
ALTER TABLE punishments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to punishments"
  ON punishments FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE punishments;

-- Can counts per player per hole (Whanganui)
CREATE TABLE IF NOT EXISTS can_counts (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  hole integer not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  UNIQUE (player_id, hole)
);
ALTER TABLE can_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to can_counts"
  ON can_counts FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE can_counts;

-- Photos
CREATE TABLE IF NOT EXISTS photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  uploaded_by text not null default 'Anonymous',
  course_id text not null default 'general',
  created_at timestamptz not null default now()
);
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to photos"
  ON photos FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
