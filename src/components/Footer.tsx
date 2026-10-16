import { BookOpen, Compass, Heart, ArrowRight } from 'lucide-react';
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
      <footer className="w-full bg-black/90 backdrop-blur-2xl border-t border-white/10 text-[#ededed] font-sans relative z-20 transition-colors duration-300">
        {/* Main Footer Content (Cosmic Dark Glass Mode for About Us) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 lg:gap-16">
            {/* Col 1: Logo, Slogan & Project Identity */}
            <div className="flex flex-col items-start max-w-xl">
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

              <p className="mt-3.5 text-[15px] text-white/70 leading-relaxed font-light">
                Dự án số hóa phát triển từ kết quả khảo sát 100 bạn đọc trẻ Việt Nam, kết nối giới trẻ với trang sách và đồng hành giải quyết các rào cản thời đại số.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                <Compass size={14} className="text-[#c2ba9b] shrink-0" />
                <span>Khởi nguồn từ khảo sát thực tế · Đồng hành cùng bạn đọc trẻ</span>
              </div>

              {/* Nhóm tác giả & Về chúng mình status */}
              <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs text-white/60">
                <span>Dự án bởi Nhóm An Toàn Thông Tin</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#c2ba9b]/15 text-[#c2ba9b] border border-[#c2ba9b]/30 font-sans">
                  Bạn đang ở trang này
                </span>
              </div>
            </div>

            {/* Col 2: Menu điều hướng đối xứng gọn gàng */}
            <div className="flex flex-col md:min-w-[320px] lg:min-w-[380px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h4 className="font-playfair text-lg font-bold text-[#fdfbf6]">
                  Khám phá nhanh
                </h4>
                <span className="text-[11px] uppercase tracking-widest text-[#c2ba9b]/70 font-mono">
                  6 Chuyên mục
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navLinks.map((item) => {
                  const isActive = item.id === currentPage;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`text-[14px] text-left transition-all py-1.5 px-2 rounded-lg flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'text-[#c2ba9b] bg-white/5 font-medium'
                          : 'text-white/75 hover:text-[#c2ba9b] hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#c2ba9b] shadow-[0_0_8px_rgba(194,186,155,0.8)]'
                              : 'bg-white/30 group-hover:bg-[#c2ba9b]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ArrowRight
                        size={12}
                        className={`transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 ${
                          isActive ? 'opacity-80 text-[#c2ba9b]' : 'text-white/40'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="border-t border-white/10 py-5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <div className="w-12 h-[1.5px] bg-[#c2ba9b] mb-3 opacity-60" />
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
      {/* Main Footer Content (Vintage Paper Mode) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 lg:gap-16">
          {/* Col 1: Logo, Slogan & Project Identity */}
          <div className="flex flex-col items-start max-w-xl">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] border border-[#D6CDBF] text-[#B56D4F] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <BookOpen size={22} strokeWidth={2} />
              </div>
              <span className="font-playfair text-2xl font-bold tracking-tight text-[#3A3530]">
                Đọc & Trẻ
              </span>
            </button>

            <p className="mt-3.5 text-[15px] text-[#6B635A] leading-relaxed">
              Dự án số hóa phát triển từ kết quả khảo sát 100 bạn đọc trẻ Việt Nam, kết nối giới trẻ với trang sách và đồng hành giải quyết các rào cản thời đại số.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#6B635A]">
              <Compass size={14} className="text-[#B56D4F] shrink-0" />
              <span>Khởi nguồn từ khảo sát thực tế · Đồng hành cùng bạn đọc trẻ</span>
            </div>

            {/* Nhóm tác giả & Liên kết Về chúng mình */}
            <div className="mt-5 pt-4 border-t border-[#D6CDBF]/70 w-full flex items-center justify-between text-xs text-[#6B635A]">
              <span>Dự án bởi Nhóm An Toàn Thông Tin</span>
              <button
                onClick={() => handleNav('about')}
                className="text-xs font-semibold text-[#B56D4F] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Về chúng mình</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Col 2: Menu điều hướng đối xứng gọn gàng */}
          <div className="flex flex-col md:min-w-[320px] lg:min-w-[380px]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D6CDBF]">
              <h4 className="font-playfair text-lg font-bold text-[#3A3530]">
                Khám phá nhanh
              </h4>
              <span className="text-[11px] uppercase tracking-widest text-[#B56D4F] font-mono font-medium">
                6 Chuyên mục
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {navLinks.map((item) => {
                const isActive = item.id === currentPage;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`text-[14px] text-left transition-all py-1.5 px-2 rounded-lg flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'text-[#B56D4F] font-bold bg-[#D6CDBF]/30'
                        : 'text-[#3A3530] hover:text-[#B56D4F] hover:bg-[#D6CDBF]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#B56D4F]'
                            : 'bg-[#B56D4F]/40 group-hover:bg-[#B56D4F]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ArrowRight
                      size={12}
                      className={`transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 ${
                        isActive ? 'opacity-80 text-[#B56D4F]' : 'text-[#6B635A]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-[#D6CDBF] py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-12 h-[1.5px] bg-[#B56D4F] mb-3 opacity-60" />
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
