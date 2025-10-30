import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const { data } = await supabase.auth.getSession();
    const session = data?.session ?? null;

    const { pathname } = req.nextUrl;

    // ------------------------
    // ページカテゴリ
    // ------------------------
    const protectedPaths = ['/', '/read', '/search', '/wishlist', '/settings'];
    const authPaths = ['/login', '/signup'];

    // ------------------------
    // 判定
    // ------------------------
    const isProtected = protectedPaths.some(
        path => pathname === path || pathname.startsWith(`${path}/`)  // ← 修正
    );
    const isAuth = authPaths.some(path => pathname.startsWith(path));

    // 未ログイン → 保護ページ → /login
    if (!session && isProtected) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // ログイン済み → 認証ページ → /
    if (session && isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

// ------------------------
// Middleware適用パス
// ------------------------
export const config = {
    matcher: [
        '/',
        '/read/:path*',
        '/search/:path*',
        '/wishlist/:path*',
        '/settings/:path*',
        '/login',
        '/signup',
    ],
};