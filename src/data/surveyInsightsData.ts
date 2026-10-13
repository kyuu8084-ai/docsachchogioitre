export interface InsightSocialNote {
  id: string;
  noteNumber: string;
  title: string;
  subtitle: string;
  socialIssue: string;
  socialIssueCategory: 'mental-health' | 'career-anxiety' | 'critical-thinking' | 'community' | 'cultural-identity' | 'knowledge-equity';
  socialIssueBadge: string;
  surveyEvidence: {
    questionRef: string;
    statistic: string;
    interpretation: string;
  };
  analysis: {
    problemContext: string;
    readingCorrelation: string;
    sociologicalDepth: string;
  };
  takeaway: {
    quote: string;
    quoteAuthor?: string;
    actionableAdvice: string;
  };
  image: {
    url: string;
    alt: string;
    caption: string;
    tag: string;
  };
  colorTheme: {
    tapeColor: string;
    badgeBg: string;
    badgeText: string;
    accentColor: string;
  };
  relatedPage?: 'reading-habits' | 'library' | 'genres';
  relatedPageLabel?: string;
  suggestedBooks?: {
    title: string;
    author: string;
    whyRelevant: string;
  }[];
}

export const SURVEY_INSIGHTS_NOTES: InsightSocialNote[] = [
  {
    id: 'insight-mental-health',
    noteNumber: '01',
    title: 'Sức Khỏe Tinh Thần & Liệu Pháp Trang Sách Giữa Cơn Bão Số',
    subtitle: 'Nỗi lo âu, quá tải dopamine từ video ngắn và sự trở lại của "Bibliotherapy" (Chữa lành qua trang sách)',
    socialIssue: 'Sức Khỏe Tinh Thần & Hội Chứng Kiệt Sức Số (Digital Burnout)',
    socialIssueCategory: 'mental-health',
    socialIssueBadge: 'Tâm lý học & Sức khỏe tinh thần',
    surveyEvidence: {
      questionRef: 'Câu 07 (Gu sách) & Câu 09 (Rào cản) & Câu 04 (Thời điểm đọc)',
      statistic: '43% chọn Tâm lý học · 66% xao nhãng bởi điện thoại · 18% đọc trước khi ngủ',
      interpretation: 'Sách tâm lý học đứng vị trí top 3 thể loại được bạn trẻ tìm đọc nhiều nhất, chứng minh nhu cầu tự chữa lành và thấu hiểu bản thân đang cấp thiết hơn bao giờ hết.',
    },
    analysis: {
      problemContext: 'Giới trẻ hiện đại đang đối mặt với "nạn dịch vô hình" mang tên FOMO (Fear of Missing Out) và kiệt sức nhận thức do thuật toán mạng xã hội liên tục bắn phá dopamine kích thích nhanh.',
      readingCorrelation: 'Khảo sát chỉ ra rằng 43% bạn trẻ chủ động tìm đến sách Tâm lý học và 18% duy trì thói quen đọc trước khi ngủ như một nghi thức ngắt kết nối với thế giới ảo. Đọc sách giấy với nhịp điệu tuyến tính hoạt động như một bài thiền động (active meditation), giúp hạ nồng độ cortisol, kéo nhịp tim về trạng thái bình yên và khôi phục nhịp chú ý sâu.',
      sociologicalDepth: 'Khi xã hội ngày càng tăng tốc, hành vi cầm một cuốn sách dày và đọc chậm rãi không còn là hoạt động giải trí đơn thuần; đó là một hành động "phản kháng thầm lặng" trước áp lực phải luôn trực tuyến và hoàn hảo trên mạng xã hội.',
    },
    takeaway: {
      quote: '“Một cuốn sách hay là một cuộc trò chuyện chữa lành với một tâm hồn thông tuệ mà không đòi hỏi bạn phải đeo bất kỳ chiếc mặt nạ nào.”',
      quoteAuthor: 'Ghi chép từ nhóm nghiên cứu Đọc & Trẻ',
      actionableAdvice: 'Dành ra 15 phút "vùng không thiết bị" mỗi tối trước khi ngủ để đọc 1 chương sách văn học hoặc tâm lý học ứng dụng.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
      alt: 'Bạn trẻ đọc sách yên bình bên tách trà ấm',
      caption: 'Tấm khiên chắn bình yên: Mỗi 20 phút đọc trang sách giấy giúp xoa dịu thần kinh sau hàng giờ chìm trong ánh sáng xanh.',
      tag: 'Detox Kỹ Thuật Số',
    },
    colorTheme: {
      tapeColor: '#D97706',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      badgeText: 'text-amber-800',
      accentColor: '#B45309',
    },
    relatedPage: 'reading-habits',
    relatedPageLabel: 'Khám phá bí quyết đọc vi mô 15 phút',
    suggestedBooks: [
      {
        title: 'Những Cuộc Phiêu Lưu Của Tom Sawyer',
        author: 'Mark Twain',
        whyRelevant: 'Liều thuốc tiếng cười hồn nhiên giải tỏa căng thẳng học đường và công sở.',
      },
      {
        title: 'Sách Tâm Lý Học & Chữa Lành',
        author: 'Nhiều tác giả',
        whyRelevant: 'Giúp nhận diện cảm xúc tiêu cực và xây dựng sự vững vàng nội tâm.',
      },
    ],
  },
  {
    id: 'insight-career-anxiety',
    noteNumber: '02',
    title: 'Áp Lực Đồng Trang Lứa & Bất An Trước Kỷ Nguyên Trí Tuệ Nhân Tạo',
    subtitle: 'Hội chứng "Hustle Culture", nỗi sợ tụt hậu kỹ năng và xu hướng đọc để tìm điểm tựa nghề nghiệp',
    socialIssue: 'Áp Lực Đồng Trang Lứa & Bất An Nghề Nghiệp (Career Uncertainty & AI Shift)',
    socialIssueCategory: 'career-anxiety',
    socialIssueBadge: 'Kinh tế & Định hướng tương lai',
    surveyEvidence: {
      questionRef: 'Câu 08 (Động lực chọn sách) & Câu 07 (Gu sách chuyên môn)',
      statistic: '52% chọn sách để phục vụ học tập & công việc · 27% quan tâm Kinh tế, Tài chính',
      interpretation: 'Hơn một nửa bạn trẻ coi sách là đòn bẩy thăng tiến và công cụ trang bị năng lực cạnh tranh trong thị trường lao động biến động.',
    },
    analysis: {
      problemContext: 'Thế hệ Gen Z bước vào ngưỡng cửa lập nghiệp đúng lúc làn sóng AI và kinh tế số tái cấu trúc mọi ngành nghề. Áp lực phải thành công sớm, kiếm nhiều tiền và nỗi sợ bị máy móc thay thế khiến các bạn trẻ rơi vào trạng thái căng thẳng nghề nghiệp trường diễn.',
      readingCorrelation: 'Con số 52% bạn trẻ chọn sách vì mục đích học tập/công việc là minh chứng rõ ràng nhất. Tuy nhiên, khảo sát cũng cho thấy xu hướng đọc đã dịch chuyển: thay vì những cuốn "làm giàu cấp tốc" sáo rỗng, các bạn tìm đọc những tác phẩm tư duy nền tảng, kinh tế vĩ mô và kỹ năng thích ứng linh hoạt.',
      sociologicalDepth: 'Sách cung cấp điều mà các video tóm tắt 3 phút không thể mang lại: sự thấu hiểu về bản chất của các hệ thống phức tạp và năng lực tư duy chiến lược dài hạn – thứ duy nhất AI không thể bắt chước con người.',
    },
    takeaway: {
      quote: '“Đừng đọc chỉ để thu thập mẹo vặt ngắn hạn; hãy đọc để xây dựng một bộ khung nhận thức vững chắc trước mọi biến động thời cuộc.”',
      quoteAuthor: 'Đúc kết từ khảo sát sinh viên 18–23 tuổi',
      actionableAdvice: 'Mỗi tháng, hãy kết hợp đọc 1 cuốn chuyên ngành kỹ thuật với 1 cuốn triết học hoặc nhân văn để mở rộng góc nhìn toàn diện.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
      alt: 'Bàn làm việc với sách chuyên môn, kính mắt và sổ ghi chép',
      caption: 'Tư duy gốc rễ: Trong thời đại thuật toán thay đổi từng tuần, chiều sâu tri thức là chiếc mỏ neo giữ vững sự nghiệp.',
      tag: 'Năng Lực Tương Lai',
    },
    colorTheme: {
      tapeColor: '#2563EB',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      badgeText: 'text-blue-800',
      accentColor: '#1D4ED8',
    },
    relatedPage: 'library',
    relatedPageLabel: 'Xem sách Tư duy & Giáo dục tại Thư viện',
    suggestedBooks: [
      {
        title: 'Bàn Về Khế Ước Xã Hội',
        author: 'Jean-Jacques Rousseau',
        whyRelevant: 'Mở rộng tư duy thể chế, luật pháp và trách nhiệm công dân.',
      },
      {
        title: 'Đôn Ki-hô-tê',
        author: 'Miguel de Cervantes',
        whyRelevant: 'Bài học về giữ đôi chân trên mặt đất trong khi vẫn kiên trì theo đuổi lý tưởng.',
      },
    ],
  },
  {
    id: 'insight-critical-thinking',
    noteNumber: '03',
    title: 'Ô Nhiễm Thông Tin & Khủng Hoảng Năng Lực Tư Duy Phản Biện',
    subtitle: 'Khi não bộ bị "mài mòn" bởi clip 15 giây: Đọc sâu (Deep Reading) là kháng thể duy nhất',
    socialIssue: 'Ô Nhiễm Thông Tin, Tin Giả & Suy Giảm Tập Trung Sâu',
    socialIssueCategory: 'critical-thinking',
    socialIssueBadge: 'Truyền thông & Tư duy phản biện',
    surveyEvidence: {
      questionRef: 'Câu 09 (Thói quen xem video ngắn) & Câu 11 (Tác động MXH)',
      statistic: '41% thích xem video ngắn hơn đọc · 47% bị MXH làm giảm thời gian đọc',
      interpretation: 'Thuật toán video ngắn kích thích trực quan đang cạnh tranh trực tiếp và áp đảo thói quen đọc suy ngẫm của gần một nửa người trẻ.',
    },
    analysis: {
      problemContext: 'Mạng xã hội và thuật toán gợi ý đã tạo ra các "bong bóng thông tin" (filter bubbles) và văn hóa xem lướt. Người trẻ dễ tiếp cận tin tức giật gân nhưng thiếu cơ chế kiểm chứng, dẫn đến khả năng chịu đựng việc đọc các văn bản phức tạp bị suy giảm nghiêm trọng.',
      readingCorrelation: 'Khảo sát ghi nhận 41% bạn trẻ bị video ngắn "hút" thời gian và 22% cảm thấy "đọc nhanh chán" nếu sách không có kích thích liên tục. Tuy nhiên, việc rèn luyện đọc sách giấy chính là giải pháp tái cấu trúc mạng lưới tế bào thần kinh (neuroplasticity), phục hồi khả năng đọc phân tích và tư duy phản biện đa chiều.',
      sociologicalDepth: 'Người biết đọc sâu là người làm chủ sự chú ý của chính mình. Trong một xã hội nơi sự chú ý bị thương mại hóa, khả năng ngồi yên đọc một cuốn sách là một năng lực siêu phàm bảo vệ sự độc lập tư tưởng.',
    },
    takeaway: {
      quote: '“Một xã hội chỉ đọc những dòng tít giật gân là một xã hội dễ bị thao túng. Người đọc sách là người biết đặt câu hỏi ‘Tại sao?’.”',
      quoteAuthor: 'Góc nhìn phản biện xã hội học',
      actionableAdvice: 'Khi gặp một chủ đề nóng trên mạng xã hội, hãy tìm đọc ít nhất 1 bài tiểu luận hoặc 1 chương sách học thuật đối chiếu trước khi đưa ra nhận định.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
      alt: 'Chồng sách nghiên cứu mở trang trong thư viện trầm lắng',
      caption: 'Kháng thể chống tin giả: Đọc sâu rèn luyện năng lực phân định đúng sai giữa đại dương thông tin xáo trộn.',
      tag: 'Tư Duy Độc Lập',
    },
    colorTheme: {
      tapeColor: '#059669',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      badgeText: 'text-emerald-800',
      accentColor: '#047857',
    },
    relatedPage: 'reading-habits',
    relatedPageLabel: 'Học cách xây dựng thói quen đọc sâu',
    suggestedBooks: [
      {
        title: 'Chiến Tranh Tiền Tệ',
        author: 'Song Hongbing',
        whyRelevant: 'Mổ xẻ bản chất vận hành tài chính toàn cầu với cái nhìn đa chiều.',
      },
      {
        title: 'Tội Ác Và Trừng Phạt',
        author: 'Fyodor Dostoevsky',
        whyRelevant: 'Phân tích tâm lý học tội phạm và giằng xé lương tâm sâu sắc nhất mọi thời đại.',
      },
    ],
  },
  {
    id: 'insight-community',
    noteNumber: '04',
    title: 'Khát Vọng Kết Nối Thực Chất Giữa Một Thế Giới Ảo Cô Đơn',
    subtitle: 'Nghịch lý siêu kết nối: Hàng nghìn "bạn bè online" nhưng thiếu vắng tri kỷ đàm đạo sách',
    socialIssue: 'Sự Cô Đơn Thời Đại Số & Khát Khao Cộng Đồng Đồng Điệu',
    socialIssueCategory: 'community',
    socialIssueBadge: 'Cộng đồng & Kết nối con người',
    surveyEvidence: {
      questionRef: 'Câu 08 (Nguồn gợi ý) & Câu 10 (Kỳ vọng giải pháp)',
      statistic: '57% chọn sách qua BookTok/Facebook · 70% đọc nhiều hơn nếu có người gợi ý đúng gu',
      interpretation: 'Nhu cầu kết nối xã hội là động lực số 1 thúc đẩy người trẻ mở sách: họ muốn thảo luận, chia sẻ cảm xúc và tìm kiếm bạn đồng hành.',
    },
    analysis: {
      problemContext: 'Thế hệ trẻ ngày nay kết nối liên tục qua màn hình nhưng lại ghi nhận mức độ cô đơn cao kỷ lục trong các nghiên cứu xã hội học. Những nút "like" và bình luận hời hợt không khỏa lấp được nhu cầu giao tiếp sâu sắc về mặt tinh thần.',
      readingCorrelation: 'Kết quả khảo sát làm sáng tỏ một góc nhìn thú vị: 57% bạn trẻ tìm sách qua các cộng đồng review (BookTok, Book Club trực tuyến) và 70% khẳng định họ sẽ đọc say mê hơn nếu có người gợi ý đúng tâm trạng. Đọc sách không phải là một ốc đảo cô độc; sách chính là "chiếc vé thông hành" để kết nối với những người cùng tần số cảm xúc.',
      sociologicalDepth: 'Văn hóa đọc hiện đại đang chuyển mình từ "độc thoại thầm lặng" sang "đối thoại cộng đồng": người trẻ mượn sách của nhau (28%), cùng đọc chung một tác phẩm kinh điển và tìm thấy sự đồng điệu tâm hồn nơi giảng đường hay quán cà phê sách.',
    },
    takeaway: {
      quote: '“Chúng ta đọc để biết mình không hề đơn độc trên thế giới này.”',
      quoteAuthor: 'C.S. Lewis',
      actionableAdvice: 'Hãy lập một nhóm bạn 3 người để cùng đọc 1 cuốn sách trong tháng và gặp nhau tại một quán cà phê yên tĩnh để trao đổi cảm nhận.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
      alt: 'Nhóm bạn trẻ ngồi trò chuyện ấm áp với sách và cà phê',
      caption: 'Cầu nối tâm hồn: Chia sẻ một trang sách mở ra những cuộc trò chuyện chân thành vượt lên trên những cú chạm màn hình vô cảm.',
      tag: 'Cộng Đồng Tri Âm',
    },
    colorTheme: {
      tapeColor: '#7C3AED',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      badgeText: 'text-purple-800',
      accentColor: '#6D28D9',
    },
    relatedPage: 'genres',
    relatedPageLabel: 'Khám phá các thể loại sách được cộng đồng yêu thích',
    suggestedBooks: [
      {
        title: 'Ba Gã Cùng Thuyền (Chưa Kể Con Chó)',
        author: 'Jerome K. Jerome',
        whyRelevant: 'Tác phẩm trứ danh về tình bạn, những chuyến phiêu lưu hài hước và sự gắn kết.',
      },
      {
        title: 'Hoàng Tử Bé',
        author: 'Antoine de Saint-Exupéry',
        whyRelevant: 'Kiệt tác bất hủ về sự thuần khiết của tình bạn và ý nghĩa của việc “cảm hóa”.',
      },
    ],
  },
  {
    id: 'insight-cultural-identity',
    noteNumber: '05',
    title: 'Định Hình Bản Sắc Cá Nhân & Lòng Trắc Ẩn Trước Các Vấn Đề Nhân Loại',
    subtitle: 'Văn học và tiểu thuyết giúp thế hệ Gen Z hiểu mình, hiểu người và thấu cảm xã hội',
    socialIssue: 'Bản Sắc Văn Hóa, Sự Đa Dạng & Trách Nhiệm Xã Hội',
    socialIssueCategory: 'cultural-identity',
    socialIssueBadge: 'Văn hóa, Nhân văn & Bản sắc',
    surveyEvidence: {
      questionRef: 'Câu 07 (Gu thể loại yêu thích)',
      statistic: '51% Manga/Light novel · 46% Tiểu thuyết văn học · 28% Lịch sử văn hóa',
      interpretation: 'Sự yêu thích đồng thời giữa văn hóa đương đại (Manga) và chiều sâu cổ điển (Tiểu thuyết, Lịch sử) phản ánh khát vọng khám phá đa chiều của người trẻ.',
    },
    analysis: {
      problemContext: 'Trong kỷ nguyên toàn cầu hóa phẳng lì, giới trẻ vừa muốn hòa nhập với thế giới nhưng vừa ráo riết đi tìm câu trả lời cho câu hỏi: "Tôi là ai?", "Cội nguồn của tôi ở đâu?" và "Tôi có trách nhiệm gì với những bất công xung quanh?".',
      readingCorrelation: 'Với 46% yêu thích tiểu thuyết và 28% đam mê lịch sử/văn hóa, các trang sách cung cấp trải nghiệm sống gián tiếp phong phú nhất. Các nghiên cứu thần kinh học chứng minh: đọc tiểu thuyết kích hoạt cùng vùng não xử lý sự thấu cảm trong đời thực, giúp người trẻ đồng cảm với những số phận nghèo khó, khác biệt giới tính hay sắc tộc.',
      sociologicalDepth: 'Người trẻ đọc sách không chỉ để tiêu khiển; họ tìm kiếm căn tính đạo đức và cảm hứng hành động vì môi trường, sự công bằng xã hội và gìn giữ di sản văn hóa dân tộc.',
    },
    takeaway: {
      quote: '“Đọc văn học là cách duy nhất để ta có thể sống thêm hàng trăm cuộc đời khác và thấu hiểu nỗi đau của nhân loại.”',
      quoteAuthor: 'Góc nhìn nhân văn Đọc & Trẻ',
      actionableAdvice: 'Mỗi quý hãy chọn đọc 1 tác phẩm văn học Việt Nam kinh điển để thấu cảm sâu sắc hơn về cội nguồn và dòng chảy văn hóa nước nhà.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      alt: 'Trang sách nghệ thuật mở ra không gian giàu chất thơ',
      caption: 'Nuôi dưỡng lòng trắc ẩn: Văn chương đưa ta bước vào tâm tư của người khác, bồi đắp nhân cách và tình yêu thương con người.',
      tag: 'Căn Tính & Trắc Ẩn',
    },
    colorTheme: {
      tapeColor: '#DB2777',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      badgeText: 'text-rose-800',
      accentColor: '#BE185D',
    },
    relatedPage: 'genres',
    relatedPageLabel: 'Xem chuyên đề 6 thể loại sách hot',
    suggestedBooks: [
      {
        title: 'Những Người Khốn Khổ',
        author: 'Victor Hugo',
        whyRelevant: 'Bản hùng ca vĩ đại về tình thương, lòng trắc ẩn và công lý xã hội.',
      },
      {
        title: 'Số Đỏ',
        author: 'Vũ Trọng Phụng',
        whyRelevant: 'Kiệt tác hiện thực phê phán sắc bén về sự tha hóa xã hội thời kỳ Âu hóa.',
      },
    ],
  },
  {
    id: 'insight-knowledge-equity',
    noteNumber: '06',
    title: 'Bình Đẳng Tiếp Cận Tri Thức & Bài Toán Chi Phí Sách Cho Sinh Viên',
    subtitle: 'Khi sách trở thành "xa xỉ phẩm" đối với người trẻ: Lời hiệu triệu cho số hóa thư viện mở',
    socialIssue: 'Bình Đẳng Giáo Dục, Rào Cản Kinh Tế & Bản Quyền Số',
    socialIssueCategory: 'knowledge-equity',
    socialIssueBadge: 'Kinh tế tri thức & Giáo dục mở',
    surveyEvidence: {
      questionRef: 'Câu 06 (Nguồn sách) & Câu 09 (Giá sách) & Câu 10 (Sách giá rẻ)',
      statistic: '75% đọc online miễn phí · 43% rào cản giá sách đắt · 36% cần sách giá rẻ',
      interpretation: 'Rào cản kinh tế là một sự thật trần trụi: 3/4 người trẻ phụ thuộc vào nguồn tài nguyên mạng miễn phí vì mức chi phí sách giấy vượt quá ngân sách sinh viên.',
    },
    analysis: {
      problemContext: 'Với mức giá trung bình 120.000đ – 250.000đ cho một cuốn sách dịch bìa mềm có bản quyền, mua sách là một khoản chi đáng kể so với tiền sinh hoạt phí hàng tháng của phần lớn sinh viên và học sinh Việt Nam.',
      readingCorrelation: 'Số liệu 75% bạn đọc tìm kiếm nguồn sách miễn phí và 43% xếp "Sách đắt" vào nhóm rào cản lớn nhất đã giải mã nghịch lý: người trẻ không hề thờ ơ với sách, nhưng ví tiền của họ chưa cho phép mua sắm thoải mái. Điều này dẫn đến nguy cơ sách lậu, sách scan chất lượng kém hoặc việc đọc bị đứt đoạn.',
      sociologicalDepth: 'Bình đẳng tri thức là tiền đề của một xã hội tiến bộ. Đây chính là lý do dự án website **Đọc & Trẻ** ra đời: xây dựng thư viện chọn lọc các tác phẩm kinh điển công cộng (public domain) hoàn toàn miễn phí, có bản quyền mở, giúp mọi người trẻ đều bình đẳng tiếp cận chân trời tri thức bất kể điều kiện kinh tế.',
    },
    takeaway: {
      quote: '“Tri thức phải là ánh sáng chan hòa cho mọi mái nhà, không bao giờ được phép là một đặc quyền kinh tế khép kín.”',
      quoteAuthor: 'Tuyên ngôn dự án Đọc & Trẻ',
      actionableAdvice: 'Tận dụng các nguồn sách mở hợp pháp, mượn thư viện trường học và tham gia các hội sách cũ để tiếp cận tri thức chất lượng với chi phí tối thiểu.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
      alt: 'Thư viện đại học rộng lớn ngập tràn ánh sáng và sách mở',
      caption: 'Tri thức cho muôn người: Không một bạn trẻ nào bị bỏ lại phía sau vì rào cản tài chính trên hành trình khai mở tư duy.',
      tag: 'Bình Đẳng Tri Thức',
    },
    colorTheme: {
      tapeColor: '#B56D4F',
      badgeBg: 'bg-amber-100 text-[#B56D4F] border-[#B56D4F]/30',
      badgeText: 'text-[#B56D4F]',
      accentColor: '#9A5A3F',
    },
    relatedPage: 'library',
    relatedPageLabel: 'Đến Thư viện sách số miễn phí 100%',
    suggestedBooks: [
      {
        title: 'Tủ Sách Văn Học Kinh Điển Miễn Phí',
        author: 'Nhiều danh hào thế giới',
        whyRelevant: 'Toàn bộ đều có thể đọc online ngay lập tức trên website mà không tốn bất kỳ chi phí nào.',
      },
      {
        title: 'Sách Kỹ Năng & Giáo Dục Mở',
        author: 'Đọc & Trẻ tuyển chọn',
        whyRelevant: 'Đầy đủ tóm tắt giá trị giáo dục, bài học thực tiễn và liên kết đọc trực tiếp.',
      },
    ],
  },
];
