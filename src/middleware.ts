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
    const { nextUrl } = req

    // Default tenant slug for simple single-tenant operation
    const DEFAULT_SLUG = 'demo'

    // Map clean URLs to internal tenant structure
    const path = nextUrl.pathname

    if (path.startsWith('/admin')) {
        return NextResponse.rewrite(new URL(`/tenant/${DEFAULT_SLUG}${path}`, req.url))
    }

    if (path.startsWith('/courses')) {
        return NextResponse.rewrite(new URL(`/tenant/${DEFAULT_SLUG}${path}`, req.url))
    }

    return NextResponse.next()
})
