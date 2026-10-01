import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Heart, Quote, X, Plus, ArrowRight } from 'lucide-react';
import VintageSeparator from './VintageSeparator';

interface Confession {
  id: string;
  text: string;
  author: string;
  date: string;
  likes: number;
}

const fullTitle = 'Góc Tâm Sự Bạn Đọc';

export default function ConfessionCorner() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState('');

  useEffect(() => {
    fetch('/api/confessions')
      .then(res => res.json())
      .then(data => {
        if (data.success) setConfessions(data.confessions);
      })
      .catch(err => console.error('Fetch confessions error:', err));
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedTitle(fullTitle.slice(0, i + 1));
      i++;
      if (i >= fullTitle.length) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText, author: newAuthor.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setConfessions([data.confession, ...confessions]);
        setNewText('');
        setNewAuthor('');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Post confession error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await fetch('/api/confessions/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setConfessions(confessions.map(c => 
          c.id === id ? { ...c, likes: data.likes } : c
        ));
      }
    } catch (err) {
      console.error('Like confession error:', err);
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 vintage-paper-alt border-y border-[#D6CDBF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B56D4F] font-semibold block mb-2 font-lora">
            Kết nối tâm hồn
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#3A3530] mb-3 min-h-[1.2em]">
            {displayedTitle}
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1 h-8 bg-[#B56D4F] ml-1 align-middle"
            />
          </h2>
          <VintageSeparator color="#B56D4F" width="w-24" />
          <p className="font-lora text-sm sm:text-base text-[#6B635A] max-w-2xl mx-auto mt-4">
            Nơi chia sẻ những suy nghĩ ngắn, những kỷ niệm hay thói quen đọc sách nhỏ bé của riêng bạn.
          </p>
        </div>

        {/* Confession Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <AnimatePresence mode="popLayout">
            {confessions.slice(0, 6).map((confession) => (
              <motion.div
                key={confession.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.03, 
                  borderColor: '#B56D4F',
                  boxShadow: '0 20px 25px -5px rgba(181, 109, 79, 0.1), 0 10px 10px -5px rgba(181, 109, 79, 0.04)'
                }}
                className="vintage-card-bg p-8 rounded-3xl border border-[#D6CDBF] shadow-sm flex flex-col justify-between group transition-colors relative"
              >
                <div className="absolute top-4 right-6 text-[#B56D4F]/10 group-hover:text-[#B56D4F]/20 transition-colors">
                  <Quote size={40} />
                </div>
                
                <div>
                  <p className="font-lora text-base sm:text-lg italic text-[#3A3530] leading-relaxed mb-6">
                    "{confession.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#D6CDBF]/50">
                  <div className="flex flex-col">
                    <span className="font-playfair font-bold text-sm text-[#3A3530]">{confession.author}</span>
                    <span className="text-[10px] text-[#6B635A] font-mono">{confession.date}</span>
                  </div>
                  <button 
                    onClick={() => handleLike(confession.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#6B635A] hover:text-[#B56D4F] transition-colors cursor-pointer"
                  >
                    <Heart size={14} className={confession.likes > 0 ? "fill-[#B56D4F] text-[#B56D4F]" : ""} />
                    <span>{confession.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add New Trigger Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-[#D6CDBF] hover:border-[#B56D4F] hover:bg-[#FAF7F0] transition-all group cursor-pointer min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center mb-4 group-hover:bg-[#B56D4F] group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <span className="font-playfair font-bold text-lg text-[#3A3530]">Chia sẻ tâm sự của bạn</span>
            <p className="text-xs text-[#6B635A] font-lora mt-2">Đóng góp một mẩu chuyện nhỏ vào thư viện tâm hồn.</p>
          </motion.button>
        </div>

        {/* View Archive Button */}
        {confessions.length > 6 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="px-6 py-2.5 bg-white border border-[#D6CDBF] text-[#3A3530] text-xs font-bold rounded-xl hover:bg-[#B56D4F] hover:text-white transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <span>Kho chứa toàn bộ tâm sự ({confessions.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Modal Overlay: New Post */}
        <AnimatePresence>
          {isArchiveOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsArchiveOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative w-full max-w-4xl max-h-[85vh] vintage-card-bg bg-[#FAF7F0] rounded-[2rem] border-2 border-[#D6CDBF] shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-[#D6CDBF] flex items-center justify-between sticky top-0 bg-[#FAF7F0] z-10">
                  <div>
                    <h3 className="font-playfair text-2xl font-bold text-[#3A3530]">Kho Lưu Trữ Tâm Sự</h3>
                    <p className="text-xs text-[#6B635A] font-lora">Nơi lưu giữ vĩnh viễn những kỷ niệm của cộng đồng Đọc & Trẻ.</p>
                  </div>
                  <button
                    onClick={() => setIsArchiveOpen(false)}
                    className="p-2 rounded-full hover:bg-black/5 text-[#6B635A] cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confessions.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl bg-white border border-[#D6CDBF] shadow-xs hover:border-[#B56D4F] transition-colors relative group">
                       <Quote size={20} className="absolute top-4 right-4 text-[#B56D4F]/5" />
                       <p className="font-lora text-sm italic text-[#3A3530] mb-4">"{c.text}"</p>
                       <div className="flex items-center justify-between text-[10px] text-[#6B635A] pt-3 border-t border-[#D6CDBF]/30">
                          <span className="font-bold">{c.author} · {c.date}</span>
                          <span className="flex items-center gap-1"><Heart size={10} className="fill-[#B56D4F] text-[#B56D4F]" /> {c.likes}</span>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-[#EBE5D9]/30 text-center border-t border-[#D6CDBF]">
                   <button
                    onClick={() => { setIsArchiveOpen(false); setIsModalOpen(true); }}
                    className="px-6 py-2.5 bg-[#B56D4F] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#9A5A3F] transition-all cursor-pointer"
                   >
                     Gửi thêm tâm sự mới
                   </button>
                </div>
              </motion.div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg vintage-card-bg bg-[#FAF7F0] rounded-[2.5rem] border-2 border-[#B56D4F] shadow-2xl overflow-hidden p-8 sm:p-10"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 text-[#6B635A] hover:text-[#3A3530] p-2 cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#B56D4F]/10 text-[#B56D4F] flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-[#3A3530]">Lời nhắn gửi</h3>
                  <p className="font-lora text-sm text-[#6B635A] mt-2">Chia sẻ ngắn gọn thói quen hay cảm xúc về sách của bạn.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#B56D4F] mb-2 font-mono">Tâm sự của bạn</label>
                    <textarea
                      required
                      maxLength={200}
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder="Viết tối đa 200 ký tự..."
                      className="w-full min-h-[120px] p-4 rounded-2xl border border-[#D6CDBF] bg-white focus:ring-2 focus:ring-[#B56D4F]/40 focus:border-[#B56D4F] outline-none font-lora text-sm transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#B56D4F] mb-2 font-mono">Tên hoặc Bút danh</label>
                    <input
                      type="text"
                      maxLength={30}
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Ẩn danh, Mọt sách, ..."
                      className="w-full p-4 rounded-xl border border-[#D6CDBF] bg-white focus:ring-2 focus:ring-[#B56D4F]/40 focus:border-[#B56D4F] outline-none font-lora text-sm transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !newText.trim()}
                    className="w-full py-4 bg-[#B56D4F] text-white rounded-xl font-bold text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-lg hover:bg-[#9A5A3F] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Gửi tâm sự</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
