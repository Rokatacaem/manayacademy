import { NextRequest, NextResponse } from 'next/server'
import { prisma, getTenantPrisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const payload = await req.json()
    const { type, data } = payload

    if (!data || !data.email_id) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const emailId = data.email_id

    try {
        // Since it's multi-tenant, we need to find which tenant this email belongs to.
        // Option 1: Search across all tenants (might be slow if many).
        // Option 2: Include tenantId in the metadata when sending (better).
        // For now, let's search in the global prisma or use a dedicated tracking table if we had one.

        // Find the log entry by externalId
        const logEntry = await (prisma as any).emailLog.findFirst({
            where: { externalId: emailId }
        })

        if (!logEntry) {
            console.warn(`Webhook received for unknown email ID: ${emailId}`)
            return NextResponse.json({ ok: true }) // Still return 200 to Resend
        }

        const db = getTenantPrisma(logEntry.tenantId)

        if (type === 'email.opened') {
            await db.emailLog.update({
                where: { id: logEntry.id },
                data: {
                    status: 'OPENED',
                    openedAt: new Date()
                }
            })
        } else if (type === 'email.clicked') {
            await db.emailLog.update({
                where: { id: logEntry.id },
                data: {
                    status: 'CLICKED',
                    clickedAt: new Date()
                }
            })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
