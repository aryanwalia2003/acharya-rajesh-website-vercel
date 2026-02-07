"use server";

import { isAdmin } from "@/lib/auth-utils";
import { query } from "@/lib/db";
import { idGenerator } from "@/lib/id-generator";
import { revalidatePath } from "next/cache";

export async function publishArticle(formData: {
  title: string;
  content: string;
  slug: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
}) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized. Only Acharya Rajesh can publish articles.");
  }

  const postId = idGenerator.nextId().toString();
  const publishedAt = formData.status === 'PUBLISHED' ? new Date() : null;

  const sql = `
    INSERT INTO posts (
      id, 
      title_hindi, 
      slug, 
      content_hindi, 
      tags, 
      status, 
      published_at
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (slug) 
    DO UPDATE SET 
      title_hindi = EXCLUDED.title_hindi,
      content_hindi = EXCLUDED.content_hindi,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status,
      published_at = COALESCE(posts.published_at, EXCLUDED.published_at),
      updated_at = CURRENT_TIMESTAMP
    RETURNING id;
  `;

  const values = [
    postId,
    formData.title,
    formData.slug,
    formData.content,
    formData.tags,
    formData.status,
    publishedAt
  ];

  try {
    const result = await query(sql, values);
    
    revalidatePath("/");
    revalidatePath("/admin/articles");
    
    return { success: true, id: result.rows[0].id };
  } catch (error: any) {
    console.error("Failed to publish article:", error);
    return { success: false, error: error.message };
  }
}