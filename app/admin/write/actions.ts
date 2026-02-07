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
  intent: 'DRAFT' | 'PUBLISH'; // We use 'intent' to decide the logic
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
      published_at
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
      CASE WHEN $6 = 'PUBLISH' THEN CURRENT_TIMESTAMP ELSE NULL END
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
      
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, slug, status;
  `;

  const values = [
    formData.id,
    formData.title,
    formData.slug,
    formData.content,
    formData.tags,
    formData.intent
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