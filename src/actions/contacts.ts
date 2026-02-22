'use server'

import { prisma } from "@/lib/prisma"
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

    // Handle Tags (comma separated)
    const tagNames = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
        await prisma.contact.create({
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
        // Handle duplicate email error
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

    const tagNames = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
        // Verify ownership
        const existing = await prisma.contact.findUnique({
            where: { id }
        })
        if (!existing || existing.tenantId !== tenantId) {
            return { error: 'Contact not found or access denied relative to tenant.' }
        }

        // First disconnect all tags, then connect/create the new ones
        await prisma.contact.update({
            where: { id },
            data: {
                email,
                firstName,
                lastName,
                status,
                tags: {
                    set: [], // Disconnect all existing tags
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

    try {
        const existing = await prisma.contact.findUnique({
            where: { id }
        })
        if (!existing || existing.tenantId !== tenantId) {
            return { error: 'Access denied.' }
        }

        await prisma.contact.delete({
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
