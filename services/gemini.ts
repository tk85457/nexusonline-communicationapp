
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * AI-powered content moderation to detect spam, hate speech, etc.
   */
  async moderateContent(content: string): Promise<{ safe: boolean; reason?: string; sentiment?: string }> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following social media post for safety guidelines (no hate speech, spam, or harmful content). 
        Return a JSON object with: 
        - "safe": boolean
        - "reason": string (if unsafe)
        - "sentiment": string (positive, negative, neutral)
        
        Content: "${content}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              safe: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
              sentiment: { type: Type.STRING }
            },
            required: ["safe", "sentiment"]
          }
        }
      });
      
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Moderation failed", error);
      return { safe: true, sentiment: 'neutral' }; // Fallback
    }
  },

  /**
   * Get personalized community recommendations based on user bio and interests.
   */
  async getRecommendations(bio: string, interests: string[]): Promise<string[]> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on a user's interests: [${interests.join(', ')}] and bio: "${bio}", suggest 5 relevant niche community categories for a social media app. Return as a plain JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return ["General", "Tech", "Life"];
    }
  },

  /**
   * Explainable AI for dashboard insights
   */
  async explainAnalytics(dataSummary: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an expert community manager. Explain these growth metrics in a helpful way: ${dataSummary}`,
      config: {
        systemInstruction: "Keep it professional, data-driven, and actionable."
      }
    });
    return response.text || "Unable to generate insights.";
  }
};
