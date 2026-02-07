"use server";

import { isAdmin } from "@/lib/auth-utils";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteArticle(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await query("DELETE FROM posts WHERE id = $1", [id]);
  
  revalidatePath("/admin/articles");
  return { success: true };
}

// Admin fuzzy search with status filtering
export async function searchAdminArticles(
  searchQuery: string,
  statusFilter: 'all' | 'PUBLISHED' | 'UNLISTED' | 'DRAFT' = 'all',
  limit: number = 50
) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  if (!searchQuery || searchQuery.trim().length < 2) {
    return [];
  }

  const statusClause = statusFilter === 'all' 
    ? '' 
    : `AND status = '${statusFilter}'`;

  const sql = `
    SELECT 
      id,
      title_hindi, 
      slug, 
      status,
      created_at,
      published_at,
      similarity(title_hindi, $1) as score
    FROM posts 
    WHERE title_hindi % $1 ${statusClause}
    ORDER BY score DESC
    LIMIT $2;
  `;

  try {
    const result = await query(sql, [searchQuery, limit]);
    return result.rows;
  } catch (error) {
    console.error("Error searching admin articles:", error);
    return [];
  }
}
