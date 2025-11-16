"use client";

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { AgeCategory, BookCategory, RecommendedBook, RakutenBooksResponse, PaginatedBooksResponse } from '../../types';
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
    const [currentPage, setCurrentPage] = useState(1);  // 現在のページ
    const [totalPages, setTotalPages] = useState(1);     // 総ページ数
    const [totalCount, setTotalCount] = useState(0);     // 総件数
    const [lastSearchParams, setLastSearchParams] = useState<{  // 最後の検索条件を保存
        genreId: string;
        title?: string;
        keyword?: string;
    } | null>(null);

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
        'シリーズ': { genreId: '001003003', title: 'シリーズ' },
        'しぜん': { genreId: '001003003', title: 'しぜん' },
    };

    const handleAgeClick = (age: AgeCategory) => {
        setSelectedAge(selectedAge === age ? null : age);
    };

    const handleCategoryClick = (category: BookCategory) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    // 楽天APIを呼び出す関数
    const searchRakutenBooks = async (genreId: string, page: number, title?: string, keyword?: string) => {
        try {
            let apiUrl = `/api/rakuten?genreId=${genreId}&page=${page}`;

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

            const data: PaginatedBooksResponse = await response.json();

            console.log('🔍 APIレスポンス:', data);

            const books: RecommendedBook[] = data.items.map((item, index) => ({
                id: item.Item.isbn || `book-${index}`,
                title: item.Item.title,
                author: item.Item.author || '著者不明',
                imageUrl: item.Item.largeImageUrl || item.Item.mediumImageUrl || '',
                publisher: item.Item.publisherName || '',
                description: item.Item.itemCaption || '',
            }));

            return {
                books,
                page: data.page,
                pageCount: data.pageCount,
                count: data.count,
            };
        } catch (error) {
            console.error('検索エラー:', error);
            throw error;
        }
    };

    const handleSearch = async (page: number = 1) => {
        setIsLoading(true);
        setSearchResults([]);

        try {
            let searchParams = { genreId: '', title: '', keyword: '' };

            if (searchType === 'age' && selectedAge) {
                // 年齢検索
                searchParams = {
                    genreId: '001003003',
                    title: ageToKeyword[selectedAge],
                    keyword: '',
                };
            } else if (searchType === 'category' && selectedCategory) {
                // カテゴリ検索
                const config = categoryConfig[selectedCategory];
                searchParams = {
                    genreId: config.genreId,
                    title: config.title || '',
                    keyword: '',
                };
            } else if (searchType === 'author' && authorName) {
                // 著者検索
                searchParams = {
                    genreId: '001003003',
                    title: authorName,
                    keyword: '',
                };
            } else if (searchType === 'keyword' && keyword) {
                // キーワード検索
                searchParams = {
                    genreId: '001003003',
                    title: keyword,
                    keyword: '',
                };
            } else {
                alert('検索条件を選択してください');
                setIsLoading(false);
                return;
            }

            // 検索パラメータを保存(ページ切り替え時に使用)
            setLastSearchParams(searchParams);

            // 検索実行
            const result = await searchRakutenBooks(
                searchParams.genreId,
                page,
                searchParams.title,
                searchParams.keyword
            );

            setSearchResults(result.books);
            setCurrentPage(result.page);
            setTotalPages(result.pageCount);
            setTotalCount(result.count);

            console.log('📊 検索結果:', {
                books: result.books.length,
                currentPage: result.page,
                totalPages: result.pageCount,
                totalCount: result.count
            });

        } catch (error) {
            alert('検索に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    // ページ切り替え用の関数(新規追加)
    const handlePageChange = async (newPage: number) => {
        if (!lastSearchParams) return;

        setIsLoading(true);

        try {
            const result = await searchRakutenBooks(
                lastSearchParams.genreId,
                newPage,
                lastSearchParams.title,
                lastSearchParams.keyword
            );

            setSearchResults(result.books);
            setCurrentPage(result.page);
            setTotalPages(result.pageCount);
            setTotalCount(result.count);

            // ページトップにスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            alert('ページの読み込みに失敗しました');
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

                    <Button onClick={() => handleSearch(1)} variant="primary" size="large" fullWidth>
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
                        けんさく けっか {totalCount}けん ({(currentPage - 1) * 10 + 1}〜{Math.min(currentPage * 10, totalCount)}けんめ)
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
                    {/* ページネーション UI (ここから追加) */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-2">
                            {/* 前へボタン */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={clsx(
                                    'px-4 py-2 rounded-lg font-mplus font-medium transition-all',
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-cyan text-brown hover:bg-cyan/80 cursor-pointer'
                                )}
                            >
                                ← まえ
                            </button>

                            {/* ページ番号ボタン */}
                            <div className="flex gap-2">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    // 現在のページ周辺のページ番号を表示
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        // 総ページ数が5以下ならすべて表示
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        // 最初の方にいる場合
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        // 最後の方にいる場合
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        // 真ん中にいる場合
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={clsx(
                                                'w-10 h-10 rounded-lg font-mplus font-medium transition-all',
                                                currentPage === pageNum
                                                    ? 'bg-brown text-cream font-bold'
                                                    : 'bg-cyan text-brown hover:bg-cyan/80 cursor-pointer'
                                            )}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 次へボタン */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={clsx(
                                    'px-4 py-2 rounded-lg font-mplus font-medium transition-all',
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-cyan text-brown hover:bg-cyan/80 cursor-pointer'
                                )}
                            >
                                つぎ →
                            </button>
                        </div>
                    )}

                    {/* ページ情報の表示 */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                        {currentPage} / {totalPages} ページ
                    </div>
                </div>
            )}
        </div>
    );
}