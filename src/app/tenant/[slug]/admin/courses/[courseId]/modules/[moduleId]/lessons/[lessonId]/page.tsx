import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { updateLesson, deleteLesson } from '@/actions/lessons';
import { notFound } from 'next/navigation';

export default async function EditLessonPage({ params }: { params: Promise<{ slug: string, courseId: string, moduleId: string, lessonId: string }> }) {
    const { slug, courseId, moduleId, lessonId } = await params;

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { module: true }
    });

    if (!lesson || lesson.tenantId !== tenant.id || lesson.moduleId !== moduleId || lesson.module.courseId !== courseId) {
        notFound();
    }

    const updateLessonAction = updateLesson.bind(null, tenant.id, courseId, moduleId, lessonId);
    const deleteLessonAction = deleteLesson.bind(null, tenant.id, courseId, lessonId);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Editar Lección: {lesson.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <form action={async (formData: FormData) => {
                        'use server';
                        await updateLessonAction(formData);
                    }} className="bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Título
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={lesson.title}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border"
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Slug (URL)
                            </label>
                            <input
                                type="text"
                                name="slug"
                                defaultValue={lesson.slug}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border"
                            />
                        </div>

                        <div>
                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Video URL
                            </label>
                            <input
                                type="text"
                                name="videoUrl"
                                defaultValue={lesson.videoUrl || ''}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contenido
                            </label>
                            <textarea
                                name="content"
                                rows={10}
                                defaultValue={lesson.content || ''}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border font-mono"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Guardar Cambios</Button>
                        </div>
                    </form>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-900">
                        <h3 className="text-sm font-bold text-red-800 dark:text-red-300 mb-2">Zona de Peligro</h3>
                        <form action={async () => {
                            'use server';
                            await deleteLessonAction();
                        }}>
                            <Button type="submit" variant="destructive" className="w-full">Eliminar Lección</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
