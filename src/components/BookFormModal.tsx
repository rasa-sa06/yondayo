// components/BookFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { StarRating } from './StarRating';
import type { ReadingRecord } from '../types';

type BookFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (record: Omit<ReadingRecord, 'id' | 'createdAt'>) => void;
    initialData?: ReadingRecord;
};

export const BookFormModal: React.FC<BookFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        imageUrl: '',
        readCount: 1,
        rating: 0,
        review: '',
        readDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                author: initialData.author || '',
                imageUrl: initialData.imageUrl || '',
                readCount: initialData.readCount || 1,
                rating: initialData.rating || 0,
                review: initialData.review || '',
                readDate: initialData.readDate || new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData({
                title: '',
                author: '',
                imageUrl: '',
                readCount: 1,
                rating: 0,
                review: '',
                readDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = () => {
        if (!formData.title || !formData.author) {
            alert('タイトルと さくしゃは ひつよう です！');
            return;
        }
        if (formData.rating === 0) {
            alert('ひょうかを えらんで ください！');
            return;
        }
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5"
            onClick={onClose}
        >
            <div
                className="bg-cream rounded-[20px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b-2 border-cyan">
                    <h2 className="text-2xl font-bold text-brown m-0">ほんを とうろく</h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-[32px] cursor-pointer text-brown leading-none p-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cyan/30"
                    >
                        ×
                    </button>
                </div>
                <div className="p-5">
                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">タイトル *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                            placeholder="ほんの なまえを いれて ください"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">さくしゃ *</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                            placeholder="さくしゃの なまえを いれて ください"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">がぞう URL</label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                            placeholder="https://..."
                        />
                    </div>

                    {/* <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">よんだ かいすう</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.readCount}
                            onChange={(e) => setFormData({ ...formData, readCount: parseInt(e.target.value) || 1 })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                        />
                    </div> */}

                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">ひょうか *</label>
                        <StarRating
                            rating={formData.rating}
                            onRatingChange={(rating) => setFormData({ ...formData, rating })}
                            size="large"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">かんそう</label>
                        <textarea
                            value={formData.review}
                            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white resize-y min-h-[100px] focus:outline-none focus:border-[#99e6e6]"
                            placeholder="かんそうを かいて ください"
                            rows={4}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">よんだ ひ</label>
                        <input
                            type="date"
                            value={formData.readDate}
                            onChange={(e) => setFormData({ ...formData, readDate: e.target.value })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button variant="secondary" onClick={onClose}>
                            キャンセル
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            とうろく
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};