import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CoursesIndexPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({ where: { slug } });

    if (!tenant) notFound();

    const courses = await prisma.course.findMany({
        where: {
            tenantId: tenant.id,
            published: true
        },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { modules: true }
            }
        }
    });

    return (
        <div className="container mx-auto py-12 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Catálogo de Cursos
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explora nuestros cursos y mejora tus habilidades con Manay Academy.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => (
                    <Link key={course.id} href={`/courses/${course.slug}`} className="group block">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-zinc-800 overflow-hidden h-full flex flex-col">
                            {/* Image Placeholder or Actual Image */}
                            <div className="aspect-video bg-gray-100 dark:bg-zinc-800 w-full object-cover relative">
                                {course.image ? (
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <span className="text-4xl">📚</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                                    {course.description || 'Sin descripción.'}
                                </p>

                                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <span className="text-gray-900 dark:text-white">
                                        {Number(course.price) > 0 ? `$${Number(course.price)}` : 'Gratis'}
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {course._count.modules} Módulos
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No hay cursos publicados disponible en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
