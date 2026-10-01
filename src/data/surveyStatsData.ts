export interface SurveyStatsData {
  totalParticipants: number;
  ageGroup: {
    'under-18': number;
    '18-22': number;
    '23-30': number;
    'above-30': number;
  };
  booksPerYear: {
    'under-2': number;
    '2-5': number;
    '6-12': number;
    'above-12': number;
  };
  readingFormats: Record<string, number>;
  favoriteGenres: Record<string, number>;
  readingMotivations: Record<string, number>;
  readingBarriers: Record<string, number>;
  buyingHabits: Record<string, number>;
  readingEnvironments: Record<string, number>;
}

export const INITIAL_SURVEY_STATS: SurveyStatsData = {
  totalParticipants: 0,
  ageGroup: {
    'under-18': 0,
    '18-22': 0,
    '23-30': 0,
    'above-30': 0,
  },
  booksPerYear: {
    'under-2': 0,
    '2-5': 0,
    '6-12': 0,
    'above-12': 0,
  },
  readingFormats: {
    'Sách giấy truyền thống': 0,
    'Máy đọc sách chuyên dụng (Kindle, Kobo)': 0,
    'Điện thoại / Máy tính bảng': 0,
    'Sách nói (Audiobook qua Voiz FM, Fonos...)': 0,
    'Tóm tắt sách qua video / podcast': 0,
  },
  favoriteGenres: {
    'Self-help / Phát triển bản thân': 0,
    'Chữa lành / Tâm lý': 0,
    'Tiểu thuyết (ngôn tình, trinh thám, fantasy…)': 0,
    'Truyện tranh / Manga / Light novel': 0,
    'Kinh tế / Khởi nghiệp / Tài chính': 0,
    'Lịch sử / Hồi ký / Tự truyện': 0,
  },
  readingMotivations: {
    'Chữa lành, tìm sự cân bằng cảm xúc nội tâm': 0,
    'Học kỹ năng mới, nâng cao kiến thức nghề nghiệp': 0,
    'Giải trí, thư giãn đầu óc sau giờ căng thẳng': 0,
    'Theo trend từ TikTok, Instagram, bạn bè giới thiệu': 0,
  },
  readingBarriers: {
    'Không có thời gian do lịch học tập, công việc dày đặc': 0,
    'Nghiện mạng xã hội, game, video ngắn lướt vô thức': 0,
    'Không biết chọn cuốn sách nào phù hợp với bản thân': 0,
    'Cảm thấy “khó vào”, dễ buồn ngủ sau vài trang đầu': 0,
  },
  buyingHabits: {
    'Mua sách mới tại nhà sách/online': 0,
    'Mua sách cũ/second-hand': 0,
    'Mượn từ thư viện/bạn bè': 0,
    'Đọc bản free/lậu trên mạng': 0,
    'Thuê sách theo tháng (app)': 0,
  },
  readingEnvironments: {
    'Tại nhà (phòng ngủ, ban công)': 0,
    'Quán cà phê yên tĩnh': 0,
    'Trên phương tiện công cộng (bus, tàu)': 0,
    'Thư viện/không gian học tập': 0,
    'Giờ nghỉ giải lao tại trường/chỗ làm': 0,
  },
};
