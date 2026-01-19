
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter for apiKey and obtain it exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkflowStructure = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Design a professional workflow definition for the following process: "${prompt}". 
    Return a valid JSON structure representing states and transitions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          states: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                isInitial: { type: Type.BOOLEAN },
                isFinal: { type: Type.BOOLEAN }
              },
              required: ["id", "name", "description"]
            }
          },
          transitions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                fromStateId: { type: Type.STRING },
                toStateId: { type: Type.STRING }
              },
              required: ["id", "name", "fromStateId", "toStateId"]
            }
          }
        },
        required: ["name", "description", "states", "transitions"]
      }
    }
  });

  // accessing response.text property directly as per coding guidelines
  return JSON.parse(response.text);
};
