'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import type { ReadingRecord, WishlistBook, RecommendedBook } from '../types';


type AppContextType = {
    records: ReadingRecord[];
    wishlist: WishlistBook[];
    selectedChildId: string | null;
    setSelectedChildId: (id: string | null) => void;
    addRecord: (record: Omit<ReadingRecord, 'id' | 'createdAt'>) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
    updateRecord: (id: string, updatedData: Partial<ReadingRecord>) => Promise<void>;
    addToWishlist: (book: RecommendedBook) => void;
    removeFromWishlist: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
    children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
    const [records, setRecords] = useState<ReadingRecord[]>([]);
    const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

    // 初回ロード時にSupabaseからデータを取得
    useEffect(() => {
        fetchRecords();
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
                title: record.title,
                author: record.author,
                imageUrl: record.image_url || undefined,
                readDate: record.read_date,
                rating: record.rating || 0,
                review: record.review || undefined,
                createdAt: record.created_at,
            }));
            setRecords(formattedRecords);
        }
    };

    const addRecord = async (newRecord: Omit<ReadingRecord, "id" | "createdAt">) => {
        console.log('送信するデータ:', {
            title: newRecord.title,
            author: newRecord.author,
            image_url: newRecord.imageUrl,
            read_date: newRecord.readDate,
            rating: newRecord.rating,
            review: newRecord.review,
        }); // ← デバッグ用


        const { data, error } = await supabase
            .from('reading_records')
            .insert([{
                title: newRecord.title,
                author: newRecord.author,
                image_url: newRecord.imageUrl,
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

    const deleteRecord = async (id: string) => {
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
                title: updatedData.title,
                author: updatedData.author,
                image_url: updatedData.imageUrl,
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

    const addToWishlist = (book: RecommendedBook) => {
        const newBook: WishlistBook = {
            id: Date.now().toString(),
            bookId: book.id,
            title: book.title,
            author: book.author,
            imageUrl: book.imageUrl,
            addedAt: new Date().toISOString(),
        };
        setWishlist([...wishlist, newBook]);
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(wishlist.filter((book) => book.id !== id));
    };

    return (
        <AppContext.Provider
            value={{
                records,
                wishlist,
                selectedChildId,
                setSelectedChildId,
                addRecord,
                deleteRecord,
                updateRecord,
                addToWishlist,
                removeFromWishlist,
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