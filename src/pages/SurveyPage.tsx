import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  LogIn,
  User as UserIcon,
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  Trash2, 
  Send, 
  Check, 
  Bookmark, 
  Heart, 
  Sparkles, 
  BookOpen, 
  AlertCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Users,
  BarChart3,
  ArrowRight,
  Award,
  PartyPopper
} from 'lucide-react';
import { doc, onSnapshot, setDoc, runTransaction, getDoc, deleteDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { subscribeAuth, getStoredAuthUser, AppAuthUser } from '../lib/appAuth';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
import VintageSeparator from '../components/VintageSeparator';
import SurveyAnalysisCharts from '../components/SurveyAnalysisCharts';
import AuthModal from '../components/AuthModal';
import { INITIAL_SURVEY_STATS, SurveyStatsData } from '../data/surveyStatsData';
import { SurveyAnswer, PageId } from '../types';

interface SurveyPageProps {
  onNavigate: (page: PageId) => void;
}

const STORAGE_KEY = 'doc_va_tre_survey_data_v1';
const STATS_STORAGE_KEY = 'doc_va_tre_survey_stats_v1';

export default function SurveyPage({ onNavigate }: SurveyPageProps) {
  const [submittedData, setSubmittedData] = useState<SurveyAnswer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Survey aggregated statistics
  const [surveyStats, setSurveyStats] = useState<SurveyStatsData>(INITIAL_SURVEY_STATS);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  // Sync with Firebase Firestore with real-time updates
  useEffect(() => {
    const docRef = doc(db, 'stats', 'global');
    
    // Use onSnapshot for real-time updates and more reliable initial fetch
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSurveyStats(docSnap.data() as SurveyStatsData);
      } else {
        // Initialize if not exists - only do this if we are certain it's missing
        setDoc(docRef, INITIAL_SURVEY_STATS).catch(err => {
          console.error("Failed to initialize stats:", err);
        });
      }
      setIsLoadingStats(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'stats/global');
      setIsLoadingStats(false);
    });
    
    return () => unsubscribe();
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Form states initialized to null or empty arrays (no auto pre-selected defaults)
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [booksPerYear, setBooksPerYear] = useState<string | null>(null);
  const [readingFormats, setReadingFormats] = useState<string[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [readingMotivations, setReadingMotivations] = useState<string[]>([]);
  const [readingBarriers, setReadingBarriers] = useState<string[]>([]);
  const [buyingHabits, setBuyingHabits] = useState<string[]>([]);
  const [readingEnvironments, setReadingEnvironments] = useState<string[]>([]);
  const [wantsNewsletter, setWantsNewsletter] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [isFirebaseOffline, setIsFirebaseOffline] = useState<boolean>(false);
  const [isAuthDisabled, setIsAuthDisabled] = useState<boolean>(false);
  const [isSyncingWithCloud, setIsSyncingWithCloud] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleConnectionFail = () => setIsFirebaseOffline(true);
    const handleAuthFail = () => setIsAuthDisabled(true);
    
    window.addEventListener('firebase-connection-failed', handleConnectionFail);
    window.addEventListener('firebase-auth-disabled', handleAuthFail);
    
    return () => {
      window.removeEventListener('firebase-connection-failed', handleConnectionFail);
      window.removeEventListener('firebase-auth-disabled', handleAuthFail);
    };
  }, []);

  // Check if current user is authenticated with a real account (must be logged in, not anonymous)
  const isUserLoggedIn = Boolean(user && !user.isAnonymous);

  // Sync with Cloud: Real User Auth + Firestore personal response
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = subscribeAuth(async (currentUser) => {
      setUser(currentUser as any);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser && !currentUser.isAnonymous) {
        setIsSyncingWithCloud(true);
        
        // Listen to personal profile (for avatar and name)
        unsubscribeProfile = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCustomAvatar(data.avatarBase64 || null);
            setCustomName(data.displayName || null);
          } else {
            setCustomAvatar(null);
            setCustomName(null);
          }
        });

        try {
          const userDocRef = doc(db, 'user_responses', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const cloudData = userDoc.data() as SurveyAnswer;
            setSubmittedData(cloudData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          } else {
            // User is logged in but hasn't submitted yet
            setSubmittedData(null);
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (err) {
          console.error("Failed to sync personal survey from cloud:", err);
        } finally {
          setIsSyncingWithCloud(false);
        }
      } else {
        // Not logged in or anonymous: cannot have a valid survey submission
        setCustomAvatar(null);
        setCustomName(null);
        setSubmittedData(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // Dynamic interaction check for each question
  const hasInteractedAge = ageGroup !== null && ageGroup !== '';
  const hasInteractedBooks = booksPerYear !== null && booksPerYear !== '';
  const hasInteractedFormats = readingFormats.length > 0;
  const hasInteractedGenres = favoriteGenres.length > 0;
  const hasInteractedMotivations = readingMotivations.length > 0;
  const hasInteractedBarriers = readingBarriers.length > 0;
  const hasInteractedBuying = buyingHabits.length > 0;
  const hasInteractedEnvironments = readingEnvironments.length > 0;
  const hasInteractedNewsletter = wantsNewsletter !== null && (wantsNewsletter === false || email.trim().length > 0);

  const completedQuestionsCount = [
    hasInteractedAge,
    hasInteractedBooks,
    hasInteractedFormats,
    hasInteractedGenres,
    hasInteractedMotivations,
    hasInteractedBarriers,
    hasInteractedBuying,
    hasInteractedEnvironments,
    hasInteractedNewsletter,
  ].filter(Boolean).length;

  const totalQuestions = 9;
  const surveyProgressPct = Math.round((completedQuestionsCount / totalQuestions) * 100);
  const isFormValid = completedQuestionsCount === totalQuestions;

  const handleFormatToggle = (format: string) => {
    if (readingFormats.includes(format)) {
      setReadingFormats(readingFormats.filter((f) => f !== format));
    } else {
      setReadingFormats([...readingFormats, format]);
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      if (favoriteGenres.length >= 3) {
        setErrorMessage('Bạn chỉ có thể chọn tối đa 3 thể loại yêu thích nhất!');
        setTimeout(() => setErrorMessage(''), 3500);
        return;
      }
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleMotivationToggle = (item: string) => {
    if (readingMotivations.includes(item)) {
      setReadingMotivations(readingMotivations.filter((m) => m !== item));
    } else {
      setReadingMotivations([...readingMotivations, item]);
    }
  };

  const handleBarrierToggle = (item: string) => {
    if (readingBarriers.includes(item)) {
      setReadingBarriers(readingBarriers.filter((b) => b !== item));
    } else {
      setReadingBarriers([...readingBarriers, item]);
    }
  };

  const handleBuyingToggle = (item: string) => {
    if (buyingHabits.includes(item)) {
      setBuyingHabits(buyingHabits.filter((h) => h !== item));
    } else {
      setBuyingHabits([...buyingHabits, item]);
    }
  };

  const handleEnvironmentToggle = (item: string) => {
    if (readingEnvironments.includes(item)) {
      setReadingEnvironments(readingEnvironments.filter((e) => e !== item));
    } else {
      setReadingEnvironments([...readingEnvironments, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) {
      if (completedQuestionsCount < totalQuestions) {
        setErrorMessage(`Vui lòng hoàn thành tất cả các câu hỏi (${completedQuestionsCount}/${totalQuestions} câu đã làm) trước khi gửi kết quả.`);
      }
      return;
    }

    if (!ageGroup || !booksPerYear) {
      setErrorMessage('Vui lòng chọn đầy đủ độ tuổi và số lượng sách đọc mỗi năm!');
      return;
    }
    if (readingFormats.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 hình thức đọc sách!');
      return;
    }
    if (favoriteGenres.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 thể loại sách yêu thích!');
      return;
    }
    if (readingMotivations.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 động lực đọc sách!');
      return;
    }
    if (readingBarriers.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 rào cản đọc sách!');
      return;
    }
    if (buyingHabits.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 hình thức sở hữu sách!');
      return;
    }
    if (readingEnvironments.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 không gian đọc sách lý tưởng!');
      return;
    }
    if (wantsNewsletter === null) {
      setErrorMessage('Vui lòng chọn xem bạn có muốn nhận thư gợi ý sách hay không!');
      return;
    }
    if (wantsNewsletter && !email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn hoặc chọn "Không, cảm ơn".');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const payload: SurveyAnswer = {
      ageGroup,
      booksPerYear,
      readingFormats,
      favoriteGenres,
      readingMotivations,
      readingBarriers,
      buyingHabits,
      readingEnvironments,
      wantsNewsletter,
      submittedAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (wantsNewsletter && email.trim()) {
      payload.email = email.trim();
    }

    try {
      // 1. Validate that the user is logged in with a real account (not anonymous)
      const currentFirebaseUser = auth.currentUser || user || getStoredAuthUser();
      if (!currentFirebaseUser || currentFirebaseUser.isAnonymous) {
        setIsAuthModalOpen(true);
        setErrorMessage('Bạn phải đăng nhập tài khoản trước khi gửi khảo sát!');
        setIsSubmitting(false);
        return;
      }

      // 2. Save personal response to Firestore
      const userDocRef = doc(db, 'user_responses', currentFirebaseUser.uid);
      await setDoc(userDocRef, payload);
      console.log("✅ Saved response to user_responses/" + currentFirebaseUser.uid);

      // 3. Sync with Firestore Global Stats using Transaction
      try {
        const docRef = doc(db, 'stats', 'global');
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(docRef);
          const current: SurveyStatsData = sfDoc.exists()
            ? (sfDoc.data() as SurveyStatsData)
            : INITIAL_SURVEY_STATS;

          const updated: SurveyStatsData = {
            ...current,
            totalParticipants: (current.totalParticipants || 0) + 1,
            ageGroup: {
              ...(current.ageGroup || {}),
              [ageGroup]: ((current.ageGroup && current.ageGroup[ageGroup as keyof typeof current.ageGroup]) || 0) + 1,
            },
            booksPerYear: {
              ...(current.booksPerYear || {}),
              [booksPerYear]: ((current.booksPerYear && current.booksPerYear[booksPerYear as keyof typeof current.booksPerYear]) || 0) + 1,
            },
            readingFormats: { ...(current.readingFormats || {}) },
            favoriteGenres: { ...(current.favoriteGenres || {}) },
            readingMotivations: { ...(current.readingMotivations || {}) },
            readingBarriers: { ...(current.readingBarriers || {}) },
            buyingHabits: { ...(current.buyingHabits || {}) },
            readingEnvironments: { ...(current.readingEnvironments || {}) },
          };

          readingFormats.forEach((fmt) => {
            updated.readingFormats[fmt] = (updated.readingFormats[fmt] || 0) + 1;
          });

          favoriteGenres.forEach((gnr) => {
            updated.favoriteGenres[gnr] = (updated.favoriteGenres[gnr] || 0) + 1;
          });

          readingMotivations.forEach((mot) => {
            updated.readingMotivations[mot] = (updated.readingMotivations[mot] || 0) + 1;
          });

          readingBarriers.forEach((barr) => {
            updated.readingBarriers[barr] = (updated.readingBarriers[barr] || 0) + 1;
          });

          buyingHabits.forEach((hab) => {
            updated.buyingHabits[hab] = (updated.buyingHabits[hab] || 0) + 1;
          });

          readingEnvironments.forEach((env) => {
            updated.readingEnvironments[env] = (updated.readingEnvironments[env] || 0) + 1;
          });

          transaction.set(docRef, updated);
          setSurveyStats(updated);
        });
        console.log("✅ Aggregated stats updated on Firebase stats/global");
      } catch (statsErr) {
        console.error("Firestore stats transaction error:", statsErr);
        handleFirestoreError(statsErr, OperationType.WRITE, 'stats/global');
      }

      // 4. Save to local storage for instant access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSubmittedData(payload);

      // 5. Send to Formspree if user requested newsletter
      if (wantsNewsletter && email.trim()) {
        fetch('https://formspree.io/f/xvkgynoj', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            form_subject: 'Đăng ký nhận thư gợi ý sách - Đọc & Trẻ',
            survey_data: {
              ageGroup,
              booksPerYear,
              readingFormats,
              favoriteGenres,
              readingMotivations,
              readingBarriers
            }
          })
        }).catch(err => console.error('Formspree error:', err));
      }

      // 6. Confetti & Celebratory Modal
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#B56D4F', '#6B7A6E', '#EBE5D9', '#FAF7F0', '#D4A373'],
      });

      setShowCelebrationModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving survey:', err);
      setErrorMessage('Có lỗi xảy ra khi lưu dữ liệu lên hệ thống. Xin vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (submittedData) {
      // Re-populate form fields from submitted data for editing
      setAgeGroup(submittedData.ageGroup || null);
      setBooksPerYear(submittedData.booksPerYear || null);
      setReadingFormats(submittedData.readingFormats || []);
      setFavoriteGenres(submittedData.favoriteGenres || []);
      setReadingMotivations(submittedData.readingMotivations || []);
      setReadingBarriers(submittedData.readingBarriers || []);
      setBuyingHabits(submittedData.buyingHabits || []);
      setReadingEnvironments(submittedData.readingEnvironments || []);
      setWantsNewsletter(submittedData.wantsNewsletter ?? null);
      setEmail(submittedData.email || '');
    }
    setSubmittedData(null);
  };

  const handleDeleteData = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa phiếu khảo sát của bạn trên hệ thống để làm lại từ đầu? Số liệu đóng góp của bạn sẽ được hoàn trả sạch sẽ.')) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    
    // Cloud Persistence: Remove personal response from Firestore & decrement stats
    const activeUser = auth.currentUser || user || getStoredAuthUser();
    if (activeUser && !activeUser.isAnonymous) {
      try {
        const uid = activeUser.uid;
        const userDocRef = doc(db, 'user_responses', uid);
        await deleteDoc(userDocRef);

        if (submittedData) {
          const statsDocRef = doc(db, 'stats', 'global');
          await runTransaction(db, async (t) => {
            const snap = await t.get(statsDocRef);
            if (!snap.exists()) return;
            const cur = snap.data() as SurveyStatsData;
            const updated: SurveyStatsData = {
              ...cur,
              totalParticipants: Math.max(0, (cur.totalParticipants || 1) - 1),
              ageGroup: { ...(cur.ageGroup || {}) },
              booksPerYear: { ...(cur.booksPerYear || {}) },
              readingFormats: { ...(cur.readingFormats || {}) },
              favoriteGenres: { ...(cur.favoriteGenres || {}) },
              readingMotivations: { ...(cur.readingMotivations || {}) },
              readingBarriers: { ...(cur.readingBarriers || {}) },
              buyingHabits: { ...(cur.buyingHabits || {}) },
              readingEnvironments: { ...(cur.readingEnvironments || {}) },
            };
            if (submittedData.ageGroup && updated.ageGroup[submittedData.ageGroup as keyof typeof updated.ageGroup] !== undefined) {
              updated.ageGroup[submittedData.ageGroup as keyof typeof updated.ageGroup] = Math.max(0, updated.ageGroup[submittedData.ageGroup as keyof typeof updated.ageGroup] - 1);
            }
            if (submittedData.booksPerYear && updated.booksPerYear[submittedData.booksPerYear as keyof typeof updated.booksPerYear] !== undefined) {
              updated.booksPerYear[submittedData.booksPerYear as keyof typeof updated.booksPerYear] = Math.max(0, updated.booksPerYear[submittedData.booksPerYear as keyof typeof updated.booksPerYear] - 1);
            }
            (submittedData.readingFormats || []).forEach(f => {
              if (updated.readingFormats[f] !== undefined) updated.readingFormats[f] = Math.max(0, updated.readingFormats[f] - 1);
            });
            (submittedData.favoriteGenres || []).forEach(g => {
              if (updated.favoriteGenres[g] !== undefined) updated.favoriteGenres[g] = Math.max(0, updated.favoriteGenres[g] - 1);
            });
            (submittedData.readingMotivations || []).forEach(m => {
              if (updated.readingMotivations[m] !== undefined) updated.readingMotivations[m] = Math.max(0, updated.readingMotivations[m] - 1);
            });
            (submittedData.readingBarriers || []).forEach(b => {
              if (updated.readingBarriers[b] !== undefined) updated.readingBarriers[b] = Math.max(0, updated.readingBarriers[b] - 1);
            });
            (submittedData.buyingHabits || []).forEach(h => {
              if (updated.buyingHabits[h] !== undefined) updated.buyingHabits[h] = Math.max(0, updated.buyingHabits[h] - 1);
            });
            (submittedData.readingEnvironments || []).forEach(e => {
              if (updated.readingEnvironments[e] !== undefined) updated.readingEnvironments[e] = Math.max(0, updated.readingEnvironments[e] - 1);
            });
            t.set(statsDocRef, updated);
            setSurveyStats(updated);
          });
        }
      } catch (err) {
        console.error("Failed to delete cloud response:", err);
      }
    }

    setSubmittedData(null);
    setAgeGroup(null);
    setBooksPerYear(null);
    setReadingFormats([]);
    setFavoriteGenres([]);
    setReadingMotivations([]);
    setReadingBarriers([]);
    setBuyingHabits([]);
    setReadingEnvironments([]);
    setEmail('');
    setWantsNewsletter(null);
  };

  return (
    <div className="relative w-full min-h-[100svh] bg-black text-[#3A3530] overflow-x-hidden">
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* BACKGROUND VIDEO: Exact MP4 positioned full-page with high visibility */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          opacity: 1,
          filter: 'contrast(1.05) brightness(1.08)',
        }}
      />

      {/* Subtle overlay allowing video to be clearly visible while keeping text legible */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none z-0" />

      {/* Floating Video Control Pill */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs text-white/90 shadow-lg">
        <button
          onClick={toggleVideoPlayback}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          title={isPlaying ? 'Tạm dừng video nền' : 'Tiếp tục phát'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span className="hidden sm:inline font-geist-mono-semibold text-[11px]">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>
        <span className="w-px h-3 bg-white/20" />
        <button
          onClick={toggleVideoMute}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full">
        {/* Row 5.1: Header trang */}
        <section className="py-14 sm:py-20 border-b border-white/10 text-center px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            {!isUserLoggedIn ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm shadow-xl"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0 shadow-md">
                    <LogIn size={20} />
                  </div>
                  <div>
                    <span className="font-lora font-bold block text-sm sm:text-base text-white">
                      Yêu cầu đăng nhập tài khoản để làm khảo sát
                    </span>
                    <span className="font-lora text-xs text-white/80">
                      {user?.isAnonymous 
                        ? 'Bạn đang ở phiên Khách ẩn danh. Vui lòng đăng nhập tài khoản chính thức để thực hiện khảo sát.'
                        : 'Vui lòng đăng nhập bằng Google hoặc Email để bắt đầu tham gia và ghi nhận kết quả.'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2.5 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
                >
                  <LogIn size={15} />
                  <span>Đăng nhập ngay</span>
                </button>
              </motion.div>
            ) : user ? (
              <div className="mb-8 inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl text-white/90 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B56D4F] flex items-center justify-center text-xs font-bold border-2 border-white/20 overflow-hidden shadow-lg">
                    {customAvatar ? (
                      <img src={customAvatar} alt="" className="w-full h-full object-cover" />
                    ) : user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0) || <UserIcon size={18}/>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-lora block text-xs opacity-70">Độc giả đã xác thực</span>
                    <span className="font-lora font-bold text-base">{customName || user.displayName || user.email?.split('@')[0]}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-[11px] font-bold text-green-300">
                  <ShieldCheck size={13} />
                  ĐÃ ĐĂNG NHẬP HỢP LỆ
                </div>
              </div>
            ) : null}

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#EBE5D9] bg-black/40 border border-white/25 backdrop-blur-md shadow-lg mb-4">
              <span className="font-sans">CHUYÊN ĐỀ 04 · KHẢO SÁT BẠN ĐỌC TƯƠNG TÁC</span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
              Cùng chia sẻ thói quen đọc của bạn
            </h1>
            <VintageSeparator color="#EBE5D9" width="w-28" />
            <p className="font-lora text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto mt-4 drop-shadow-xs">
              Chỉ mất 2–3 phút để hoàn thành khảo sát này. Kết quả của bạn sẽ giúp chúng mình thấu hiểu sâu sắc hơn về gu đọc và nguyện vọng của người trẻ hôm nay.
            </p>

            {/* Prominent Live Persistent Counter Banner in Header */}
            <div className="mt-8 inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl text-white">
              <div className="w-10 h-10 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Users size={20} />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider block font-sans">
                  Tổng số người đã tham gia khảo sát
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-playfair text-2xl sm:text-3xl font-black text-white">
                    {surveyStats.totalParticipants.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-lora text-[#EBE5D9]">
                    {surveyStats.totalParticipants === 0 ? 'người tham gia (Hãy là người mở đầu!)' : 'bạn đọc đã gửi ý kiến'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Row 5.2 & Row 5.3: Survey Body or Completed State */}
        <section className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isUserLoggedIn ? (
            /* Login Gate when not signed in */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md rounded-3xl p-8 sm:p-14 border-2 border-[#D6CDBF] shadow-2xl max-w-2xl mx-auto text-center space-y-6"
            >
              <div className="w-20 h-20 bg-[#B56D4F]/10 border-2 border-[#B56D4F] rounded-3xl flex items-center justify-center mx-auto text-[#B56D4F] shadow-md">
                <LogIn size={36} />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#B56D4F] font-bold font-sans">
                  QUY ĐỊNH THAM GIA KHẢO SÁT
                </span>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530]">
                  Phải đăng nhập mới được làm khảo sát
                </h3>
                <p className="font-lora text-sm sm:text-base text-[#6B635A] max-w-md mx-auto leading-relaxed">
                  Để đảm bảo tính xác thực của nghiên cứu cộng đồng, mỗi độc giả cần đăng nhập tài khoản trước khi thực hiện khảo sát. Mỗi tài khoản chỉ đóng góp 1 phiếu duy nhất.
                </p>
              </div>

              {/* 3 feature highlights */}
              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#D6CDBF] text-left space-y-3 text-xs sm:text-sm font-lora text-[#3A3530]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#4A7C59] shrink-0" />
                  <span>Xác thực danh tính bạn đọc thực tế, chống spam và trùng lặp</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#4A7C59] shrink-0" />
                  <span>Lưu trữ vĩnh viễn và đồng bộ câu trả lời an toàn trên Firebase Cloud</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#4A7C59] shrink-0" />
                  <span>Mở khóa toàn bộ biểu đồ phân tích xu hướng ngay sau khi gửi bài</span>
                </div>
              </div>

              {user?.isAnonymous && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-lora text-left flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>Bạn đang duyệt ở chế độ Khách ẩn danh. Vui lòng đăng nhập bằng Google hoặc Email của bạn để mở khóa bảng câu hỏi khảo sát.</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white font-playfair font-bold text-base rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-3 mx-auto"
                >
                  <LogIn size={20} />
                  <span>Đăng nhập ngay để làm khảo sát</span>
                </button>
                <p className="text-[11px] text-[#6B635A] font-lora mt-3">
                  Hỗ trợ đăng nhập nhanh bằng tài khoản Google hoặc tài khoản Email cá nhân.
                </p>
              </div>
            </motion.div>
          ) : (submittedData && submittedData.submittedAt) ? (
            /* Row 5.3: Trạng thái “Đã làm khảo sát” - Max width 5xl for spacious chart breathing room */
            <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-[#D6CDBF] shadow-2xl max-w-5xl mx-auto text-center relative overflow-hidden">
              {/* Vintage Postal Stamp Seal */}
              <div className="w-20 h-20 rounded-full border-3 border-dashed border-[#6B7A6E] text-[#6B7A6E] bg-[#6B7A6E]/10 mx-auto flex items-center justify-center mb-6">
                <CheckCircle2 size={44} />
              </div>

              <span className="text-xs uppercase tracking-[0.2em] text-[#6B7A6E] font-bold block mb-1 font-lora">
                Dấu mộc chứng nhận
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530] mb-3">
                Cảm ơn bạn đã hoàn thành khảo sát!
              </h2>
              <p className="font-lora text-sm sm:text-base text-[#6B635A] max-w-md mx-auto mb-8">
                Ý kiến của bạn đã được ghi nhận vào hệ thống vào lúc{' '}
                <strong className="text-[#3A3530]">{submittedData.submittedAt}</strong>.
              </p>

              {/* Tóm tắt kết quả (viền trái #B56D4F) */}
              <div className="bg-[#FAF7F0] p-6 rounded-2xl border-l-4 border-l-[#B56D4F] border border-[#D6CDBF] text-left space-y-4 mb-8 max-w-3xl mx-auto">
                <h4 className="font-playfair font-bold text-lg text-[#3A3530] flex items-center gap-2">
                  <Bookmark size={18} className="text-[#B56D4F]" />
                  <span>Hồ sơ thói quen đọc của bạn:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-lora">
                  <div>
                    <span className="text-[#6B635A] block">Nhóm tuổi:</span>
                    <strong className="text-[#3A3530]">
                      {submittedData.ageGroup === 'under-18' && 'Dưới 18 tuổi'}
                      {submittedData.ageGroup === '18-22' && '18 – 22 tuổi (Học sinh/Sinh viên)'}
                      {submittedData.ageGroup === '23-30' && '23 – 30 tuổi (Người trẻ đi làm)'}
                      {submittedData.ageGroup === 'above-30' && 'Trên 30 tuổi'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#6B635A] block">Số cuốn sách/năm:</span>
                    <strong className="text-[#B56D4F]">
                      {submittedData.booksPerYear === 'under-2' && 'Dưới 2 cuốn'}
                      {submittedData.booksPerYear === '2-5' && '2 – 5 cuốn'}
                      {submittedData.booksPerYear === '6-12' && '6 – 12 cuốn'}
                      {submittedData.booksPerYear === 'above-12' && 'Hơn 12 cuốn (Mọt sách chính hiệu)'}
                    </strong>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[#6B635A] block">Hình thức đọc ưu tiên:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {submittedData.readingFormats.map((f, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-[#EBE5D9] rounded-md text-xs text-[#3A3530] border border-[#D6CDBF]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[#6B635A] block">Thể loại yêu thích:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {submittedData.favoriteGenres.map((g, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-[#B56D4F]/15 rounded-md text-xs text-[#B56D4F] font-semibold border border-[#B56D4F]/30">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {submittedData.email && (
                    <div className="sm:col-span-2 text-xs text-[#6B635A]">
                      Email nhận bản tin sách định kỳ: <strong>{submittedData.email}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <RotateCcw size={15} />
                  <span>Chỉnh sửa câu trả lời</span>
                </button>

                <button
                  onClick={handleDeleteData}
                  className="w-full sm:w-auto px-6 py-3 bg-[#FAF7F0] hover:bg-[#EBE5D9] text-[#6B635A] hover:text-red-700 text-xs uppercase tracking-wider font-semibold rounded-xl border border-[#D6CDBF] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trash2 size={15} />
                  <span>Xóa dữ liệu</span>
                </button>

                <button
                  onClick={() => onNavigate('genres')}
                  className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#B56D4F] hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Xem thể loại sách gợi ý</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* BIỂU ĐỒ PHÂN TÍCH CHI TIẾT TỪNG CÂU TRẢ LỜI & SỐ NGƯỜI THAM GIA */}
              <div className="mt-14 pt-10 border-t-2 border-[#D6CDBF]/80 text-left">
                {isLoadingStats || isSyncingWithCloud ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-[#B56D4F]/20 border-t-[#B56D4F] rounded-full animate-spin" />
                    <p className="font-lora text-sm text-[#6B635A]">
                      {isSyncingWithCloud ? 'Đang đồng bộ dữ liệu của bạn...' : 'Đang cập nhật dữ liệu cộng đồng...'}
                    </p>
                  </div>
                ) : (
                  <SurveyAnalysisCharts
                    stats={surveyStats}
                    userAnswer={submittedData}
                    onNavigate={onNavigate}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Form 7 câu hỏi chi tiết */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Col 1: Form chính */}
              <div className="lg:col-span-8">
                {/* ANIMATED QUESTION PROGRESS BAR (STICKY HEADER) */}
                <div className="sticky top-20 z-20 mb-6 bg-[#FAF7F0]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border-2 border-[#D6CDBF] shadow-lg">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-lora mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#B56D4F] text-white flex items-center justify-center text-xs font-bold font-sans">
                        {completedQuestionsCount}
                      </span>
                      <span className="font-bold text-[#3A3530]">
                        Tiến độ hoàn thành câu hỏi:
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="font-bold text-[#B56D4F] text-sm">
                        {surveyProgressPct}%
                      </span>
                      <span className="text-xs text-[#6B635A]">
                        ({completedQuestionsCount}/{totalQuestions} câu)
                      </span>
                    </div>
                  </div>

                  {/* Smooth Framer Motion animated progress bar */}
                  <div className="w-full h-3 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${surveyProgressPct}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      className={`h-full rounded-full transition-colors duration-300 ${
                        surveyProgressPct === 100 ? 'bg-[#4A7C59]' : 'bg-[#B56D4F]'
                      }`}
                    />
                  </div>

                  {/* Motivational indicator */}
                  <div className="flex items-center justify-between mt-2 text-[11px] text-[#6B635A] font-lora">
                    <span>
                      {surveyProgressPct === 100
                        ? '✨ Bạn đã hoàn tất mọi câu hỏi! Sẵn sàng gửi bài.'
                        : `Còn ${totalQuestions - completedQuestionsCount} câu nữa để hoàn tất`}
                    </span>
                    <span className="hidden sm:inline-block font-sans font-medium text-[#B56D4F]">
                      Tự động lưu tạm thời
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl space-y-8">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2 font-lora">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Câu 1: Độ tuổi */}
                  <div>
                    <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] block mb-3">
                      1. Độ tuổi của bạn:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'under-18', label: 'Dưới 18 tuổi' },
                        { id: '18-22', label: '18 – 22 tuổi (Học sinh, sinh viên)' },
                        { id: '23-30', label: '23 – 30 tuổi (Người trẻ đi làm)' },
                        { id: 'above-30', label: 'Trên 30 tuổi' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                            ageGroup === item.id
                              ? 'bg-[#FAF7F0] border-[#B56D4F] text-[#B56D4F] font-semibold shadow-2xs'
                              : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="ageGroup"
                            value={item.id}
                            checked={ageGroup === item.id}
                            onChange={() => setAgeGroup(item.id)}
                            className="accent-[#B56D4F] w-4 h-4 cursor-pointer"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Câu 2: Số cuốn sách/năm */}
                  <div>
                    <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] block mb-3">
                      2. Trung bình mỗi năm bạn đọc khoảng bao nhiêu cuốn sách?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'under-2', label: 'Dưới 2 cuốn' },
                        { id: '2-5', label: '2 – 5 cuốn' },
                        { id: '6-12', label: '6 – 12 cuốn' },
                        { id: 'above-12', label: 'Trên 12 cuốn' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex flex-col items-center justify-center text-center p-3.5 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                            booksPerYear === item.id
                              ? 'bg-[#FAF7F0] border-[#B56D4F] text-[#B56D4F] font-semibold shadow-2xs'
                              : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="booksPerYear"
                            value={item.id}
                            checked={booksPerYear === item.id}
                            onChange={() => setBooksPerYear(item.id)}
                            className="accent-[#B56D4F] mb-1 cursor-pointer"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Câu 3: Hình thức đọc */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        3. Hình thức đọc sách bạn thường sử dụng nhất:
                      </label>
                      <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Sách giấy truyền thống',
                        'Máy đọc sách chuyên dụng (Kindle, Kobo)',
                        'Điện thoại / Máy tính bảng',
                        'Sách nói (Audiobook qua Voiz FM, Fonos...)',
                        'Tóm tắt sách qua video / podcast',
                      ].map((fmt) => {
                        const isChecked = readingFormats.includes(fmt);
                        return (
                          <label
                            key={fmt}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                              isChecked
                                ? 'bg-[#FAF7F0] border-[#B56D4F] text-[#B56D4F] font-medium shadow-2xs'
                                : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleFormatToggle(fmt)}
                              className="accent-[#B56D4F] w-4 h-4 cursor-pointer"
                            />
                            <span>{fmt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Câu 4: Thể loại yêu thích (tối đa 3) */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        4. Thể loại sách bạn quan tâm nhất:
                      </label>
                      <span className="text-xs text-[#B56D4F] font-lora font-semibold">
                        (Tối đa 3 thể loại - đã chọn {favoriteGenres.length}/3)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Self-help / Phát triển bản thân',
                        'Chữa lành / Tâm lý',
                        'Tiểu thuyết (ngôn tình, trinh thám, fantasy…)',
                        'Truyện tranh / Manga / Light novel',
                        'Kinh tế / Khởi nghiệp / Tài chính',
                        'Lịch sử / Hồi ký / Tự truyện',
                      ].map((genre) => {
                        const isChecked = favoriteGenres.includes(genre);
                        return (
                          <label
                            key={genre}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                              isChecked
                                ? 'bg-[#FAF7F0] border-[#B56D4F] text-[#B56D4F] font-semibold shadow-2xs'
                                : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleGenreToggle(genre)}
                              className="accent-[#B56D4F] w-4 h-4 cursor-pointer"
                            />
                            <span>{genre}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Câu 5: Lý do đọc */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        5. Động lực lớn nhất thôi thúc bạn đọc sách:
                      </label>
                      <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        'Giải trí, thư giãn đầu óc sau giờ căng thẳng',
                        'Học kỹ năng mới, nâng cao kiến thức nghề nghiệp',
                        'Chữa lành, tìm sự cân bằng cảm xúc nội tâm',
                        'Theo trend từ TikTok, Instagram, bạn bè giới thiệu',
                      ].map((mot) => {
                        const isChecked = readingMotivations.includes(mot);
                        return (
                          <label
                            key={mot}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                              isChecked
                                ? 'bg-[#FAF7F0] border-[#B56D4F] text-[#B56D4F] font-medium shadow-2xs'
                                : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleMotivationToggle(mot)}
                              className="accent-[#B56D4F] w-4 h-4 cursor-pointer"
                            />
                            <span>{mot}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Câu 6: Lý do ít đọc */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        6. Rào cản lớn nhất khiến bạn chưa đọc được nhiều như mong muốn:
                      </label>
                      <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        'Không có thời gian do lịch học tập, công việc dày đặc',
                        'Nghiện mạng xã hội, game, video ngắn lướt vô thức',
                        'Không biết chọn cuốn sách nào phù hợp với bản thân',
                        'Cảm thấy “khó vào”, dễ buồn ngủ sau vài trang đầu',
                      ].map((barr) => {
                        const isChecked = readingBarriers.includes(barr);
                        return (
                          <label
                            key={barr}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                              isChecked
                                ? 'bg-[#FAF7F0] border-[#6B7A6E] text-[#6B7A6E] font-medium shadow-2xs'
                                : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleBarrierToggle(barr)}
                              className="accent-[#6B7A6E] w-4 h-4 cursor-pointer"
                            />
                            <span>{barr}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* New Câu 7: Buying Habits */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        7. Bạn thường sở hữu sách thông qua hình thức nào:
                      </label>
                      <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        'Mua sách mới tại nhà sách/online',
                        'Mua sách cũ/second-hand',
                        'Mượn từ thư viện/bạn bè',
                        'Đọc bản free/lậu trên mạng',
                        'Thuê sách theo tháng (app)',
                      ].map((hab) => {
                        const isChecked = buyingHabits.includes(hab);
                        return (
                          <label
                            key={hab}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                              isChecked
                                ? 'bg-[#FAF7F0] border-[#B56D4F] text-[#B56D4F] font-medium shadow-2xs'
                                : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleBuyingToggle(hab)}
                              className="accent-[#B56D4F] w-4 h-4 cursor-pointer"
                            />
                            <span>{hab}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* New Câu 8: Reading Environments */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        8. Không gian đọc sách lý tưởng của bạn:
                      </label>
                      <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        'Tại nhà (phòng ngủ, ban công)',
                        'Quán cà phê yên tĩnh',
                        'Trên phương tiện công cộng (bus, tàu)',
                        'Thư viện/không gian học tập',
                        'Giờ nghỉ giải lao tại trường/chỗ làm',
                      ].map((env) => {
                        const isChecked = readingEnvironments.includes(env);
                        return (
                          <label
                            key={env}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer font-lora text-sm transition-all ${
                              isChecked
                                ? 'bg-[#FAF7F0] border-[#6B7A6E] text-[#6B7A6E] font-medium shadow-2xs'
                                : 'bg-[#FAF7F0]/60 border-[#D6CDBF] text-[#3A3530] hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleEnvironmentToggle(env)}
                              className="accent-[#6B7A6E] w-4 h-4 cursor-pointer"
                            />
                            <span>{env}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Câu 9: Email nhận bản tin */}
                  <div className="border-t border-[#D6CDBF] pt-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <label className="font-playfair text-base sm:text-lg font-bold text-[#3A3530]">
                        9. Bạn có muốn nhận thư gợi ý sách hay mỗi tháng qua email?
                      </label>
                      <span className="text-xs text-[#B56D4F] font-lora">
                        {wantsNewsletter === null
                          ? '(Chưa chọn)'
                          : wantsNewsletter
                          ? '(Đã chọn: Có nhận thư)'
                          : '(Đã chọn: Không nhận)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 mb-3">
                      <label className="flex items-center gap-2 cursor-pointer font-lora text-sm">
                        <input
                          type="radio"
                          name="newsletter"
                          checked={wantsNewsletter === true}
                          onChange={() => setWantsNewsletter(true)}
                          className="accent-[#B56D4F] cursor-pointer"
                        />
                        <span>Có, hãy gửi cho mình</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-lora text-sm">
                        <input
                          type="radio"
                          name="newsletter"
                          checked={wantsNewsletter === false}
                          onChange={() => {
                            setWantsNewsletter(false);
                            setEmail('');
                          }}
                          className="accent-[#B56D4F] cursor-pointer"
                        />
                        <span>Không, cảm ơn</span>
                      </label>
                    </div>

                    {wantsNewsletter === true && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-1.5"
                      >
                        <label className="text-xs font-semibold text-[#6B635A] font-lora">
                          Địa chỉ email nhận thư gợi ý sách: <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Nhập email của bạn (ví dụ: banchuyen@gmail.com)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full p-3.5 bg-[#FAF7F0] border border-[#D6CDBF] rounded-xl text-sm font-lora text-[#3A3530] focus:outline-hidden focus:border-[#B56D4F]"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Submit button: Only available when user has interacted with all questions */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className={`w-full py-4 border font-playfair font-bold text-base sm:text-lg rounded-xl transition-all shadow-md flex items-center justify-center gap-3 ${
                        isFormValid && !isSubmitting
                          ? 'bg-[#B56D4F] hover:bg-[#9A5A3F] border-[#9A5A3F] text-white cursor-pointer active:scale-98 shadow-lg'
                          : 'bg-[#D6CDBF]/50 border-[#D6CDBF] text-[#8C8275] cursor-not-allowed opacity-75'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Đang ghi nhận kết quả lên hệ thống...</span>
                        </>
                      ) : (
                        <>
                          <span>Gửi kết quả</span>
                          <Send size={18} />
                        </>
                      )}
                    </button>
                    
                    <div className="text-center mt-3 text-xs font-lora">
                      {!isFormValid ? (
                        <div className="text-amber-700 font-medium flex items-center justify-center gap-1.5">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>
                            Vui lòng hoàn thành tất cả các câu hỏi để kích hoạt nút gửi kết quả ({completedQuestionsCount}/{totalQuestions} câu đã hoàn tất).
                          </span>
                        </div>
                      ) : (
                        <div className="text-[#4A7C59] font-medium flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={14} className="shrink-0" />
                          <span>Bạn đã hoàn thành đủ 9 câu hỏi. Sẵn sàng gửi kết quả và cập nhật số liệu!</span>
                        </div>
                      )}
                      <p className="text-[#6B635A] mt-1.5 text-[11px]">
                        Dữ liệu được lưu trữ bảo mật trên Firebase và đồng bộ tức thì cùng cộng đồng bạn đọc.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Col 2: Minh họa + Ghi chú an toàn & Bộ đếm số người tham gia hiện tại */}
              <div className="lg:col-span-4 space-y-6">
                {/* Live Counter Card */}
                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shadow-xs">
                      <Users size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#6B635A] uppercase tracking-wider block font-sans">
                        Cộng đồng bạn đọc
                      </span>
                      <span className="font-playfair text-2xl font-extrabold text-[#3A3530]">
                        {surveyStats.totalParticipants.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-xs font-lora text-[#B56D4F] font-bold ml-1.5">
                        người đã tham gia
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B635A] font-lora leading-relaxed">
                    Sau khi hoàn thành gửi bài, bạn sẽ được mở khóa toàn bộ biểu đồ phân tích tỷ lệ phần trăm chi tiết từng câu trả lời.
                  </p>
                </div>

                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-[#B56D4F]/10 text-[#B56D4F] flex items-center justify-center mb-4">
                    <ShieldCheck size={26} />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-[#3A3530] mb-2">
                    Dữ liệu của bạn được an toàn
                  </h4>
                  <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-4">
                    Khảo sát được thiết kế với mục đích phi thương mại nhằm phản ánh trung thực thói quen văn hóa đọc của thanh thiếu niên Việt Nam trong thời đại số.
                  </p>
                  <div className="border-t border-[#D6CDBF] pt-4 space-y-2 text-xs text-[#6B635A] font-lora">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A6E]" />
                      <span>Lưu trữ cục bộ (Local Storage)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A6E]" />
                      <span>Tự động cộng +1 lượt & tính tỷ lệ % ngay</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A6E]" />
                      <span>Có thể xóa dữ liệu hoặc làm lại bất kỳ lúc nào</span>
                    </div>
                  </div>
                </div>

                {/* Sổ tay trích dẫn */}
                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 rounded-3xl border border-[#D6CDBF] relative shadow-lg">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B56D4F] block mb-2 font-lora">
                    Ghi chép từ ban biên tập
                  </span>
                  <blockquote className="font-lora text-xs sm:text-sm text-[#3A3530] italic leading-relaxed">
                    “Mỗi một câu trả lời của bạn là một nét vẽ góp phần hoàn thiện bức tranh văn hóa đọc của thế hệ trẻ Việt Nam hôm nay.”
                  </blockquote>
                  <div className="mt-3 text-right text-xs font-playfair font-bold text-[#3A3530]">
                    — Đọc & Trẻ Team
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* CELEBRATORY ANIMATION MODAL (FRAMER MOTION) */}
      <AnimatePresence>
        {showCelebrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCelebrationModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Celebratory Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#FAF7F0] to-[#F5EFE6] border-3 border-[#B56D4F] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center font-lora overflow-hidden"
            >
              {/* Decorative background aura rings */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#B56D4F]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#6B7A6E]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Animated Trophy / Popper Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#B56D4F] to-[#D4A373] text-white flex items-center justify-center mx-auto mb-5 shadow-lg border-2 border-white/50"
              >
                <PartyPopper size={38} className="animate-bounce" />
              </motion.div>

              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#B56D4F] font-sans block mb-1">
                Hoàn thành xuất sắc!
              </span>

              <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#3A3530] mb-3">
                Chúc Mừng Bạn! 🎉
              </h3>

              <p className="text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-6">
                Bạn đã hoàn thành toàn bộ 7 câu hỏi khảo sát thói quen đọc sách. Phiếu đóng góp của bạn đã được ghi nhận vào cơ sở dữ liệu cộng đồng.
              </p>

              {/* Stats Highlight Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 border border-[#D6CDBF] rounded-2xl p-4 mb-6 shadow-xs flex items-center justify-around text-center"
              >
                <div>
                  <span className="text-[10px] text-[#6B635A] uppercase tracking-wider block font-sans">
                    Tiến độ hoàn thành
                  </span>
                  <span className="font-sans text-xl font-black text-[#4A7C59]">
                    100%
                  </span>
                </div>
                <div className="h-8 w-px bg-[#D6CDBF]" />
                <div>
                  <span className="text-[10px] text-[#6B635A] uppercase tracking-wider block font-sans">
                    Số người đã tham gia
                  </span>
                  <span className="font-playfair text-xl font-extrabold text-[#B56D4F]">
                    {surveyStats.totalParticipants.toLocaleString('vi-VN')}
                  </span>
                </div>
              </motion.div>

              {/* Action button to explore charts */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCelebrationModal(false)}
                className="w-full py-3.5 px-6 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Xem Ngay Báo Cáo & Biểu Đồ</span>
                <ArrowRight size={15} />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

