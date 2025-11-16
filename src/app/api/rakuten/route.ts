// src/app/api/rakuten/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 楽天APIのアプリケーションID（環境変数から取得）
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;

export async function GET(request: NextRequest) {
    try {
        // URLからクエリパラメータを取得
        const searchParams = request.nextUrl.searchParams;
        const genreId = searchParams.get('genreId'); // ジャンルID
        const title = searchParams.get('title'); // タイトル
        const keyword = searchParams.get('keyword'); // キーワード
        const page = searchParams.get('page') || '1';  // ページ番号を取得(デフォルト1)

        // APIキーが設定されているか確認
        if (!RAKUTEN_APP_ID) {
            return NextResponse.json(
                { error: 'APIキーが設定されていません' },
                { status: 500 }
            );
        }

        // 楽天APIのURLを構築
        let apiUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?`;
        apiUrl += `format=json`;
        apiUrl += `&applicationId=${RAKUTEN_APP_ID}`;
        apiUrl += `&hits=10`;
        apiUrl += `&page=${page}`;
        apiUrl += `&sort=reviewAverage`;  // 常に評価順

        // ジャンルIDがある場合は追加
        if (genreId) {
            apiUrl += `&booksGenreId=${genreId}`;
        }

        // タイトル検索の場合
        if (title) {
            apiUrl += `&title=${encodeURIComponent(title)}`;
        }

        // キーワード検索の場合
        if (keyword) {
            apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
        }

        console.log('🔍 楽天API呼び出し:', apiUrl);

        // 楽天APIを呼び出し
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`楽天API呼び出しエラー: ${response.status}`);
        }

        const data = await response.json();

        // 結果を返す
        return NextResponse.json({
            items: data.Items || [],
            page: data.page || 1,
            pageCount: data.pageCount || 0,
            count: data.count || 0,
        });

    } catch (error) {
        console.error('APIエラー:', error);
        return NextResponse.json(
            { error: 'データの取得に失敗しました' },
            { status: 500 }
        );
    }
}