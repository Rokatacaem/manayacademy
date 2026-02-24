'use server'

import { prisma, getTenantPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Resend } from 'resend'
import { buildEmailTemplate } from "@/lib/emailTemplate"

function getResend() {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not configured. Go to resend.com to get your key and add it to .env')
    return new Resend(key)
}

export async function sendTestEmail(tenantId: string, campaignId: string, formData: FormData) {
    const testEmails = (formData.get('testEmails') as string ?? '').split(',').map(e => e.trim()).filter(Boolean)

    if (testEmails.length === 0) {
        return { error: 'Por favor ingresa al menos un correo de prueba.' }
    }

    const db = getTenantPrisma(tenantId)
    const campaign = await db.campaign.findUnique({ where: { id: campaignId } })
    if (!campaign) return { error: 'Campaña no encontrada.' }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    try {
        await getResend().emails.send({
            from: fromEmail,
            to: testEmails,
            subject: `[PRUEBA] ${campaign.subject}`,
            html: buildEmailTemplate(campaign.content || '<p>Sin contenido</p>', campaign.subject),
        })
        return { success: `✅ Email de prueba enviado a: ${testEmails.join(', ')}` }
    } catch (err: any) {
        console.error('sendTestEmail error:', err)
        return { error: `Error al enviar: ${err?.message ?? 'desconocido'}` }
    }
}

export async function createCampaign(tenantId: string, formData: FormData) {
    const subject = formData.get('subject') as string
    const content = formData.get('content') as string

    if (!subject) throw new Error('Subject is required')

    const db = getTenantPrisma(tenantId)

    try {
        await db.campaign.create({
            data: {
                tenantId, // Keeping it for TS compatibility
                subject,
                content,
                status: 'DRAFT'
            }
        })
    } catch (error) {
        console.error('Failed to create campaign:', error)
        return { error: 'Failed to create campaign.' }
    }

    revalidatePath('/admin/campaigns')
    redirect('/admin/campaigns')
}

export async function updateCampaign(tenantId: string, id: string, formData: FormData) {
    if (!id) return

    const subject = formData.get('subject') as string
    const content = formData.get('content') as string

    const db = getTenantPrisma(tenantId)

    try {
        await db.campaign.update({
            where: { id },
            data: {
                subject,
                content
            }
        })
    } catch (error) {
        console.error('Failed to update campaign:', error)
        return { error: 'Failed to update campaign.' }
    }

    revalidatePath('/admin/campaigns')
    revalidatePath(`/admin/campaigns/${id}`)
    redirect('/admin/campaigns')
}

export async function deleteCampaign(tenantId: string, id: string, formData?: FormData) {
    if (!id) return

    const db = getTenantPrisma(tenantId)

    try {
        await db.emailLog.deleteMany({
            where: { campaignId: id }
        })

        await db.campaign.delete({
            where: { id }
        })
    } catch (error) {
        console.error('Failed to delete campaign:', error)
        return { error: 'Failed to delete campaign.' }
    }

    revalidatePath('/admin/campaigns')
    redirect('/admin/campaigns')
}

export async function sendCampaign(tenantId: string, campaignId: string, formData: FormData) {
    if (!campaignId) return { error: 'Campaign ID required' }

    const targetType = formData.get('targetType') as string
    const tagIds = formData.getAll('tags') as string[]

    const db = getTenantPrisma(tenantId)

    const campaign = await db.campaign.findUnique({
        where: { id: campaignId }
    })

    if (!campaign) return { error: 'Campaign not found' }
    if (campaign.status === 'SENT') return { error: 'Campaign already sent' }

    let contacts: any[] = []

    if (targetType === 'tags' && tagIds.length > 0) {
        contacts = await db.contact.findMany({
            where: {
                status: 'ACTIVE',
                tags: {
                    some: {
                        id: { in: tagIds }
                    }
                }
            }
        })
    } else if (targetType === 'all') {
        contacts = await db.contact.findMany({
            where: { status: 'ACTIVE' }
        })
    }

    if (contacts.length === 0) {
        return { error: 'No active contacts found for selected criteria.' }
    }

    let sentCount = 0
    let errorCount = 0
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    for (const contact of contacts) {
        try {
            const { error } = await getResend().emails.send({
                from: fromEmail,
                to: contact.email,
                subject: campaign.subject,
                html: campaign.content || '',
            })

            if (error) {
                console.error(`Resend Error for ${contact.email}:`, error)
                errorCount++
                await db.emailLog.create({
                    data: {
                        tenantId,
                        campaignId,
                        contactId: contact.id,
                        status: 'BOUNCED',
                    }
                })
            } else {
                sentCount++
                await db.emailLog.create({
                    data: {
                        tenantId,
                        campaignId,
                        contactId: contact.id,
                        status: 'SENT',
                    }
                })
            }

        } catch (e) {
            console.error(`Unexpected Error for ${contact.email}:`, e)
            errorCount++
        }
    }

    await db.campaign.update({
        where: { id: campaignId },
        data: {
            status: 'SENT',
            sentAt: new Date(),
            stats: JSON.stringify({
                sent: sentCount,
                errors: errorCount,
                total: contacts.length
            })
        }
    })

    revalidatePath(`/admin/campaigns/${campaignId}`)
    revalidatePath('/admin/campaigns')
    redirect(`/admin/campaigns/${campaignId}`)
}
