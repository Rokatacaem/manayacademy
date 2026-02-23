
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    // NO adapter: with JWT strategy + Credentials, adapter is not needed and causes conflicts
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6), tenantId: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password, tenantId } = parsedCredentials.data;

                    const user = await prisma.user.findFirst({
                        where: { email, tenantId },
                    });

                    if (!user) return null;
                    if (!user.password) return null; // OAuth user

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
    callbacks: {
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
    }
})
