
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
                    const normalizedEmail = email.toLowerCase();

                    const user = await prisma.user.findFirst({
                        where: { email: normalizedEmail, tenantId },
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
})
