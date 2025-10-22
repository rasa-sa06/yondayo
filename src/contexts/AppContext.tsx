'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import type { ReadingRecord, WishlistBook, RecommendedBook, Book, Child } from '../types';


type AppContextType = {
    records: ReadingRecord[];
    wishlist: WishlistBook[];
    books: Book[];
    childrenList: Child[];
    selectedChild: Child | null;           // 現在選択中の子ども
    setSelectedChild: (child: Child | null) => void;
    selectedChildId: string | null;
    setSelectedChildId: (id: string | null) => void;

    addRecord: (record: Omit<ReadingRecord, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
    updateRecord: (id: string, updatedData: Partial<ReadingRecord>) => Promise<void>;
    addToWishlist: (book: RecommendedBook) => Promise<void>;
    removeFromWishlist: (id: string) => Promise<void>;

    // books の CRUD
    fetchBooks: () => Promise<void>;
    addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;

    // children の CRUD
    fetchChildren: () => Promise<void>;
    addChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateChild: (id: string, updatedData: Partial<Child>) => Promise<void>;
    deleteChild: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
    children: ReactNode;
};

// localStorage用キー
const CHILD_ID_KEY = 'selectedChildId';

export function AppProvider({ children }: AppProviderProps) {
    const [records, setRecords] = useState<ReadingRecord[]>([]);
    const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
    const [books, setBooks] = useState<Book[]>([]);  // ← 追加
    const [childrenList, setChildrenList] = useState<Child[]>([]);  // ← 追加（children は予約語なので childrenList）


    // 初期値を localStorage から取得
    const [selectedChildId, _setSelectedChildId] = useState<string | null>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem(CHILD_ID_KEY) || null;
        return null;
    });

    const [selectedChild, setSelectedChild] = useState<Child | null>(null);

    // ラッパー関数で localStorage に保存
    const setSelectedChildId = (id: string | null) => {
        _setSelectedChildId(id);
        if (typeof window !== 'undefined') {
            if (id) localStorage.setItem(CHILD_ID_KEY, id);
            else localStorage.removeItem(CHILD_ID_KEY);
        }
    };

    // selectedChildId が変わったら selectedChild を自動でセット
    useEffect(() => {
        if (selectedChildId) {
            const child = childrenList.find(c => c.id === selectedChildId) || null;
            setSelectedChild(child);
        } else {
            setSelectedChild(null);
        }
    }, [selectedChildId, childrenList]);

    // 初回ロード時にSupabaseからデータを取得
    useEffect(() => {
        fetchRecords();
        fetchWishlist();
        fetchBooks();
        fetchChildren();
    }, []);

    // selectedChildIdが変更されたら再取得
    useEffect(() => {
        if (selectedChildId) {
            fetchRecords();
            fetchWishlist();
        }
    }, [selectedChildId]);

    // ------------------- CRUD: ReadingRecords -------------------
    const fetchRecords = async () => {
        let query = supabase  // ← まずqueryに格納してから条件追加
            .from('reading_records')
            .select('*')
            .order('created_at', { ascending: false });

        if (selectedChildId) {
            query = query.eq('child_id', selectedChildId);
        }

        const { data, error } = await query;

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

    const updateRecord = async (id: string, updatedData: Partial<ReadingRecord>): Promise<void> => {
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

    /// ------------------- CRUD: Wishlist -------------------
    const fetchWishlist = async () => {
        let query = supabase
            .from('wishlist_books')
            .select('*')
            .order('created_at', { ascending: false });

        // selectedChildIdがある場合はフィルタリング
        if (selectedChildId) {
            query = query.eq('child_id', selectedChildId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('よみたい本取得エラー:', error);
        } else if (data) {
            const formattedWishlist: WishlistBook[] = data.map((book) => ({
                id: book.id,
                userId: book.user_id,
                childId: book.child_id,
                title: book.title,
                author: book.author || undefined,  // ← '' から undefined に変更
                imageUrl: book.image_url || undefined,
                rating: book.rating || undefined,
                createdAt: book.created_at,
                updatedAt: book.updated_at,
            }));
            setWishlist(formattedWishlist);
        }
    };

    // よみたい本に追加
    const addToWishlist = async (book: RecommendedBook) => {
        if (!selectedChildId) {
            alert('子どもを選択してください');
            return;
        }

        const { data, error } = await supabase
            .from('wishlist_books')
            .insert([{
                user_id: '00000000-0000-0000-0000-000000000000',  // ← 一時的な値（認証実装後に修正）
                child_id: selectedChildId,
                title: book.title,
                author: book.author,
                image_url: book.imageUrl,
                rating: book.averageRating,  // ← 追加
            }])
            .select()
            .single();
        if (error) { console.error(error); alert('よみたい本の追加に失敗しました'); }
        else await fetchWishlist();
    };

    const removeFromWishlist = async (id: string) => {
        const { error } = await supabase
            .from('wishlist_books')
            .delete()
            .eq('id', id);

        if (error) { console.error(error); alert('よみたい本の削除に失敗しました'); }
        else await fetchWishlist();
    };

    // ------------------- CRUD: Books -------------------
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

    // ------------------- CRUD: Children -------------------
    const fetchChildren = async (): Promise<void> => {
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
            // 🌟 初回選択：localStorage または先頭の子を自動選択
            setChildrenList(formattedChildren);
            if (!selectedChildId && data.length) {
                setSelectedChildId(data[0].id);
            }
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
        } else if (data) {
            await fetchChildren();
            setSelectedChildId(data.id); // ← 追加：追加した子どもを自動選択
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
                selectedChild,
                setSelectedChild,
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