import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  LogOut, 
  Mail, 
  User, 
  X, 
  Loader2, 
  AlertCircle,
  Chrome,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { loginDemoUser } from '../lib/appAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'selection' | 'email-login' | 'email-signup' | 'verification-sent';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMode('selection');
      setEmail('');
      setPassword('');
      setError(null);
      setUnauthorizedDomain(null);
      setCopiedDomain(false);
    }
  }, [isOpen]);

  const handleCopyDomain = () => {
    const domain = window.location.hostname;
    navigator.clipboard.writeText(domain).then(() => {
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }).catch(() => {});
  };

  const handleQuickDemoLogin = (roleName = 'Bạn Đọc Trẻ') => {
    loginDemoUser(roleName);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setUnauthorizedDomain(null);
    try {
      const provider = new GoogleAuthProvider();
      
      if (auth.currentUser?.isAnonymous) {
        try {
          await linkWithPopup(auth.currentUser, provider);
        } catch (linkErr: any) {
          if (linkErr.code === 'auth/credential-already-in-use') {
            await signInWithPopup(auth, provider);
          } else {
            throw linkErr;
          }
        }
      } else {
        await signInWithPopup(auth, provider);
      }
      
      onClose();
    } catch (err: any) {
      const errorCode = err?.code || '';
      if (errorCode === 'auth/unauthorized-domain') {
        console.warn("Google Sign-in domain not authorized in Firebase Console:", window.location.hostname);
        setUnauthorizedDomain(window.location.hostname);
        setError('Tên miền máy chủ xem trước hiện tại chưa nằm trong danh sách Authorized Domains của Firebase.');
      } else if (errorCode === 'auth/configuration-not-found') {
        console.warn("Google Login configuration not found:", err);
        setError('Google Login chưa được bật trong Firebase Console.');
      } else if (errorCode === 'auth/popup-closed-by-user') {
        // User just cancelled popup, no error needed
        console.info("Google Sign-in popup closed by user.");
      } else if (errorCode === 'auth/operation-not-allowed') {
        console.warn("Google auth operation not allowed:", err);
        setError('Phương thức đăng nhập bằng Google chưa được bật trong Firebase Console.');
      } else {
        console.warn("Google Sign-in notice:", errorCode, err?.message);
        setError(`Đăng nhập Google thất bại (${errorCode}): ${err?.message || 'Vui lòng thử lại'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      console.warn("Firebase Anonymous Sign-in notice, activating local fallback:", err?.code);
      // Seamless fallback so the user is never stuck
      loginDemoUser('Khách Ẩn Danh');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'email-login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư.');
          return;
        }
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setMode('verification-sent');
      }
    } catch (err: any) {
      console.warn("Email Auth notice:", err?.code);
      const errorCode = err?.code;
      if (errorCode === 'auth/user-not-found') setError('Không tìm thấy tài khoản.');
      else if (errorCode === 'auth/wrong-password') setError('Mật khẩu không chính xác.');
      else if (errorCode === 'auth/email-already-in-use') setError('Email đã được sử dụng.');
      else if (errorCode === 'auth/weak-password') setError('Mật khẩu quá yếu (tối thiểu 6 ký tự).');
      else if (errorCode === 'auth/invalid-email') setError('Email không hợp lệ.');
      else if (errorCode === 'auth/operation-not-allowed') {
        setError('Phương thức Email/Password chưa bật trong Firebase Console. Bạn có thể chọn "Trải nghiệm nhanh" để đăng nhập ngay.');
      }
      else setError(`Xác thực thất bại (${errorCode}): ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#3A3530]/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#FAF7F0] rounded-3xl shadow-2xl overflow-hidden border border-[#D6CDBF]"
      >
        <div className="h-28 bg-[#B56D4F] relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#B56D4F]">
            <User size={28} />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="font-playfair text-2xl font-bold text-[#3A3530]">
              {mode === 'verification-sent' ? 'Kiểm tra Email' : mode === 'selection' ? 'Chào mừng bạn!' : mode === 'email-login' ? 'Đăng nhập Email' : 'Tạo tài khoản mới'}
            </h2>
            <p className="font-lora text-[#6B635A] text-sm mt-1.5">
              {mode === 'verification-sent' 
                ? `Chúng mình đã gửi liên kết xác thực đến ${email}. Vui lòng kiểm tra hộp thư.`
                : 'Lưu sách yêu thích, ghi chú khảo sát và cá nhân hóa trải nghiệm đọc.'}
            </p>
          </div>

          {/* Hộp thông báo chi tiết khi gặp lỗi Unauthorized Domain */}
          {unauthorizedDomain && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left"
            >
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                <span>Tên miền xem trước chưa thêm vào Firebase</span>
              </div>
              <p className="text-xs text-[#5C5346] font-lora leading-relaxed mb-3">
                Firebase OAuth yêu cầu tên miền đang chạy ứng dụng phải được cấp phép trong 
                <span className="font-semibold text-[#3A3530]"> Firebase Console → Authentication → Settings → Authorized domains</span>.
              </p>
              
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200 mb-3">
                <span className="text-[11px] font-mono text-[#3A3530] truncate flex-1 select-all">
                  {unauthorizedDomain}
                </span>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg flex items-center gap-1 shrink-0 font-medium transition-colors cursor-pointer"
                >
                  {copiedDomain ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedDomain ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Bạn Đọc Trẻ')}
                  className="w-full py-2.5 px-3 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles size={14} />
                  <span>Tiếp tục ngay với Tài khoản Trải nghiệm</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnauthorizedDomain(null);
                    setError(null);
                    setMode('email-login');
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-amber-50 text-[#3A3530] border border-[#D6CDBF] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail size={13} />
                  <span>Đăng nhập bằng Email (Không cần duyệt tên miền)</span>
                </button>
              </div>
            </motion.div>
          )}

          {error && !unauthorizedDomain && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{error}</p>
            </motion.div>
          )}

          {mode === 'verification-sent' ? (
            <div className="space-y-4">
              <button
                onClick={() => setMode('email-login')}
                className="w-full bg-[#B56D4F] text-white py-3.5 rounded-xl font-medium hover:bg-[#9A5A3F] transition-all cursor-pointer"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          ) : mode === 'selection' ? (
            <div className="space-y-2.5">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#D6CDBF] text-[#3A3530] py-3 rounded-xl font-medium hover:bg-[#F5F1E8] transition-all active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Chrome size={18} className="text-blue-500" />}
                <span className="text-sm">Tiếp tục với Google</span>
              </button>

              <button
                onClick={() => setMode('email-login')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#3A3530] text-white py-3 rounded-xl font-medium hover:bg-[#2A2520] transition-all active:scale-[0.98] cursor-pointer"
              >
                <Mail size={18} />
                <span className="text-sm">Sử dụng Email & Mật khẩu</span>
              </button>

              {/* Nút đăng nhập thử nghiệm tiện lợi */}
              <button
                onClick={() => handleQuickDemoLogin('Bạn Đọc Trẻ')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-[#FAF3E8] border border-[#E0D5C3] text-[#B56D4F] py-3 rounded-xl font-semibold text-sm hover:bg-[#F5ECD8] transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles size={17} className="text-[#B56D4F]" />
                <span>Trải nghiệm nhanh (Tài khoản Đọc & Trẻ)</span>
              </button>

              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-[#D6CDBF]"></div>
                <span className="text-[10px] uppercase tracking-widest text-[#6B635A] font-bold">Hoặc</span>
                <div className="flex-1 h-px bg-[#D6CDBF]"></div>
              </div>

              <button
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
                className="w-full py-2.5 text-[#6B635A] hover:text-[#B56D4F] font-semibold text-sm hover:underline transition-all cursor-pointer"
              >
                Tiếp tục như Khách ẩn danh
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B635A] uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D6CDBF] rounded-xl focus:ring-2 focus:ring-[#B56D4F]/30 focus:border-[#B56D4F] outline-none transition-all text-sm"
                  placeholder="email@vidu.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B635A] uppercase tracking-wider ml-1">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D6CDBF] rounded-xl focus:ring-2 focus:ring-[#B56D4F]/30 focus:border-[#B56D4F] outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#B56D4F] text-white py-3.5 rounded-xl font-medium hover:bg-[#9A5A3F] transition-all active:scale-[0.98] shadow-md cursor-pointer mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'email-login' ? 'Đăng nhập' : 'Tạo tài khoản')}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'email-login' ? 'email-signup' : 'email-login')}
                  className="text-xs text-[#6B635A] hover:text-[#B56D4F] transition-colors cursor-pointer"
                >
                  {mode === 'email-login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D5] mt-4">
                <button
                  type="button"
                  onClick={() => setMode('selection')}
                  className="text-xs text-[#6B635A] hover:underline cursor-pointer"
                >
                  ← Quay lại phương thức khác
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Bạn Đọc Trẻ')}
                  className="text-xs text-[#B56D4F] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles size={12} />
                  <span>Vào nhanh (Demo)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
