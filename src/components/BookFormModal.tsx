import { useState, useEffect } from 'react';
import { Button } from './Button';
import { StarRating } from './StarRating';
import type { ReadingRecord, ReadingRecordWithBook, Book, Child } from '../types';
import { useApp } from '../contexts/AppContext';

type BookFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (record: Omit<ReadingRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: ReadingRecordWithBook;
};

export function BookFormModal({ isOpen, onClose, onSubmit, initialData, }: BookFormModalProps) {
    const { books, selectedChild, addBook } = useApp();
    const [formData, setFormData] = useState({
        bookId: '',
        title: '',
        author: '',
        imageUrl: '',
        // readCount: 1, 後で使うかも
        rating: 0,
        review: '',
        readDate: new Date().toISOString().split('T')[0],
    });

    const [isNewBook, setIsNewBook] = useState(true);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

    // 予測候補リスト
    const [suggestions, setSuggestions] = useState<Book[]>([]);


    useEffect(() => {
        if (initialData) {
            setFormData({
                // readCount: initialData.readCount || 1,　後で使うかも
                bookId: initialData.bookId,
                title: initialData.book.title || '',
                author: initialData.book.author || '',
                imageUrl: initialData.book.imageUrl || '',
                rating: initialData.rating || 0,
                review: initialData.review || '',
                readDate: initialData.readDate || new Date().toISOString().split('T')[0],
            });
            setIsNewBook(!initialData.bookId);
        } else {
            setFormData({
                bookId: '',
                title: '',
                author: '',
                imageUrl: '',
                rating: 0,
                review: '',
                readDate: new Date().toISOString().split('T')[0],
            });
            setIsNewBook(true);
        }
        setFilteredBooks([]);
    }, [initialData, isOpen]);

    // タイトル入力時の予測変換
    const handleTitleChange = (title: string) => {
        setFormData({ ...formData, title, bookId: '' });
        if (title.length > 0) {
            const matches = books.filter((b) =>
                b.title.toLowerCase().includes(title.toLowerCase())
            );
            setFilteredBooks(matches);
        } else {
            setFilteredBooks([]);
        }
    };

    const handleSelectBook = (book: Book) => {
        setFormData({
            ...formData,
            bookId: book.id,
            title: book.title,
            author: book.author || '',
            imageUrl: book.imageUrl || '',
        });
        setIsNewBook(false);
        setFilteredBooks([]);
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            alert('タイトルは ひつよう です');
            return;
        }
        if (formData.rating === 0) {
            alert('ひょうかを えらんで ください');
            return;
        }
        if (!selectedChild) {
            alert('子どもが選択されていません');
            return;
        }

        let finalBookId = formData.bookId;

        // 新しい本なら追加
        if (!finalBookId) {
            const bookId = await addBook({
                userId: selectedChild.userId,
                title: formData.title,
                author: formData.author,
                imageUrl: formData.imageUrl,
            });
            if (!bookId) {
                alert('ほんの とうろくに しっぱい しました');
                return;
            }
            finalBookId = bookId;
        }
        onSubmit({
            userId: selectedChild.userId,
            childId: selectedChild.id,
            bookId: finalBookId,
            rating: formData.rating,
            review: formData.review,
            readDate: formData.readDate,
        });
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
                    {/* タイトル入力 */}
                    <div className="mb-5 relative">
                        <label className="block mb-2 font-medium text-brown text-base">タイトル *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                            placeholder="ほんの なまえを いれて ください"
                        />
                        {/* 予測変換 */}
                        {filteredBooks.length > 0 && (
                            <ul className="absolute z-[100] bg-white border border-cyan rounded-xl mt-1 w-full max-h-40 overflow-y-auto">
                                {filteredBooks.map((b) => (
                                    <li
                                        key={b.id}
                                        className="p-2 cursor-pointer hover:bg-cyan/30"
                                        onClick={() => handleSelectBook(b)}
                                    >
                                        {b.title} {b.author ? `- ${b.author}` : ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 著者 */}
                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">さくしゃ</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                            placeholder="さくしゃの なまえを いれて ください"
                        />
                    </div>

                    {/* 画像URL */}
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

                    {/* 評価 */}
                    <div className="mb-5">
                        <label className="block mb-2 font-medium text-brown text-base">ひょうか *</label>
                        <StarRating
                            rating={formData.rating}
                            onRatingChange={(rating) => setFormData({ ...formData, rating })}
                            size="large"
                        />
                    </div>

                    {/* 感想 */}
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

                    {/* 読んだ日 */}
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
}