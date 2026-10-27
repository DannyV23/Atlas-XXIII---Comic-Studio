import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get Gemini Client with session key fallback
function getClient(apiKey?: string): GoogleGenAI {
  const key = (apiKey && apiKey.trim().length >= 10) ? apiKey.trim() : (process.env.GEMINI_API_KEY || '');
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper model mapping function
function getNormalizedModel(model?: string): string {
  if (!model) return 'gemini-nano-banana-2.1';
  if (model === 'pro' || model === 'gemini-3-pro-image-preview') return 'gemini-nano-banana-2.1';
  if (model === 'flash') return 'gemini-3.1-flash-lite-image';
  return model;
}

// 1. Text Generation Endpoint
app.post('/api/gemini/generate-text', async (req, res) => {
  try {
    const { prompt, systemInstruction, model, apiKey } = req.body;
    const clientKey = (req.headers['x-gemini-api-key'] as string) || apiKey;
    const ai = getClient(clientKey);

    const targetModel = model || 'gemini-3.8-flash';
    
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate text' });
  }
});

// 2. Image Generation & Refine Endpoint
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const { parts, config, model, apiKey } = req.body;
    const clientKey = (req.headers['x-gemini-api-key'] as string) || apiKey;
    const ai = getClient(clientKey);

    const targetModel = getNormalizedModel(model);

    console.log(`[Atlas XXIII Server API] Generating image with model: ${targetModel}`);

    const response = await ai.models.generateContent({
      model: targetModel,
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

    res.json({
      imageData,
      textData,
      finishReason: candidate?.finishReason,
      blockReason: response.promptFeedback?.blockReason,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate image' });
  }
});

// Serve frontend in dev (via Vite middleware) or prod (dist)
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Atlas XXIII - Comic Studio server running on http://0.0.0.0:${PORT}`);
});
