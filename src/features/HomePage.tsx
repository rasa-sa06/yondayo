// pages/HomePage.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ReadingRecordCard } from '../components/ReadingRecordCard';
import { BookFormModal } from '../components/BookFormModal';
import type { ReadingRecord } from '../types';
import Image from 'next/image'; // ← 追加


type HomePageProps = {
    records: ReadingRecord[];
    onAddRecord: (record: Omit<ReadingRecord, 'id' | 'createdAt'>) => void;
    onViewAllRecords: () => void;
};

export const HomePage: React.FC<HomePageProps> = ({ records, onAddRecord, onViewAllRecords }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 最新3件を取得
    const recentRecords = records.slice(0, 3);

    return (
        <div className="max-w-[800px] mx-auto pb-5">
            <section className="mb-6 bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brown m-0">さいきん よんだ ほん</h2>
                        {records.length > 0 && (
                            <button
                                onClick={onViewAllRecords}
                                className="bg-transparent border-none text-brown text-base font-mplus cursor-pointer underline hover:opacity-70"
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
                                className={`w-[50px] h-[50px] rounded-full border-[3px] border-cyan flex items-center justify-center text-[32px] ${
                                    index < records.length % 10 ? 'bg-cyan' : 'bg-cream'
                                }`}
                            >
                                {index < records.length % 10 && (
                                    <Image
                                    src="/stamp.png"  // ← public/stamp.png のパス
                                    alt="スタンプ"
                                    width={32}        // お好みで調整
                                    height={32}       // お好みで調整
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
                onSubmit={onAddRecord}
            />
        </div>
    );
};