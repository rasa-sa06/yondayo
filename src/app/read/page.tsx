"use client";

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { ReadingRecordCard } from '../../components/ReadingRecordCard';
import { BookFormModal } from '../../components/BookFormModal';
import type { ReadingRecord, ReadingRecordWithBook } from '../../types';
import { useApp } from "../../contexts/AppContext";

export default function Read() {
    const { records, books, addRecord, deleteRecord, updateRecord } = useApp();
    console.log('📚 books:', books);
    console.log('📖 records:', records);
    console.log('books length:', books.length);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 型をReadingRecordWithBookに変更
    const [editingRecord, setEditingRecord] = useState<ReadingRecordWithBook | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'rating'>('date');

    // recordsとbooksを結合したデータ（ReadingRecordWithBook型に）
    const recordsWithBooks = useMemo((): ReadingRecordWithBook[] => {
        console.log('🔄 recordsWithBooks 再計算中');
        console.log('records:', records.length, 'books:', books.length);
        return records.map(record => {
            const book = books.find(b => b.id === record.bookId);
            console.log(`Record ${record.id} の bookId: ${record.bookId}, 見つかった? ${!!book}`);
            if (!book) {
                // bookが見つからない場合のフォールバック
                return {
                    ...record,
                    book: {
                        id: record.bookId,
                        userId: record.userId,
                        title: '不明な本',
                        author: '不明', // optionalだけど値を設定
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

    // 検索フィルター
    const filteredRecords = recordsWithBooks.filter((record) => {
        const query = searchQuery.toLowerCase();
        return (
            record.book.title.toLowerCase().includes(query) ||
            (record.book.author?.toLowerCase() ?? '').includes(query)
        );
    });

    // ソート
    const sortedRecords = [...filteredRecords].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
            case 'title':
                return a.book.title.localeCompare(b.book.title);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    const handleEdit = (record: ReadingRecordWithBook) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleSubmit = (recordData: Omit<ReadingRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingRecord) {
            updateRecord(editingRecord.id, recordData);
        } else {
            addRecord(recordData);
        }
        setEditingRecord(null);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    const inputClassName = clsx(
        'w-full p-3 border-2 border-cyan rounded-xl',
        'font-mplus text-base text-brown bg-cream',
        'focus:outline-none focus:border-[#99e6e6]'
    );

    const selectClassName = clsx(
        'flex-1 p-3 border-2 border-cyan rounded-xl',
        'font-mplus text-base text-brown bg-cream cursor-pointer',
        'focus:outline-none focus:border-[#99e6e6]'
    );

    return (
        <div className="max-w-[800px] mx-auto pb-5">
            <div className={clsx(
                'flex justify-between items-center mb-6 bg-white p-5',
                'rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
            )}>
                <h1 className="text-[28px] font-bold text-brown m-0">よんだ ほん</h1>
                <Button onClick={() => setIsModalOpen(true)} size="medium">
                    ➕ とうろく
                </Button>
            </div>

            <div className={clsx(
                'flex flex-col gap-3 mb-5 bg-white p-5',
                'rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
            )}>
                <input
                    type="text"
                    placeholder="タイトルや さくしゃで けんさく"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={inputClassName}
                />
                <div className="flex items-center gap-2">
                    <label className="text-sm text-brown font-medium whitespace-nowrap">ならびかえ：</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'rating')}
                        className={selectClassName}
                    >
                        <option value="date">よんだ ひ（あたらしい じゅん）</option>
                        <option value="title">タイトル（あいうえお じゅん）</option>
                        <option value="rating">ひょうか（たかい じゅん）</option>
                    </select>
                </div>
            </div>

            <div className={clsx(
                'bg-cyan p-4 rounded-[20px] text-center mb-5',
                'shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
            )}>
                <span className="text-lg font-bold text-brown">
                    {records.length}さつ よんだよ
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
                                        deleteRecord(record.id);
                                    }
                                }}
                                className={clsx(
                                    'absolute top-4 right-4 z-10',
                                    'px-4 py-2 text-sm font-mplus border-2 border-cyan rounded-[20px]',
                                    'cursor-pointer font-medium shadow-[0_2px_4px_rgba(102,0,0,0.1)]',
                                    'bg-white text-brown hover:bg-gray-50'
                                )}
                            >
                                さくじょ
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={clsx(
                    'text-center py-[60px] bg-white',
                    'rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
                )}>
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
}