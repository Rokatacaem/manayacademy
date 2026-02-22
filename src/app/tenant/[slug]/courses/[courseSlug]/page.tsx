import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CourseWelcomePage({ params }: { params: Promise<{ slug: string, courseSlug: string }> }) {
    const resolvedParams = await params;
    const { slug, courseSlug } = resolvedParams;

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

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
                take: 1,
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                        take: 1
                    }
                }
            }
        }
    });

    if (!course) notFound();

    const firstLesson = course.modules[0]?.lessons[0];

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    {course.description}
                </p>
            </div>

            {course.image && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                    ¿Listo para empezar?
                </h2>
                <p className="text-indigo-800 dark:text-indigo-300 mb-4">
                    Comienza tu aprendizaje ahora mismo.
                </p>
                {firstLesson ? (
                    <Link href={`/courses/${course.slug}/${firstLesson.slug}`}>
                        <Button className="w-full sm:w-auto">
                            Comenzar Curso &rarr;
                        </Button>
                    </Link>
                ) : (
                    <Button disabled className="opacity-50 cursor-not-allowed">
                        Próximamente
                    </Button>
                )}
            </div>
        </div>
    )
}
