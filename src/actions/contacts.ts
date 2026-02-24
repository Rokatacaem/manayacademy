'use server'

import { prisma, getTenantPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createContact(tenantId: string, formData: FormData) {
    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const tagsInput = formData.get('tags') as string

    if (!email) {
        throw new Error('Email is required')
    }

    const db = getTenantPrisma(tenantId)
    const tagNames = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
        await db.contact.create({
            data: {
                tenantId,
                email,
                firstName,
                lastName,
                source: 'Manual Entry',
                tags: {
                    connectOrCreate: tagNames.map(name => ({
                        where: { tenantId_name: { name, tenantId } },
                        create: { name, tenantId }
                    }))
                }
            }
        })
    } catch (error) {
        console.error('Failed to create contact:', error)
        return { error: 'Failed to create contact. Email might already exist.' }
    }

    revalidatePath('/admin/contacts')
    redirect('/admin/contacts')
}

export async function updateContact(tenantId: string, id: string, formData: FormData) {
    if (!id) return { error: 'ID required' }

    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const tagsInput = formData.get('tags') as string
    const status = formData.get('status') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const db = getTenantPrisma(tenantId)
    const tagNames = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
        // Ownership check is still good as a double layer, 
        // but now 'findUnique' will implicitly filter by tenantId too via the extension!
        const existing = await db.contact.findUnique({
            where: { id }
        })

        if (!existing) {
            return { error: 'Contact not found or access denied.' }
        }

        await db.contact.update({
            where: { id },
            data: {
                email,
                firstName,
                lastName,
                status,
                tags: {
                    set: [],
                    connectOrCreate: tagNames.map(name => ({
                        where: { tenantId_name: { name, tenantId } },
                        create: { name, tenantId }
                    }))
                }
            }
        })
    } catch (error) {
        console.error('Failed to update contact:', error)
        return { error: 'Failed to update contact.' }
    }

    revalidatePath('/admin/contacts')
    revalidatePath(`/admin/contacts/${id}`)
    redirect('/admin/contacts')
}

export async function deleteContact(tenantId: string, id: string) {
    if (!id) return

    const db = getTenantPrisma(tenantId)

    try {
        await db.contact.delete({
            where: { id }
        })
    } catch (error) {
        console.error('Failed to delete contact:', error)
        return { error: 'Failed to delete contact.' }
    }

    revalidatePath('/admin/contacts')
    redirect('/admin/contacts')
}

export async function registerPublicLead(formData: FormData) {
    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string

    // In single-tenant production, we use a default tenant or find the first one
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) return { error: 'System not initialized. No tenant found.' }

    if (!email) return { error: 'Email is required' }

    try {
        await prisma.contact.upsert({
            where: { tenantId_email: { email, tenantId: tenant.id } },
            update: { firstName },
            create: {
                tenantId: tenant.id,
                email,
                firstName,
                source: 'Web/Landing'
            }
        })
        return { success: true }
    } catch (error) {
        console.error('Failed to register lead:', error)
        return { error: 'Registration failed. Please try again.' }
    }
}
