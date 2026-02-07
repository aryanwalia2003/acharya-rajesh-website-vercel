-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on title_hindi for fast trigram matching
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm 
ON posts USING GIN (title_hindi gin_trgm_ops);
