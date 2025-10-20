'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import type { ReadingRecord, WishlistBook, RecommendedBook } from '../types';


type AppContextType = {
    records: ReadingRecord[];
    wishlist: WishlistBook[];
    selectedChildId: string | null;
    setSelectedChildId: (id: string | null) => void;
    // addRecord: (record: Omit<ReadingRecord, 'id' | 'createdAt'>) => Promise<void>;
    // deleteRecord: (id: string) => Promise<void>;
    // updateRecord: (id: string, updatedData: Partial<ReadingRecord>) => Promise<void>;
    addToWishlist: (book: RecommendedBook) => Promise<void>;
    removeFromWishlist: (id: string) => Promise<void>;
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
        // fetchRecords();
        fetchWishlist();
    }, []);

    // const fetchRecords = async () => {
    //     const { data, error } = await supabase
    //         .from('reading_records')
    //         .select('*')
    //         .order('created_at', { ascending: false });

    //     if (error) {
    //         console.error('データ取得エラー:', error);
    //     } else if (data) {
    //         const formattedRecords: ReadingRecord[] = data.map((record) => ({
    //             id: record.id,
    //             title: record.title,
    //             author: record.author || '',
    //             imageUrl: record.image_url || undefined,
    //             readDate: record.read_date,
    //             rating: record.rating,
    //             review: record.review || undefined,
    //             createdAt: record.created_at,
    //         }));
    //         setRecords(formattedRecords);
    //     }
    // };

    // const addRecord = async (newRecord: Omit<ReadingRecord, "id" | "createdAt">) => {
    //     console.log('送信するデータ:', {
    //         title: newRecord.title,
    //         author: newRecord.author,
    //         image_url: newRecord.imageUrl,
    //         read_date: newRecord.readDate,
    //         rating: newRecord.rating,
    //         review: newRecord.review,
    //     }); // ← デバッグ用


    //     const { data, error } = await supabase
    //         .from('reading_records')
    //         .insert([{
    //             title: newRecord.title,
    //             author: newRecord.author,
    //             image_url: newRecord.imageUrl,
    //             read_date: newRecord.readDate,
    //             rating: newRecord.rating,
    //             review: newRecord.review,
    //         }])
    //         .select()
    //         .single();

    //     if (error) {
    //         console.error('追加エラー:', error);
    //         alert('保存に失敗しました');
    //     } else {
    //         await fetchRecords();
    //     }
    // };

    // const deleteRecord = async (id: string) => {
    //     const { error } = await supabase
    //         .from('reading_records')
    //         .delete()
    //         .eq('id', id);

    //     if (error) {
    //         console.error('削除エラー:', error);
    //         alert('削除に失敗しました');
    //     } else {
    //         await fetchRecords();
    //     }
    // };

    // const updateRecord = async (id: string, updatedData: Partial<ReadingRecord>) => {
    //     const { error } = await supabase
    //         .from('reading_records')
    //         .update({
    //             title: updatedData.title,
    //             author: updatedData.author,
    //             image_url: updatedData.imageUrl,
    //             read_date: updatedData.readDate,
    //             rating: updatedData.rating,
    //             review: updatedData.review,
    //         })
    //         .eq('id', id);

    //     if (error) {
    //         console.error('更新エラー:', error);
    //         alert('更新に失敗しました');
    //     } else {
    //         await fetchRecords();
    //     }
    // };

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

    return (
        <AppContext.Provider
            value={{
                records,
                wishlist,
                selectedChildId,
                setSelectedChildId,
                // addRecord,
                // deleteRecord,
                // updateRecord,
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