// 読書記録の型
export type ReadingRecord = {
    id: string;
    userId: string;
    childId: string;
    bookId: string;
    // readCount: number;  // ← 後で使うかも
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
    userId: string;
    title: string;
    author?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
};

// スタンプの型　（今のところは必要なし）
// export type StampCard = {
//     stamps: number;
//     level: number;
// };

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

// 子どもの型
export type Child = {
    id: string;
    userId: string;
    name: string;
    birthday: string;
    createdAt: string;
    updatedAt: string;
};

// 本の型
export type Book = {
    id: string;
    userId: string;
    title: string;
    author?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
};

// 読書記録 + Book情報
export type ReadingRecordWithBook = ReadingRecord & {
    book: Book;
};