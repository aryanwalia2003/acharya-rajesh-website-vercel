/**
 * Quick script to check AI data in the database
 * Run with: npx tsx scripts/check-ai-data.ts
 */

import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkData() {
  console.log("\n========== AI CACHE TABLE ==========");
  const cacheResult = await pool.query(`
    SELECT id, input_hash, result_type, 
           LEFT(result_content, 200) as preview,
           created_at
    FROM ai_cache 
    ORDER BY created_at DESC 
    LIMIT 10
  `);
  
  if (cacheResult.rows.length === 0) {
    console.log("❌ No entries in ai_cache table");
  } else {
    console.log(`✅ Found ${cacheResult.rows.length} cached AI results:\n`);
    cacheResult.rows.forEach((row, i) => {
      console.log(`--- Entry ${i + 1} ---`);
      console.log(`Type: ${row.result_type}`);
      console.log(`Hash: ${row.input_hash.substring(0, 20)}...`);
      console.log(`Preview: ${row.preview}...`);
      console.log(`Created: ${row.created_at}\n`);
    });
  }

  console.log("\n========== POSTS TABLE (AI Fields) ==========");
  const postsResult = await pool.query(`
    SELECT id, 
           LEFT(title_hindi, 50) as title,
           status,
           LEFT(english_translation, 100) as translation_preview,
           LEFT(english_summary, 100) as summary_preview,
           important_dates
    FROM posts 
    ORDER BY updated_at DESC 
    LIMIT 5
  `);

  if (postsResult.rows.length === 0) {
    console.log("❌ No posts found");
  } else {
    console.log(`✅ Found ${postsResult.rows.length} posts:\n`);
    postsResult.rows.forEach((row, i) => {
      console.log(`--- Post ${i + 1} ---`);
      console.log(`ID: ${row.id}`);
      console.log(`Title: ${row.title}...`);
      console.log(`Status: ${row.status}`);
      console.log(`Translation: ${row.translation_preview || '(empty)'}...`);
      console.log(`Summary: ${row.summary_preview || '(empty)'}...`);
      console.log(`Dates: ${row.important_dates ? JSON.stringify(row.important_dates) : '(empty)'}\n`);
    });
  }

  await pool.end();
}

checkData().catch(console.error);
