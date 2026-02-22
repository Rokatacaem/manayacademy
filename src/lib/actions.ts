
'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const slug = formData.get('slug') as string;
        const { prisma } = await import('@/lib/prisma');

        let tenant;
        if (slug) {
            tenant = await prisma.tenant.findUnique({ where: { slug } });
        } else {
            // Single-tenant fallback: get the first active tenant
            tenant = await prisma.tenant.findFirst();
        }

        if (!tenant) return 'System not initialized. Please run seeds.';

        await signIn('credentials', {
            ...Object.fromEntries(formData),
            tenantId: tenant.id,
            redirectTo: '/admin',
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}
