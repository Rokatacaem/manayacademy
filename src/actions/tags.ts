'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTag(tenantId: string, formData: FormData) {
    const name = formData.get('name') as string

    if (!name || name.trim() === '') {
        return { error: 'Tag name is required' }
    }

    try {
        await prisma.tag.create({
            data: {
                name: name.trim(),
                tenantId
            }
        })
    } catch (error) {
        console.error('Failed to create tag:', error)
        return { error: 'Failed to create tag. Name might already exist.' }
    }

    revalidatePath('/admin/tags')
    revalidatePath('/admin/contacts') // Revalidate contacts as they use tags
}

export async function deleteTag(tenantId: string, id: string) {
    if (!id) return

    try {
        const existing = await prisma.tag.findUnique({ where: { id } })
        if (!existing || existing.tenantId !== tenantId) {
            return { error: 'Access denied' }
        }

        await prisma.tag.delete({
            where: { id }
        })
    } catch (error) {
        console.error('Failed to delete tag:', error)
        return { error: 'Failed to delete tag.' }
    }

    revalidatePath('/admin/tags')
    revalidatePath('/admin/contacts')
}
