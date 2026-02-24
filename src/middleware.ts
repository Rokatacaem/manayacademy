import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
        // Force match admin
        "/admin/:path*",
    ],
}

export default auth(async function middleware(req) {
    const { nextUrl, auth: session } = req
    const isLoggedIn = !!session
    const userRole = (session?.user as any)?.role

    // Default tenant slug for simple single-tenant operation
    const DEFAULT_SLUG = 'demo'

    const path = nextUrl.pathname

    // Protect ANY path that contains /admin
    const isAccessingAdmin = path === '/admin' || path.startsWith('/admin/') || path.includes('/admin/') || path.endsWith('/admin')

    if (isAccessingAdmin) {
        if (!isLoggedIn || userRole !== 'ADMIN') {
            console.log(`Basking access to ${path} - Not logged in or not ADMIN`)
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Only rewrite if it's the root /admin path
        if (path.startsWith('/admin')) {
            return NextResponse.rewrite(new URL(`/tenant/${DEFAULT_SLUG}${path}`, req.url))
        }
    }

    if (path.startsWith('/courses')) {
        return NextResponse.rewrite(new URL(`/tenant/${DEFAULT_SLUG}${path}`, req.url))
    }

    return NextResponse.next()
})
