'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createModule(tenantId: string, courseId: string, formData: FormData) {
    const title = formData.get('title') as string

    if (!title) return { error: 'Title required' }

    try {
        // Verify Course Ownership
        const course = await prisma.course.findUnique({ where: { id: courseId } })
        if (!course || course.tenantId !== tenantId) return { error: 'Access denied' }

        // Get max order
        const lastModule = await prisma.module.findFirst({
            where: { courseId },
            orderBy: { order: 'desc' }
        })
        const newOrder = (lastModule?.order ?? -1) + 1

        await prisma.module.create({
            data: {
                tenantId,
                courseId,
                title,
                order: newOrder
            }
        })
    } catch (error) {
        console.error('Failed to create module:', error)
        return { error: 'Failed to create module' }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    redirect(`/admin/courses/${courseId}`)
}

export async function updateModule(tenantId: string, courseId: string, moduleId: string, formData: FormData) {
    const title = formData.get('title') as string

    try {
        const existing = await prisma.module.findUnique({ where: { id: moduleId } })
        if (!existing || existing.tenantId !== tenantId) return { error: 'Access denied' }

        await prisma.module.update({
            where: { id: moduleId },
            data: { title }
        })
    } catch (error) {
        return { error: 'Update failed' }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    redirect(`/admin/courses/${courseId}`)
}

export async function deleteModule(tenantId: string, courseId: string, moduleId: string) {
    try {
        const existing = await prisma.module.findUnique({ where: { id: moduleId } })
        if (!existing || existing.tenantId !== tenantId) return { error: 'Access denied' }

        await prisma.module.delete({ where: { id: moduleId } })
    } catch (error) {
        return { error: 'Delete failed' }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    // redirect is not needed if calling from a form on the main page, but if on edit page it might be.
    // Assuming we might call this from the main course page list.
}
