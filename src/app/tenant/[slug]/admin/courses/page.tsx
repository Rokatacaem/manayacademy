import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

import { notFound } from 'next/navigation';

interface CoursesPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CoursesPage({ params }: CoursesPageProps) {
    const { slug } = await params;

    const tenant = await prisma.tenant.findUnique({
        where: { slug }
    });

    if (!tenant) {
        notFound();
    }

    const courses = await prisma.course.findMany({
        where: { tenantId: tenant.id },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { modules: true, enrollments: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
                <Link href="/admin/courses/new">
                    <Button>+ Nuevo Curso</Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-950 shadow sm:rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Título
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Precio
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Contenido
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Alumnos
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Editar</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-gray-200 dark:divide-zinc-800">
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-0">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {course.title}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                /{course.slug}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.published
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                        {course.published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {Number(course.price) > 0 ? `$${Number(course.price)}` : 'Gratis'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {course._count.modules} Módulos
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {course._count.enrollments}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/courses/${course.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        Gestionar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay cursos creados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
