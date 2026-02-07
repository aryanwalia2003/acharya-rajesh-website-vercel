-- Add draft columns to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS draft_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS draft_content TEXT;

-- Migrate existing data: Copy live content to draft content so editors don't see empty fields
UPDATE posts 
SET 
  draft_title = title_hindi,
  draft_content = content_hindi
WHERE draft_title IS NULL;
