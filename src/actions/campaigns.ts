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
        const { data, error } = await getResend().emails.send({
            from: fromEmail,
            to: testEmails,
            subject: `[PRUEBA] ${campaign.subject}`,
            html: buildEmailTemplate(campaign.content || '<p>Sin contenido</p>', campaign.subject),
        })

        if (error) {
            console.error('sendTestEmail Resend error:', error)
            return { error: `Error de Resend: ${error.name} - ${error.message}` }
        }

        return { success: `✅ Email de prueba enviado a: ${testEmails.join(', ')} (ID: ${data?.id})` }
    } catch (err: any) {
        console.error('sendTestEmail unexpected error:', err)
        return { error: `Error inesperado: ${err?.message ?? 'desconocido'}` }
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

    // Use Resend Batch API for better performance and tracking
    const batchSize = 100
    for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize)

        try {
            const batchRequest = batch.map(contact => ({
                from: fromEmail,
                to: contact.email,
                subject: campaign.subject,
                html: buildEmailTemplate(campaign.content || '<p>Sin contenido</p>', campaign.subject),
            }))

            const { data, error } = await getResend().batch.send(batchRequest)

            if (error) {
                console.error(`Resend Batch Error:`, error)
                errorCount += batch.length
                // Log all as failed in this batch
                const logData = batch.map(contact => ({
                    tenantId,
                    campaignId,
                    contactId: contact.id,
                    status: 'BOUNCED',
                }))
                await db.emailLog.createMany({ data: logData })
            } else if (data && Array.isArray(data.data)) {
                // Success - map Resend IDs back to our contacts
                for (let j = 0; j < batch.length; j++) {
                    const resendItem = data.data[j]
                    const contact = batch[j]

                    if (resendItem?.id) {
                        sentCount++
                        await db.emailLog.create({
                            data: {
                                tenantId,
                                campaignId,
                                contactId: contact.id,
                                status: 'SENT',
                                externalId: resendItem.id
                            }
                        })
                    } else {
                        errorCount++
                        await db.emailLog.create({
                            data: {
                                tenantId,
                                campaignId,
                                contactId: contact.id,
                                status: 'BOUNCED',
                            }
                        })
                    }
                }
            }
        } catch (e: any) {
            console.error(`Unexpected Batch Error:`, e)
            errorCount += batch.length
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

export async function getCampaignHourlyStats(tenantId: string, campaignId: string) {
    const db = getTenantPrisma(tenantId)
    const logs = await db.emailLog.findMany({
        where: { campaignId },
        select: {
            status: true,
            createdAt: true,
            openedAt: true,
            clickedAt: true
        }
    })

    // Group by hour
    const hourlyStats = logs.reduce((acc: any, log) => {
        const hour = log.createdAt.toISOString().substring(0, 13) + ':00' // YYYY-MM-DDTHH:00
        if (!acc[hour]) {
            acc[hour] = { sent: 0, opened: 0, clicked: 0, bounced: 0 }
        }

        if (log.status === 'SENT' || log.status === 'OPENED' || log.status === 'CLICKED') acc[hour].sent++
        if (log.status === 'BOUNCED') acc[hour].bounced++
        if (log.openedAt) acc[hour].opened++
        if (log.clickedAt) acc[hour].clicked++

        return acc
    }, {})

    return Object.entries(hourlyStats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([hour, stats]) => ({
            hour,
            ...(stats as any)
        }))
}

export async function duplicateCampaign(tenantId: string, id: string, formData?: FormData) {
    if (!id) return

    const db = getTenantPrisma(tenantId)

    const campaign = await db.campaign.findUnique({
        where: { id }
    })

    if (!campaign) return { error: 'Campaign not found' }

    let newCampaignId = ''
    try {
        const newCampaign = await db.campaign.create({
            data: {
                tenantId,
                subject: `${campaign.subject} (Copia)`,
                content: campaign.content,
                status: 'DRAFT'
            }
        })
        newCampaignId = newCampaign.id
    } catch (error) {
        console.error('Failed to duplicate campaign:', error)
        return { error: 'Failed to duplicate campaign.' }
    }

    revalidatePath('/admin/campaigns')
    redirect(`/admin/campaigns/${newCampaignId}`)
}


