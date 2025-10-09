// features/SearchPage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { AgeCategory, BookCategory, RecommendedBook } from '../types';

type SearchPageProps = {
    onAddToWishlist: (book: RecommendedBook) => void;
};

export function SearchPage({ onAddToWishlist }: SearchPageProps) {
    const [searchType, setSearchType] = useState<'age' | 'category' | 'author' | 'keyword'>('age');
    const [selectedAge, setSelectedAge] = useState<AgeCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<RecommendedBook[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const ageCategories: AgeCategory[] = ['0歳', '1歳', '2歳', '3歳', '4歳', '5歳', '小学校低学年'];
    const bookCategories: BookCategory[] = [
        'えほん', 'ずかん', 'かがく', 'ことば', 'きもち', 'きせつ', 'いきもの', 'あそび', 'シリーズ', 'しぜん'
    ];

    const handleAgeClick = (age: AgeCategory) => {
        setSelectedAge(selectedAge === age ? null : age);
    };

    const handleCategoryClick = (category: BookCategory) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => {
            setSearchResults([
                {
                    id: '1',
                    title: 'はらぺこ あおむし',
                    author: 'エリック・カール',
                    imageUrl: '',
                    publisher: 'へんしゅうしゃ',
                    description: 'ちいさな あおむしが たべものを たべて おおきく なる おはなし',
                },
                {
                    id: '2',
                    title: 'ぐりとぐら',
                    author: 'なかがわ りえこ',
                    imageUrl: '',
                    publisher: 'ふくいんかん',
                    description: 'のねずみの ぐりと ぐらが おおきな かすてらを つくる おはなし',
                },
                {
                    id: '3',
                    title: 'おおきな かぶ',
                    author: 'A・トルストイ',
                    imageUrl: '',
                    publisher: 'ふくいんかん',
                    description: 'おじいさんが うえた かぶが おおきく そだちすぎて ぬけません',
                },
            ]);
            setIsLoading(false);
        }, 1000);
    };

    const typeButtonClassName = (isActive: boolean) => clsx(
        'p-3 border-2 border-cyan rounded-xl font-mplus text-base font-medium cursor-pointer transition-all',
        isActive ? 'bg-cyan text-brown font-bold' : 'bg-white text-brown hover:bg-cyan/30'
    );

    const optionButtonClassName = (isSelected: boolean) => clsx(
        'p-4 rounded-xl font-mplus text-base cursor-pointer transition-all',
        isSelected
            ? 'border-[3px] border-cyan bg-cyan font-bold'
            : 'border-2 border-cyan bg-cream hover:bg-cyan/30'
    );

    const inputClassName = clsx(
        'w-full p-4 border-2 border-cyan rounded-xl',
        'font-mplus text-base text-brown bg-cream',
        'focus:outline-none focus:border-[#99e6e6]'
    );

    return (
        <div className="max-w-[800px] mx-auto pb-5">
            <h1 className="text-[28px] font-bold text-brown mb-6 mt-6 text-center">
                ほんを さがす
            </h1>

            <Card>
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                        { type: 'age' as const, label: 'ねんれい' },
                        { type: 'category' as const, label: 'カテゴリ' },
                        { type: 'author' as const, label: 'さくしゃ' },
                        { type: 'keyword' as const, label: 'キーワード' },
                    ].map((item) => (
                        <button
                            key={item.type}
                            onClick={() => setSearchType(item.type)}
                            className={typeButtonClassName(searchType === item.type)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    {searchType === 'age' && (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                                ※ もういちど クリック すると せんたくを かいじょ できます
                            </p>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                                {ageCategories.map((age) => (
                                    <button
                                        key={age}
                                        onClick={() => handleAgeClick(age)}
                                        className={optionButtonClassName(selectedAge === age)}
                                    >
                                        {age}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchType === 'category' && (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                                ※ もういちど クリック すると せんたくを かいじょ できます
                            </p>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                                {bookCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={optionButtonClassName(selectedCategory === category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchType === 'author' && (
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="さくしゃの なまえを いれて ください"
                            className={inputClassName}
                        />
                    )}

                    {searchType === 'keyword' && (
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="キーワードを いれて ください"
                            className={inputClassName}
                        />
                    )}

                    <Button onClick={handleSearch} variant="primary" size="large" fullWidth>
                        🔍 けんさく
                    </Button>
                </div>
            </Card>

            {isLoading && (
                <div className="text-center py-10 text-lg text-brown">
                    <p>けんさく ちゅう...</p>
                </div>
            )}

            {!isLoading && searchResults.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-brown mb-5">
                        けんさく けっか ({searchResults.length}けん)
                    </h2>
                    <div className="flex flex-col gap-4">
                        {searchResults.map((book) => (
                            <Card key={book.id} hoverable>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-[100px] h-[140px] relative">
                                        {book.imageUrl ? (
                                            <Image
                                                src={book.imageUrl}
                                                alt={book.title}
                                                fill
                                                sizes="100px"
                                                className="object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className={clsx(
                                                'w-full h-full bg-gray-200 rounded-lg',
                                                'flex items-center justify-center text-[40px]'
                                            )}>
                                                📚
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <h3 className="text-lg font-bold text-brown m-0">{book.title}</h3>
                                        <p className="text-sm text-gray-600 m-0">{book.author}</p>
                                        <p className="text-[13px] text-gray-500 m-0">{book.publisher}</p>
                                        {book.description && (
                                            <p className="text-sm text-brown leading-relaxed m-0">{book.description}</p>
                                        )}
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => {
                                                onAddToWishlist(book);
                                                alert('よみたい ほんに ついか しました！');
                                            }}
                                        >
                                            📌 よみたい ほんに ついか
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}