"use server";

import { isAdmin } from "@/lib/auth-utils";
import { query } from "@/lib/db";
import { idGenerator } from "@/lib/id-generator";
import { revalidatePath } from "next/cache";

/**
 * Combined Publish Action
 * Upserts based on Snowflake ID to prevent duplicate/abandoned rows.
 */
export async function upsertArticle(formData: {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  intent: 'DRAFT' | 'PUBLISH';
  // AI-Generated Content (Optional - only saved when provided)
  english_translation?: string;
  english_summary?: string;
  important_dates?: any[];
}) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const sql = `
    INSERT INTO posts (
      id, 
      title_hindi, 
      content_hindi, 
      draft_title,
      draft_content,
      slug, 
      tags, 
      status, 
      published_at,
      english_translation,
      english_summary,
      important_dates
    ) 
    VALUES (
      $1, 
      -- Live Content (Only set on PUBLISH)
      CASE WHEN $6 = 'PUBLISH' THEN $2 ELSE '' END, 
      CASE WHEN $6 = 'PUBLISH' THEN $4 ELSE '' END,
      -- Draft Content (Always set)
      $2, 
      $4,
      $3, $5, 
      CASE WHEN $6 = 'PUBLISH' THEN 'PUBLISHED' ELSE 'DRAFT' END,
      CASE WHEN $6 = 'PUBLISH' THEN CURRENT_TIMESTAMP ELSE NULL END,
      -- AI Content (Set if provided)
      $7, $8, $9
    )
    ON CONFLICT (id) 
    DO UPDATE SET 
      -- Draft Columns: Always update these on every save
      draft_title = EXCLUDED.draft_title,
      draft_content = EXCLUDED.draft_content,
      
      -- Live Columns: Only update on PUBLISH
      title_hindi = CASE 
        WHEN $6 = 'PUBLISH' THEN EXCLUDED.draft_title 
        ELSE posts.title_hindi 
      END,
      content_hindi = CASE 
        WHEN $6 = 'PUBLISH' THEN EXCLUDED.draft_content 
        ELSE posts.content_hindi 
      END,

      tags = EXCLUDED.tags,
      
      -- SLUG PROTECTION LOGIC:
      -- Only update the slug if the current status in the DB is 'DRAFT'.
      -- If it's already 'PUBLISHED', we keep the old slug to prevent broken links.
      slug = CASE 
        WHEN posts.status = 'DRAFT' THEN EXCLUDED.slug 
        ELSE posts.slug 
      END,

      -- STATUS LOGIC:
      -- If the user clicked 'Publish', update status to 'PUBLISHED'.
      -- If it was already 'PUBLISHED', keep it 'PUBLISHED'.
      status = CASE 
        WHEN $6 = 'PUBLISH' OR posts.status = 'PUBLISHED' THEN 'PUBLISHED' 
        ELSE 'DRAFT' 
      END,

      -- DATE LOGIC:
      -- Only set published_at the very first time it goes live.
      published_at = COALESCE(posts.published_at, 
        CASE WHEN $6 = 'PUBLISH' THEN CURRENT_TIMESTAMP ELSE NULL END
      ),

      -- AI CONTENT: Only update if new value is provided (not null/empty)
      english_translation = COALESCE(NULLIF($7, ''), posts.english_translation),
      english_summary = COALESCE(NULLIF($8, ''), posts.english_summary),
      important_dates = COALESCE($9, posts.important_dates),
      
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, slug, status;
  `;

  const values = [
    formData.id,
    formData.title,
    formData.slug,
    formData.content,
    formData.tags,
    formData.intent,
    formData.english_translation || null,
    formData.english_summary || null,
    formData.important_dates ? JSON.stringify(formData.important_dates) : null
  ];

  try {
    const result = await query(sql, values);
    
    // Refresh relevant pages
    revalidatePath("/");
    revalidatePath("/admin/articles");
    if (result.rows[0].slug) {
        revalidatePath(`/blog/${result.rows[0].slug}`);
    }
    
    return { success: true, data: result.rows[0] };
  } catch (error: any) {
    console.error("Upsert failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Utility to generate a new Snowflake ID on the server
 */
export async function getNewPostId() {
  return idGenerator.nextId().toString();
}

/**
 * Fetch Post by ID for Editing
 */
export async function getPostById(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const sql = `
    SELECT id, title_hindi, content_hindi, tags, status, slug
    FROM posts 
    WHERE id = $1
  `;

  try {
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

/**
 * Unlist a published article (hide from public but keep accessible via direct link)
 */
export async function unlistArticle(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const sql = `
    UPDATE posts 
    SET status = 'UNLISTED', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND status = 'PUBLISHED'
    RETURNING id, slug, status;
  `;

  try {
    const result = await query(sql, [id]);
    
    if (result.rows.length === 0) {
      return { success: false, error: "Article not found or not published" };
    }

    // Refresh relevant pages
    revalidatePath("/");
    revalidatePath("/admin/articles");
    if (result.rows[0].slug) {
      revalidatePath(`/blog/${result.rows[0].slug}`);
    }

    return { success: true, data: result.rows[0] };
  } catch (error: any) {
    console.error("Unlist failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Re-publish an unlisted article (make it public again)
 */
export async function republishArticle(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const sql = `
    UPDATE posts 
    SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND status = 'UNLISTED'
    RETURNING id, slug, status;
  `;

  try {
    const result = await query(sql, [id]);
    
    if (result.rows.length === 0) {
      return { success: false, error: "Article not found or not unlisted" };
    }

    revalidatePath("/");
    revalidatePath("/admin/articles");
    if (result.rows[0].slug) {
      revalidatePath(`/blog/${result.rows[0].slug}`);
    }

    return { success: true, data: result.rows[0] };
  } catch (error: any) {
    console.error("Republish failed:", error);
    return { success: false, error: error.message };
  }
}