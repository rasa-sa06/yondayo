import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (!code) {
        // codeがない場合はHOMEへ
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 🍪 Next.jsのcookies APIを取得（非同期）
    const cookieStore = await cookies();

    // 🔐 Supabaseサーバークライアントを作成
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    cookieStore.set(name, value, options);
                },
                remove(name, options) {
                    cookieStore.set(name, '', { ...options, maxAge: 0 });
                },
            },
        }
    );

    // 🪄 メール確認リンクの code からセッションを確立
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
        console.error('セッション確立エラー:', exchangeError);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 👤 現在のユーザー情報を取得
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('ユーザー取得エラー:', userError);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 👶 子どもが登録済みか確認
    const { data: children, error: childError } = await supabase
        .from('children')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

    if (childError) {
        console.error('子どもデータ取得エラー:', childError);
    }

    // 🧭 子どもが未登録なら /onboarding に誘導
    if (!children || children.length === 0) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // ✅ すでに登録済みならホームへ
    return NextResponse.redirect(new URL('/', request.url));
}
