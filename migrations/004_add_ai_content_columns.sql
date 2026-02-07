-- Migration: Add AI-generated content columns
-- These store English translation, summary, and extracted important dates

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS english_translation TEXT,
ADD COLUMN IF NOT EXISTS english_summary TEXT,
ADD COLUMN IF NOT EXISTS important_dates JSONB;

-- Index for queries that filter by important dates
CREATE INDEX IF NOT EXISTS idx_posts_important_dates ON posts USING GIN (important_dates);
