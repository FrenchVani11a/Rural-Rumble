-- Seed players for Rural Rumble
-- Run this in Supabase SQL Editor

INSERT INTO players (name, handicap, avatar_color) VALUES
  ('Alex Beaven',    18, '#E63946'),
  ('Walter Todd',     9, '#457B9D'),
  ('Simon Reeves',   10, '#FF69B4'),
  ('Dinesh Fonseka', 15, '#C084FC')
ON CONFLICT DO NOTHING;

-- Note: Walter Todd's exact handicap is 8.8, stored here as 9 (integer field).
