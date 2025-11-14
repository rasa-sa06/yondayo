"use client";

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { AgeCategory, BookCategory, RecommendedBook, RakutenBooksResponse } from '../../types';
import { useApp } from "../../contexts/AppContext";

export default function Search() {
    const { addToWishlist } = useApp();
    const [searchType, setSearchType] = useState<'age' | 'category' | 'author' | 'keyword'>('age');
    const [selectedAge, setSelectedAge] = useState<AgeCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<RecommendedBook[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const ageCategories: AgeCategory[] = ['0歳', '1歳', '2歳', '3歳', '4歳', '5歳', '6歳', '小学校低学年'];
    const bookCategories: BookCategory[] = [
        'えほん', 'ずかん', 'かがく', 'ことば', 'きもち', 'きせつ', 'いきもの', 'あそび', 'シリーズ', 'しぜん'
    ];

    // 年齢 → ひらがなキーワード (titleパラメータで検索)
    const ageToKeyword: Record<AgeCategory, string> = {
        '0歳': '0さい',
        '1歳': '1さい',
        '2歳': '2さい',
        '3歳': '3さい',
        '4歳': '4さい',
        '5歳': '5さい',
        '6歳': '6さい',
        '小学校低学年': 'しょうがっこう',
    };

    // カテゴリ → 検索設定
    const categoryConfig: Record<BookCategory, { genreId: string; title?: string }> = {
        'えほん': { genreId: '001003003' },  // ジャンルIDのみ
        'ずかん': { genreId: '001003003', title: 'ずかん' },
        'かがく': { genreId: '001003003', title: 'かがく' },
        'ことば': { genreId: '001003003', title: 'ことば' },
        'きもち': { genreId: '001003003', title: 'きもち' },
        'きせつ': { genreId: '001003003', title: 'きせつ' },
        'いきもの': { genreId: '001003003', title: 'いきもの' },
        'あそび': { genreId: '001003003', title: 'あそび' },
        'シリーズ': { genreId: '001003003', title: 'しりーず' },
        'しぜん': { genreId: '001003003', title: 'しぜん' },
    };

    const handleAgeClick = (age: AgeCategory) => {
        setSelectedAge(selectedAge === age ? null : age);
    };

    const handleCategoryClick = (category: BookCategory) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    // 楽天APIを呼び出す関数
    const searchRakutenBooks = async (genreId: string, title?: string, keyword?: string) => {
        try {
            let apiUrl = `/api/rakuten?genreId=${genreId}`;

            if (title) {
                apiUrl += `&title=${encodeURIComponent(title)}`;
            }

            if (keyword) {
                apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
            }

            console.log('🔍 検索開始:', apiUrl);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('検索に失敗しました');
            }

            const data: RakutenBooksResponse = await response.json();

            const books: RecommendedBook[] = data.Items.map((item, index) => ({
                id: item.Item.isbn || `book-${index}`,
                title: item.Item.title,
                author: item.Item.author || '著者不明',
                imageUrl: item.Item.largeImageUrl || item.Item.mediumImageUrl || '',
                publisher: item.Item.publisherName || '',
                description: item.Item.itemCaption || '',
            }));

            return books;
        } catch (error) {
            console.error('検索エラー:', error);
            throw error;
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setSearchResults([]);

        try {
            let results: RecommendedBook[] = [];

            if (searchType === 'age' && selectedAge) {
                // 年齢検索 (titleパラメータ)
                results = await searchRakutenBooks('001003003', ageToKeyword[selectedAge]);
            } else if (searchType === 'category' && selectedCategory) {
                // カテゴリ検索
                const config = categoryConfig[selectedCategory];
                results = await searchRakutenBooks(config.genreId, config.title);
            } else if (searchType === 'author' && authorName) {
                // 著者検索 (titleパラメータ)
                results = await searchRakutenBooks('001003003', authorName);
            } else if (searchType === 'keyword' && keyword) {
                // キーワード検索 (titleパラメータ)
                results = await searchRakutenBooks('001003003', keyword);
            } else {
                alert('検索条件を選択してください');
                setIsLoading(false);
                return;
            }

            setSearchResults(results);
        } catch (error) {
            alert('検索に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
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
                        <Image
                            src="/icon-search.png"
                            alt="検索アイコン"
                            width={24}
                            height={24}
                            className="inline-block mr-2"
                        />
                        けんさく
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
                                            onClick={async () => {
                                                await addToWishlist(book);
                                                alert('よみたい ほんに ついか しました！');
                                            }}
                                        >
                                            <Image
                                                src="/icon-add.png"
                                                alt="追加アイコン"
                                                width={24}
                                                height={24}
                                                className="inline-block mr-2"
                                            />
                                            よみたい ほんに ついか
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