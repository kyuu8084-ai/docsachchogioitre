export interface SurveyQuestionOption {
  label: string;
  count: number;
  percent: number;
  color?: string;
}

export interface CoreChartAnalysis {
  number: number;
  id: string;
  title: string;
  question: string;
  fullAnalysis: string;
  summaryQuote: string;
  badge: string;
  statChips: { label: string; value: string; color: string }[];
}

export interface SurveyQuestionItem {
  id: string;
  number: number;
  question: string;
  type: 'pie' | 'bar';
  totalResponses: number;
  category: 'demographics' | 'habits' | 'preferences' | 'barriers';
  categoryLabel: string;
  options: SurveyQuestionOption[];
  commentary: {
    highlight: string;
    analysis: string;
    takeaway: string;
    specificInsight?: string;
  };
  specificChartAnalysis?: {
    chartTitle: string;
    analysis: string;
    keyStats: { label: string; value: string }[];
  };
}

export const CORE_6_CHARTS_ANALYSIS: CoreChartAnalysis[] = [
  {
    number: 1,
    id: 'q5-format',
    title: '1. Hình thức đọc sách',
    question: 'Bạn đọc sách bằng hình thức nào?',
    badge: 'Đọc song song đa hình thức',
    summaryQuote: 'Truyện online (32,3%) và sách giấy (31,2%) gần như ngang nhau, chỉ chênh 1,1 điểm phần trăm.',
    fullAnalysis: 'Truyện online (32,3%) và sách giấy (31,2%) gần như ngang nhau, chỉ chênh 1,1 điểm phần trăm. Giới trẻ không bỏ hẳn sách giấy mà đọc song song nhiều hình thức. Ebook thấp nhất (14,5%), cho thấy ebook chưa phổ biến bằng truyện online.',
    statChips: [
      { label: 'Truyện online', value: '32,3%', color: '#5B50E5' },
      { label: 'Sách giấy', value: '31,2%', color: '#B56D4F' },
      { label: 'Ebook', value: '14,5%', color: '#2563EB' },
      { label: 'Chênh lệch', value: '1,1%', color: '#059669' },
    ]
  },
  {
    number: 2,
    id: 'q7-genres',
    title: '2. Thể loại quan tâm',
    question: 'Thể loại sách mà bạn quan tâm?',
    badge: 'Giải trí 57% · Kỹ năng 43%',
    summaryQuote: 'Phân bố khá đều từ 9,1% đến 17,2%, không thể loại nào áp đảo. Manga dẫn đầu (17,2%).',
    fullAnalysis: 'Phân bố khá đều, từ 9,1% đến 17,2%, không thể loại nào áp đảo. Manga, light novel, truyện tranh đứng đầu (17,2%), tiếp theo là tiểu thuyết văn học (15,5%) và tâm lý học (14,5%). Nhóm giải trí (manga, tiểu thuyết, viễn tưởng, ngôn tình) chiếm khoảng 57% tổng lượt chọn, còn nhóm kiến thức và kỹ năng (tâm lý, self-help, lịch sử, kinh tế) khoảng 43%.',
    statChips: [
      { label: 'Manga / Light novel', value: '17,2%', color: '#5B50E5' },
      { label: 'Tiểu thuyết văn học', value: '15,5%', color: '#B56D4F' },
      { label: 'Tâm lý học', value: '14,5%', color: '#059669' },
      { label: 'Nhóm giải trí', value: '~57%', color: '#DB2777' },
      { label: 'Nhóm kiến thức/kỹ năng', value: '~43%', color: '#D97706' },
    ]
  },
  {
    number: 3,
    id: 'q8-decision-factors',
    title: '3. Điều khiến chọn một cuốn sách',
    question: 'Điều gì khiến bạn chọn một cuốn sách?',
    badge: 'Review MXH & Ảnh hưởng cộng đồng',
    summaryQuote: 'Review trên TikTok, Facebook, YouTube dẫn đầu (21,5%). Bìa đẹp (16,2%) cao hơn tên tác giả.',
    fullAnalysis: 'Review trên TikTok, Facebook, YouTube dẫn đầu (21,5%), sát theo là nội dung phục vụ học tập, công việc (19,6%). Bìa đẹp (16,2%) còn cao hơn tên tác giả (10,0%) và việc được chuyển thể thành phim (8,1%). Riêng review mạng và bạn bè giới thiệu cộng lại đã chiếm 33,8%, tức việc chọn sách chịu ảnh hưởng nhiều từ người khác.',
    statChips: [
      { label: 'Review MXH', value: '21,5%', color: '#5B50E5' },
      { label: 'Học tập / Công việc', value: '19,6%', color: '#B56D4F' },
      { label: 'Bìa đẹp visual', value: '16,2%', color: '#DB2777' },
      { label: 'Tên tác giả', value: '10,0%', color: '#2563EB' },
      { label: 'Review + Bạn bè', value: '33,8%', color: '#059669' },
    ]
  },
  {
    number: 4,
    id: 'q6-source',
    title: '4. Nguồn lấy sách',
    question: 'Bạn thường lấy sách từ đâu?',
    badge: 'Nguồn miễn phí chiếm 76,6%',
    summaryQuote: 'Đọc miễn phí trên mạng chiếm 42,9%, gần gấp đôi mua online (23,4%).',
    fullAnalysis: 'Đọc miễn phí trên mạng chiếm 42,9%, gần gấp đôi mua online (23,4%). Gộp ba nguồn miễn phí (mạng, thư viện, mượn bạn) thì chiếm khoảng 76,6%, chỉ khoảng 23% là bỏ tiền mua. Điều này khớp với việc “sách đắt” nằm trong nhóm rào cản ở biểu đồ 5.',
    statChips: [
      { label: 'Đọc miễn phí online', value: '42,9%', color: '#5B50E5' },
      { label: 'Mua online', value: '23,4%', color: '#B56D4F' },
      { label: 'Tổng 3 nguồn miễn phí', value: '~76,6%', color: '#059669' },
      { label: 'Bỏ tiền mua', value: '~23,4%', color: '#D97706' },
    ]
  },
  {
    number: 5,
    id: 'q9-barriers',
    title: '5. Điều cản đọc nhiều hơn',
    question: 'Điều gì cản bạn đọc nhiều hơn?',
    badge: 'Thiết bị số & Video ngắn 39,1%',
    summaryQuote: 'Dễ bị phân tâm bởi điện thoại là rào cản lớn nhất (24,1%), tiếp theo là thiếu thời gian (20,4%).',
    fullAnalysis: 'Dễ bị phân tâm bởi điện thoại là rào cản lớn nhất (24,1%), sau đó là thiếu thời gian (20,4%). Nếu cộng điện thoại và thích xem video hơn (15,0%) thì nhóm lý do liên quan đến thiết bị số và giải trí video chiếm 39,1%. “Không biết đọc gì” chỉ 4,8%, nghĩa là vấn đề không nằm ở việc thiếu sách để chọn.',
    statChips: [
      { label: 'Phân tâm điện thoại', value: '24,1%', color: '#DC2626' },
      { label: 'Thiếu thời gian', value: '20,4%', color: '#D97706' },
      { label: 'Thích xem video', value: '15,0%', color: '#5B50E5' },
      { label: 'Thiết bị số & Video', value: '39,1%', color: '#7C3AED' },
      { label: 'Không biết đọc gì', value: '4,8%', color: '#2563EB' },
    ]
  },
  {
    number: 6,
    id: 'q10-enablers',
    title: '6. Điều giúp đọc nhiều hơn',
    question: 'Điều gì giúp bạn đọc nhiều hơn?',
    badge: 'Gợi ý đúng gu & Không gian yên tĩnh',
    summaryQuote: 'Có gợi ý đúng gu đứng đầu (36,3%), tiếp theo là không gian đọc yên tĩnh (27,5%).',
    fullAnalysis: 'Có gợi ý đúng gu đứng đầu (36,3%), tiếp theo là có không gian đọc yên tĩnh (27,5%). Hai yếu tố giá rẻ/miễn phí (18,6%) và sách ngắn, dễ đọc (17,6%) thấp hơn. Cái giúp giới trẻ đọc nhiều hơn nghiêng về sự phù hợp cá nhân và môi trường đọc hơn là giá cả hay độ dài',
    statChips: [
      { label: 'Gợi ý đúng gu', value: '36,3%', color: '#059669' },
      { label: 'Không gian yên tĩnh', value: '27,5%', color: '#5B50E5' },
      { label: 'Sách rẻ / Miễn phí', value: '18,6%', color: '#B56D4F' },
      { label: 'Sách ngắn, dễ đọc', value: '17,6%', color: '#D97706' },
    ]
  }
];

export const SURVEY_RESULTS_100: SurveyQuestionItem[] = [
  {
    id: 'q1-age',
    number: 1,
    question: 'Độ tuổi của bạn bao nhiêu?',
    type: 'pie',
    totalResponses: 100,
    category: 'demographics',
    categoryLabel: 'Nhân khẩu học',
    options: [
      { label: 'Từ 18–23 tuổi', count: 82, percent: 82, color: '#DC2626' },
      { label: 'Dưới 18 tuổi', count: 17, percent: 17, color: '#2563EB' },
      { label: 'Trên 26 tuổi', count: 1, percent: 1, color: '#16A34A' },
      { label: 'Từ 23–26 tuổi', count: 0, percent: 0, color: '#F59E0B' },
    ],
    commentary: {
      highlight: '82% người tham gia thuộc nhóm tuổi 18–23 (học sinh cuối cấp, sinh viên đại học).',
      analysis: 'Mẫu khảo sát phản ánh trực diện tiếng nói của thế hệ Gen Z trẻ trung, nhóm đối tượng học sinh, sinh viên năng động, nhạy bén với công nghệ, mạng xã hội và đang trong giai đoạn định hình thế giới quan sâu sắc.',
      takeaway: 'Mọi giải pháp thúc đẩy văn hóa đọc cần phải "nói cùng ngôn ngữ", gần gũi với phong cách và nhịp sống của sinh viên, người trẻ.',
    },
  },
  {
    id: 'q2-frequency',
    number: 2,
    question: 'Bạn đọc sách với tần suất như nào?',
    type: 'pie',
    totalResponses: 100,
    category: 'habits',
    categoryLabel: 'Thói quen & Tần suất',
    options: [
      { label: 'Vài lần 1 tuần', count: 34, percent: 34, color: '#DC2626' },
      { label: 'Rất ít khi đọc', count: 31, percent: 31, color: '#16A34A' },
      { label: 'Vài lần 1 tháng', count: 19, percent: 19, color: '#F59E0B' },
      { label: 'Thường xuyên', count: 16, percent: 16, color: '#2563EB' },
    ],
    commentary: {
      highlight: 'Nhóm duy trì đọc "Vài lần 1 tuần" dẫn đầu với 34%, nhưng có tới 31% bạn trẻ "Rất ít khi đọc".',
      analysis: 'Có sự phân hóa rõ rệt: đúng 50% bạn trẻ duy trì được tần suất đọc thường xuyên hoặc vài lần một tuần. Tuy nhiên, 31% hầu như không chạm vào sách cho thấy rào cản bước đầu còn lớn.',
      takeaway: 'Cần chuyển đổi nhóm 31% "Rất ít khi đọc" bằng cách đơn giản hóa mục tiêu đọc (áp dụng quy tắc 2 phút hoặc đọc từng trích đoạn ngắn mỗi ngày).',
    },
  },
  {
    id: 'q3-duration',
    number: 3,
    question: 'Mỗi lần đọc bạn thường dành bao nhiêu phút?',
    type: 'pie',
    totalResponses: 100,
    category: 'habits',
    categoryLabel: 'Thói quen & Tần suất',
    options: [
      { label: 'Từ 15–30 phút', count: 43, percent: 43, color: '#DC2626' },
      { label: 'Từ 30 phút – 1 giờ', count: 23, percent: 23, color: '#F59E0B' },
      { label: 'Dưới 15 phút', count: 20, percent: 20, color: '#2563EB' },
      { label: 'Trên 1 giờ', count: 14, percent: 14, color: '#16A34A' },
    ],
    commentary: {
      highlight: 'Khung giờ 15–30 phút mỗi lần đọc chiếm ưu thế áp đảo với 43%.',
      analysis: 'Khoảng thời gian 15–30 phút tương đương với phương pháp Pomodoro và khả năng duy trì tập trung tự nhiên của não bộ trước khi bị phân tán. Chỉ 14% độc giả có thể đọc liên tục trên 60 phút.',
      takeaway: 'Các ấn phẩm, ứng dụng hoặc thử thách đọc nên thiết kế lộ trình đọc ngắn (micro-reading) 15–20 phút để người trẻ dễ dàng tích lũy từng chương mỗi ngày mà không bị quá tải.',
    },
  },
  {
    id: 'q4-time-of-day',
    number: 4,
    question: 'Bạn thường đọc sách vào thời gian nào?',
    type: 'pie',
    totalResponses: 100,
    category: 'habits',
    categoryLabel: 'Thói quen & Tần suất',
    options: [
      { label: 'Không cố định', count: 67, percent: 67, color: '#16A34A' },
      { label: 'Trước khi ngủ', count: 18, percent: 18, color: '#DC2626' },
      { label: 'Cuối tuần', count: 8, percent: 8, color: '#F59E0B' },
      { label: 'Giờ nghỉ trưa', count: 7, percent: 7, color: '#2563EB' },
    ],
    commentary: {
      highlight: '67% bạn trẻ đọc vào thời gian "Không cố định", đọc theo ngẫu hứng hoặc khoảng trống lịch trình.',
      analysis: 'Việc đọc chưa được đưa vào thời gian biểu cố định của 2/3 người tham gia; họ đọc khi thấy hứng thú, khi rảnh rỗi hoặc khi vô tình bắt gặp nội dung hay. Khung giờ trước khi ngủ (18%) là thời điểm ổn định thứ hai, dùng để thư giãn và tránh xa ánh sáng xanh.',
      takeaway: 'Khuyến khích gắn hành vi đọc vào một "mỏ neo thói quen" cụ thể (ví dụ: ngay sau khi đánh răng buổi tối hoặc 10 phút sau bữa trưa) để biến việc đọc ngẫu hứng thành phản xạ tự nhiên.',
    },
  },
  {
    id: 'q5-format',
    number: 5,
    question: 'Bạn đọc sách bằng hình thức nào?',
    type: 'bar',
    totalResponses: 100,
    category: 'preferences',
    categoryLabel: 'Hình thức & Sở thích',
    options: [
      { label: 'Truyện online', count: 32.3, percent: 32.3, color: '#5B50E5' },
      { label: 'Sách giấy', count: 31.2, percent: 31.2, color: '#5B50E5' },
      { label: 'Truyện tranh', count: 22.0, percent: 22.0, color: '#5B50E5' },
      { label: 'Ebook', count: 14.5, percent: 14.5, color: '#5B50E5' },
    ],
    commentary: {
      highlight: 'Truyện online (32,3%) và sách giấy (31,2%) gần như ngang nhau, chỉ chênh 1,1 điểm phần trăm.',
      analysis: 'Truyện online (32,3%) và sách giấy (31,2%) gần như ngang nhau, chỉ chênh 1,1 điểm phần trăm. Giới trẻ không bỏ hẳn sách giấy mà đọc song song nhiều hình thức. Ebook thấp nhất (14,5%), cho thấy ebook chưa phổ biến bằng truyện online.',
      takeaway: 'Đừng đối đầu sách giấy với nội dung số; hãy kết hợp hệ sinh thái đa kênh (đọc thử chương đầu online, mua sách giấy bản quyền để sưu tầm và lưu giữ).',
      specificInsight: '1. Hình thức đọc sách: Truyện online (32,3%) và sách giấy (31,2%) gần như ngang nhau, chỉ chênh 1,1 điểm phần trăm. Giới trẻ không bỏ hẳn sách giấy mà đọc song song nhiều hình thức. Ebook thấp nhất (14,5%), cho thấy ebook chưa phổ biến bằng truyện online.'
    },
    specificChartAnalysis: {
      chartTitle: '1. Hình thức đọc sách',
      analysis: 'Truyện online (32,3%) và sách giấy (31,2%) gần như ngang nhau, chỉ chênh 1,1 điểm phần trăm. Giới trẻ không bỏ hẳn sách giấy mà đọc song song nhiều hình thức. Ebook thấp nhất (14,5%), cho thấy ebook chưa phổ biến bằng truyện online.',
      keyStats: [
        { label: 'Truyện online', value: '32,3%' },
        { label: 'Sách giấy', value: '31,2%' },
        { label: 'Chênh lệch', value: '1,1%' },
        { label: 'Ebook', value: '14,5%' }
      ]
    }
  },
  {
    id: 'q6-source',
    number: 6,
    question: 'Bạn thường lấy sách từ đâu?',
    type: 'bar',
    totalResponses: 100,
    category: 'preferences',
    categoryLabel: 'Hình thức & Nguồn sách',
    options: [
      { label: 'Đọc miễn phí trên mạng', count: 42.9, percent: 42.9, color: '#5B50E5' },
      { label: 'Mua online', count: 23.4, percent: 23.4, color: '#5B50E5' },
      { label: 'Mượn thư viện', count: 17.7, percent: 17.7, color: '#5B50E5' },
      { label: 'Mượn bạn', count: 16.0, percent: 16.0, color: '#5B50E5' },
    ],
    commentary: {
      highlight: 'Đọc miễn phí trên mạng chiếm 42,9%, gần gấp đôi mua online (23,4%). Ba nguồn miễn phí chiếm 76,6%.',
      analysis: 'Đọc miễn phí trên mạng chiếm 42,9%, gần gấp đôi mua online (23,4%). Gộp ba nguồn miễn phí (mạng, thư viện, mượn bạn) thì chiếm khoảng 76,6%, chỉ khoảng 23% là bỏ tiền mua. Điều này khớp với việc “sách đắt” nằm trong nhóm rào cản ở biểu đồ 5.',
      takeaway: 'Cần xây dựng các kho sách số hợp pháp, miễn phí chất lượng cao (như thư viện trường học số hóa) để định hướng nguồn đọc chuẩn xác cho bạn đọc trẻ.',
      specificInsight: '4. Nguồn lấy sách: Đọc miễn phí trên mạng chiếm 42,9%, gần gấp đôi mua online (23,4%). Gộp ba nguồn miễn phí (mạng, thư viện, mượn bạn) thì chiếm khoảng 76,6%, chỉ khoảng 23% là bỏ tiền mua. Điều này khớp với việc “sách đắt” nằm trong nhóm rào cản ở biểu đồ 5.'
    },
    specificChartAnalysis: {
      chartTitle: '4. Nguồn lấy sách',
      analysis: 'Đọc miễn phí trên mạng chiếm 42,9%, gần gấp đôi mua online (23,4%). Gộp ba nguồn miễn phí (mạng, thư viện, mượn bạn) thì chiếm khoảng 76,6%, chỉ khoảng 23% là bỏ tiền mua. Điều này khớp với việc “sách đắt” nằm trong nhóm rào cản ở biểu đồ 5.',
      keyStats: [
        { label: 'Đọc miễn phí trên mạng', value: '42,9%' },
        { label: 'Mua online', value: '23,4%' },
        { label: '3 nguồn miễn phí', value: '76,6%' },
        { label: 'Bỏ tiền mua', value: '~23%' }
      ]
    }
  },
  {
    id: 'q7-genres',
    number: 7,
    question: 'Thể loại sách mà bạn quan tâm?',
    type: 'bar',
    totalResponses: 100,
    category: 'preferences',
    categoryLabel: 'Gu sách & Thể loại',
    options: [
      { label: 'Manga, light novel, truyện tranh', count: 17.2, percent: 17.2, color: '#5B50E5' },
      { label: 'Tiểu thuyết văn học', count: 15.5, percent: 15.5, color: '#5B50E5' },
      { label: 'Tâm lý học', count: 14.5, percent: 14.5, color: '#5B50E5' },
      { label: 'Khoa học viễn tưởng', count: 13.9, percent: 13.9, color: '#5B50E5' },
      { label: 'Ngôn tình lãng mạn', count: 10.5, percent: 10.5, color: '#5B50E5' },
      { label: 'Self-help, phát triển bản thân', count: 9.8, percent: 9.8, color: '#5B50E5' },
      { label: 'Lịch sử, văn hóa', count: 9.5, percent: 9.5, color: '#5B50E5' },
      { label: 'Kinh tế, tài chính, kinh doanh', count: 9.1, percent: 9.1, color: '#5B50E5' },
    ],
    commentary: {
      highlight: 'Phân bố khá đều (9,1% - 17,2%). Manga dẫn đầu (17,2%), Nhóm giải trí chiếm 57%, Nhóm kiến thức chiếm 43%.',
      analysis: 'Phân bố khá đều, từ 9,1% đến 17,2%, không thể loại nào áp đảo. Manga, light novel, truyện tranh đứng đầu (17,2%), tiếp theo là tiểu thuyết văn học (15,5%) và tâm lý học (14,5%). Nhóm giải trí (manga, tiểu thuyết, viễn tưởng, ngôn tình) chiếm khoảng 57% tổng lượt chọn, còn nhóm kiến thức và kỹ năng (tâm lý, self-help, lịch sử, kinh tế) khoảng 43%.',
      takeaway: 'Thư viện và các nhà xuất bản nên cân đối cả 2 nhánh: tuyển chọn các tác phẩm giải trí giàu chiều sâu lẫn các sách tâm lý học, kỹ năng ứng dụng gần gũi.',
      specificInsight: '2. Thể loại quan tâm: Phân bố khá đều, từ 9,1% đến 17,2%, không thể loại nào áp đảo. Manga, light novel, truyện tranh đứng đầu (17,2%), tiếp theo là tiểu thuyết văn học (15,5%) và tâm lý học (14,5%). Nhóm giải trí (manga, tiểu thuyết, viễn tưởng, ngôn tình) chiếm khoảng 57% tổng lượt chọn, còn nhóm kiến thức và kỹ năng (tâm lý, self-help, lịch sử, kinh tế) khoảng 43%.'
    },
    specificChartAnalysis: {
      chartTitle: '2. Thể loại quan tâm',
      analysis: 'Phân bố khá đều, từ 9,1% đến 17,2%, không thể loại nào áp đảo. Manga, light novel, truyện tranh đứng đầu (17,2%), tiếp theo là tiểu thuyết văn học (15,5%) và tâm lý học (14,5%). Nhóm giải trí (manga, tiểu thuyết, viễn tưởng, ngôn tình) chiếm khoảng 57% tổng lượt chọn, còn nhóm kiến thức và kỹ năng (tâm lý, self-help, lịch sử, kinh tế) khoảng 43%.',
      keyStats: [
        { label: 'Manga/Light novel', value: '17,2%' },
        { label: 'Tiểu thuyết văn học', value: '15,5%' },
        { label: 'Tâm lý học', value: '14,5%' },
        { label: 'Nhóm giải trí', value: '~57%' },
        { label: 'Nhóm kỹ năng', value: '~43%' }
      ]
    }
  },
  {
    id: 'q8-decision-factors',
    number: 8,
    question: 'Điều khiến bạn chọn một cuốn sách',
    type: 'bar',
    totalResponses: 100,
    category: 'preferences',
    categoryLabel: 'Động lực chọn sách',
    options: [
      { label: 'Review trên TikTok, Facebook, YouTube', count: 21.5, percent: 21.5, color: '#5B50E5' },
      { label: 'Nội dung phục vụ học tập, công việc', count: 19.6, percent: 19.6, color: '#5B50E5' },
      { label: 'Bìa đẹp', count: 16.2, percent: 16.2, color: '#5B50E5' },
      { label: 'Sách đang hot, bán chạy', count: 12.3, percent: 12.3, color: '#5B50E5' },
      { label: 'Bạn bè giới thiệu', count: 12.3, percent: 12.3, color: '#5B50E5' },
      { label: 'Tên tác giả', count: 10.0, percent: 10.0, color: '#5B50E5' },
      { label: 'Được chuyển thể thành phim', count: 8.1, percent: 8.1, color: '#5B50E5' },
    ],
    commentary: {
      highlight: 'Review trên MXH dẫn đầu (21,5%), sát theo là nội dung học tập/công việc (19,6%). Bìa đẹp (16,2%) cao hơn tên tác giả.',
      analysis: 'Review trên TikTok, Facebook, YouTube dẫn đầu (21,5%), sát theo là nội dung phục vụ học tập, công việc (19,6%). Bìa đẹp (16,2%) còn cao hơn tên tác giả (10,0%) và việc được chuyển thể thành phim (8,1%). Riêng review mạng và bạn bè giới thiệu cộng lại đã chiếm 33,8%, tức việc chọn sách chịu ảnh hưởng nhiều từ người khác.',
      takeaway: 'Một cuốn sách hay cần được thiết kế bìa thẩm mỹ cao và có chiến lược giới thiệu thông qua các video review ngắn, chân thật trên mạng xã hội.',
      specificInsight: '3. Điều khiến chọn một cuốn sách: Review trên TikTok, Facebook, YouTube dẫn đầu (21,5%), sát theo là nội dung phục vụ học tập, công việc (19,6%). Bìa đẹp (16,2%) còn cao hơn tên tác giả (10,0%) và việc được chuyển thể thành phim (8,1%). Riêng review mạng và bạn bè giới thiệu cộng lại đã chiếm 33,8%, tức việc chọn sách chịu ảnh hưởng nhiều từ người khác.'
    },
    specificChartAnalysis: {
      chartTitle: '3. Điều khiến chọn một cuốn sách',
      analysis: 'Review trên TikTok, Facebook, YouTube dẫn đầu (21,5%), sát theo là nội dung phục vụ học tập, công việc (19,6%). Bìa đẹp (16,2%) còn cao hơn tên tác giả (10,0%) và việc được chuyển thể thành phim (8,1%). Riêng review mạng và bạn bè giới thiệu cộng lại đã chiếm 33,8%, tức việc chọn sách chịu ảnh hưởng nhiều từ người khác.',
      keyStats: [
        { label: 'Review TikTok/FB/YT', value: '21,5%' },
        { label: 'Học tập & công việc', value: '19,6%' },
        { label: 'Bìa đẹp thị giác', value: '16,2%' },
        { label: 'Tên tác giả', value: '10,0%' },
        { label: 'Ảnh hưởng từ người khác', value: '33,8%' }
      ]
    }
  },
  {
    id: 'q9-barriers',
    number: 9,
    question: 'Điều cản bạn đọc nhiều hơn',
    type: 'bar',
    totalResponses: 100,
    category: 'barriers',
    categoryLabel: 'Rào cản đọc sách',
    options: [
      { label: 'Dễ bị phân tâm bởi điện thoại', count: 24.1, percent: 24.1, color: '#5B50E5' },
      { label: 'Thiếu thời gian', count: 20.4, percent: 20.4, color: '#5B50E5' },
      { label: 'Sách đắt', count: 15.7, percent: 15.7, color: '#5B50E5' },
      { label: 'Thích xem video hơn', count: 15.0, percent: 15.0, color: '#5B50E5' },
      { label: 'Không có thói quen', count: 12.0, percent: 12.0, color: '#5B50E5' },
      { label: 'Đọc nhanh chán', count: 8.0, percent: 8.0, color: '#5B50E5' },
      { label: 'Không biết đọc gì', count: 4.8, percent: 4.8, color: '#5B50E5' },
    ],
    commentary: {
      highlight: 'Phân tâm bởi điện thoại là rào cản lớn nhất (24,1%), thiếu thời gian (20,4%). Thiết bị số & video chiếm 39,1%.',
      analysis: 'Dễ bị phân tâm bởi điện thoại là rào cản lớn nhất (24,1%), sau đó là thiếu thời gian (20,4%). Nếu cộng điện thoại và thích xem video hơn (15,0%) thì nhóm lý do liên quan đến thiết bị số và giải trí video chiếm 39,1%. “Không biết đọc gì” chỉ 4,8%, nghĩa là vấn đề không nằm ở việc thiếu sách để chọn.',
      takeaway: 'Vấn đề không phải là thiếu sách; giải pháp là xây dựng thói quen đọc vi mô 15–20 phút và thiết lập vùng cách ly điện thoại để bảo vệ sự tập trung.',
      specificInsight: '5. Điều cản đọc nhiều hơn: Dễ bị phân tâm bởi điện thoại là rào cản lớn nhất (24,1%), sau đó là thiếu thời gian (20,4%). Nếu cộng điện thoại và thích xem video hơn (15,0%) thì nhóm lý do liên quan đến thiết bị số và giải trí video chiếm 39,1%. “Không biết đọc gì” chỉ 4,8%, nghĩa là vấn đề không nằm ở việc thiếu sách để chọn.'
    },
    specificChartAnalysis: {
      chartTitle: '5. Điều cản đọc nhiều hơn',
      analysis: 'Dễ bị phân tâm bởi điện thoại là rào cản lớn nhất (24,1%), sau đó là thiếu thời gian (20,4%). Nếu cộng điện thoại và thích xem video hơn (15,0%) thì nhóm lý do liên quan đến thiết bị số và giải trí video chiếm 39,1%. “Không biết đọc gì” chỉ 4,8%, nghĩa là vấn đề không nằm ở việc thiếu sách để chọn.',
      keyStats: [
        { label: 'Phân tâm điện thoại', value: '24,1%' },
        { label: 'Thiếu thời gian', value: '20,4%' },
        { label: 'Thích xem video', value: '15,0%' },
        { label: 'Nhóm thiết bị số & video', value: '39,1%' },
        { label: 'Không biết đọc gì', value: '4,8%' }
      ]
    }
  },
  {
    id: 'q10-enablers',
    number: 10,
    question: 'Điều giúp bạn đọc nhiều hơn',
    type: 'bar',
    totalResponses: 100,
    category: 'barriers',
    categoryLabel: 'Động lực & Giải pháp',
    options: [
      { label: 'Có gợi ý đúng gu', count: 36.3, percent: 36.3, color: '#5B50E5' },
      { label: 'Có không gian đọc yên tĩnh', count: 27.5, percent: 27.5, color: '#5B50E5' },
      { label: 'Sách rẻ hoặc miễn phí', count: 18.6, percent: 18.6, color: '#5B50E5' },
      { label: 'Sách ngắn, dễ đọc', count: 17.6, percent: 17.6, color: '#5B50E5' },
    ],
    commentary: {
      highlight: 'Có gợi ý đúng gu đứng đầu (36,3%), tiếp theo là không gian đọc yên tĩnh (27,5%). Phù hợp cá nhân quan trọng hơn giá cả.',
      analysis: 'Có gợi ý đúng gu đứng đầu (36,3%), tiếp theo là có không gian đọc yên tĩnh (27,5%). Hai yếu tố giá rẻ/miễn phí (18,6%) và sách ngắn, dễ đọc (17,6%) thấp hơn. Cái giúp giới trẻ đọc nhiều hơn nghiêng về sự phù hợp cá nhân và môi trường đọc hơn là giá cả hay độ dài',
      takeaway: 'Cái giúp giới trẻ đọc nhiều hơn nghiêng về sự phù hợp cá nhân và môi trường đọc hơn là giá cả hay độ dài. Cần đẩy mạnh tính năng gợi ý theo gu và xây dựng không gian đọc truyền cảm hứng.',
      specificInsight: '6. Điều giúp đọc nhiều hơn: Có gợi ý đúng gu đứng đầu (36,3%), tiếp theo là có không gian đọc yên tĩnh (27,5%). Hai yếu tố giá rẻ/miễn phí (18,6%) và sách ngắn, dễ đọc (17,6%) thấp hơn. Cái giúp giới trẻ đọc nhiều hơn nghiêng về sự phù hợp cá nhân và môi trường đọc hơn là giá cả hay độ dài'
    },
    specificChartAnalysis: {
      chartTitle: '6. Điều giúp đọc nhiều hơn',
      analysis: 'Có gợi ý đúng gu đứng đầu (36,3%), tiếp theo là có không gian đọc yên tĩnh (27,5%). Hai yếu tố giá rẻ/miễn phí (18,6%) và sách ngắn, dễ đọc (17,6%) thấp hơn. Cái giúp giới trẻ đọc nhiều hơn nghiêng về sự phù hợp cá nhân và môi trường đọc hơn là giá cả hay độ dài',
      keyStats: [
        { label: 'Gợi ý đúng gu', value: '36,3%' },
        { label: 'Không gian yên tĩnh', value: '27,5%' },
        { label: 'Giá rẻ / miễn phí', value: '18,6%' },
        { label: 'Sách ngắn dễ đọc', value: '17,6%' }
      ]
    }
  },
  {
    id: 'q11-social-media',
    number: 11,
    question: 'Mạng xã hội ảnh hưởng đến việc đọc của bạn thế nào?',
    type: 'pie',
    totalResponses: 100,
    category: 'barriers',
    categoryLabel: 'Tác động Mạng xã hội',
    options: [
      { label: 'Cả hai (vừa biết sách hay vừa đọc ít đi)', count: 47, percent: 47, color: '#F59E0B' },
      { label: 'Giúp mình biết thêm sách hay', count: 24, percent: 24, color: '#2563EB' },
      { label: 'Làm mình đọc ít đi', count: 17, percent: 17, color: '#DC2626' },
      { label: 'Không ảnh hưởng', count: 12, percent: 12, color: '#16A34A' },
    ],
    commentary: {
      highlight: 'Gần một nửa (47%) thừa nhận mạng xã hội vừa mang lại lợi ích giới thiệu sách, vừa gây xao nhãng giảm thời gian đọc.',
      analysis: 'Mạng xã hội là một "mối quan hệ phức tạp" (love-hate relationship) đối với văn hóa đọc: nó là công cụ tìm kiếm sách nhanh nhất (24% thấy tích cực thuần túy), nhưng đồng thời thuật toán giữ chân người dùng liên tục làm họ đọc ít đi (17%).',
      takeaway: 'Bí quyết nằm ở sự chủ động: sử dụng mạng xã hội để "săn" sách hay, sau đó kích hoạt chế độ Không Làm Phiền (Do Not Disturb) để tập trung tận hưởng trọn vẹn cuốn sách đã chọn.',
    },
  },
];
