// pages/ReadPage.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ReadingRecordCard } from '../components/ReadingRecordCard';
import { BookFormModal } from '../components/BookFormModal';
import type { ReadingRecord } from '../types';

type ReadPageProps = {
    records: ReadingRecord[];
    onAddRecord: (record: Omit<ReadingRecord, 'id' | 'createdAt'>) => void;
    onDeleteRecord: (id: string) => void;
    onUpdateRecord: (id: string, record: Omit<ReadingRecord, 'id' | 'createdAt'>) => void;
};

export const ReadPage: React.FC<ReadPageProps> = ({
    records,
    onAddRecord,
    onDeleteRecord,
    onUpdateRecord,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ReadingRecord | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'rating'>('date');

    // 検索フィルター
    const filteredRecords = records.filter((record) => {
        const query = searchQuery.toLowerCase();
            return (
                record.title.toLowerCase().includes(query) ||
                record.author.toLowerCase().includes(query)
            );
        }
    );

    // ソート
    const sortedRecords = [...filteredRecords].sort((a, b) => {
        switch (sortBy) {
        case 'date':
            return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
        case 'title':
            return a.title.localeCompare(b.title);
        case 'rating':
            return b.rating - a.rating;
        default:
            return 0;
        }
    });

    const handleEdit = (record: ReadingRecord) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleSubmit = (recordData: Omit<ReadingRecord, 'id' | 'createdAt'>) => {
        if (editingRecord) {
            onUpdateRecord(editingRecord.id, recordData);
        } else {
            onAddRecord(recordData);
        }
        setEditingRecord(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    return (
        <div className="max-w-[800px] mx-auto pb-5">
            <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                    <h1 className="text-[28px] font-bold text-brown m-0">よんだ ほん</h1>
                    <Button onClick={() => setIsModalOpen(true)} size="medium">
                        ➕ とうろく
                    </Button>
            </div>

            <div className="flex gap-3 mb-5 bg-white p-5 rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                <input
                    type="text"
                    placeholder="タイトルや さくしゃで けんさく"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-cream focus:outline-none focus:border-[#99e6e6]"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'rating')}
                    className="p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-cream cursor-pointer focus:outline-none focus:border-[#99e6e6]"
                >
                    <option value="date">よんだ ひ</option>
                    <option value="title">タイトル</option>
                    <option value="rating">ひょうか</option>
                </select>
            </div>

            <div className="bg-cyan p-4 rounded-[20px] text-center mb-5 shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                <span className="text-lg font-bold text-brown">
                    {records.length}さつめ
                </span>
            </div>

            {sortedRecords.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {sortedRecords.map((record) => (
                        <div key={record.id} className="relative">
                            <div className="cursor-pointer" onClick={() => handleEdit(record)}>
                                <ReadingRecordCard record={record} />
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm('ほんとうに さくじょ しますか？')) {
                                        onDeleteRecord(record.id);
                                    }
                                }}
                                className="absolute top-4 right-4 z-10 px-4 py-2 text-sm font-mplus border-2 border-cyan rounded-[20px] cursor-pointer font-medium shadow-[0_2px_4px_rgba(102,0,0,0.1)] bg-white text-brown hover:bg-gray-50"
                            >
                                さくじょ
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-[60px] bg-white rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]">
                    <p className="text-lg font-medium text-brown m-0">
                        {searchQuery ? 'けんさく けっかが ありません' : 'まだ とうろく されて いません'}
                    </p>
                </div>
            )}

            <BookFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={editingRecord || undefined}
            />
        </div>
    );
};