"use server";

import { isAdmin } from "@/lib/auth-utils";
import { processAstrologyAI, ExtractedDate } from "./ai-logic";

export async function runAITask(content: string, type: 'translation' | 'summary' | 'dates') {
  // 1. Security Check
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const result = await processAstrologyAI(content, type);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(`AI Task ${type} failed:`, error);
    return { success: false, error: error.message };
  }
}