import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { createLesson } from '@/actions/lessons';
import { notFound } from 'next/navigation';

export default async function NewLessonPage({ params }: { params: Promise<{ slug: string, courseId: string, moduleId: string }> }) {
    const { slug, courseId, moduleId } = await params;

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { course: true }
    });

    if (!moduleData || moduleData.tenantId !== tenant.id || moduleData.courseId !== courseId) {
        notFound();
    }

    const createLessonWithIds = createLesson.bind(null, tenant.id, courseId, moduleId);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nueva Lección para: {moduleData.title}</h1>

            <form action={createLessonWithIds} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Título
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Lección 1"
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
                        required
                        placeholder="leccion-1"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border"
                    />
                </div>

                <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video URL (YouTube/Vimeo)
                    </label>
                    <input
                        type="text"
                        name="videoUrl"
                        placeholder="https://youtube.com/..."
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contenido (Markdown/HTML)
                    </label>
                    <textarea
                        name="content"
                        rows={10}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm p-2 bg-transparent border font-mono"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit">Crear Lección</Button>
                </div>
            </form>
        </div>
    );
}
