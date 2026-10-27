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

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper model mapping function
function getNormalizedModel(model?: string): string {
  if (!model) return 'gemini-3.1-flash-lite-image';
  if (model === 'gemini-3-pro-image-preview' || model === 'pro') return 'gemini-nano-banana-2.1';
  if (model === 'gemini-2.5-flash-image' || model === 'flash') return 'gemini-3.1-flash-lite-image';
  return model;
}

// 1. Text Generation Endpoint
app.post('/api/gemini/generate-text', async (req, res) => {
  try {
    const { prompt, systemInstruction, model } = req.body;
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
    const { parts, config, model } = req.body;
    const targetModel = getNormalizedModel(model);

    console.log(`[Server API] Generating image with model: ${targetModel}`);

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

// 3. Video / Animation Generation Endpoint
app.post('/api/gemini/generate-video', async (req, res) => {
  try {
    const { prompt, imageBytes, mimeType } = req.body;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Subtle cinematic motion, 4k, high quality, comic book animation.',
      image: imageBytes ? { imageBytes, mimeType: mimeType || 'image/jpeg' } : undefined,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '9:16',
      },
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      const vidRes = await fetch(`${videoUri}&key=${process.env.GEMINI_API_KEY}`);
      const arrayBuffer = await vidRes.arrayBuffer();
      const base64Video = Buffer.from(arrayBuffer).toString('base64');
      const dataUrl = `data:video/mp4;base64,${base64Video}`;
      res.json({ videoUri, videoDataUrl: dataUrl });
    } else {
      res.status(500).json({ error: 'No video returned by Veo' });
    }
  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate video' });
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
  console.log(`Comic Book Studio server running on http://0.0.0.0:${PORT}`);
});
