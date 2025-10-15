// 読書記録の型
export type ReadingRecord = {
    id: string;
    title: string;
    author: string;
    imageUrl?: string;
    // readCount: number;  // ← 削除
    rating: number;
    review?: string;
    readDate: string;
    createdAt: string;
};

// おすすめ本の型
export type RecommendedBook = {
    id: string;
    title: string;
    author: string;
    imageUrl?: string;
    isbn?: string;
    publisher?: string;
    publishedDate?: string;
    description?: string;
    rakutenUrl?: string;
    amazonUrl?: string;
    reviewCount?: number;
    averageRating?: number;
};

// よみたい本の型
export type WishlistBook = {
    id: string;
    bookId: string;
    title: string;
    author: string;
    imageUrl?: string;
    addedAt: string;
};

// スタンプの型
export type StampCard = {
    stamps: number;
    level: number;
};

// 年齢カテゴリ
export type AgeCategory = '0歳' | '1歳' | '2歳' | '3歳' | '4歳' | '5歳' | '6歳' | '小学校低学年';

// 本のカテゴリ
export type BookCategory =
    | 'えほん'
    | 'ずかん'
    | 'かがく'
    | 'ことば'
    | 'きもち'
    | 'きせつ'
    | 'いきもの'
    | 'あそび'
    | 'シリーズ'
    | 'しぜん';