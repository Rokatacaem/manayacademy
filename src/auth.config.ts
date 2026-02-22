
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
            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
} satisfies NextAuthConfig
