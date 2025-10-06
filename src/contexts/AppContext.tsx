// src/contexts/AppContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ReadingRecord, WishlistBook, RecommendedBook } from "../types";

type AppContextType = {
    records: ReadingRecord[];
    wishlist: WishlistBook[];
    addRecord: (record: Omit<ReadingRecord, "id" | "createdAt">) => void;
    deleteRecord: (id: string) => void;
    updateRecord: (
        id: string,
        record: Omit<ReadingRecord, "id" | "createdAt">
    ) => void;
    addToWishlist: (book: RecommendedBook) => void;
    removeFromWishlist: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // 読書記録の状態管理
    const [records, setRecords] = useState<ReadingRecord[]>([
        {
            id: "1",
            title: "はらぺこ あおむし",
            author: "エリック・カール",
            imageUrl: "",
            readCount: 3,
            rating: 5,
            review: "とても たのしい えほん でした！",
            readDate: "2025-09-28",
            createdAt: "2025-09-28T10:00:00Z",
        },
        {
            id: "2",
            title: "ぐりとぐら",
            author: "なかがわ りえこ",
            imageUrl: "",
            readCount: 2,
            rating: 4,
            review: "かすてらが おいしそう！",
            readDate: "2025-09-25",
            createdAt: "2025-09-25T10:00:00Z",
        },
    ]);

    // よみたい本の状態管理
    const [wishlist, setWishlist] = useState<WishlistBook[]>([]);

    // 読書記録を追加
    const addRecord = (newRecord: Omit<ReadingRecord, "id" | "createdAt">) => {
        const record: ReadingRecord = {
            ...newRecord,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setRecords([record, ...records]);
    };

    // 読書記録を削除
    const deleteRecord = (id: string) => {
        setRecords(records.filter((record) => record.id !== id));
    };

    // 読書記録を更新
    const updateRecord = (
        id: string,
        updatedData: Omit<ReadingRecord, "id" | "createdAt">
    ) => {
        setRecords(
            records.map((record) =>
                record.id === id ? { ...record, ...updatedData } : record
            )
        );
    };

    // よみたい本に追加
    const addToWishlist = (book: RecommendedBook) => {
        const wishlistItem: WishlistBook = {
            id: Date.now().toString(),
            bookId: book.id,
            title: book.title,
            author: book.author,
            imageUrl: book.imageUrl,
            addedAt: new Date().toISOString(),
        };
        setWishlist([wishlistItem, ...wishlist]);
    };

    // よみたい本から削除
    const removeFromWishlist = (id: string) => {
        setWishlist(wishlist.filter((item) => item.id !== id));
    };

    return (
        <AppContext.Provider
            value={{
                records,
                wishlist,
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
};

// カスタムフック：どのページでもデータにアクセスできる
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within AppProvider");
    }
    return context;
};
