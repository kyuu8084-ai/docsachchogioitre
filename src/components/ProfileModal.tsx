import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Loader2, 
  Camera, 
  User, 
  Check, 
  AlertCircle,
  Upload
} from 'lucide-react';
import { 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isOpen) {
        setDisplayName(user.displayName || '');
        setSuccess(false);
        setError(null);
        setIsFetching(true);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setAvatarBase64(docSnap.data().avatarBase64 || null);
          } else {
            setAvatarBase64(null);
          }
        } catch (err) {
          console.error("Error fetching avatar:", err);
        } finally {
          setIsFetching(false);
        }
      }
    };
    fetchProfile();
  }, [isOpen, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for Firestore Base64
      setError("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB để đảm bảo hiệu suất.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update standard profile (display name)
      await updateProfile(user, {
        displayName: displayName.trim()
      });

      // Save custom avatar to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        avatarBase64: avatarBase64,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Update profile failed:", err);
      setError("Cập nhật thông tin thất bại. Vui lòng thử lại.");
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
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl font-bold text-[#3A3530]">Hồ sơ của bạn</h2>
            <button 
              onClick={onClose}
              className="p-2 text-[#6B635A] hover:bg-[#EBE5D9] rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 rounded-full bg-[#B56D4F] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden relative">
                  {isFetching ? (
                    <Loader2 className="animate-spin" size={32} />
                  ) : avatarBase64 ? (
                    <img src={avatarBase64} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    displayName.charAt(0).toUpperCase() || <User size={40} />
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[10px] text-[#6B635A] uppercase tracking-widest mt-3 font-bold">Bấm để thay ảnh</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B635A] uppercase tracking-wider ml-1">Tên hiển thị</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D6CDBF] rounded-xl focus:ring-2 focus:ring-[#B56D4F]/30 focus:border-[#B56D4F] outline-none transition-all"
                  placeholder="Họ và tên của bạn"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 text-green-700 text-sm">
                <Check size={18} className="shrink-0 mt-0.5" />
                <p>Cập nhật thành công!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || success || isFetching}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium transition-all active:scale-[0.98] shadow-md cursor-pointer ${
                success ? 'bg-green-600 text-white' : 'bg-[#B56D4F] text-white hover:bg-[#9A5A3F]'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : success ? <Check size={20} /> : 'Lưu hồ sơ'}
            </button>
          </form>
          {user.isAnonymous ? (
            <div className="mt-8 p-4 bg-[#EBE5D9] rounded-2xl border border-[#D6CDBF]">
              <p className="text-xs text-[#3A3530] leading-relaxed">
                <b>💡 Bạn đang dùng tài khoản Khách:</b> Hãy đăng nhập bằng Google hoặc Email để lưu trữ dữ liệu vĩnh viễn và đồng bộ trên mọi thiết bị.
              </p>
            </div>
          ) : user.email && !user.emailVerified && (
            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <p className="text-xs text-amber-800 leading-relaxed">
                <b>⚠️ Email chưa xác thực:</b> Vui lòng kiểm tra hộp thư <b>{user.email}</b> và nhấn vào liên kết xác thực để hoàn tất bảo mật tài khoản.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

