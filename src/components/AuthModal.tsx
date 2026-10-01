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
  Chrome
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

  useEffect(() => {
    if (!isOpen) {
      setMode('selection');
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
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
      console.error("Google Sign-in failed:", err);
      if (err.code === 'auth/configuration-not-found') {
        setError('Google Login chưa được bật trong Firebase Console.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Tên miền này chưa được cấp phép trong Firebase Console. Vui lòng kiểm tra cài đặt Authorized Domains.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Cửa sổ đăng nhập đã bị đóng.');
      } else {
        setError(`Đăng nhập thất bại: ${err.message || 'Lỗi không xác định'}`);
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
      console.error("Guest Sign-in failed:", err);
      setError('Đăng nhập khách thất bại.');
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
          // Optionally resend verification
          // await sendEmailVerification(userCredential.user);
          return;
        }
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setMode('verification-sent');
      }
    } catch (err: any) {
      console.error("Email Auth failed:", err);
      if (err.code === 'auth/user-not-found') setError('Không tìm thấy tài khoản.');
      else if (err.code === 'auth/wrong-password') setError('Mật khẩu không chính xác.');
      else if (err.code === 'auth/email-already-in-use') setError('Email đã được sử dụng.');
      else if (err.code === 'auth/weak-password') setError('Mật khẩu quá yếu (tối thiểu 6 ký tự).');
      else if (err.code === 'auth/invalid-email') setError('Email không hợp lệ.');
      else setError('Xác thực thất bại. Vui lòng kiểm tra lại.');
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
        <div className="h-32 bg-[#B56D4F] relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#B56D4F]">
            <User size={32} />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-2xl font-bold text-[#3A3530]">
              {mode === 'verification-sent' ? 'Kiểm tra Email' : mode === 'selection' ? 'Chào mừng bạn!' : mode === 'email-login' ? 'Đăng nhập Email' : 'Tạo tài khoản mới'}
            </h2>
            <p className="font-lora text-[#6B635A] text-sm mt-2">
              {mode === 'verification-sent' 
                ? `Chúng mình đã gửi một liên kết xác thực đến ${email}. Vui lòng xác thực trước khi đăng nhập.`
                : 'Lưu lại thói quen đọc sách và theo dõi khảo sát của riêng bạn.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
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
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#D6CDBF] text-[#3A3530] py-3.5 rounded-xl font-medium hover:bg-[#F5F1E8] transition-all active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} className="text-blue-500" />}
                Tiếp tục với Google
              </button>

              <button
                onClick={() => setMode('email-login')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#3A3530] text-white py-3.5 rounded-xl font-medium hover:bg-[#2A2520] transition-all active:scale-[0.98] cursor-pointer"
              >
                <Mail size={20} />
                Sử dụng Email
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[#D6CDBF]"></div>
                <span className="text-[10px] uppercase tracking-widest text-[#6B635A] font-bold">Hoặc</span>
                <div className="flex-1 h-px bg-[#D6CDBF]"></div>
              </div>

              <button
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
                className="w-full py-3 text-[#B56D4F] font-semibold text-sm hover:underline transition-all cursor-pointer"
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
                  className="w-full px-4 py-3 bg-white border border-[#D6CDBF] rounded-xl focus:ring-2 focus:ring-[#B56D4F]/30 focus:border-[#B56D4F] outline-none transition-all"
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
                  className="w-full px-4 py-3 bg-white border border-[#D6CDBF] rounded-xl focus:ring-2 focus:ring-[#B56D4F]/30 focus:border-[#B56D4F] outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#B56D4F] text-white py-3.5 rounded-xl font-medium hover:bg-[#9A5A3F] transition-all active:scale-[0.98] shadow-md cursor-pointer mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'email-login' ? 'Đăng nhập' : 'Tạo tài khoản')}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'email-login' ? 'email-signup' : 'email-login')}
                  className="text-sm text-[#6B635A] hover:text-[#B56D4F] transition-colors cursor-pointer"
                >
                  {mode === 'email-login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMode('selection')}
                className="w-full text-xs text-[#6B635A] mt-4 hover:underline cursor-pointer"
              >
                Quay lại phương thức khác
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
