'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createLesson(tenantId: string, courseId: string, moduleId: string, formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const videoUrl = formData.get('videoUrl') as string
    const content = formData.get('content') as string

    if (!title || !slug) return { error: 'Title and Slug required' }

    try {
        // Verify Module Ownership
        const module = await prisma.module.findUnique({ where: { id: moduleId } })
        if (!module || module.tenantId !== tenantId) return { error: 'Access denied' }

        const lastLesson = await prisma.lesson.findFirst({
            where: { moduleId },
            orderBy: { order: 'desc' }
        })
        const newOrder = (lastLesson?.order ?? -1) + 1

        await prisma.lesson.create({
            data: {
                tenantId,
                moduleId,
                title,
                slug,
                videoUrl,
                content,
                order: newOrder
            }
        })
    } catch (error) {
        console.error('Create Lesson Error:', error)
        return { error: 'Failed to create lesson' }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    redirect(`/admin/courses/${courseId}`)
}

export async function updateLesson(tenantId: string, courseId: string, moduleId: string, lessonId: string, formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const videoUrl = formData.get('videoUrl') as string
    const content = formData.get('content') as string

    try {
        const existing = await prisma.lesson.findUnique({ where: { id: lessonId } })
        if (!existing || existing.tenantId !== tenantId) return { error: 'Access denied' }

        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                title,
                slug,
                videoUrl,
                content
            }
        })
    } catch (error) {
        return { error: 'Update failed' }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
    redirect(`/admin/courses/${courseId}`)
}

export async function deleteLesson(tenantId: string, courseId: string, lessonId: string) {
    try {
        const existing = await prisma.lesson.findUnique({ where: { id: lessonId } })
        if (!existing || existing.tenantId !== tenantId) return { error: 'Access denied' }

        await prisma.lesson.delete({ where: { id: lessonId } })
    } catch (error) {
        return { error: 'Delete failed' }
    }

    revalidatePath(`/admin/courses/${courseId}`)
}
