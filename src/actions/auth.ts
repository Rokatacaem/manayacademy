
'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function register(
    prevState: string | undefined,
    formData: FormData,
) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const slug = formData.get('slug') as string

    if (!name || !email || !password || !slug) {
        return 'Missing fields'
    }

    try {
        const tenant = await prisma.tenant.findUnique({ where: { slug } });
        if (!tenant) return 'Tenant not found';

        // Check if user exists within this tenant
        const existingUser = await prisma.user.findFirst({
            where: { email, tenantId: tenant.id }
        });

        if (existingUser) {
            return 'Email already exists in this tenant.'
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                tenantId: tenant.id,
                role: 'STUDENT', // Default role
            }
        })

    } catch (error) {
        console.error('Registration failed:', error)
        return 'Failed to create user.'
    }

    redirect(`/_tenant/${slug}/login?registered=true`)
}
