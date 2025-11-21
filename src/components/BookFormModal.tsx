import { useState, useEffect } from 'react';
import { Button } from './Button';
import { StarRating } from './StarRating';
import Image from 'next/image';
import type { ReadingRecord, ReadingRecordWithBook, Book } from '../types';
import { useApp } from '../contexts/AppContext';

type BookFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (record: Omit<ReadingRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: ReadingRecordWithBook;
};

// 楽天APIの書籍データ型
type RakutenBook = {
    title: string;
    author: string;
    largeImageUrl: string;
};

// 楽天APIのレスポンス型
type RakutenApiItem = {
    Item: {
        title: string;
        author: string;
        largeImageUrl: string;
    };
};

type RakutenApiResponse = {
    Items?: RakutenApiItem[];
};

export function BookFormModal({ isOpen, onClose, onSubmit, initialData }: BookFormModalProps) {
    const { books, selectedChild, addBook } = useApp();
    const [formData, setFormData] = useState({
        bookId: '',
        title: '',
        author: '',
        imageUrl: '',
        rating: 0,
        review: '',
        readDate: new Date().toISOString().split('T')[0],
    });

    const [isNewBook, setIsNewBook] = useState(true);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

    // 楽天API検索用の状態
    const [rakutenResults, setRakutenResults] = useState<RakutenBook[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showRakutenResults, setShowRakutenResults] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
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
        setRakutenResults([]);
        setShowRakutenResults(false);
    }, [initialData, isOpen]);

    // タイトル入力時の予測変換（既存の本から）
    const handleTitleChange = (title: string) => {
        setFormData({ ...formData, title, bookId: '' });
        setShowRakutenResults(false); // 楽天検索結果を閉じる

        if (title.length > 0) {
            const matches = books.filter((b) =>
                b.title.toLowerCase().includes(title.toLowerCase())
            );
            setFilteredBooks(matches);
        } else {
            setFilteredBooks([]);
        }
    };

    // 楽天APIで検索
    const handleRakutenSearch = async () => {
        if (!formData.title.trim()) {
            alert('タイトルを いれて ください');
            return;
        }

        setIsSearching(true);
        setFilteredBooks([]); // 既存の本の予測を閉じる

        try {
            const response = await fetch(
                `/api/rakuten/search-by-title?title=${encodeURIComponent(formData.title)}`
            );
            const data: RakutenApiResponse = await response.json();

            if (data.Items && data.Items.length > 0) {
                const books = data.Items.map((item: RakutenApiItem) => ({
                    title: item.Item.title,
                    author: item.Item.author,
                    largeImageUrl: item.Item.largeImageUrl,
                }));
                setRakutenResults(books);
                setShowRakutenResults(true);
            } else {
                alert('けんさく けっかが ありませんでした');
                setRakutenResults([]);
            }
        } catch (error) {
            console.error('検索エラー:', error);
            alert('けんさくに しっぱい しました');
        } finally {
            setIsSearching(false);
        }
    };

    // 既存の本から選択
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

    // 楽天APIの検索結果から選択
    const handleSelectRakutenBook = (book: RakutenBook) => {
        setFormData({
            ...formData,
            bookId: '', // 新しい本なのでIDはなし
            title: book.title,
            author: book.author,
            imageUrl: book.largeImageUrl,
        });
        setShowRakutenResults(false);
        setRakutenResults([]);
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
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="flex-1 p-3 border-2 border-cyan rounded-xl font-mplus text-base text-brown bg-white focus:outline-none focus:border-[#99e6e6]"
                                placeholder="ほんの なまえを いれて ください"
                            />
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={handleRakutenSearch}
                                disabled={isSearching}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/icon-search.png"
                                        alt="検索"
                                        width={20}
                                        height={20}
                                    />
                                    <span>{isSearching ? 'さがしてるよ' : 'さがす'}</span>
                                </div>
                            </Button>
                        </div>

                        {/* 既存の本の予測変換 */}
                        {filteredBooks.length > 0 && (
                            <ul className="absolute z-[100] bg-white border border-cyan rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
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

                        {/* 楽天API検索結果 */}
                        {showRakutenResults && rakutenResults.length > 0 && (
                            <div className="absolute z-[100] bg-white border-2 border-orange rounded-xl mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                                <div className="p-2 bg-orange/10 font-medium text-brown text-sm border-b border-orange">
                                    楽天ブックスから けんさく
                                </div>
                                {rakutenResults.map((book, index) => (
                                    <div
                                        key={index}
                                        className="p-3 cursor-pointer hover:bg-orange/10 border-b border-gray-200 last:border-b-0 flex gap-3"
                                        onClick={() => handleSelectRakutenBook(book)}
                                    >
                                        {book.largeImageUrl && (
                                            <Image
                                                src={book.largeImageUrl}
                                                alt={book.title}
                                                width={48}
                                                height={64}
                                                className="w-12 h-16 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-brown text-sm">{book.title}</p>
                                            <p className="text-xs text-gray-600">{book.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                        {/* 画像プレビュー */}
                        {formData.imageUrl && (
                            <div className="mt-2">
                                <Image
                                    src={formData.imageUrl}
                                    alt="プレビュー"
                                    width={96}
                                    height={128}
                                    className="w-24 h-32 object-cover rounded border-2 border-cyan"
                                />
                            </div>
                        )}
                    </div>

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