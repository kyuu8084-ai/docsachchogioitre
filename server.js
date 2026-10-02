// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json());
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var DATA_FILE = path.join(__dirname, "survey_database.json");
var INITIAL_SURVEY_STATS = {
  totalParticipants: 0,
  ageGroup: {
    "under-18": 0,
    "18-22": 0,
    "23-30": 0,
    "above-30": 0
  },
  booksPerYear: {
    "under-2": 0,
    "2-5": 0,
    "6-12": 0,
    "above-12": 0
  },
  readingFormats: {
    "S\xE1ch gi\u1EA5y truy\u1EC1n th\u1ED1ng": 0,
    "M\xE1y \u0111\u1ECDc s\xE1ch chuy\xEAn d\u1EE5ng (Kindle, Kobo)": 0,
    "\u0110i\u1EC7n tho\u1EA1i / M\xE1y t\xEDnh b\u1EA3ng": 0,
    "S\xE1ch n\xF3i (Audiobook qua Voiz FM, Fonos...)": 0,
    "T\xF3m t\u1EAFt s\xE1ch qua video / podcast": 0
  },
  favoriteGenres: {
    "Self-help / Ph\xE1t tri\u1EC3n b\u1EA3n th\xE2n": 0,
    "Ch\u1EEFa l\xE0nh / T\xE2m l\xFD": 0,
    "Ti\u1EC3u thuy\u1EBFt (ng\xF4n t\xECnh, trinh th\xE1m, fantasy\u2026)": 0,
    "Truy\u1EC7n tranh / Manga / Light novel": 0,
    "Kinh t\u1EBF / Kh\u1EDFi nghi\u1EC7p / T\xE0i ch\xEDnh": 0,
    "L\u1ECBch s\u1EED / H\u1ED3i k\xFD / T\u1EF1 truy\u1EC7n": 0
  },
  readingMotivations: {
    "Ch\u1EEFa l\xE0nh, t\xECm s\u1EF1 c\xE2n b\u1EB1ng c\u1EA3m x\xFAc n\u1ED9i t\xE2m": 0,
    "H\u1ECDc k\u1EF9 n\u0103ng m\u1EDBi, n\xE2ng cao ki\u1EBFn th\u1EE9c ngh\u1EC1 nghi\u1EC7p": 0,
    "Gi\u1EA3i tr\xED, th\u01B0 gi\xE3n \u0111\u1EA7u \xF3c sau gi\u1EDD c\u0103ng th\u1EB3ng": 0,
    "Theo trend t\u1EEB TikTok, Instagram, b\u1EA1n b\xE8 gi\u1EDBi thi\u1EC7u": 0
  },
  readingBarriers: {
    "Kh\xF4ng c\xF3 th\u1EDDi gian do l\u1ECBch h\u1ECDc t\u1EADp, c\xF4ng vi\u1EC7c d\xE0y \u0111\u1EB7c": 0,
    "Nghi\u1EC7n m\u1EA1ng x\xE3 h\u1ED9i, game, video ng\u1EAFn l\u01B0\u1EDBt v\xF4 th\u1EE9c": 0,
    "Kh\xF4ng bi\u1EBFt ch\u1ECDn cu\u1ED1n s\xE1ch n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1EA3n th\xE2n": 0,
    "C\u1EA3m th\u1EA5y \u201Ckh\xF3 v\xE0o\u201D, d\u1EC5 bu\u1ED3n ng\u1EE7 sau v\xE0i trang \u0111\u1EA7u": 0
  },
  confessions: [
    {
      id: "1",
      text: "\u0110\u1ECDc s\xE1ch kh\xF4ng ph\u1EA3i \u0111\u1EC3 tr\u1EDF th\xE0nh gi\xE1o s\u01B0, m\xE0 \u0111\u1EC3 th\u1EA5y m\xECnh b\u1EDBt c\xF4 \u0111\u1ED9c gi\u1EEFa th\u1EBF gi\u1EDBi n\xE0y.",
      author: "B\u1EA1n nh\u1ECF \u1EA9n danh",
      date: "2026-10-01",
      likes: 12
    },
    {
      id: "2",
      text: "M\u1ED7i l\u1EA7n ng\u1EEDi m\xF9i s\xE1ch m\u1EDBi, m\xECnh l\u1EA1i th\u1EA5y m\u1ED9t th\u1EBF gi\u1EDBi m\u1EDBi \u0111ang m\u1EDF ra. \u0110\xF3 l\xE0 c\u1EA3m gi\xE1c g\xE2y nghi\u1EC7n nh\u1EA5t.",
      author: "M\u1ECDt s\xE1ch H\xE0 N\u1ED9i",
      date: "2026-10-01",
      likes: 24
    }
  ]
};
function readSurveyData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      if (content.trim()) {
        const parsed = JSON.parse(content);
        return {
          ...INITIAL_SURVEY_STATS,
          ...parsed,
          confessions: parsed.confessions || INITIAL_SURVEY_STATS.confessions
        };
      }
    }
  } catch (err) {
    console.error("Error reading survey_database.json:", err);
  }
  return INITIAL_SURVEY_STATS;
}
function writeSurveyData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing survey_database.json:", err);
  }
}
if (!fs.existsSync(DATA_FILE)) {
  writeSurveyData(INITIAL_SURVEY_STATS);
}
app.get("/api/survey/stats", (_req, res) => {
  const data = readSurveyData();
  res.json({ success: true, stats: data });
});
app.post("/api/survey/submit", (req, res) => {
  const { ageGroup, booksPerYear, readingFormats, favoriteGenres, readingMotivations, readingBarriers } = req.body;
  const current = readSurveyData();
  const updated = {
    ...current,
    totalParticipants: current.totalParticipants + 1,
    ageGroup: {
      ...current.ageGroup,
      [ageGroup]: (current.ageGroup[ageGroup] || 0) + 1
    },
    booksPerYear: {
      ...current.booksPerYear,
      [booksPerYear]: (current.booksPerYear[booksPerYear] || 0) + 1
    },
    readingFormats: { ...current.readingFormats },
    favoriteGenres: { ...current.favoriteGenres },
    readingMotivations: { ...current.readingMotivations },
    readingBarriers: { ...current.readingBarriers }
  };
  if (Array.isArray(readingFormats)) {
    readingFormats.forEach((fmt) => {
      updated.readingFormats[fmt] = (updated.readingFormats[fmt] || 0) + 1;
    });
  }
  if (Array.isArray(favoriteGenres)) {
    favoriteGenres.forEach((gnr) => {
      updated.favoriteGenres[gnr] = (updated.favoriteGenres[gnr] || 0) + 1;
    });
  }
  if (Array.isArray(readingMotivations)) {
    readingMotivations.forEach((mot) => {
      updated.readingMotivations[mot] = (updated.readingMotivations[mot] || 0) + 1;
    });
  }
  if (Array.isArray(readingBarriers)) {
    readingBarriers.forEach((barr) => {
      updated.readingBarriers[barr] = (updated.readingBarriers[barr] || 0) + 1;
    });
  }
  writeSurveyData(updated);
  res.json({ success: true, stats: updated });
});
app.post("/api/survey/reset-all", (_req, res) => {
  writeSurveyData(INITIAL_SURVEY_STATS);
  res.json({ success: true, stats: INITIAL_SURVEY_STATS });
});
app.get("/api/books/reviews", (_req, res) => {
  res.json({
    success: true,
    message: "Book reviews and educational analysis loaded successfully",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/gemini/suggest-books", async (req, res) => {
  const { mood } = req.body;
  if (!mood) {
    return res.status(400).json({ success: false, message: "Mood is required" });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `G\u1EE3i \xFD 3 cu\u1ED1n s\xE1ch ph\xF9 h\u1EE3p cho ng\u01B0\u1EDDi \u0111ang c\xF3 t\xE2m tr\u1EA1ng: "${mood}". 
      \u0110\u01B0a ra m\u1ED9t l\u1EDDi nh\u1EAFn nh\u1EE7 ng\u1EAFn g\u1ECDn, \u1EA5m \xE1p t\u1EEB AI.
      Tr\u1EA3 v\u1EC1 k\u1EBFt qu\u1EA3 theo \u0111\u1ECBnh d\u1EA1ng JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiMessage: {
              type: Type.STRING,
              description: "L\u1EDDi nh\u1EAFn nh\u1EE7 ng\u1EAFn g\u1ECDn t\u1EEB AI cho ng\u01B0\u1EDDi d\xF9ng."
            },
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "T\u1EA1i sao cu\u1ED1n s\xE1ch n\xE0y ph\xF9 h\u1EE3p v\u1EDBi t\xE2m tr\u1EA1ng." }
                },
                required: ["title", "author", "reason"]
              }
            }
          },
          required: ["aiMessage", "books"]
        }
      }
    });
    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ success: false, message: "Failed to generate suggestions" });
  }
});
app.get("/api/confessions", (_req, res) => {
  const data = readSurveyData();
  res.json({ success: true, confessions: data.confessions || [] });
});
app.post("/api/confessions", (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "Text is required" });
  const data = readSurveyData();
  const newConfession = {
    id: Date.now().toString(),
    text,
    author: author || "B\u1EA1n tr\u1EBB \u1EA9n danh",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    likes: 0
  };
  data.confessions = [newConfession, ...data.confessions || []];
  writeSurveyData(data);
  res.json({ success: true, confession: newConfession });
});
app.post("/api/confessions/like", (req, res) => {
  const { id } = req.body;
  const data = readSurveyData();
  if (data.confessions) {
    const confession = data.confessions.find((c) => c.id === id);
    if (confession) {
      confession.likes += 1;
      writeSurveyData(data);
      return res.json({ success: true, likes: confession.likes });
    }
  }
  res.status(404).json({ success: false, message: "Confession not found" });
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
startServer();
export {
  INITIAL_SURVEY_STATS
};
