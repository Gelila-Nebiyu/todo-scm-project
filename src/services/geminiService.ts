
import { GoogleGenAI, Type } from "@google/genai";

export const suggestTasks = async (currentTasks: string[]): Promise<string[]> => {
  // Initialize the GoogleGenAI client with the API key from environment variables.
  // As per guidelines, use process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = currentTasks.length > 0 
    ? `Based on these current tasks: "${currentTasks.join(', ')}", suggest 3 new productive and relevant tasks for today.`
    : "Suggest 3 general productive tasks to start my day.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A short, actionable task description."
          }
        },
      },
    });

    // Access the .text property directly to get the generated content string.
    const text = response.text;
    if (!text) return [];
    
    // Parse the JSON result after trimming any potential whitespace from the model output.
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    // Provide a graceful fallback if the AI generation fails.
    return ["Organize workspace", "Review weekly goals", "Take a short walk"];
  }
};
