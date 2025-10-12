"use client";


import Image from 'next/image';
import clsx from 'clsx';
import { Card } from '../../components/Card';
import type { WishlistBook } from '../../types';
import { useApp } from "../../contexts/AppContext";

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useApp();
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}ねん ${month}がつ ${day}にち`;
    };

    return (
        <div className="max-w-[800px] mx-auto pb-5">
            <div className={clsx(
                'flex justify-between items-center mb-6 bg-white p-5',
                'rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
            )}>
                <h1 className="text-[28px] font-bold text-brown m-0">よみたい ほん</h1>
                <div className={clsx(
                    'bg-cyan px-5 py-2 rounded-[20px]',
                    'text-lg font-bold text-brown'
                )}>
                    {wishlist.length}さつ
                </div>
            </div>

            {wishlist.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {wishlist.map((book) => (
                        <Card key={book.id} hoverable>
                            <div className="flex gap-4 items-center">
                                <div className="flex-shrink-0 w-20 h-[100px] relative">
                                    {book.imageUrl ? (
                                        <Image
                                            src={book.imageUrl}
                                            alt={book.title}
                                            fill
                                            sizes="80px"
                                            className="object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className={clsx(
                                            'w-full h-full bg-gray-200 rounded-lg',
                                            'flex items-center justify-center text-[32px]'
                                        )}>
                                            📚
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <h3 className="text-lg font-bold text-brown m-0">{book.title}</h3>
                                    <p className="text-sm text-gray-600 m-0">{book.author}</p>
                                    <p className="text-xs text-gray-500 m-0">
                                        ついか した ひ: {formatDate(book.addedAt)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            if (window.confirm('リストから さくじょ しますか？')) {
                                                removeFromWishlist(book.id);
                                            }
                                        }}
                                        className={clsx(
                                            'px-4 py-2 text-sm font-mplus border-2 border-cyan rounded-[20px]',
                                            'cursor-pointer font-medium shadow-[0_2px_4px_rgba(102,0,0,0.1)]',
                                            'bg-white text-brown hover:bg-gray-50'
                                        )}
                                    >
                                        さくじょ
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className={clsx(
                    'text-center py-20 bg-white',
                    'rounded-[20px] shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
                )}>
                    <div className="text-[80px] mb-5 flex justify-center">  {/* flex justify-centerで中央よせ */}
                        <Image
                            src="/icon-add.png"  // public フォルダに置いた画像パス
                            alt="検索アイコン"
                            width={40}             // 好きなサイズに調整
                            height={40}
                        ></Image>
                    </div>
                    <p className="text-xl font-bold text-brown m-0 mb-3">
                        よみたい ほんが まだ ありません
                    </p>
                    <p className="text-base text-gray-500 m-0 leading-relaxed">
                        「ほんを さがす」から きになる ほんを ついか しましょう！
                    </p>
                </div>
            )}
        </div>
    );
}
