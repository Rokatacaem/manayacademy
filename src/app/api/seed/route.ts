
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const tenant = await prisma.tenant.upsert({
            where: { slug: 'demo' },
            update: {},
            create: {
                name: 'Demo Academy',
                slug: 'demo',
                type: 'BUSINESS'
            }
        });
        return NextResponse.json({ success: true, tenant });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
