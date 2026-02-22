
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })
dotenv.config({ path: path.join(process.cwd(), '.env.local') })
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo' },
        update: {},
        create: {
            name: 'Demo Academy',
            slug: 'demo',
            type: 'BUSINESS',
            brandColor: '#2563eb',
        },
    })

    console.log('Seeded tenant:', tenant.name)

    const password = await hash('Tacaem2026', 10)

    const admin = await prisma.user.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: 'info@manayacademy.com',
            },
        },
        update: {
            password,
        },
        create: {
            email: 'info@manayacademy.com',
            name: 'Admin Manay',
            password,
            role: 'ADMIN',
            tenantId: tenant.id,
        },
    })
    console.log('Seeded admin:', admin.email)

    const student = await prisma.user.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: 'student@demo.com',
            },
        },
        update: {},
        create: {
            email: 'student@demo.com',
            name: 'Student User',
            password,
            role: 'STUDENT',
            tenantId: tenant.id,
        },
    })
    console.log('Seeded student:', student.email)

    // Seed Course
    const course = await prisma.course.upsert({
        where: {
            tenantId_slug: {
                tenantId: tenant.id,
                slug: 'intro-to-nextjs',
            },
        },
        update: {},
        create: {
            title: 'Introduction to Next.js',
            slug: 'intro-to-nextjs',
            description: 'Learn the basics of Next.js 14+',
            published: true,
            price: 0,
            tenantId: tenant.id,
        },
    })
    console.log('Seeded course:', course.title)

    // Seed Module - check if exists first to avoid duplicates on re-run if not using upsert properly for nested writes
    const existingModule = await prisma.module.findFirst({
        where: {
            courseId: course.id,
            title: 'Getting Started'
        }
    })

    if (!existingModule) {
        await prisma.module.create({
            data: {
                title: 'Getting Started',
                order: 1,
                courseId: course.id,
                tenantId: tenant.id,
                lessons: {
                    create: [
                        {
                            title: 'What is Next.js?',
                            slug: 'what-is-nextjs',
                            content: 'Next.js is a React framework for building full-stack web applications.',
                            order: 1,
                            tenantId: tenant.id,
                        },
                        {
                            title: 'Installation',
                            slug: 'installation',
                            content: 'Run npx create-next-app@latest to get started.',
                            order: 2,
                            tenantId: tenant.id,
                        },
                    ],
                },
            },
        })
        console.log('Seeded module with lessons')
    }


    // Enroll student
    await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: student.id,
                courseId: course.id,
            },
        },
        update: {},
        create: {
            userId: student.id,
            courseId: course.id,
            tenantId: tenant.id,
        },
    })
    console.log('Enrolled student in course')

    // Seed Contacts (simple createMany might fail unique constraints if run multiple times, so we'll just ignore errors or leave as is since contacts usually don't break flow)

    // Seed Contact 1
    await prisma.contact.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: 'lead1@example.com'
            }
        },
        update: {},
        create: {
            email: 'lead1@example.com',
            firstName: 'John',
            lastName: 'Doe',
            tenantId: tenant.id,
            source: 'Web'
        }
    })

    // Seed Contact 2
    await prisma.contact.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: 'lead2@example.com'
            }
        },
        update: {},
        create: {
            email: 'lead2@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            tenantId: tenant.id,
            source: 'Kartra Import'
        }
    })
    console.log('Seeded contacts')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
