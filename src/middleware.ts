import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    console.log('🔍 Middleware実行中:', req.nextUrl.pathname)

    const res = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => req.cookies.get(name)?.value,
                set: (name, value, options) => {
                    res.cookies.set(name, value, options)
                },
                remove: (name, options) => {
                    res.cookies.set(name, '', { ...options, maxAge: 0 })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    console.log('🔐 セッション状態:', user ? 'ログイン中' : '未ログイン')

    const { pathname } = req.nextUrl

    const protectedPaths = ['/', '/read', '/search', '/wishlist', '/settings']
    const authPaths = ['/login', '/signup']

    const isProtected = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
    const isAuth = authPaths.some((path) => pathname.startsWith(path))

    console.log('📍 パス判定:', { pathname, isProtected, isAuth })

    if (!user && isProtected) {
        console.log('🚫 リダイレクト: /login へ')
        const redirectUrl = new URL('/login', req.url)
        return NextResponse.redirect(redirectUrl)
    }

    if (user && isAuth) {
        console.log('🚫 リダイレクト: / へ')
        const redirectUrl = new URL('/', req.url)
        return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ そのまま通過')
    return res
}

export const config = {
    matcher: [
        '/',
        '/read/:path*',
        '/search/:path*',
        '/wishlist/:path*',
        '/settings/:path*',
        '/login',
        '/signup',
        '/onboarding',
    ],
}

