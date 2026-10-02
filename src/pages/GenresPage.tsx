import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Landmark, 
  Search, 
  ArrowRight, 
  Quote, 
  X, 
  Check, 
  Bookmark, 
  BookmarkCheck,
  Compass,
  Star,
  ChevronDown,
  Smile,
  GraduationCap,
  Skull,
  Feather,
  SlidersHorizontal,
  Flame,
  Zap,
  Award
} from 'lucide-react';
import VintageSeparator from '../components/VintageSeparator';
import { GenreItem, PageId } from '../types';
import GenreSurveyChart from '../components/GenreSurveyChart';

interface GenresPageProps {
  onNavigate: (page: PageId) => void;
}

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';

export interface SpecializedGenreItem extends GenreItem {
  iconComponent: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  themeColor: string;
  badge: string;
  moods: string[];
  challenge: string;
}

const GENRE_LIST: SpecializedGenreItem[] = [
  {
    id: 'fiction',
    title: 'Fiction / Tiểu thuyết văn học',
    subtitle: 'Kinh điển, trinh thám, kỳ ảo & văn học đương đại',
    category: 'fiction',
    popularRatio: '55% độc giả trẻ đọc thường xuyên',
    description: 'Thế giới muôn màu của những câu chuyện tình cảm sâu lắng, những vụ án cân não hay những cuộc phiêu lưu giả tưởng. Đây là thể loại giữ chân bạn đọc xuyên đêm để theo dõi từng nút thắt.',
    whyYouthLove: 'Nuôi dưỡng trí tưởng tượng phong phú, khả năng đồng cảm sâu rộng với nhiều số phận và là phương tiện thư giãn thuần túy tuyệt vời sau giờ làm việc.',
    iconName: 'BookOpen',
    iconComponent: BookOpen,
    themeColor: '#8C4328', // Rich Terracotta / Rust
    badge: 'Phổ biến nhất',
    moods: ['adventure', 'thoughtful', 'dreamy'],
    challenge: 'Đọc một cuốn tiểu thuyết kinh điển có trên 400 trang trong tháng này.',
    recommendedBooks: [
      {
        title: 'Phía Sau Nghi Can X',
        author: 'Higashino Keigo',
        quote: 'Một bộ óc thiên tài có thể tính toán tất cả, ngoại trừ sự mù quáng thánh thiện của tình yêu.',
      },
      {
        title: 'Rừng Na Uy',
        author: 'Haruki Murakami',
        quote: 'Cái chết không phải là đối nghịch của sự sống, mà là một phần tự nhiên ẩn sâu bên trong nó.',
      },
      {
        title: 'Cánh Đồng Bất Tận',
        author: 'Nguyễn Ngọc Tư',
        quote: 'Người ta đi qua nỗi đau như đi qua một khúc sông mùa cạn, bùn lầy bám chặt nhưng cỏ non vẫn mọc.',
      },
    ],
  },
  {
    id: 'self-help',
    title: 'Self-help / Phát triển bản thân',
    subtitle: 'Nâng cấp kỹ năng sống, tư duy & thói quen tích cực',
    category: 'self-help',
    popularRatio: '46% độc giả trẻ bình chọn định hình lối sống',
    description: 'Dòng sách luôn dẫn đầu doanh số tại các nhà sách hiện đại. Giới trẻ tìm đọc để xây dựng kỷ luật bản thân, quản lý thời gian, rèn luyện sự tập trung và kiến tạo lối sống hiệu quả.',
    whyYouthLove: 'Gen Z phải đối mặt với áp lực cạnh tranh nghề nghiệp và cảm giác FOMO, do đó nhu cầu tối ưu hóa bản thân và phát triển kỹ năng mềm là ưu tiên hàng đầu.',
    iconName: 'Sparkles',
    iconComponent: Sparkles,
    themeColor: '#B56D4F', // Warm ochre clay
    badge: 'Bestseller',
    moods: ['productive', 'confused', 'energetic'],
    challenge: 'Áp dụng một phương pháp từ sách vào thực tế cuộc sống trong ít nhất 7 ngày.',
    recommendedBooks: [
      {
        title: 'Atomic Habits (Thay Đổi Tí Hon)',
        author: 'James Clear',
        quote: 'Bạn không đạt đến tầm của những mục tiêu, bạn rơi xuống ngang mức của các hệ thống mà bạn xây dựng.',
      },
      {
        title: 'Tư Duy Nhanh Và Chậm',
        author: 'Daniel Kahneman',
        quote: 'Cách tốt nhất để bảo vệ mình khỏi những sai lầm nhận thức là nhận ra những cạm bẫy của chính tâm trí.',
      },
      {
        title: 'Sâu (Deep Work)',
        author: 'Cal Newport',
        quote: 'Khả năng tập trung sâu sắc đang dần trở thành một siêu năng lực hiếm hoi trong nền kinh tế mới.',
      },
    ],
  },
  {
    id: 'healing',
    title: 'Chữa lành & Tâm lý học',
    subtitle: 'Thấu hiểu cảm xúc & nuôi dưỡng sự bình yên nội tâm',
    category: 'healing',
    popularRatio: '42% lựa chọn khi gặp stress & khủng hoảng',
    description: 'Xu hướng nổi bật nhất trong 3 năm trở lại đây. Những trang sách dịu dàng giúp người trẻ lắng nghe những tổn thương thời ấu thơ, giải tỏa áp lực đồng trang lứa và học cách yêu thương chính mình.',
    whyYouthLove: 'Nhịp sống đô thị gấp gáp và mạng xã hội dễ tạo ra cảm giác cô đơn và kiệt sức tâm lý; những cuốn sách chữa lành như một chiếc ôm vô hình đầy thấu cảm.',
    iconName: 'Heart',
    iconComponent: Heart,
    themeColor: '#C05C6E', // Rosewood
    badge: 'Xu hướng lớn',
    moods: ['stressed', 'lonely', 'sad'],
    challenge: 'Dành 15 phút tĩnh lặng sau khi đọc một chương sách để tự phản chiếu cảm xúc cá nhân.',
    recommendedBooks: [
      {
        title: 'Hiểu Về Trái Tim',
        author: 'Thầy Minh Niệm',
        quote: 'Hạnh phúc không phải là không có đau khổ, mà là biết mỉm cười và thấu suốt trước những thăng trầm.',
      },
      {
        title: 'Dám Bị Ghét',
        author: 'Kishimi Ichiro & Koga Fumitake',
        quote: 'Tự do thực sự là có can đảm chấp nhận bị người khác ghét bỏ khi sống đúng với bản chất của mình.',
      },
      {
        title: 'Cây Cam Ngọt Của Tôi',
        author: 'José Mauro de Vasconcelos',
        quote: 'Vị ngọt ngào nhất của tình yêu thương là biết sẻ chia những điều nhỏ bé khi tâm hồn còn thơ dại.',
      },
    ],
  },
  {
    id: 'comics',
    title: 'Truyện tranh, Manga & Comics',
    subtitle: 'Nghệ thuật hình ảnh kể chuyện sống động & cảm xúc',
    category: 'comics',
    popularRatio: '48% bạn trẻ sở hữu ít nhất 1 bộ sưu tập',
    description: 'Không đơn thuần là giải trí cho trẻ em, Manga và Light novel hiện đại sở hữu cốt truyện triết lý sâu sắc, nét vẽ đỉnh cao và cách xây dựng nhân vật truyền cảm hứng mạnh mẽ.',
    whyYouthLove: 'Hình ảnh sống động, tốc độ kể chuyện nhanh, phù hợp với thói quen tiếp nhận thị giác của thế hệ Gen Z và mang lại giá trị sưu tầm thẩm mỹ cao.',
    iconName: 'Layers',
    iconComponent: Layers,
    themeColor: '#367B99', // Ocean blue
    badge: 'Gen Z yêu thích',
    moods: ['bored', 'energetic', 'dreamy'],
    challenge: 'Vẽ lại một nhân vật hoặc viết cảm nhận ngắn về một bài học triết lý trong bộ truyện bạn thích.',
    recommendedBooks: [
      {
        title: 'Thám Tử Lừng Danh Conan',
        author: 'Gosho Aoyama',
        quote: 'Sự thật chỉ có một, và chân lý sẽ luôn chiến thắng bóng tối mưu toan.',
      },
      {
        title: 'Doraemon',
        author: 'Fujiko F. Fujio',
        quote: 'Mỗi món bảo bối chỉ có ý nghĩa khi ta biết đứng vững bằng chính đôi chân của mình.',
      },
      {
        title: 'One Piece (Đảo Hải Tặc)',
        author: 'Eiichiro Oda',
        quote: 'Nếu không dám mạo hiểm vì ước mơ của mình, thì cuộc sống này còn có ý nghĩa gì nữa?',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Kinh tế & Tài chính cá nhân',
    subtitle: 'Tự do tài chính & tư duy làm chủ dòng tiền thực chiến',
    category: 'finance',
    popularRatio: '38% bạn trẻ chuẩn bị đi làm theo dõi chặt chẽ',
    description: 'Dòng sách trang bị kiến thức thực chiến: từ quản lý chi tiêu cá nhân, đầu tư tích lũy đến tư duy khởi nghiệp trong thời đại kinh tế số đầy biến động.',
    whyYouthLove: 'Gen Z muốn tự chủ tài chính sớm (xu hướng FIRE) và tìm kiếm các mô hình kinh doanh sáng tạo thay vì phụ thuộc hoàn toàn vào một nguồn lương cố định.',
    iconName: 'TrendingUp',
    iconComponent: TrendingUp,
    themeColor: '#2D7F60', // Emerald green
    badge: 'Thực chiến',
    moods: ['productive', 'stressed', 'ambitious'],
    challenge: 'Ghi chép lại các khoản chi tiêu trong 1 tuần sau khi đọc xong một cuốn sách về tài chính.',
    recommendedBooks: [
      {
        title: 'Tâm Lý Học Về Tiền',
        author: 'Morgan Housel',
        quote: 'Làm tốt với tiền bạc ít liên quan đến độ thông minh của bạn, mà liên quan mật thiết đến cách bạn cư xử.',
      },
      {
        title: 'Cha Giàu Cha Nghèo',
        author: 'Robert Kiyosaki',
        quote: 'Người nghèo làm việc vì tiền, người giàu bắt tiền phải làm việc cật lực cho mình.',
      },
      {
        title: 'Khởi Nghiệp Tinh Gọn',
        author: 'Eric Ries',
        quote: 'Học hỏi có kiểm chứng là thước đo tiến bộ đích thực của bất kỳ dự án kinh doanh nào.',
      },
    ],
  },
  {
    id: 'history',
    title: 'Lịch sử & Tri thức nhân loại',
    subtitle: 'Gốc rễ quá khứ, khoa học & các bài học trường tồn',
    category: 'history',
    popularRatio: '29% độc giả trẻ tìm đọc để mở rộng thế giới quan',
    description: 'Không còn khô khan với số liệu năm tháng, dòng sách lịch sử hiện đại được viết theo lối kể chuyện cuốn hút, tái hiện các chuyển dịch lớn của nhân loại và bài học sâu sắc từ các danh nhân.',
    whyYouthLove: 'Giúp người trẻ hiểu sâu sắc về bản sắc cội nguồn dân tộc, vị thế của con người trong dòng chảy vũ trụ và tìm kiếm kim chỉ nam từ những cuộc đời kiên định.',
    iconName: 'Landmark',
    iconComponent: Landmark,
    themeColor: '#6B5490', // Royal purple/slate
    badge: 'Mở rộng tư duy',
    moods: ['thoughtful', 'bored', 'curious'],
    challenge: 'Tìm hiểu về một sự kiện lịch sử Việt Nam và chia sẻ lại cho một người bạn.',
    recommendedBooks: [
      {
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        quote: 'Khả năng tin vào những điều tưởng tượng tập thể chính là bí mật làm nên sự thống trị của loài người.',
      },
      {
        title: 'Việt Nam Sử Lược',
        author: 'Trần Trọng Kim',
        quote: 'Biết chuyện đời xưa để soi sáng cho con đường đi tới của giống nòi ngàn năm.',
      },
      {
        title: 'Lược Sử Thời Gian',
        author: 'Stephen Hawking',
        quote: 'Mục đích tối hậu của chúng ta là hiểu được toàn vẹn vũ trụ: tại sao nó tồn tại và tại sao chúng ta lại ở đây.',
      },
    ],
  },
  {
    id: 'science',
    title: 'Khoa học & Công nghệ',
    subtitle: 'Khám phá bí ẩn vũ trụ, AI & tương lai nhân loại',
    category: 'science',
    popularRatio: '32% bạn trẻ yêu thích công nghệ theo dõi',
    description: 'Nơi tri thức khoa học trở nên sống động. Từ trí tuệ nhân tạo (AI) đến cơ học lượng tử, những cuốn sách này giải mã cách thế giới vận hành.',
    whyYouthLove: 'Thế hệ sống trong kỷ nguyên công nghệ luôn tò mò về những gì đang định hình tương lai và cách các đột phá khoa học thay đổi cuộc sống.',
    iconName: 'Zap',
    iconComponent: Flame,
    themeColor: '#4A5568',
    badge: 'Tương lai',
    moods: ['curious', 'productive', 'thoughtful'],
    challenge: 'Đọc một chương về AI hoặc công nghệ mới và thảo luận về tác động của nó.',
    recommendedBooks: [
      {
        title: 'Life 3.0',
        author: 'Max Tegmark',
        quote: 'Trí tuệ nhân tạo có thể là điều tốt nhất hoặc tồi tệ nhất xảy đến với nhân loại.',
      },
      {
        title: 'Cosmos (Vũ Trụ)',
        author: 'Carl Sagan',
        quote: 'Chúng ta là một cách để vũ trụ tự thấu hiểu chính nó.',
      },
    ],
  },
  {
    id: 'biography',
    title: 'Hồi ký & Tiểu sử',
    subtitle: 'Những cuộc đời truyền cảm hứng & bài học từ người đi trước',
    category: 'biography',
    popularRatio: '25% độc giả tìm kiếm hình mẫu lý tưởng',
    description: 'Khám phá hành trình đầy thăng trầm của những vĩ nhân, doanh nhân hay nghệ sĩ. Những câu chuyện thật giúp ta có thêm niềm tin vào bản thân.',
    whyYouthLove: 'Tìm kiếm sự kết nối với những con người thực, học hỏi từ những sai lầm và thành công thực tế của họ.',
    iconName: 'Feather',
    iconComponent: Feather,
    themeColor: '#4A5568',
    badge: 'Cảm hứng',
    moods: ['thoughtful', 'ambitious', 'curious'],
    challenge: 'Đọc về cuộc đời của một người bạn ngưỡng mộ và viết ra 3 bài học bạn tâm đắc nhất.',
    recommendedBooks: [
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        quote: 'Những người đủ điên rồ để nghĩ rằng mình có thể thay đổi thế giới chính là những người làm được điều đó.',
      },
      {
        title: 'Becoming (Chất Michelle)',
        author: 'Michelle Obama',
        quote: 'Thành công không phải là về việc bạn kiếm được bao nhiêu tiền, mà là về sự khác biệt bạn tạo ra cho cuộc sống của người khác.',
      },
    ],
  },
  {
    id: 'poetry',
    title: 'Thơ ca & Tản văn',
    subtitle: 'Giai điệu của ngôn từ & những rung động tinh tế',
    category: 'poetry',
    popularRatio: '22% bạn trẻ yêu thích sự ngắn gọn, hàm súc',
    description: 'Nơi ngôn ngữ trở nên bay bổng. Những vần thơ hay tản văn ngắn giúp bạn tìm thấy sự đồng điệu trong tâm hồn chỉ qua vài dòng chữ.',
    whyYouthLove: 'Phù hợp với nhịp sống nhanh, dễ dàng chia sẻ trên mạng xã hội và mang lại cảm giác nghệ thuật nhẹ nhàng.',
    iconName: 'Feather',
    iconComponent: Feather,
    themeColor: '#C05C6E',
    badge: 'Nghệ thuật',
    moods: ['dreamy', 'sad', 'lonely'],
    challenge: 'Tự viết một bài thơ ngắn hoặc một đoạn tản văn sau khi đọc xong một tập thơ.',
    recommendedBooks: [
      {
        title: 'Không gia đình',
        author: 'Hector Malot',
        quote: 'Nước mắt không phải là dấu hiệu của sự yếu đuối, mà là bằng chứng của một trái tim biết cảm nhận.',
      },
      {
        title: 'Thơ Xuân Quỳnh',
        author: 'Xuân Quỳnh',
        quote: 'Lòng em nhớ đến anh / Cả trong mơ còn thức.',
      },
    ],
  },
  {
    id: 'art',
    title: 'Nghệ thuật & Thiết kế',
    subtitle: 'Thẩm mỹ, sáng tạo & ngôn ngữ của hình ảnh',
    category: 'art',
    popularRatio: '27% bạn trẻ làm ngành sáng tạo quan tâm',
    description: 'Từ lịch sử hội họa đến tư duy thiết kế hiện đại. Những cuốn sách này không chỉ cung cấp kiến thức mà còn nuôi dưỡng đôi mắt thẩm mỹ.',
    whyYouthLove: 'Giúp nâng cao gu thẩm mỹ cá nhân và tìm kiếm nguồn cảm hứng cho các dự án sáng tạo riêng.',
    iconName: 'Sparkles',
    iconComponent: Sparkles,
    themeColor: '#D69E2E',
    badge: 'Sáng tạo',
    moods: ['curious', 'dreamy', 'energetic'],
    challenge: 'Tạo ra một tác phẩm nghệ thuật nhỏ (vẽ, chụp ảnh...) lấy cảm hứng từ một chương sách.',
    recommendedBooks: [
      {
        title: 'Steal Like An Artist',
        author: 'Austin Kleon',
        quote: 'Mọi tác phẩm sáng tạo đều được xây dựng dựa trên những gì đã có trước đó.',
      },
      {
        title: 'Ways of Seeing',
        author: 'John Berger',
        quote: 'Cách chúng ta nhìn nhận mọi thứ bị ảnh hưởng bởi những gì chúng ta biết hoặc những gì chúng ta tin tưởng.',
      },
    ],
  },
  {
    id: 'travel',
    title: 'Du ký & Khám phá',
    subtitle: 'Hành trình vạn dặm & những chân trời mới',
    category: 'travel',
    popularRatio: '30% bạn trẻ mê xê dịch tìm đọc',
    description: 'Mang cả thế giới vào tầm mắt. Những cuốn du ký dẫn dắt bạn qua những vùng đất lạ, những nền văn hóa khác biệt và những trải nghiệm khó quên.',
    whyYouthLove: 'Thỏa mãn khao khát khám phá, "du lịch qua trang sách" và lên kế hoạch cho những chuyến đi thực tế trong tương lai.',
    iconName: 'Compass',
    iconComponent: Compass,
    themeColor: '#3182CE',
    badge: 'Xê dịch',
    moods: ['adventure', 'dreamy', 'bored'],
    challenge: 'Tìm hiểu về một vùng đất bạn chưa từng đến và lên kế hoạch "ảo" cho chuyến đi 3 ngày.',
    recommendedBooks: [
      {
        title: 'Xách ba lô lên và đi',
        author: 'Huyền Chip',
        quote: 'Thế giới rộng lớn hơn những gì bạn có thể tưởng tượng từ văn phòng của mình.',
      },
      {
        title: 'Trên đường (On the Road)',
        author: 'Jack Kerouac',
        quote: 'Chẳng có nơi nào để đi ngoại trừ khắp mọi nơi, vì vậy hãy cứ tiếp tục tiến lên dưới ánh sao.',
      },
    ],
  },
  {
    id: 'spirituality',
    title: 'Tâm linh & Triết học phương Đông',
    subtitle: 'Sự tỉnh thức, nhân quả & trí tuệ cổ xưa',
    category: 'spirituality',
    popularRatio: '26% tìm kiếm ý nghĩa cuộc sống sâu xa',
    description: 'Tìm về những giá trị cốt lõi của sự tồn tại. Những cuốn sách này giúp bạn hiểu về quy luật vũ trụ, sự an lạc và con đường tìm về chính mình.',
    whyYouthLove: 'Giúp cân bằng cuộc sống giữa thế giới vật chất đầy xáo động và tìm thấy điểm tựa tâm linh vững chắc.',
    iconName: 'GraduationCap',
    iconComponent: GraduationCap,
    themeColor: '#805AD5',
    badge: 'Tỉnh thức',
    moods: ['thoughtful', 'stressed', 'lonely'],
    challenge: 'Thực hành thiền định 10 phút sau khi đọc một đoạn sách về tâm linh.',
    recommendedBooks: [
      {
        title: 'Muôn kiếp nhân sinh',
        author: 'Nguyên Phong',
        quote: 'Con người không thể thay đổi được số phận, nhưng có thể thay đổi được thái độ đối với số phận.',
      },
      {
        title: 'Đường xưa mây trắng',
        author: 'Thích Nhất Hạnh',
        quote: 'Hơi thở là nhịp cầu nối liền sự sống và ý thức, nối liền thân thể và tâm trí.',
      },
    ],
  },
];

export default function GenresPage({ onNavigate }: GenresPageProps) {
  // Genres filterable state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<SpecializedGenreItem | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const toggleBookmark = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((itemId) => itemId !== id));
      showToast(`Đã bỏ lưu thể loại "${title}"`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast(`Đã lưu "${title}" vào mục quan tâm của bạn!`);
    }
  };

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage('');
    }, 2800);
  };

  const filterCategories = [
    { id: 'all', label: 'Tất cả', icon: Sparkles, count: GENRE_LIST.length },
    { id: 'fiction', label: 'Tiểu thuyết', icon: BookOpen, count: GENRE_LIST.filter(g => g.category === 'fiction').length },
    { id: 'self-help', label: 'Kỹ năng', icon: Sparkles, count: GENRE_LIST.filter(g => g.category === 'self-help').length },
    { id: 'healing', label: 'Chữa lành', icon: Heart, count: GENRE_LIST.filter(g => g.category === 'healing').length },
    { id: 'comics', label: 'Truyện tranh', icon: Layers, count: GENRE_LIST.filter(g => g.category === 'comics').length },
    { id: 'finance', label: 'Kinh tế', icon: TrendingUp, count: GENRE_LIST.filter(g => g.category === 'finance').length },
    { id: 'history', label: 'Lịch sử', icon: Landmark, count: GENRE_LIST.filter(g => g.category === 'history').length },
    { id: 'science', label: 'Khoa học', icon: Flame, count: GENRE_LIST.filter(g => g.category === 'science').length },
    { id: 'biography', label: 'Hồi ký', icon: Feather, count: GENRE_LIST.filter(g => g.category === 'biography').length },
    { id: 'poetry', label: 'Thơ ca', icon: Feather, count: GENRE_LIST.filter(g => g.category === 'poetry').length },
    { id: 'art', label: 'Nghệ thuật', icon: Sparkles, count: GENRE_LIST.filter(g => g.category === 'art').length },
    { id: 'travel', label: 'Du ký', icon: Compass, count: GENRE_LIST.filter(g => g.category === 'travel').length },
    { id: 'spirituality', label: 'Tâm linh', icon: GraduationCap, count: GENRE_LIST.filter(g => g.category === 'spirituality').length },
  ];

  const moods = [
    { id: 'adventure', label: 'Phiêu lưu', icon: Compass },
    { id: 'stressed', label: 'Căng thẳng', icon: Skull },
    { id: 'productive', label: 'Năng suất', icon: Zap },
    { id: 'sad', label: 'Nỗi buồn', icon: Heart },
    { id: 'curious', label: 'Tò mò', icon: Search },
    { id: 'bored', label: 'Nhàm chán', icon: Smile },
  ];

  const filteredGenres = GENRE_LIST.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesMood = !selectedMood || item.moods.includes(selectedMood);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    
    return matchesCategory && matchesMood && matchesSearch;
  });

  return (
    <div className="w-full bg-white text-gray-900 font-inter">
      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-[#3A3530] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/10 text-xs sm:text-sm font-sans"
          >
            <Check size={16} className="text-[#B56D4F]" />
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HERO VIDEO COMPONENT */}
      <section className="relative w-full p-3 sm:p-4 md:p-6 min-h-[580px] lg:min-h-[640px] flex">
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black flex flex-col justify-end min-h-[540px] lg:min-h-[600px]">
          {/* Background Loop Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            poster="https://images.unsplash.com/photo-1507842229458-57790b07a51d?w=1600&auto=format&fit=crop&q=80"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>

          {/* Subtly calibrated scrim for crystal clear contrast while keeping video 100% visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 pointer-events-none" />

          {/* CONTENT LAYER */}
          <div className="relative z-10 flex flex-col justify-end w-full p-6 sm:p-8 md:p-12 pb-8 sm:pb-10 md:pb-12 gap-6">
            {/* BOTTOM ROW (headline & action) */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* HEADLINE */}
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-black/40 backdrop-blur-md border border-white/25 shadow-md">
                  <Flame size={14} className="text-amber-400 shrink-0" />
                  <span className="font-sans">CHUYÊN ĐỀ 02 · GU ĐỌC ĐA SẮC MÀU GIỚI TRẺ</span>
                </div>
                <h1 className="text-3xl sm:text-5xl xl:text-6xl font-medium leading-[1.15] drop-shadow-2xl text-white font-playfair">
                  Gu đọc đa sắc màu <br />
                  của thế hệ{' '}
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: 'italic',
                      fontWeight: 400,
                    }}
                    className="text-white text-4xl sm:text-6xl xl:text-7xl"
                  >
                    độc giả trẻ
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-white/90 max-w-2xl font-lora leading-relaxed drop-shadow-md">
                  Từ những trang sách chữa lành xoa dịu tâm hồn, tiểu thuyết lôi cuốn đến dòng sách tài chính thực chiến kiến tạo tương lai.
                </p>
              </div>

              {/* ACTION: Scroll to interactive filterable grid */}
              <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                <button
                  onClick={() => {
                    document.getElementById('genres-library')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white text-black text-sm font-semibold px-6 py-3.5 rounded-2xl hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 active:scale-95 duration-200"
                >
                  <span>Khám phá 6 thể loại</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERABLE GENRES SECTION */}
      <section id="genres-library" className="py-16 sm:py-24 bg-[#FAF7F0] border-t border-[#D6CDBF] scroll-mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B56D4F] block mb-2 font-lora">
              Bản Đồ Thể Loại Sách
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#3A3530] mb-4">
              Khám Phá Gu Đọc Cá Nhân
            </h2>
            <p className="font-lora text-[#6B635A] text-sm sm:text-base leading-relaxed">
              Dòng sách bạn chọn kể câu chuyện về con người bạn muốn trở thành.
            </p>
            <VintageSeparator className="max-w-xs mx-auto mt-6" />
          </div>

          {/* NEW: Mood Picker Tool */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-[#D6CDBF] p-6 mb-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B56D4F]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-playfair font-bold text-lg text-[#3A3530] mb-1 flex items-center justify-center md:justify-start gap-2">
                  <Smile size={20} className="text-[#B56D4F]" />
                  <span>Hôm nay bạn thấy thế nào?</span>
                </h4>
                <p className="text-xs text-[#6B635A] font-lora italic">Chọn tâm trạng để chúng mình gợi ý thể loại sách phù hợp nhất.</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                      selectedMood === mood.id
                        ? 'bg-[#B56D4F] text-white border-[#B56D4F] shadow-md scale-105'
                        : 'bg-white text-[#6B635A] border-[#D6CDBF] hover:border-[#B56D4F] hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <mood.icon size={14} />
                    <span>{mood.label}</span>
                  </button>
                ))}
                {selectedMood && (
                  <button 
                    onClick={() => setSelectedMood(null)}
                    className="text-xs text-[#B56D4F] font-bold hover:underline ml-2"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Bar & Search controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#D6CDBF]">
            {/* Filter Category Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {filterCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer font-sans flex items-center gap-2 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'bg-white text-[#6B635A] hover:bg-[#F5F1E8] hover:text-[#3A3530] border border-[#D6CDBF]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-[#B56D4F] rounded-xl shadow-md -z-0"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={14} className={isActive ? 'text-white' : 'text-[#B56D4F]'} />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#D6CDBF]/50 text-[#6B635A]'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B635A]" />
              <input
                type="text"
                placeholder="Tìm thể loại, tên sách, tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#D6CDBF] rounded-xl text-xs sm:text-sm font-sans text-[#3A3530] placeholder-[#6B635A]/70 focus:outline-none focus:ring-2 focus:ring-[#B56D4F] focus:border-transparent transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B635A] hover:text-[#3A3530] p-0.5"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Results count banner */}
          <div className="flex items-center justify-between text-xs text-[#6B635A] font-lora mb-6 px-1">
            <span>
              Đang hiển thị <strong className="text-[#3A3530] font-semibold">{filteredGenres.length}</strong> thể loại
              {activeCategory !== 'all' && ' được lọc'}
            </span>
            {bookmarkedIds.length > 0 && (
              <span className="text-[#B56D4F] font-medium bg-[#B56D4F]/10 px-2.5 py-1 rounded-lg">
                Đã lưu: {bookmarkedIds.length} thể loại
              </span>
            )}
          </div>

          {/* Filterable Grid with Framer Motion hover elevation & filter transitions */}
          {filteredGenres.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-12 text-center rounded-2xl border border-[#D6CDBF] max-w-md mx-auto my-12 shadow-sm"
            >
              <Search size={36} className="mx-auto text-[#6B635A] mb-3 opacity-50" />
              <p className="font-lora text-base text-[#3A3530] font-medium mb-1">
                Không tìm thấy thể loại phù hợp
              </p>
              <p className="text-xs text-[#6B635A] mb-5">
                Vui lòng thử lại với từ khóa khác hoặc bỏ chọn bộ lọc.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#B56D4F] text-white text-xs font-semibold rounded-xl hover:bg-[#9A5A3F] transition-colors cursor-pointer"
              >
                Xem lại tất cả thể loại
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredGenres.map((item, index) => {
                  const IconComponent = item.iconComponent;
                  const isBookmarked = bookmarkedIds.includes(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.88, y: 24 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.88, y: 16 }}
                      transition={{ 
                        layout: { type: 'spring', stiffness: 350, damping: 28 },
                        opacity: { duration: 0.25 },
                        scale: { duration: 0.25 },
                        delay: index * 0.04
                      }}
                      whileHover={{ 
                        y: -12,
                        scale: 1.02,
                        boxShadow: '0 28px 45px -14px rgba(58, 53, 48, 0.26), 0 6px 16px rgba(0, 0, 0, 0.08)',
                        borderColor: item.themeColor,
                        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } 
                      }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setSelectedGenre(item)}
                      className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#D6CDBF] transition-colors cursor-pointer group relative overflow-hidden select-none shadow-sm"
                    >
                      {/* Top Accent Gradient Bar */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1.5 transition-transform duration-300 group-hover:scale-x-105"
                        style={{ backgroundColor: item.themeColor }}
                      />

                      {/* Stamp style corner indicator badge */}
                      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden">
                        <div
                          className="absolute -right-8 top-4 w-32 text-center py-1 text-[9px] font-bold text-white uppercase tracking-wider transform rotate-45 shadow-sm"
                          style={{ backgroundColor: item.themeColor }}
                        >
                          {item.badge}
                        </div>
                      </div>

                      <div>
                        {/* Top Action Row: Specialized Icon & Bookmark Button */}
                        <div className="flex items-center justify-between mb-5">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 6 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xs border"
                            style={{
                              borderColor: `${item.themeColor}40`,
                              color: item.themeColor,
                              backgroundColor: `${item.themeColor}12`,
                            }}
                          >
                            <IconComponent size={30} strokeWidth={2} />
                          </motion.div>

                          <button
                            onClick={(e) => toggleBookmark(e, item.id, item.title)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer z-10 ${
                              isBookmarked
                                ? 'bg-[#B56D4F] text-white border-[#B56D4F] shadow-sm'
                                : 'bg-[#FAF7F0] text-[#6B635A] border-[#D6CDBF] hover:text-[#B56D4F] hover:border-[#B56D4F]'
                            }`}
                            title={isBookmarked ? 'Bỏ lưu thể loại' : 'Lưu thể loại quan tâm'}
                            aria-label="Lưu thể loại"
                          >
                            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                          </button>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530] group-hover:text-[#B56D4F] transition-colors mb-1.5 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6B635A] font-lora mb-4 line-clamp-1 font-medium">
                          {item.subtitle}
                        </p>

                        <div className="w-12 h-[2px] mb-4 rounded-full" style={{ backgroundColor: `${item.themeColor}40` }} />

                        {/* Description */}
                        <p className="font-lora text-sm text-[#3A3530]/90 leading-relaxed mb-5 line-clamp-3">
                          {item.description}
                        </p>

                        {/* Specialized Recommended Books Card */}
                        <div className="bg-[#FAF7F0] rounded-xl p-3.5 border border-[#D6CDBF]/80 mb-4 transition-colors group-hover:bg-[#F5F1E8]">
                          <div className="text-[11px] font-bold text-[#3A3530] mb-2 flex items-center justify-between uppercase tracking-wider font-sans">
                            <span>Gợi ý tiêu biểu:</span>
                            <span className="text-[10px] lowercase text-[#6B635A] font-normal italic">
                              3 tác phẩm nổi bật
                            </span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#6B635A] font-lora">
                            {item.recommendedBooks.slice(0, 3).map((book, bIdx) => (
                              <li key={bIdx} className="flex items-baseline gap-2">
                                <span 
                                  className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                                  style={{ backgroundColor: item.themeColor }}
                                />
                                <span className="truncate">
                                  <strong className="text-[#3A3530] font-semibold">{book.title}</strong> – {book.author}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-3 border-t border-[#D6CDBF]/70 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#6B635A] font-lora italic font-medium">
                          {item.popularRatio}
                        </span>
                        <span 
                          className="font-semibold flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
                          style={{ color: item.themeColor }}
                        >
                          <span>Chi tiết</span>
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* DYNAMIC: Real-time Genre Survey Data Visualization */}
          <div className="mt-16 bg-[#FAF7F0] border-t border-[#D6CDBF] pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D4F] bg-[#B56D4F]/10 px-3 py-1 rounded-full mb-3 inline-block">Thống kê xu hướng</span>
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530]">Sức hút của các dòng sách hiện nay</h3>
            </div>
            
            <GenreSurveyChart />
          </div>

          {/* Bottom invitation to library & survey */}
          <div className="mt-16 bg-white p-8 sm:p-10 rounded-2xl border-2 border-[#D6CDBF] text-center max-w-3xl mx-auto shadow-sm">
            <h4 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530] mb-2">
              Khám phá toàn bộ tác phẩm trong Thư Viện Sách
            </h4>
            <p className="font-lora text-[#6B635A] text-sm leading-relaxed mb-6 max-w-xl mx-auto">
              Bạn muốn tìm đọc ngay các đầu sách nổi tiếng thuộc từng thể loại? Ghé thăm Thư viện 40 cuốn sách với link đọc trực tuyến miễn phí.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('library')}
                className="px-6 py-2.5 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Xem Thư Viện Sách Online</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigate('survey')}
                className="px-6 py-2.5 bg-[#FAF7F0] hover:bg-[#F5F1E8] text-[#3A3530] border border-[#D6CDBF] text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Bình chọn thể loại yêu thích
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedGenre && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-[#FAF7F0] w-full max-w-2xl rounded-2xl border-2 border-[#D6CDBF] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedGenre(null)}
                className="absolute top-5 right-5 text-[#6B635A] hover:text-[#3A3530] p-1.5 rounded-lg hover:bg-[#EBE5D9] transition-colors cursor-pointer"
                aria-label="Đóng modal"
              >
                <X size={20} />
              </button>

              {/* Header inside Modal */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    borderColor: `${selectedGenre.themeColor}50`,
                    color: selectedGenre.themeColor,
                    backgroundColor: `${selectedGenre.themeColor}15`,
                  }}
                >
                  <selectedGenre.iconComponent size={28} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] font-lora">
                    {selectedGenre.popularRatio}
                  </span>
                  <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530]">
                    {selectedGenre.title}
                  </h3>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm font-semibold text-[#B56D4F] mb-4">
                {selectedGenre.subtitle}
              </p>

              {/* Summary */}
              <div className="mb-5 bg-[#EBE5D9]/70 p-4 rounded-xl border border-[#D6CDBF]">
                <h4 className="font-playfair font-bold text-sm text-[#3A3530] uppercase tracking-wider mb-1.5">
                  Đặc điểm thể loại:
                </h4>
                <p className="text-sm text-[#3A3530] leading-relaxed font-lora">
                  {selectedGenre.description}
                </p>
              </div>

              {/* Why youth loves it */}
              <div className="mb-6">
                <h4 className="font-playfair font-bold text-base text-[#3A3530] mb-2">
                  Lý do người trẻ yêu thích thể loại này:
                </h4>
                <p className="text-sm text-[#6B635A] leading-relaxed font-lora">
                  {selectedGenre.whyYouthLove}
                </p>
              </div>

              {/* Recommended list */}
              <div className="mb-6">
                <h4 className="font-playfair font-bold text-base text-[#3A3530] mb-3">
                  Tác phẩm tiêu biểu & Trích dẫn đắt giá:
                </h4>
                <div className="space-y-3">
                  {selectedGenre.recommendedBooks.map((book, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-white p-3.5 rounded-xl border border-[#D6CDBF] text-xs sm:text-sm"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-[#3A3530] font-playfair text-sm sm:text-base">
                          {book.title}
                        </strong>
                        <span className="text-xs text-[#B56D4F] font-medium font-lora">
                          {book.author}
                        </span>
                      </div>
                      <blockquote className="italic text-[#6B635A] font-lora border-l-2 border-[#B56D4F] pl-3 py-0.5">
                        "{book.quote}"
                      </blockquote>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEW: Reading Challenge Section */}
              <div className="mb-8 bg-[#B56D4F]/10 p-6 rounded-2xl border-2 border-dashed border-[#B56D4F]/30 relative overflow-hidden">
                <Award className="absolute -right-2 -bottom-2 text-[#B56D4F] opacity-10" size={80} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#B56D4F] text-white flex items-center justify-center">
                      <Star size={16} className="fill-current" />
                    </div>
                    <h4 className="font-bold text-sm text-[#B56D4F] uppercase tracking-wider">Thử thách đọc cho bạn:</h4>
                  </div>
                  <p className="text-sm font-lora text-[#3A3530] leading-relaxed font-medium">
                    {selectedGenre.challenge}
                  </p>
                  <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#B56D4F] hover:underline flex items-center gap-1">
                    <span>Nhận thử thách này</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#D6CDBF] flex items-center justify-between font-sans">
                <button
                  onClick={(e) => toggleBookmark(e, selectedGenre.id, selectedGenre.title)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                    bookmarkedIds.includes(selectedGenre.id)
                      ? 'bg-[#B56D4F] text-white border-[#B56D4F]'
                      : 'bg-white text-[#3A3530] border-[#D6CDBF] hover:bg-[#EBE5D9]'
                  }`}
                >
                  <Bookmark size={14} />
                  <span>
                    {bookmarkedIds.includes(selectedGenre.id) ? 'Đã lưu quan tâm' : 'Lưu thể loại này'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGenre(null);
                      onNavigate('library');
                    }}
                    className="px-4 py-2 bg-[#B56D4F] text-white text-xs font-semibold rounded-xl hover:bg-[#9A5A3F] transition-colors cursor-pointer"
                  >
                    Đến Thư Viện Đọc
                  </button>
                  <button
                    onClick={() => setSelectedGenre(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
