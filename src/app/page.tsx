'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MenuBar } from '@/components/MenuBar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { StarRating } from '@/components/StarRating';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'read' | 'search' | 'wishlist'>('home');
  const [rating, setRating] = useState(3);

  return (
    <div>
      <Header />
      <main className='pt-5 pb-[150px] px-9 max-w-[1200px] w-full mx-auto'>
        <h1 className="text-3xl font-bold mb-6 text-brown">コンポーネント テスト</h1>
        
        {/* ボタンテスト */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-brown">ボタン</h2>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary" size="small">ちいさい</Button>
            <Button variant="primary" size="medium">ふつう</Button>
            <Button variant="primary" size="large">おおきい</Button>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            <Button variant="secondary">しろい ボタン</Button>
            <Button variant="danger">さくじょ ボタン</Button>
          </div>
        </Card>

        {/* カードテスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <h3 className="font-bold mb-2 text-brown">ふつうの カード</h3>
            <p className="text-brown">ほんの じょうほうを ひょうじ します</p>
          </Card>
          <Card hoverable>
            <h3 className="font-bold mb-2 text-brown">ホバー できる カード</h3>
            <p className="text-brown">マウスを のせると うごきます</p>
          </Card>
        </div>

        {/* 星評価テスト */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-brown">ほしの ひょうか</h2>
          <div className="mb-4">
            <p className="mb-2 text-brown">クリックして へんこう できます</p>
            <StarRating rating={rating} onRatingChange={setRating} size="large" />
            <p className="mt-2 text-brown">げんざいの ひょうか: {rating} ★</p>
          </div>
          <div className="mb-4">
            <p className="mb-2 text-brown">よめない せいど（medium）</p>
            <StarRating rating={4} readonly size="medium" />
          </div>
          <div>
            <p className="mb-2 text-brown">ちいさい せいど（small）</p>
            <StarRating rating={5} readonly size="small" />
          </div>
        </Card>

        {/* メニューバーの状態テスト */}
        <Card>
          <h2 className="text-xl font-bold mb-4 text-brown">メニューバー</h2>
          <p className="text-brown">したの メニューバーを クリックして ページを きりかえて ください</p>
          <p className="mt-2 text-brown font-bold">げんざいの ページ: {currentPage}</p>
        </Card>
      </main>
      <MenuBar currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
