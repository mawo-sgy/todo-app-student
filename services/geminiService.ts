import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are a calm, encouraging, and helpful study companion for a university student. 
Your goal is to help them manage stress, answer academic questions concisely, and provide productivity tips.
Keep responses brief, friendly, and motivating. Avoid long lectures.`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the study companion.");
  }
};