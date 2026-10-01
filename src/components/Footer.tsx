import { BookOpen, Instagram, Facebook, Mail, Compass, Heart } from 'lucide-react';
import { PageId } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'reading-habits', label: 'Thói quen đọc' },
    { id: 'genres', label: 'Thể loại sách hot' },
    { id: 'library', label: 'Thư viện sách' },
    { id: 'survey', label: 'Khảo sát cộng đồng' },
    { id: 'about', label: 'Về chúng mình' },
  ];

  const handleNav = (id: PageId) => {
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#E3DCCF] border-t border-[#D6CDBF] text-[#3A3530] font-lora">
      {/* Row 7.1: Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Col 1: Logo & Slogan */}
          <div className="flex flex-col items-start">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] border border-[#D6CDBF] text-[#B56D4F] flex items-center justify-center transition-transform group-hover:scale-105">
                <BookOpen size={22} strokeWidth={2} />
              </div>
              <span className="font-playfair text-2xl font-bold tracking-tight text-[#3A3530]">
                Đọc & Trẻ
              </span>
            </button>
            <p className="mt-3 text-[15px] text-[#6B635A] max-w-sm leading-relaxed">
              Dự án kết nối giới trẻ với trang sách, nuôi dưỡng thói quen đọc sâu sắc và khám phá những chân trời tri thức bất tận.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#6B635A]">
              <Compass size={14} className="text-[#B56D4F]" />
              <span>Dành cho độc giả trẻ yêu tri thức khắp Việt Nam</span>
            </div>
          </div>

          {/* Col 2: Menu nhanh */}
          <div className="flex flex-col">
            <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-4">
              Khám phá nhanh
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className="text-[15px] text-[#3A3530] hover:text-[#B56D4F] transition-colors flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B56D4F]/40 group-hover:bg-[#B56D4F] transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Liên hệ & MXH */}
          <div className="flex flex-col">
            <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-4">
              Liên hệ & Kết nối
            </h4>
            <p className="text-[14px] text-[#6B635A] mb-3">
              Mọi đóng góp ý kiến hoặc hợp tác lan tỏa văn hóa đọc:
            </p>
            <a
              href="mailto:docvatre@example.com"
              className="inline-flex items-center gap-2 text-[15px] text-[#B56D4F] font-medium hover:underline mb-5"
            >
              <Mail size={16} />
              <span>docvatre@example.com</span>
            </a>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#6B635A] font-semibold mr-1">
                Theo dõi:
              </span>
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                title="Instagram Đọc & Trẻ"
                className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#D6CDBF] text-[#B56D4F] hover:bg-[#B56D4F] hover:text-white transition-all flex items-center justify-center"
              >
                <Instagram size={17} />
              </a>
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                title="Facebook Đọc & Trẻ"
                className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#D6CDBF] text-[#B56D4F] hover:bg-[#B56D4F] hover:text-white transition-all flex items-center justify-center"
              >
                <Facebook size={17} />
              </a>
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                title="TikTok Đọc & Trẻ"
                className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#D6CDBF] text-[#B56D4F] hover:bg-[#B56D4F] hover:text-white transition-all flex items-center justify-center font-bold text-xs"
              >
                TT
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row 7.2: Dòng bản quyền */}
      <div className="border-t border-[#D6CDBF] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-16 h-[2px] bg-[#B56D4F] mb-3 opacity-60" />
          <p className="text-xs sm:text-sm text-[#6B635A] flex items-center gap-1.5 flex-wrap justify-center">
            <span>© 2026 Đọc & Trẻ. Nền tảng chia sẻ văn hóa đọc cho giới trẻ.</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#B56D4F]">
              Được thiết kế với <Heart size={12} fill="#B56D4F" /> dành cho người yêu sách
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
