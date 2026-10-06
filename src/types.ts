export type PageId = 'home' | 'reading-habits' | 'genres' | 'library' | 'survey' | 'about' | 'detective-game' | '404';

export enum Category {
  COMEDY = 'COMEDY',
  HORROR = 'HORROR',
  EDUCATION = 'EDUCATION',
  COMICS = 'COMICS',
}

export interface BookReview {
  reviewerName: string;
  reviewerRole?: string;
  rating: number; // 1 to 5
  whatItIsAbout: string; // Cuốn sách nói về điều gì
  howItHelpsYou: string; // Giúp ích gì cho bạn / Bài học rút ra
  educationalValue?: string; // Giá trị giáo dục & rèn luyện kỹ năng
  coreThemes?: string[]; // Các chủ đề cốt lõi (ví dụ: Bản lĩnh, Kỷ luật, Trắc ẩn, Tư duy phản biện)
  quote?: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: Category;
  categoryLabel?: string;
  publishedYear: string;
  description: string;
  longDescription?: string;
  coverUrl: string;
  readUrl: string;
  rating?: number;
  reviewCount?: number;
  // Review chi tiết: Nói về cái gì, Giúp ích gì cho người đọc & Giá trị giáo dục
  review?: BookReview;
  whatItIsAbout?: string;
  howItHelpsYou?: string;
  educationalValue?: string;
  coreThemes?: string[];
  keyTakeaway?: string;
}

export interface GenreItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  whyYouthLove: string;
  recommendedBooks: {
    title: string;
    author: string;
    quote: string;
  }[];
  popularRatio: string;
  iconName: string;
}

export interface SurveyAnswer {
  ageGroup: string;
  booksPerYear: string;
  readingFormats: string[];
  favoriteGenres: string[];
  readingMotivations: string[];
  readingBarriers: string[];
  buyingHabits: string[];
  wantsNewsletter: boolean;
  email?: string;
  submittedAt: string;
}
