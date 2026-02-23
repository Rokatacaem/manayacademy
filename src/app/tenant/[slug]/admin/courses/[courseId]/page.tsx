import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { updateCourse, deleteCourse } from '@/actions/courses';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CourseIdPage({ params }: { params: { courseId: string } }) {
    const resolvedParams = await params;
    const { courseId } = resolvedParams;

    const course = await prisma.course.findUnique({
        where: { id: courseId },
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
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{course.title}</h1>
                    <p className="text-sm text-gray-500">/{course.slug}</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/courses/${course.slug}`} target="_blank">
                        <Button variant="outline">Ver cómo estudiante</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Course Details */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                        <h2 className="text-lg font-bold mb-4">Detalles del Curso</h2>
                        <form action={async (formData: FormData) => {
                            'use server';
                            await updateCourse(course.tenantId, course.id, formData);
                        }} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                                <input type="text" name="title" defaultValue={course.title} className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border" />
                            </div>
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                                <input type="text" name="slug" defaultValue={course.slug} className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                                <textarea name="description" rows={3} defaultValue={course.description || ''} className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border" />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
                                <input type="number" name="price" step="0.01" defaultValue={Number(course.price)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border" />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen URL</label>
                                <input type="text" name="image" defaultValue={course.image || ''} className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border" />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" name="published" id="published" defaultChecked={course.published} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <label htmlFor="published" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Publicado</label>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full">Guardar Cambios</Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-900">
                        <h3 className="text-sm font-bold text-red-800 dark:text-red-300 mb-2">Zona de Peligro</h3>
                        <form action={async () => {
                            'use server';
                            await deleteCourse(course.tenantId, course.id);
                        }}>
                            <Button type="submit" variant="destructive" className="w-full">Eliminar Curso</Button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Curriculum (Modules & Lessons) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Contenido del Curso</h2>
                        {/* We will add a Create Module action later, or link to a separate page? 
                            Ideally inline or separate. Let's start with a Link to separate page "New Module". 
                            Or just a form here? Let's use a Link for now to keep it clean, or a small inline form.
                        */}
                        <Link href={`/admin/courses/${course.id}/modules/new`}>
                            <Button variant="secondary">+ Añadir Módulo</Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {course.modules.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
                                <p className="text-gray-500">No hay módulos definidos.</p>
                            </div>
                        )}

                        {course.modules.map(module => (
                            <div key={module.id} className="bg-white dark:bg-zinc-950 rounded-lg shadow border border-gray-200 dark:border-zinc-800 overflow-hidden">
                                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800">
                                    <h3 className="font-semibold">{module.title}</h3>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/courses/${course.id}/modules/${module.id}/edit`}>
                                            <span className="text-xs text-indigo-600 hover:underline">Editar</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        {module.lessons.map(lesson => (
                                            <li key={lesson.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">📄</span>
                                                    <span className="text-sm">{lesson.title}</span>
                                                </div>
                                                <Link href={`/admin/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}`}>
                                                    <span className="text-xs text-indigo-600 hover:underline">Editar</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                                        <Link href={`/admin/courses/${course.id}/modules/${module.id}/lessons/new`} className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                                            <span>+ Añadir Lección</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
