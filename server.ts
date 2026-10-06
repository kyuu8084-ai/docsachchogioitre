import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Gemini API Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes

// Book reviews & educational insights API (Static for now)
app.get('/api/books/reviews', (_req, res) => {
  res.json({
    success: true,
    message: 'Book reviews and educational analysis loaded successfully',
    timestamp: new Date().toISOString(),
  });
});

// Mood-based book suggestions API using Gemini
app.post('/api/gemini/suggest-books', async (req, res) => {
  const { mood } = req.body;
  if (!mood) {
    return res.status(400).json({ success: false, message: 'Mood is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Gợi ý 3 cuốn sách phù hợp cho người đang có tâm trạng: "${mood}". 
      Đưa ra một lời nhắn nhủ ngắn gọn, ấm áp từ AI.
      Trả về kết quả theo định dạng JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiMessage: {
              type: Type.STRING,
              description: "Lời nhắn nhủ ngắn gọn từ AI cho người dùng.",
            },
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "Tại sao cuốn sách này phù hợp với tâm trạng." },
                },
                required: ["title", "author", "reason"],
              },
            },
          },
          required: ["aiMessage", "books"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate suggestions' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
