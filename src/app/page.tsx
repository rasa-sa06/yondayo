"use client";

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from '../components/Button';
import { ReadingRecordCard } from '../components/ReadingRecordCard';
import { BookFormModal } from '../components/BookFormModal';
import Image from 'next/image'; // ← 追加
import { useApp } from "../contexts/AppContext";
import { useRouter } from "next/navigation";
import type { ReadingRecordWithBook } from '../types';

export default function Home() {
    const { records, books, addRecord } = useApp();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // recordsとbooksを結合したデータ
    const recordsWithBooks = useMemo((): ReadingRecordWithBook[] => {
        return records.map(record => {
            const book = books.find(b => b.id === record.bookId);
            if (!book) {
                return {
                    ...record,
                    book: {
                        id: record.bookId,
                        userId: record.userId,
                        title: '不明な本',
                        author: '不明',
                        imageUrl: undefined,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                };
            }
            return {
                ...record,
                book,
            };
        });
    }, [records, books]);


    // 最新3件を取得
    const recentRecords = recordsWithBooks.slice(0, 3);

    return (
        <div className="max-w-[800px] mx-auto pb-5">
            <section className="mb-6 bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brown m-0">さいきん よんだ ほん</h2>
                    {records.length > 0 && (
                        <button
                            onClick={() => router.push("/read")}
                            className={clsx(
                                'bg-transparent border-none text-brown text-base',
                                'font-mplus cursor-pointer underline hover:opacity-70'
                            )}
                        >
                            → すべて みる
                        </button>
                    )}
                </div>
                {recentRecords.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {recentRecords.map((record) => (
                            <ReadingRecordCard key={record.id} record={record} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-[60px]">
                        <p className="text-lg font-medium text-brown m-0 mb-3">まだ とうろく されて いません</p>
                        <p className="text-sm text-gray-500 m-0">したの ボタンから ほんを とうろく して みましょう！</p>
                    </div>
                )}
            </section>

            <div className="mb-6">
                <Button variant="primary" size="large" fullWidth onClick={() => setIsModalOpen(true)}>
                    ➕ ほんを とうろく する
                </Button>
            </div>

            <section className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                <h2 className="text-2xl font-bold text-brown m-0 mb-4">スタンプ カード</h2>
                <div className="text-center">
                    <div className="mb-4">
                        <span className="text-xl font-bold text-brown">
                            レベル {Math.floor(records.length / 10) + 1}
                        </span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {[...Array(10)].map((_, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    'w-[50px] h-[50px] rounded-full border-[3px] border-cyan',
                                    'flex items-center justify-center text-[32px]',
                                    'bg-cyan/30'
                                )}
                            >
                                {index < records.length % 10 && (
                                    <Image
                                        src="/stamp.png"  // ← public/stamp.png のパス
                                        alt="スタンプ"
                                        width={40}        // お好みで調整
                                        height={40}       // お好みで調整
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-base text-brown m-0">
                        あと {10 - (records.length % 10)}さつで レベルアップ！
                    </p>
                </div>
            </section>

            <BookFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addRecord}
            />
        </div>
    );
}
