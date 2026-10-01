import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Plus, Trash2, Trophy, Sparkles } from 'lucide-react';
import VintageSeparator from './VintageSeparator';

interface JournalEntry {
  id: string;
  title: string;
  author: string;
  completed: boolean;
  dateAdded: string;
}

const STORAGE_KEY = 'doc_va_tre_reading_journal';

export default function ReadingJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reading journal', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Chưa rõ tác giả',
      completed: false,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setEntries([newEntry, ...entries]);
    setNewTitle('');
    setNewAuthor('');
    setIsAdding(false);
  };

  const toggleComplete = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, completed: !entry.completed } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const completedCount = entries.filter(e => e.completed).length;
  const totalCount = entries.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="w-full py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-8 sm:p-12 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#B56D4F]/5 rounded-br-full pointer-events-none" />
        
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/20 mb-4 uppercase tracking-widest">
            <BookOpen size={14} />
            <span>Tiến độ cá nhân</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#3A3530] mb-3">
            Nhật Ký Đọc Sách Tháng Này
          </h2>
          <VintageSeparator color="#B56D4F" width="w-24" />
          <p className="font-lora text-sm sm:text-base text-[#6B635A] max-w-2xl mx-auto mt-4">
            Ghi lại những hành trình tri thức bạn đã đi qua. Dữ liệu được lưu an toàn trên trình duyệt của bạn.
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 relative z-10">
          <div className="bg-[#EBE5D9] p-6 rounded-2xl border border-[#D6CDBF] text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B635A] mb-1">Tổng cộng</span>
            <div className="text-3xl font-black text-[#3A3530] font-mono">{totalCount}</div>
            <span className="text-xs font-lora text-[#6B635A]">cuốn sách</span>
          </div>
          <div className="bg-[#EBE5D9] p-6 rounded-2xl border border-[#D6CDBF] text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B635A] mb-1">Hoàn thành</span>
            <div className="text-3xl font-black text-[#B56D4F] font-mono">{completedCount}</div>
            <span className="text-xs font-lora text-[#6B635A]">đã đọc xong</span>
          </div>
          <div className="bg-[#EBE5D9] p-6 rounded-2xl border border-[#D6CDBF] text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B635A] mb-1">Tỷ lệ</span>
            <div className="text-3xl font-black text-[#4A7C59] font-mono">{progressPercent}%</div>
            <div className="w-full bg-white/50 h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-[#4A7C59]"
              />
            </div>
          </div>
        </div>

        {/* Checklist Container */}
        <div className="space-y-4 mb-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed border-[#D6CDBF] rounded-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBE5D9] text-[#6B635A] flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} />
                </div>
                <p className="font-lora text-[#6B635A]">Chưa có cuốn sách nào trong danh sách tháng này.</p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="mt-4 text-[#B56D4F] font-bold text-xs uppercase tracking-widest hover:underline cursor-pointer"
                >
                  Thêm cuốn đầu tiên ngay
                </button>
              </motion.div>
            ) : (
              entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                    entry.completed 
                      ? 'bg-[#EBE5D9]/50 border-transparent opacity-75' 
                      : 'bg-white border-[#D6CDBF] shadow-sm hover:border-[#B56D4F]/30'
                  }`}
                >
                  <button
                    onClick={() => toggleComplete(entry.id)}
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      entry.completed ? 'bg-[#4A7C59] text-white' : 'border-2 border-[#D6CDBF] text-transparent hover:border-[#B56D4F]'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-playfair font-bold text-base sm:text-lg truncate ${entry.completed ? 'line-through text-[#6B635A]' : 'text-[#3A3530]'}`}>
                      {entry.title}
                    </h4>
                    <p className="font-lora text-xs text-[#6B635A] truncate">
                      Tác giả: {entry.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {entry.completed && (
                      <Trophy size={16} className="text-[#B56D4F] animate-bounce" />
                    )}
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-[#6B635A] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Add Section */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-[#D6CDBF] rounded-2xl text-[#6B635A] font-lora hover:border-[#B56D4F] hover:text-[#B56D4F] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span>Thêm cuốn sách mới đã hoàn thành</span>
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddEntry}
            className="bg-white p-6 rounded-2xl border-2 border-[#B56D4F] shadow-lg relative z-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] mb-1 font-mono">Tên sách</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Rừng Na Uy"
                  className="w-full p-3 rounded-xl border border-[#D6CDBF] focus:ring-2 focus:ring-[#B56D4F]/40 outline-none font-lora text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] mb-1 font-mono">Tác giả</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ví dụ: Haruki Murakami"
                  className="w-full p-3 rounded-xl border border-[#D6CDBF] focus:ring-2 focus:ring-[#B56D4F]/40 outline-none font-lora text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#B56D4F] text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-md hover:bg-[#9A5A3F] transition-all active:scale-95"
              >
                Lưu vào nhật ký
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 border border-[#D6CDBF] text-[#6B635A] rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#FAF7F0] transition-all"
              >
                Hủy
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
