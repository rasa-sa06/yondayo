import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user }
    } = await supabase.auth.getUser()

    console.log('🔍 Middleware:', {  // ← 追加
        pathname: request.nextUrl.pathname,
        user: user ? user.email : 'なし',
    });

    const { pathname } = request.nextUrl

    const protectedPaths = ['/', '/read', '/search', '/wishlist', '/settings']
    const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

    if (!user && isProtected) {
        console.log('❌ 未ログイン + 保護ページ → /login へリダイレクト');  // ← 追加
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    const authPaths = ['/login', '/signup']
    const isAuth = authPaths.some((path) => pathname.startsWith(path))

    if (user && isAuth) {
        console.log('❌ ログイン中 + 認証ページ → / へリダイレクト');  // ← 追加
        const redirectUrl = new URL('/', request.url)
        return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ そのまま通過');  // ← 追加
    return supabaseResponse
}