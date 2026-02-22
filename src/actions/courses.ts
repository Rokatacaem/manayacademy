'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCourse(tenantId: string, formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const image = formData.get('image') as string

    if (!title || !slug) {
        return { error: 'Title and Slug are required' }
    }

    try {
        await prisma.course.create({
            data: {
                tenantId,
                title,
                slug, // TODO: Check uniqueness within tenant? Prisma unique constraint handles it but distinct error msg is better.
                description,
                price,
                image,
                published: false,
            }
        })
    } catch (error) {
        console.error('Failed to create course:', error)
        return { error: 'Failed to create course. Slug might already exist.' }
    }

    revalidatePath('/admin/courses')
    redirect('/admin/courses') // Relative redirect assumes middleware handles basic path, but best to be safe? 
    // Actually redirects in Server Actions are relative to the domain. 
    // But since we are inside a tenant subdomain, relative path '/admin/courses' works perfectly.
}

export async function updateCourse(tenantId: string, id: string, formData: FormData) {
    if (!id) return

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const image = formData.get('image') as string
    const published = formData.get('published') === 'on'

    try {
        const existing = await prisma.course.findUnique({ where: { id } })
        if (!existing || existing.tenantId !== tenantId) {
            return { error: 'Access denied' }
        }

        await prisma.course.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                price,
                image,
                published
            }
        })
    } catch (error) {
        console.error('Failed to update course:', error)
        return { error: 'Failed to update course.' }
    }

    revalidatePath('/admin/courses')
    revalidatePath(`/admin/courses/${id}`)
    // redirect('/admin/courses') // Keep on edit page? Or go back? Usually staying is better for "Update". 
    // But existing code redirected. I will NOT redirect to allow seeing changes, or redirect if requested.
    // The previous implementation redirected. Let's redirect to list for "Save" button usually.
    redirect(`/admin/courses/${id}`)
}

export async function deleteCourse(tenantId: string, id: string) {
    if (!id) return

    try {
        const existing = await prisma.course.findUnique({ where: { id } })
        if (!existing || existing.tenantId !== tenantId) {
            return { error: 'Access denied' }
        }

        await prisma.course.delete({
            where: { id }
        })
    } catch (error) {
        console.error('Failed to delete course:', error)
        return { error: 'Failed to delete course.' }
    }

    revalidatePath('/admin/courses')
    redirect('/admin/courses')
}
