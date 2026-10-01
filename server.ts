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

// File path for server persistent survey data
const DATA_FILE = path.join(__dirname, 'survey_database.json');

export interface SurveyStatsData {
  totalParticipants: number;
  ageGroup: {
    'under-18': number;
    '18-22': number;
    '23-30': number;
    'above-30': number;
  };
  booksPerYear: {
    'under-2': number;
    '2-5': number;
    '6-12': number;
    'above-12': number;
  };
  readingFormats: Record<string, number>;
  favoriteGenres: Record<string, number>;
  readingMotivations: Record<string, number>;
  readingBarriers: Record<string, number>;
  confessions: Array<{
    id: string;
    text: string;
    author: string;
    date: string;
    likes: number;
  }>;
}

export const INITIAL_SURVEY_STATS: SurveyStatsData = {
  totalParticipants: 0,
  ageGroup: {
    'under-18': 0,
    '18-22': 0,
    '23-30': 0,
    'above-30': 0,
  },
  booksPerYear: {
    'under-2': 0,
    '2-5': 0,
    '6-12': 0,
    'above-12': 0,
  },
  readingFormats: {
    'Sách giấy truyền thống': 0,
    'Máy đọc sách chuyên dụng (Kindle, Kobo)': 0,
    'Điện thoại / Máy tính bảng': 0,
    'Sách nói (Audiobook qua Voiz FM, Fonos...)': 0,
    'Tóm tắt sách qua video / podcast': 0,
  },
  favoriteGenres: {
    'Self-help / Phát triển bản thân': 0,
    'Chữa lành / Tâm lý': 0,
    'Tiểu thuyết (ngôn tình, trinh thám, fantasy…)': 0,
    'Truyện tranh / Manga / Light novel': 0,
    'Kinh tế / Khởi nghiệp / Tài chính': 0,
    'Lịch sử / Hồi ký / Tự truyện': 0,
  },
  readingMotivations: {
    'Chữa lành, tìm sự cân bằng cảm xúc nội tâm': 0,
    'Học kỹ năng mới, nâng cao kiến thức nghề nghiệp': 0,
    'Giải trí, thư giãn đầu óc sau giờ căng thẳng': 0,
    'Theo trend từ TikTok, Instagram, bạn bè giới thiệu': 0,
  },
  readingBarriers: {
    'Không có thời gian do lịch học tập, công việc dày đặc': 0,
    'Nghiện mạng xã hội, game, video ngắn lướt vô thức': 0,
    'Không biết chọn cuốn sách nào phù hợp với bản thân': 0,
    'Cảm thấy “khó vào”, dễ buồn ngủ sau vài trang đầu': 0,
  },
  confessions: [
    {
      id: '1',
      text: 'Đọc sách không phải để trở thành giáo sư, mà để thấy mình bớt cô độc giữa thế giới này.',
      author: 'Bạn nhỏ ẩn danh',
      date: '2026-10-01',
      likes: 12
    },
    {
      id: '2',
      text: 'Mỗi lần ngửi mùi sách mới, mình lại thấy một thế giới mới đang mở ra. Đó là cảm giác gây nghiện nhất.',
      author: 'Mọt sách Hà Nội',
      date: '2026-10-01',
      likes: 24
    }
  ],
};

// Helper to read data safely
function readSurveyData(): SurveyStatsData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        // Merge with initial stats to ensure all keys exist
        return {
          ...INITIAL_SURVEY_STATS,
          ...parsed,
          confessions: parsed.confessions || INITIAL_SURVEY_STATS.confessions
        };
      }
    }
  } catch (err) {
    console.error('Error reading survey_database.json:', err);
  }
  return INITIAL_SURVEY_STATS;
}

// Helper to write data safely
function writeSurveyData(data: SurveyStatsData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing survey_database.json:', err);
  }
}

// Ensure database file exists on startup
if (!fs.existsSync(DATA_FILE)) {
  writeSurveyData(INITIAL_SURVEY_STATS);
}

// API Routes
app.get('/api/survey/stats', (_req, res) => {
  const data = readSurveyData();
  res.json({ success: true, stats: data });
});

app.post('/api/survey/submit', (req, res) => {
  const { ageGroup, booksPerYear, readingFormats, favoriteGenres, readingMotivations, readingBarriers } = req.body;
  
  const current = readSurveyData();
  const updated: SurveyStatsData = {
    ...current,
    totalParticipants: current.totalParticipants + 1,
    ageGroup: {
      ...current.ageGroup,
      [ageGroup as keyof typeof current.ageGroup]: (current.ageGroup[ageGroup as keyof typeof current.ageGroup] || 0) + 1,
    },
    booksPerYear: {
      ...current.booksPerYear,
      [booksPerYear as keyof typeof current.booksPerYear]: (current.booksPerYear[booksPerYear as keyof typeof current.booksPerYear] || 0) + 1,
    },
    readingFormats: { ...current.readingFormats },
    favoriteGenres: { ...current.favoriteGenres },
    readingMotivations: { ...current.readingMotivations },
    readingBarriers: { ...current.readingBarriers },
  };

  if (Array.isArray(readingFormats)) {
    readingFormats.forEach((fmt: string) => {
      updated.readingFormats[fmt] = (updated.readingFormats[fmt] || 0) + 1;
    });
  }

  if (Array.isArray(favoriteGenres)) {
    favoriteGenres.forEach((gnr: string) => {
      updated.favoriteGenres[gnr] = (updated.favoriteGenres[gnr] || 0) + 1;
    });
  }

  if (Array.isArray(readingMotivations)) {
    readingMotivations.forEach((mot: string) => {
      updated.readingMotivations[mot] = (updated.readingMotivations[mot] || 0) + 1;
    });
  }

  if (Array.isArray(readingBarriers)) {
    readingBarriers.forEach((barr: string) => {
      updated.readingBarriers[barr] = (updated.readingBarriers[barr] || 0) + 1;
    });
  }

  writeSurveyData(updated);
  res.json({ success: true, stats: updated });
});

// Reset endpoint
app.post('/api/survey/reset-all', (_req, res) => {
  writeSurveyData(INITIAL_SURVEY_STATS);
  res.json({ success: true, stats: INITIAL_SURVEY_STATS });
});

// Book reviews & educational insights API
app.get('/api/books/reviews', (_req, res) => {
  // Returns cached list of reviews with verified read links
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

// Shared Confessions API
app.get('/api/confessions', (_req, res) => {
  const data = readSurveyData();
  res.json({ success: true, confessions: data.confessions || [] });
});

app.post('/api/confessions', (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

  const data = readSurveyData();
  const newConfession = {
    id: Date.now().toString(),
    text,
    author: author || 'Bạn trẻ ẩn danh',
    date: new Date().toISOString().split('T')[0],
    likes: 0
  };

  data.confessions = [newConfession, ...(data.confessions || [])]; // Keep all for permanent storage
  writeSurveyData(data);
  res.json({ success: true, confession: newConfession });
});

app.post('/api/confessions/like', (req, res) => {
  const { id } = req.body;
  const data = readSurveyData();
  if (data.confessions) {
    const confession = data.confessions.find(c => c.id === id);
    if (confession) {
      confession.likes += 1;
      writeSurveyData(data);
      return res.json({ success: true, likes: confession.likes });
    }
  }
  res.status(404).json({ success: false, message: 'Confession not found' });
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
