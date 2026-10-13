import { BookOpen, Instagram, Facebook, Mail, Compass, Heart } from 'lucide-react';
import { PageId } from '../types';

interface FooterProps {
  currentPage?: PageId;
  onNavigate: (page: PageId) => void;
}

export default function Footer({ currentPage, onNavigate }: FooterProps) {
  const isCosmic = currentPage === 'about';

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'reading-habits', label: 'Thói quen đọc' },
    { id: 'genres', label: 'Thể loại sách hot' },
    { id: 'library', label: 'Thư viện sách' },
    { id: 'survey', label: 'Kết quả khảo sát' },
    { id: 'about', label: 'Về chúng mình' },
  ];

  const handleNav = (id: PageId) => {
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCosmic) {
    return (
      <footer className="w-full bg-black/85 backdrop-blur-2xl border-t border-white/10 text-[#ededed] font-sans relative z-20 transition-colors duration-300">
        {/* Row 7.1: Main Footer Content (Cosmic Dark Glass Mode for About Us) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {/* Col 1: Logo & Slogan */}
            <div className="flex flex-col items-start">
              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-3 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-[#c2ba9b] flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_20px_rgba(194,186,155,0.2)]">
                  <BookOpen size={22} strokeWidth={2} />
                </div>
                <span className="font-playfair text-2xl font-bold tracking-tight text-[#fdfbf6]">
                  Đọc & Trẻ
                </span>
              </button>
              <p className="mt-3 text-[15px] text-white/70 max-w-sm leading-relaxed">
                Dự án số hóa phát triển từ kết quả khảo sát 100 bạn đọc trẻ Việt Nam, kết nối giới trẻ với trang sách và đồng hành giải quyết các rào cản thời đại số.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                <Compass size={14} className="text-[#c2ba9b]" />
                <span>Khởi nguồn từ khảo sát thực tế · Đồng hành cùng bạn đọc trẻ</span>
              </div>

              {/* Nhóm tác giả & Về chúng mình status */}
              <div className="mt-5 pt-4 border-t border-white/10 w-full max-w-sm flex items-center justify-between text-xs text-white/60">
                <span>Dự án bởi Nhóm An Toàn Thông Tin</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#c2ba9b]/15 text-[#c2ba9b] border border-[#c2ba9b]/30 font-sans">
                  Bạn đang ở trang này
                </span>
              </div>
            </div>

            {/* Col 2: Menu nhanh */}
            <div className="flex flex-col">
              <h4 className="font-playfair text-lg font-bold text-[#fdfbf6] mb-4">
                Khám phá nhanh
              </h4>
              <ul className="space-y-2.5">
                {navLinks.map((item) => {
                  const isActive = item.id === currentPage;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNav(item.id)}
                        className={`text-[15px] transition-colors flex items-center gap-2 group cursor-pointer ${
                          isActive
                            ? 'text-[#c2ba9b] font-semibold'
                            : 'text-white/75 hover:text-[#c2ba9b]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isActive
                              ? 'bg-[#c2ba9b] shadow-[0_0_8px_rgba(194,186,155,0.8)]'
                              : 'bg-white/25 group-hover:bg-[#c2ba9b]'
                          }`}
                        />
                        <span>
                          {item.label}
                          {isActive && <span className="ml-1 text-xs text-[#c2ba9b]/70 font-normal">(Đang xem)</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Col 3: Liên hệ & MXH */}
            <div className="flex flex-col">
              <h4 className="font-playfair text-lg font-bold text-[#fdfbf6] mb-4">
                Liên hệ & Kết nối
              </h4>
              <p className="text-[14px] text-white/70 mb-3">
                Mọi đóng góp ý kiến hoặc hợp tác lan tỏa văn hóa đọc:
              </p>
              <a
                href="mailto:docvatre@example.com"
                className="inline-flex items-center gap-2 text-[15px] text-[#c2ba9b] font-medium hover:text-[#d4ccad] hover:underline mb-5 transition-colors"
              >
                <Mail size={16} />
                <span>docvatre@example.com</span>
              </a>

              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-white/50 font-semibold mr-1">
                  Theo dõi:
                </span>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  title="Instagram Đọc & Trẻ"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-[#c2ba9b] hover:text-black hover:border-[#c2ba9b] transition-all flex items-center justify-center"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  title="Facebook Đọc & Trẻ"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-[#c2ba9b] hover:text-black hover:border-[#c2ba9b] transition-all flex items-center justify-center"
                >
                  <Facebook size={17} />
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  title="TikTok Đọc & Trẻ"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-[#c2ba9b] hover:text-black hover:border-[#c2ba9b] transition-all flex items-center justify-center font-bold text-xs"
                >
                  TT
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Row 7.2: Dòng bản quyền */}
        <div className="border-t border-white/10 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <div className="w-16 h-[2px] bg-[#c2ba9b] mb-3 opacity-60" />
            <p className="text-xs sm:text-sm text-white/50 flex items-center gap-1.5 flex-wrap justify-center">
              <span>© 2026 Đọc & Trẻ. Nền tảng chia sẻ văn hóa đọc cho giới trẻ.</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#c2ba9b]">
                Được thiết kế với <Heart size={12} fill="#c2ba9b" /> dành cho người yêu sách
              </span>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#E3DCCF] border-t border-[#D6CDBF] text-[#3A3530] font-lora transition-colors duration-300">
      {/* Row 7.1: Main Footer Content (Vintage Paper Mode) */}
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
              Dự án số hóa phát triển từ kết quả khảo sát 100 bạn đọc trẻ Việt Nam, kết nối giới trẻ với trang sách và đồng hành giải quyết các rào cản thời đại số.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#6B635A]">
              <Compass size={14} className="text-[#B56D4F]" />
              <span>Khởi nguồn từ khảo sát thực tế · Đồng hành cùng bạn đọc trẻ</span>
            </div>

            {/* Nhóm tác giả & Liên kết Về chúng mình */}
            <div className="mt-5 pt-4 border-t border-[#D6CDBF]/70 w-full max-w-sm flex items-center justify-between text-xs text-[#6B635A]">
              <span>Dự án bởi Nhóm An Toàn Thông Tin</span>
              <button
                onClick={() => handleNav('about')}
                className="text-xs font-semibold text-[#B56D4F] hover:underline cursor-pointer"
              >
                Về chúng mình →
              </button>
            </div>
          </div>

          {/* Col 2: Menu nhanh */}
          <div className="flex flex-col">
            <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-4">
              Khám phá nhanh
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((item) => {
                const isActive = item.id === currentPage;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNav(item.id)}
                      className={`text-[15px] transition-colors flex items-center gap-2 group cursor-pointer ${
                        isActive
                          ? 'text-[#B56D4F] font-bold'
                          : 'text-[#3A3530] hover:text-[#B56D4F]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive
                            ? 'bg-[#B56D4F]'
                            : 'bg-[#B56D4F]/40 group-hover:bg-[#B56D4F]'
                        }`}
                      />
                      <span>
                        {item.label}
                        {isActive && <span className="ml-1 text-xs text-[#B56D4F]/70 font-normal">(Đang xem)</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
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
