-- Run this ONLY if you already ran the original migration and need to add hole columns
-- If starting fresh, just run migration.sql instead

ALTER TABLE scores ADD COLUMN IF NOT EXISTS hole_scores jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE scores ADD COLUMN IF NOT EXISTS holes_played integer NOT NULL DEFAULT 0;
ALTER TABLE scores ADD COLUMN IF NOT EXISTS par_played integer NOT NULL DEFAULT 0;

-- Relax the gross_score check to allow partial rounds (min 0)
ALTER TABLE scores DROP CONSTRAINT IF EXISTS scores_gross_score_check;
ALTER TABLE scores ADD CONSTRAINT scores_gross_score_check CHECK (gross_score >= 0 AND gross_score <= 300);
