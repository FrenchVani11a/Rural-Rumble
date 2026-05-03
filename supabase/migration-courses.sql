-- Add course tracking to scores
-- Run this in Supabase SQL Editor after migration.sql

-- Add course_id column
ALTER TABLE scores ADD COLUMN IF NOT EXISTS course_id text NOT NULL DEFAULT 'waverley';

-- Drop old unique constraint (one score per player)
ALTER TABLE scores DROP CONSTRAINT IF EXISTS scores_player_id_key;

-- Add new unique constraint (one score per player per course)
ALTER TABLE scores ADD CONSTRAINT IF NOT EXISTS scores_player_course_key UNIQUE (player_id, course_id);
