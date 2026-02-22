
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function TenantPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // Basic tenant info
    const tenant = await prisma.tenant.findUnique({
        where: { slug }
    });

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">Welcome to {tenant?.name}</h1>
            <div className="flex gap-4">
                <Link href="/admin/courses" className="text-blue-500 hover:underline">
                    Go to Admin / Courses
                </Link>
                <Link href="/courses" className="text-blue-500 hover:underline">
                    Go to Public Catalog
                </Link>
            </div>
        </div>
    );
}
