import { query } from "@/lib/db";
import { idGenerator } from "@/lib/id-generator";
import crypto from "crypto";

/**
 * Creates a unique hash for a string of text
 */
export function generateTextHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Check if the AI has already processed this exact text
 */
export async function getCachedAIResult(hash: string, type: 'translation' | 'summary' | 'dates') {
  const sql = `SELECT result_content FROM ai_cache WHERE input_hash = $1 AND result_type = $2 LIMIT 1`;
  const res = await query(sql, [hash, type]);
  return res.rows[0]?.result_content || null;
}

/**
 * Save new AI result to the persistent cache
 */
export async function saveToAICache(hash: string, type: 'translation' | 'summary' | 'dates', content: string) {
  const id = idGenerator.nextId().toString();
  const sql = `
    INSERT INTO ai_cache (id, input_hash, result_type, result_content)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (input_hash) DO UPDATE SET result_content = EXCLUDED.result_content;
  `;
  await query(sql, [id, hash, type, content]);
}