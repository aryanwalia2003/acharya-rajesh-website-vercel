import { generateWithRetry } from "@/lib/ai/gemini";
import { generateTextHash, getCachedAIResult, saveToAICache } from "@/lib/ai/cache";
import { SYSTEM_INSTRUCTIONS } from "@/lib/ai/prompts";

export type AITaskType = 'translation' | 'summary' | 'dates';

export interface ExtractedDate {
  date: string;
  time: string | null;
  time_end: string | null;
  title_hi: string;
  title_en: string;
  type: 'transit' | 'eclipse' | 'muhurat' | 'rahu_kaal' | 'festival' | 'panchang' | 'period_start' | 'period_end' | 'other';
}

const INSTRUCTION_MAP: Record<AITaskType, string> = {
  translation: SYSTEM_INSTRUCTIONS.TRANSLATION,
  summary: SYSTEM_INSTRUCTIONS.SUMMARY,
  dates: SYSTEM_INSTRUCTIONS.DATE_EXTRACTION,
};

export async function processAstrologyAI(
  hindiContent: string, 
  type: AITaskType
): Promise<string | ExtractedDate[]> {
  console.log(`\n========== AI TASK: ${type.toUpperCase()} ==========`);
  console.log(`[AI] Input content length: ${hindiContent.length} chars`);
  
  // 1. Generate hash of the Hindi input
  const hash = generateTextHash(hindiContent);
  console.log(`[AI] Content hash: ${hash.substring(0, 16)}...`);

  // 2. Check persistent DB cache (Save $$$ and Time)
  const cached = await getCachedAIResult(hash, type);
  if (cached) {
    console.log(`[AI] ✅ CACHE HIT! Using cached ${type}`);
    console.log(`[AI] Cached result preview: ${cached.substring(0, 200)}...`);
    return type === 'dates' ? JSON.parse(cached) : cached;
  }

  // 3. If not cached, call Gemini with our Retry System
  console.log(`[AI] ❌ CACHE MISS - Calling Gemini API...`);
  const instruction = INSTRUCTION_MAP[type];
  
  try {
    let result = await generateWithRetry(hindiContent, instruction);
    
    console.log(`[AI] ✅ Gemini Response received!`);
    console.log(`[AI] Response length: ${result.length} chars`);
    console.log(`[AI] Response preview: ${result.substring(0, 300)}...`);

    // Post-process: Convert any remaining markdown asterisks to HTML (safety net)
    if (type === 'translation') {
      // Convert **bold** to <strong>bold</strong>
      result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // Convert *italic* to <i>italic</i>
      result = result.replace(/\*([^*]+)\*/g, '<i>$1</i>');
      console.log(`[AI] Post-processed markdown to HTML`);
    }

    // 4. Save to cache for future use
    await saveToAICache(hash, type, result);
    console.log(`[AI] Saved to cache`);

    // 5. For dates, parse and return JSON array
    if (type === 'dates') {
      try {
        const parsed = JSON.parse(result) as ExtractedDate[];
        console.log(`[AI] Parsed ${parsed.length} dates from response`);
        return parsed;
      } catch (parseError) {
        console.error(`[AI] ❌ JSON PARSE ERROR for dates:`, parseError);
        console.error(`[AI] Raw response that failed to parse:`, result);
        return [];
      }
    }

    return result;
  } catch (error) {
    console.error(`[AI] ❌ Gemini API Error:`, error);
    throw error;
  }
}