'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- MODULES ---

export async function createModule(courseId: string, formData: FormData) {
    const title = formData.get('title') as string

    if (!title) return { error: 'Title required' }

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { tenantId: true } })
    if (!course) return { error: 'Course not found' }

    // Get max order
    const lastModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
    })
    const newOrder = (lastModule?.order ?? -1) + 1

    await prisma.module.create({
        data: {
            title,
            courseId,
            order: newOrder,
            tenantId: course.tenantId
        }
    })

    revalidatePath(`/admin/courses/${courseId}`)
    redirect(`/admin/courses/${courseId}`)
}

// --- LESSONS ---

export async function createLesson(courseId: string, moduleId: string, formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const videoUrl = formData.get('videoUrl') as string
    const content = formData.get('content') as string

    const parentModule = await prisma.module.findUnique({ where: { id: moduleId }, select: { tenantId: true } })
    if (!parentModule) return { error: 'Module not found' }

    // Get max order in module
    const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: 'desc' }
    })
    const newOrder = (lastLesson?.order ?? -1) + 1

    await prisma.lesson.create({
        data: {
            title,
            slug,
            videoUrl,
            content,
            moduleId,
            order: newOrder,
            tenantId: parentModule.tenantId
        }
    })

    revalidatePath(`/admin/courses/${courseId}`)
    redirect(`/admin/courses/${courseId}`)
}

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const videoUrl = formData.get('videoUrl') as string
    const content = formData.get('content') as string

    await prisma.lesson.update({
        where: { id: lessonId },
        data: {
            title,
            slug,
            videoUrl,
            content
        }
    })

    revalidatePath(`/admin/courses/${courseId}`)
    revalidatePath(`/admin/courses/${courseId}/modules`) // Generic reval just in case
    // We might redirect back to the lesson edit page or the course page.
    // Let's redirect to course page for now, or stay?
    // User might want to save and stay. But server actions usually redirect.
    redirect(`/admin/courses/${courseId}`)
}
