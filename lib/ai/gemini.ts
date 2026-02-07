import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Safety settings to ensure scholarly content isn't accidentally blocked
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
];

/**
 * Generic Gemini Request with Exponential Backoff (Retry System)
 */
export async function generateWithRetry(
  prompt: string, 
  systemInstruction: string,
  retries: number = 3, 
  delay: number = 2000
): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", // Faster & cheaper for translation/summaries
    systemInstruction,
  });

  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings
      });
      
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      // If it's a Rate Limit (429) or Server Error (500/503)
      if (i < retries - 1 && (error.status === 429 || error.status >= 500)) {
        console.warn(`Gemini Busy. Retrying in ${delay}ms... (Attempt ${i + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw new Error("Gemini failed after maximum retries.");
}