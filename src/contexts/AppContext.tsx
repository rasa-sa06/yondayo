'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import type { ReadingRecord, WishlistBook, RecommendedBook, Book, Child } from '../types';


type AppContextType = {
    records: ReadingRecord[];
    wishlist: WishlistBook[];
    books: Book[];  // ← 追加
    childrenList: Child[];  // ← 追加
    selectedChildId: string | null;
    setSelectedChildId: (id: string | null) => void;
    addRecord: (record: Omit<ReadingRecord, 'id' | 'createdAt'>) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
    updateRecord: (id: string, updatedData: Partial<ReadingRecord>) => Promise<void>;
    addToWishlist: (book: RecommendedBook) => Promise<void>;
    removeFromWishlist: (id: string) => Promise<void>;

    // books の CRUD
    fetchBooks: () => Promise<void>;  // ← 追加
    addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;  // ← 追加（book.idを返す）

    // children の CRUD
    fetchChildren: () => Promise<void>;  // ← 追加
    addChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;  // ← 追加
    updateChild: (id: string, updatedData: Partial<Child>) => Promise<void>;  // ← 追加
    deleteChild: (id: string) => Promise<void>;  // ← 追加
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
    children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
    const [records, setRecords] = useState<ReadingRecord[]>([]);
    const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
    const [books, setBooks] = useState<Book[]>([]);  // ← 追加
    const [childrenList, setChildrenList] = useState<Child[]>([]);  // ← 追加（children は予約語なので childrenList）
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

    // 初回ロード時にSupabaseからデータを取得
    useEffect(() => {
        fetchRecords();
        fetchWishlist();
        fetchBooks();
        fetchChildren();
    }, []);

    const fetchRecords = async () => {
        const { data, error } = await supabase
            .from('reading_records')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('データ取得エラー:', error);
        } else if (data) {
            const formattedRecords: ReadingRecord[] = data.map((record) => ({
                id: record.id,
                userId: record.user_id,
                childId: record.child_id,
                bookId: record.book_id,
                readDate: record.read_date,
                rating: record.rating,
                review: record.review || undefined,
                createdAt: record.created_at,
                updatedAt: record.updated_at,
            }));
            setRecords(formattedRecords);
        }
    };

    const addRecord = async (newRecord: Omit<ReadingRecord, "id" | "createdAt">) => {
        const { data, error } = await supabase
            .from('reading_records')
            .insert([{
                user_id: newRecord.userId,
                child_id: newRecord.childId,
                book_id: newRecord.bookId,
                read_date: newRecord.readDate,
                rating: newRecord.rating,
                review: newRecord.review,
            }])
            .select()
            .single();

        if (error) {
            console.error('追加エラー:', error);
            alert('保存に失敗しました');
        } else {
            await fetchRecords();
        }
    };

    const deleteRecord = async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('reading_records')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('削除エラー:', error);
            alert('削除に失敗しました');
        } else {
            await fetchRecords();
        }
    };

    const updateRecord = async (id: string, updatedData: Partial<ReadingRecord>) => {
        const { error } = await supabase
            .from('reading_records')
            .update({
                user_id: updatedData.userId,
                child_id: updatedData.childId,
                book_id: updatedData.bookId,
                read_date: updatedData.readDate,
                rating: updatedData.rating,
                review: updatedData.review,
            })
            .eq('id', id);

        if (error) {
            console.error('更新エラー:', error);
            alert('更新に失敗しました');
        } else {
            await fetchRecords();
        }
    };

    // よみたい本を取得
    const fetchWishlist = async () => {
        const { data, error } = await supabase
            .from('wishlist_books')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('よみたい本取得エラー:', error);
        } else if (data) {
            const formattedWishlist: WishlistBook[] = data.map((book) => ({
                id: book.id,
                userId: book.user_id,  // ← 追加
                title: book.title,
                author: book.author || undefined,  // ← '' から undefined に変更
                imageUrl: book.image_url || undefined,
                rating: book.rating || undefined,  // ← 追加
                createdAt: book.created_at,  // ← addedAt から変更
                updatedAt: book.updated_at,  // ← 追加
            }));
            setWishlist(formattedWishlist);
        }
    };

    // よみたい本に追加
    const addToWishlist = async (book: RecommendedBook) => {
        console.log('追加する本:', book); // ← デバック

        const { data, error } = await supabase
            .from('wishlist_books')
            .insert([{
                user_id: '00000000-0000-0000-0000-000000000000',  // ← 一時的な値（認証実装後に修正）
                title: book.title,
                author: book.author,
                image_url: book.imageUrl,
                rating: book.averageRating,  // ← 追加
            }])
            .select()
            .single();

        console.log('Supabaseレスポンス:', { data, error }); // ← デバック

        if (error) {
            console.error('よみたい本追加エラー:', JSON.stringify(error, null, 2)); // ← デバック
            alert('よみたい本の追加に失敗しました');
        } else {
            console.log('追加成功！'); //← デバック
            await fetchWishlist();
        }
    };

    const removeFromWishlist = async (id: string) => {
        const { error } = await supabase
            .from('wishlist_books')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('よみたい本削除エラー:', error);
            alert('よみたい本の削除に失敗しました');
        } else {
            await fetchWishlist();
        }
    };

    // books を取得
    const fetchBooks = async () => {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('本の取得エラー:', error);
        } else if (data) {
            const formattedBooks: Book[] = data.map((book) => ({
                id: book.id,
                userId: book.user_id,
                title: book.title,
                author: book.author || undefined,
                imageUrl: book.image_url || undefined,
                createdAt: book.created_at,
                updatedAt: book.updated_at,
            }));
            setBooks(formattedBooks);
        }
    };

    // book を追加（book.id を返す）
    const addBook = async (newBook: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
        const { data, error } = await supabase
            .from('books')
            .insert([{
                user_id: '00000000-0000-0000-0000-000000000000',  // 一時的なダミー値
                title: newBook.title,
                author: newBook.author,
                image_url: newBook.imageUrl,
            }])
            .select()
            .single();

        if (error) {
            console.error('本の追加エラー:', error);
            return null;
        } else {
            await fetchBooks();
            return data.id;  // 作成した book の id を返す
        }
    };

    // children を取得
    const fetchChildren = async () => {
        const { data, error } = await supabase
            .from('children')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('子どもの取得エラー:', error);
        } else if (data) {
            const formattedChildren: Child[] = data.map((child) => ({
                id: child.id,
                userId: child.user_id,
                name: child.name,
                birthday: child.birthday,
                createdAt: child.created_at,
                updatedAt: child.updated_at,
            }));
            setChildrenList(formattedChildren);
        }
    };

    // child を追加
    const addChild = async (newChild: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
        const { data, error } = await supabase
            .from('children')
            .insert([{
                user_id: '00000000-0000-0000-0000-000000000000',  // 一時的なダミー値
                name: newChild.name,
                birthday: newChild.birthday,
            }])
            .select()
            .single();

        if (error) {
            console.error('子どもの追加エラー:', error);
            alert('子どもの追加に失敗しました');
        } else {
            await fetchChildren();
        }
    };

    // child を更新
    const updateChild = async (id: string, updatedData: Partial<Child>): Promise<void> => {
        const { error } = await supabase
            .from('children')
            .update({
                name: updatedData.name,
                birthday: updatedData.birthday,
            })
            .eq('id', id);

        if (error) {
            console.error('子どもの更新エラー:', error);
            alert('子どもの更新に失敗しました');
        } else {
            await fetchChildren();
        }
    };

    // child を削除
    const deleteChild = async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('children')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('子どもの削除エラー:', error);
            alert('子どもの削除に失敗しました');
        } else {
            await fetchChildren();
        }
    };


    return (
        <AppContext.Provider
            value={{
                records,
                wishlist,
                books,
                childrenList,
                selectedChildId,
                setSelectedChildId,
                addRecord,
                deleteRecord,
                updateRecord,
                addToWishlist,
                removeFromWishlist,
                fetchBooks,
                addBook,
                fetchChildren,
                addChild,
                updateChild,   // ← 追加
                deleteChild,    // ← 追加
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}