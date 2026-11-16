import { GoogleGenAI } from '@google/genai';
import { logError, logInfo } from './ErrorLogger';
import { ImageModel } from './types';

export const getActiveApiKey = (): string => {
  if (typeof window !== "undefined") {
    const customKey = localStorage.getItem("comic_gemini_api_key") ||
                      localStorage.getItem("persona_gemini_api_key") ||
                      localStorage.getItem("logopro_gemini_api_key") ||
                      localStorage.getItem("gemini_api_key");
    if (customKey && customKey.trim().length >= 10) {
      return customKey.trim();
    }
  }
  // @ts-ignore
  const envKey = (typeof process !== "undefined" && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) || (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
  return (envKey && typeof envKey === 'string') ? envKey.trim() : '';
};

export const hasValidApiKey = (): boolean => {
  return getActiveApiKey().length >= 10;
};

const shouldUseDirectClient = (): boolean => {
  if (typeof window === 'undefined') return false;
  // If we are hosted on Firebase / web domain, always use direct GenAI client
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
};

const parseJsonResponse = async (res: Response): Promise<any> => {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `API endpoint unavailable (received ${contentType || 'HTML'} instead of JSON). Please enter your Gemini API key directly in the app.`
    );
  }
  return res.json();
};

export const generateScriptText = async (
  prompt: string, 
  systemInstruction?: string, 
  model: string = 'gemini-3.8-flash'
): Promise<string> => {
  const apiKey = getActiveApiKey();

  // If on web hosting (Firebase), require direct client API key — never fall through to /api/ (which serves index.html)
  if (shouldUseDirectClient()) {
    if (!apiKey) {
      const msg = "Missing Gemini API Key. Please enter your Gemini API key in the API Key & Guide panel.";
      logError("API Key Required", msg, "Script Generator");
      throw new Error(msg);
    }
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const resp = await ai.models.generateContent({
        model,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      return resp.text || '';
    } catch (clientErr: any) {
      logError("Text Scripting Failed", clientErr.message || 'Direct GenAI client error', "Script Generator", clientErr.stack);
      throw clientErr;
    }
  }

  // Try server endpoint first (local dev)
  try {
    const res = await fetch("/api/gemini/generate-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-gemini-api-key": apiKey } : {})
      },
      body: JSON.stringify({ prompt, systemInstruction, model, apiKey }),
    });

    if (res.ok) {
      const data = await parseJsonResponse(res);
      if (data.text) return data.text;
    } else {
      const errData = await parseJsonResponse(res).catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }
  } catch (serverErr: any) {
    // If client has direct API key, fallback to direct client-side SDK
    if (apiKey) {
      try {
        logInfo("Client Direct Fallback", "Server endpoint failed, falling back to direct browser SDK", "Text Generator");
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const resp = await ai.models.generateContent({
          model,
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined,
        });
        return resp.text || '';
      } catch (clientErr: any) {
        logError("Text Scripting Failed", clientErr.message || 'Direct GenAI client error', "Script Generator", clientErr.stack);
        throw clientErr;
      }
    } else {
      logError("Text Scripting Failed", serverErr.message || 'Server API error', "Script Generator", serverErr.stack);
      throw serverErr;
    }
  }

  return '';
};

export const generateComicImage = async (
  parts: any[], 
  config: any, 
  model: ImageModel = 'gemini-nano-banana-2.1'
): Promise<{ imageData: string; textData?: string }> => {
  const apiKey = getActiveApiKey();

  // If on web hosting (Firebase), require direct client API key — never fall through to /api/ (which serves index.html)
  if (shouldUseDirectClient()) {
    if (!apiKey) {
      const msg = "Missing Gemini API Key. Please enter your Gemini API key in the API Key & Guide panel.";
      logError("API Key Required", msg, `Model: ${model}`);
      throw new Error(msg);
    }
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: config || {},
      });

      let imageData = '';
      let textData = '';
      const candidate = response.candidates?.[0];

      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data) {
            imageData = part.inlineData.data;
          } else if (part.text) {
            textData += part.text;
          }
        }
      }

      if (imageData) {
        return { imageData, textData };
      }
      throw new Error("No image data received in direct response");
    } catch (clientErr: any) {
      logError("Image Synthesis Failed", clientErr.message || 'Direct GenAI error', `Model: ${model}`, clientErr.stack);
      throw clientErr;
    }
  }

  try {
    const res = await fetch("/api/gemini/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-gemini-api-key": apiKey } : {})
      },
      body: JSON.stringify({ parts, config, model, apiKey }),
    });

    if (res.ok) {
      const data = await parseJsonResponse(res);
      if (data.imageData) {
        return { imageData: data.imageData, textData: data.textData };
      }
      if (data.blockReason) {
        const msg = `Image generation safety block: ${data.blockReason}`;
        logError("Safety Filter Triggered", msg, `Model: ${model}`);
        throw new Error(msg);
      }
      throw new Error(data.error || "No image data returned from synthesis");
    } else {
      const errData = await parseJsonResponse(res).catch(() => ({}));
      throw new Error(errData.error || `Server image error (HTTP ${res.status})`);
    }
  } catch (serverErr: any) {
    // Client Direct Fallback
    if (apiKey) {
      try {
        logInfo("Client Direct Fallback", `Calling ${model} directly from browser`, "Image Generator");
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const response = await ai.models.generateContent({
          model,
          contents: { parts },
          config: config || {},
        });

        let imageData = '';
        let textData = '';
        const candidate = response.candidates?.[0];

        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              imageData = part.inlineData.data;
            } else if (part.text) {
              textData += part.text;
            }
          }
        }

        if (imageData) {
          return { imageData, textData };
        }
        throw new Error("No image data received in direct response");
      } catch (clientErr: any) {
        logError("Image Synthesis Failed", clientErr.message || 'Direct GenAI error', `Model: ${model}`, clientErr.stack);
        throw clientErr;
      }
    } else {
      logError("Image Synthesis Failed", serverErr.message || 'Image generation error', `Model: ${model}`, serverErr.stack);
      throw serverErr;
    }
  }
};
