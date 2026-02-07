"use server";

import { query } from "@/lib/db";

// Fetch latest published posts for the homepage
export async function getLatestPosts(limit: number = 10) {
  const sql = `
    SELECT 
      title_hindi, 
      content_hindi, 
      slug, 
      tags, 
      published_at
    FROM posts 
    WHERE status = 'PUBLISHED'
    ORDER BY published_at DESC
    LIMIT $1;
  `;

  try {
    const result = await query(sql, [limit]);
    
    // Transform data for the frontend
    const posts = result.rows.map(row => ({
      title: row.title_hindi,
      // Create a plain text excerpt from HTML content
      excerpt: row.content_hindi
        ? row.content_hindi.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
        : "",
      date: new Date(row.published_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: row.tags && row.tags.length > 0 ? row.tags[0] : "General",
      slug: row.slug
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const sql = `
    SELECT 
      title_hindi, 
      content_hindi, 
      slug, 
      tags, 
      published_at
    FROM posts 
    WHERE slug = $1 AND status = 'PUBLISHED'
    LIMIT 1;
  `;

  try {
    const result = await query(sql, [slug]);
    
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      title: row.title_hindi,
      content: row.content_hindi,
      date: new Date(row.published_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: row.tags && row.tags.length > 0 ? row.tags[0] : "General",
      slug: row.slug,
      // For now, important dates are mocked or extracted from content if we had structured data
      importantDates: [] 
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}
