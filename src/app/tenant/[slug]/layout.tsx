
import { ReactNode } from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Next.js 15+ Params are async in layouts too? No, usually in page.
// In Next.js 15, params is Promise? Check recent docs. 
// "In Next.js 15, params is asynchronous".
// So `params` should be awaited.

export default async function TenantLayout({
    children,
    params
}: {
    children: ReactNode;
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const tenant = await prisma.tenant.findUnique({
        where: { slug }
    });

    if (!tenant) {
        notFound();
    }

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-zinc-900"
            data-tenant={tenant.id}
            style={tenant.brandColor ? { '--primary': tenant.brandColor } as React.CSSProperties : undefined}
        >
            {/* Dynamic Theme Injection */}
            {tenant.brandColor && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root { --primary: ${tenant.brandColor}; }
                    .bg-primary { background-color: ${tenant.brandColor}; }
                    .text-primary { color: ${tenant.brandColor}; }
                    .border-primary { border-color: ${tenant.brandColor}; }
                    /* Add more utility overrides if needed or use CSS variables in CSS file */
                `}} />
            )}
            {children}
        </div>
    );
}
