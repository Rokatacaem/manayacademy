
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
    secret: process.env.AUTH_SECRET ?? "manay-academy-secret-2026-local",
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                return null; // Logic is in auth.ts
            },
        }),
    ],
    pages: {
        signIn: '/login', // Will be dynamic in middleware
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const userRole = (auth?.user as any)?.role;

            if (isOnAdmin) {
                if (isLoggedIn && userRole === 'ADMIN') return true;
                return false; // Redirect unauthenticated or non-admin users to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.tenantId = (user as any).tenantId;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).tenantId = token.tenantId;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
} satisfies NextAuthConfig
