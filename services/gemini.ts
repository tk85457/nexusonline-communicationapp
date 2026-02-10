
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
        contents: `You are a strict content moderator for Nexus, a high-quality community platform. 
        Analyze the following user-generated content for:
        1. Hate speech or harassment.
        2. Spam or malicious links.
        3. Harmful misinformation.
        4. Sexually explicit content.
        
        Return a JSON object with: 
        - "safe": boolean (true only if content is perfectly fine)
        - "reason": string (a short, clear explanation of why it was flagged, if unsafe)
        - "sentiment": string (one word: positive, negative, or neutral)
        
        User Content: "${content.replace(/"/g, '\\"')}"`,
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
      
      const result = JSON.parse(response.text || '{}');
      return {
        safe: result.safe ?? true,
        reason: result.reason || 'Content may violate community standards.',
        sentiment: result.sentiment || 'neutral'
      };
    } catch (error) {
      console.error("Moderation failed", error);
      return { safe: true, sentiment: 'neutral' }; // Fallback to safe if API fails for UX
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
