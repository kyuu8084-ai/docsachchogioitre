/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReadingHabitsPage from './pages/ReadingHabitsPage';
import GenresPage from './pages/GenresPage';
import BookLibraryPage from './pages/BookLibraryPage';
import SurveyPage from './pages/SurveyPage';
import AboutPage from './pages/AboutPage';
import DetectiveGamePage from './pages/DetectiveGamePage';
import NotFoundPage from './pages/NotFoundPage';
import { PageId } from './types';
import BackToTop from './components/BackToTop';

export default function App() {
  // Sync page state with window.location.hash for true multi-page navigation feel
  const getPageFromHash = (): PageId => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
    if (!hash || hash === '/') return 'home';
    if (hash === 'reading-habits') return 'reading-habits';
    if (hash === 'genres') return 'genres';
    if (hash === 'library') return 'library';
    if (hash === 'survey') return 'survey';
    if (hash === 'about') return 'about';
    if (hash === 'detective-game') return 'detective-game';
    if (hash === '404') return '404';
    return '404';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      setCurrentPage(newPage);
      // Reset immersive mode when changing pages
      setIsImmersiveMode(false);
      // Wait a tiny bit for the exit animation to start before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    if (page === currentPage) return;
    window.location.hash = page === 'home' ? '/' : `/${page}`;
  };

  // Update document title dynamically based on active page
  useEffect(() => {
    const titleMap: Record<PageId, string> = {
      home: 'Đọc & Trẻ – Giới trẻ Việt đang đọc gì? | Thói quen & Gu sách',
      'reading-habits': 'Thói quen đọc sách của giới trẻ – Đọc & Trẻ',
      genres: 'Các thể loại sách được giới trẻ quan tâm – Đọc & Trẻ',
      library: 'Thư viện sách – Tuyển tập tác phẩm giới trẻ yêu thích – Đọc & Trẻ',
      survey: 'Khảo sát thói quen đọc sách – Đọc & Trẻ',
      about: 'Về Đọc & Trẻ – Kết nối giới trẻ với sách',
      'detective-game': 'Trò chơi Thám Tử Thư Viện – Giải mã bí ẩn sách – Đọc & Trẻ',
      '404': '404 - Not Found',
    };
    document.title = titleMap[currentPage] || 'Đọc & Trẻ';
  }, [currentPage]);

  // If on 404, render the exact single-page full-viewport 404 composition without cards, navs, or extra UI
  if (currentPage === '404') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="404"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NotFoundPage onReturnHome={() => handleNavigate('home')} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8] text-[#3A3530] font-lora overflow-x-hidden">
      {/* Header (sticky across all pages) */}
      {!isImmersiveMode && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isHeroOverlay={currentPage === 'home' || currentPage === 'detective-game'}
        />
      )}

      {/* Main Content: Completely Isolated Standalone Pages with smooth transitions */}
      <main className="flex-1 w-full flex flex-col relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col w-full"
          >
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'reading-habits' && <ReadingHabitsPage onNavigate={handleNavigate} />}
            {currentPage === 'genres' && <GenresPage onNavigate={handleNavigate} />}
            {currentPage === 'library' && <BookLibraryPage onNavigate={handleNavigate} />}
            {currentPage === 'survey' && <SurveyPage onNavigate={handleNavigate} />}
            {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
            {currentPage === 'detective-game' && (
              <DetectiveGamePage 
                onNavigate={handleNavigate} 
                onImmersiveChange={setIsImmersiveMode} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (consistent across all pages) */}
      {!isImmersiveMode && <Footer onNavigate={handleNavigate} />}

      {/* Global Utilities */}
      <BackToTop />

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white/80 hover:bg-white backdrop-blur-md border border-[#D6CDBF] rounded-full text-[#3A3530] shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
        title={isFullscreen ? "Thu nhỏ" : "Phóng to toàn màn hình"}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </div>
  );
}

