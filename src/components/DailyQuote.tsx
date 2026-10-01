import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, MessageSquareQuote, RefreshCw, BookOpen } from 'lucide-react';
import { STATIC_BOOKS } from '../data/booksData';

export default function DailyQuote() {
  const [quoteData, setQuoteData] = useState<{
    text: string;
    author: string;
    bookTitle: string;
  } | null>(null);

  useEffect(() => {
    // Get quote based on current day of the year to make it truly "Daily"
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Filter books that actually have a quote in their review
    const booksWithQuotes = STATIC_BOOKS.filter(b => b.review && b.review.quote);
    
    if (booksWithQuotes.length > 0) {
      const index = dayOfYear % booksWithQuotes.length;
      const book = booksWithQuotes[index];
      setQuoteData({
        text: book.review!.quote!.replace(/[“”""]/g, ''),
        author: book.author,
        bookTitle: book.title
      });
    }
  }, []);

  if (!quoteData) return null;

  return (
    <div className="w-full py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="vintage-card-bg bg-[#FAF7F0] border-2 border-[#D6CDBF] rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-center">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#B56D4F]/5 rounded-br-full -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#B56D4F]/5 rounded-tl-full translate-x-12 translate-y-12" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#B56D4F]/10 text-[#B56D4F] flex items-center justify-center mb-6">
              <MessageSquareQuote size={24} />
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B56D4F] mb-6 block font-lora">
              Trích dẫn hay mỗi ngày
            </span>

            <Quote className="text-[#D6CDBF] mb-4 opacity-40" size={40} />
            
            <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-[#3A3530] leading-relaxed italic mb-8 max-w-3xl">
              “{quoteData.text}”
            </h3>

            <div className="w-16 h-px bg-[#D6CDBF] mb-6" />

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-[#3A3530] font-semibold text-sm sm:text-base">
                <span className="font-playfair">{quoteData.author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B635A] text-xs sm:text-sm italic font-lora">
                <BookOpen size={14} className="text-[#B56D4F]" />
                <span>Trích từ: {quoteData.bookTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
