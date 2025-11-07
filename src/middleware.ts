import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
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
    ],
}

