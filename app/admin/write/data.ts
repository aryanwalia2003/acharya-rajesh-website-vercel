"use server";

import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth-utils";

export async function getPostForEditing(id: string) {
  // 1. Security Check
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const sql = `
    SELECT 
      id::text, 
      COALESCE(draft_title, title_hindi) as title_hindi, 
      COALESCE(draft_content, content_hindi) as content_hindi, 
      slug, 
      tags, 
      status 
    FROM posts 
    WHERE id = $1 
    LIMIT 1
  `;
  
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}