-- The Hahei Classic - Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Players table
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handicap integer not null check (handicap >= 0 and handicap <= 54),
  avatar_color text not null default '#457B9D',
  created_at timestamptz not null default now()
);

-- Scores table (one score per player, with hole-by-hole data)
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  gross_score integer not null check (gross_score >= 0 and gross_score <= 300),
  net_score integer not null,
  hole_scores jsonb not null default '[]'::jsonb,
  holes_played integer not null default 0,
  par_played integer not null default 0,
  created_at timestamptz not null default now(),
  unique (player_id)
);

-- Enable Row Level Security
alter table players enable row level security;
alter table scores enable row level security;

-- Allow public read/write (this is a mates-only app, no auth needed)
create policy "Allow all access to players"
  on players for all
  using (true)
  with check (true);

create policy "Allow all access to scores"
  on scores for all
  using (true)
  with check (true);

-- Enable realtime for both tables
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table scores;
