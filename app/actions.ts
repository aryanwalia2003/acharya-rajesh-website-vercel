"use server";

import { query } from "@/lib/db";

// Post type for frontend
export type Post = {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  publishedAt: string; // ISO string for cursor
};

// Pagination response type
export type PaginatedPosts = {
  posts: Post[];
  hasMore: boolean;
  nextCursor: string | null;
};

// Fetch latest published posts with cursor-based pagination
export async function getLatestPosts(
  limit: number = 10,
  cursor?: string // ISO timestamp cursor
): Promise<PaginatedPosts> {
  // Fetch one extra to determine if there are more posts
  const fetchLimit = limit + 1;
  
  const sql = cursor
    ? `
      SELECT 
        title_hindi, 
        content_hindi, 
        slug, 
        tags, 
        published_at
      FROM posts 
      WHERE status = 'PUBLISHED' AND published_at < $2
      ORDER BY published_at DESC
      LIMIT $1;
    `
    : `
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
    const params = cursor ? [fetchLimit, cursor] : [fetchLimit];
    const result = await query(sql, params);
    
    // Check if there are more posts
    const hasMore = result.rows.length > limit;
    const rows = hasMore ? result.rows.slice(0, limit) : result.rows;
    
    // Transform data for the frontend
    const posts: Post[] = rows.map(row => ({
      title: row.title_hindi,
      excerpt: row.content_hindi
        ? row.content_hindi.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
        : "",
      date: new Date(row.published_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: row.tags && row.tags.length > 0 ? row.tags[0] : "General",
      slug: row.slug,
      publishedAt: new Date(row.published_at).toISOString()
    }));

    // Get next cursor from the last post
    const nextCursor = hasMore && posts.length > 0
      ? posts[posts.length - 1].publishedAt
      : null;

    return { posts, hasMore, nextCursor };
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return { posts: [], hasMore: false, nextCursor: null };
  }
}

export async function getPostBySlug(slug: string) {
  const sql = `
    SELECT 
      title_hindi, 
      content_hindi, 
      slug, 
      tags, 
      published_at,
      english_translation,
      english_summary,
      important_dates
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
      // AI-Generated Content
      englishTranslation: row.english_translation || null,
      englishSummary: row.english_summary || null,
      importantDates: row.important_dates || []
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

// Fuzzy search for published posts (readers)
export async function searchPosts(
  searchQuery: string,
  limit: number = 20
): Promise<Post[]> {
  if (!searchQuery || searchQuery.trim().length < 2) {
    return [];
  }

  const sql = `
    SELECT 
      title_hindi, 
      content_hindi, 
      slug, 
      tags, 
      published_at,
      similarity(title_hindi, $1) as score
    FROM posts 
    WHERE status = 'PUBLISHED' 
      AND title_hindi % $1
    ORDER BY score DESC
    LIMIT $2;
  `;

  try {
    const result = await query(sql, [searchQuery, limit]);
    
    return result.rows.map(row => ({
      title: row.title_hindi,
      excerpt: row.content_hindi
        ? row.content_hindi.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
        : "",
      date: new Date(row.published_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: row.tags && row.tags.length > 0 ? row.tags[0] : "General",
      slug: row.slug,
      publishedAt: new Date(row.published_at).toISOString()
    }));
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

