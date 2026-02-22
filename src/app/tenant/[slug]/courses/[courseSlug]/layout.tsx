import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CourseLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string, courseSlug: string }>;
}) {
    const resolvedParams = await params;
    const { slug, courseSlug } = resolvedParams;

    // 1. Get Tenant
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    // 2. Get Course scoped to Tenant
    const course = await prisma.course.findUnique({
        where: {
            tenantId_slug: {
                tenantId: tenant.id,
                slug: courseSlug
            }
        },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' }
                    }
                }
            }
        }
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col pt-16 md:pt-0 md:flex-row">
            {/* Sidebar / Curriculum */}
            <aside className="w-full md:w-80 bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <Link href="/courses" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-2 block">
                        &larr; Volver al catálogo
                    </Link>
                    <h2 className="font-bold text-lg leading-tight">{course.title}</h2>
                </div>

                <div className="p-4 space-y-6">
                    {course.modules.map((module, modIndex) => (
                        <div key={module.id}>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Módulo {modIndex + 1}: {module.title}
                            </h3>
                            <ul className="space-y-1">
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <li key={lesson.id}>
                                        <Link
                                            href={`/courses/${course.slug}/${lesson.slug}`}
                                            className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="mt-0.5 text-gray-400 dark:text-gray-500 text-xs text-nowrap">
                                                    {modIndex + 1}.{lessonIndex + 1}
                                                </span>
                                                <span>{lesson.title}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {course.modules.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Próximamente...</p>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
