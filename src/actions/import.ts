'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { parse } from 'csv-parse/sync'

export async function importContacts(tenantId: string, formData: FormData) {
    const file = formData.get('file') as File

    if (!file) {
        throw new Error('No file uploaded')
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString('utf-8')

    try {
        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        }) as Record<string, string>[]

        // Process records
        // Expected columns: email, firstName, lastName, tags
        let successCount = 0
        let errorCount = 0

        for (const record of records) {
            if (!record.email) {
                errorCount++
                continue
            }

            const tagNames = record.tags
                ? record.tags.split(/[|,]/).map((t: string) => t.trim()).filter(Boolean)
                : []

            try {
                await prisma.contact.upsert({
                    where: {
                        tenantId_email: { tenantId, email: record.email }
                    },
                    update: {
                        firstName: record.firstName,
                        lastName: record.lastName,
                        tags: {
                            connectOrCreate: tagNames.map((name: string) => ({
                                where: { tenantId_name: { tenantId, name } },
                                create: { name, tenantId }
                            }))
                        }
                    },
                    create: {
                        email: record.email,
                        firstName: record.firstName,
                        lastName: record.lastName,
                        source: 'Import CSV',
                        tenantId,
                        tags: {
                            connectOrCreate: tagNames.map((name: string) => ({
                                where: { tenantId_name: { tenantId, name } },
                                create: { name, tenantId }
                            }))
                        }
                    }
                })
                successCount++
            } catch (err) {
                console.error(`Failed to import contact ${record.email}:`, err)
                errorCount++
            }
        }

        console.log(`Import finished. Success: ${successCount}, Errors: ${errorCount}`)

    } catch (parseError) {
        console.error('CSV Parse Error:', parseError)
        return { error: 'Failed to parse CSV file.' }
    }

    revalidatePath('/admin/contacts')
    redirect('/admin/contacts')
}
