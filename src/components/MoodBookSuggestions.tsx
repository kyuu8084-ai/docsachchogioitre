import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coffee, Rocket, Heart, Brain, Loader2, BookOpen, Sun, Moon, Book } from 'lucide-react';

const MOODS = [
  { id: 'relax', label: 'Cần thư giãn', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'inspire', label: 'Muốn truyền cảm hứng', icon: Rocket, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'healing', label: 'Muốn được chữa lành', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: 'knowledge', label: 'Khao khát kiến thức', icon: Brain, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

type Theme = 'light' | 'sepia' | 'dark';

const THEMES: Record<Theme, { bg: string; card: string; text: string; sub: string; border: string }> = {
  light: { bg: 'bg-[#FAF7F0]', card: 'bg-white', text: 'text-[#3A3530]', sub: 'text-[#6B635A]', border: 'border-[#D6CDBF]' },
  sepia: { bg: 'bg-[#F4ECD8]', card: 'bg-[#EADDC2]', text: 'text-[#5F4B32]', sub: 'text-[#8C6D46]', border: 'border-[#D1BFA5]' },
  dark: { bg: 'bg-[#121212]', card: 'bg-[#1E1E1E]', text: 'text-[#E0E0E0]', sub: 'text-[#A0A0A0]', border: 'border-[#333333]' }
};

export default function MoodBookSuggestions() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [suggestion, setSuggestion] = useState<{
    aiMessage: string;
    books: { title: string; author: string; reason: string }[];
  } | null>(null);

  const activeTheme = THEMES[theme];

  const fetchSuggestions = async (moodLabel: string) => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const res = await fetch('/api/gemini/suggest-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodLabel }),
      });
      const data = await res.json();
      if (data.success) {
        setSuggestion(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#D6CDBF]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            <span>Tính năng AI mới</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#3A3530] mb-4">
            Gợi ý sách theo tâm trạng
          </h2>
          <p className="font-lora text-[#6B635A]">
            Hôm nay bạn cảm thấy thế nào? Hãy để AI đồng hành cùng bạn tìm ra cuốn sách "đúng người, đúng thời điểm".
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => {
                  setSelectedMood(mood.id);
                  fetchSuggestions(mood.label);
                }}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMood === mood.id
                    ? `border-[#B56D4F] ${mood.bg} shadow-md scale-105`
                    : 'border-transparent bg-[#FAF7F0] hover:bg-[#F5F1E8] hover:border-[#D6CDBF]'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${mood.bg} ${mood.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-bold text-[#3A3530] font-sans">{mood.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <Loader2 size={40} className="text-[#B56D4F] animate-spin mb-4" />
              <p className="font-lora italic text-[#6B635A]">Đang kết nối với tri thức nhân loại...</p>
            </motion.div>
          )}

          {suggestion && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${activeTheme.bg} rounded-3xl p-6 sm:p-8 border ${activeTheme.border} shadow-sm transition-colors duration-500`}
            >
              {/* Theme Switcher */}
              <div className="flex justify-end gap-2 mb-6">
                {[
                  { id: 'light', icon: Sun, label: 'Sáng' },
                  { id: 'sepia', icon: Book, label: 'Giấy' },
                  { id: 'dark', icon: Moon, label: 'Tối' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as Theme)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      theme === t.id
                        ? 'bg-[#B56D4F] text-white border-[#B56D4F] shadow-sm'
                        : `${activeTheme.card} ${activeTheme.text} ${activeTheme.border} hover:opacity-80`
                    }`}
                  >
                    <t.icon size={14} />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#B56D4F] text-white flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className={`${activeTheme.card} p-4 rounded-2xl rounded-tl-none border ${activeTheme.border} shadow-xs transition-colors duration-500`}>
                  <p className={`text-sm sm:text-base ${activeTheme.text} font-lora leading-relaxed italic`}>
                    "{suggestion.aiMessage}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {suggestion.books.map((book, i) => (
                  <div key={i} className={`${activeTheme.card} p-5 rounded-2xl border ${activeTheme.border} hover:shadow-md transition-all duration-500 group`}>
                    <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-[#333333]' : 'bg-[#FAF7F0]'} text-[#B56D4F] flex items-center justify-center mb-3 group-hover:bg-[#B56D4F] group-hover:text-white transition-colors`}>
                      <BookOpen size={16} />
                    </div>
                    <h4 className={`font-playfair font-bold ${activeTheme.text} mb-1 leading-tight`}>{book.title}</h4>
                    <p className="text-xs font-semibold text-[#B56D4F] mb-3">{book.author}</p>
                    <p className={`text-[11px] ${activeTheme.sub} font-lora leading-relaxed`}>
                      {book.reason}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
