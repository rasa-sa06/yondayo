import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        // メール確認後、セッションを確立
        await supabase.auth.exchangeCodeForSession(code);

        // ユーザー情報を取得
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // 子どもが登録されているか確認
            const { data: children } = await supabase
                .from('children')
                .select('id')
                .eq('user_id', user.id)
                .limit(1);

            // 子どもが登録されていなければオンボーディングへ
            if (!children || children.length === 0) {
                return NextResponse.redirect(new URL('/onboarding', request.url));
            }
        }
    }

    // それ以外はHOMEへ
    return NextResponse.redirect(new URL('/', request.url));
}