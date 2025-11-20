import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const title = request.nextUrl.searchParams.get('title');

    if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const applicationId = process.env.RAKUTEN_APP_ID;
    const baseUrl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';

    const params = new URLSearchParams({
        applicationId: applicationId!,
        title: title,
        hits: '5',
    });

    try {
        const response = await fetch(`${baseUrl}?${params}`);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch from Rakuten API' },
            { status: 500 }
        );
    }
}
