import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { createModule } from '@/actions/modules';
import { notFound } from 'next/navigation';

export default async function NewModulePage({ params }: { params: Promise<{ slug: string, courseId: string }> }) {
    const { slug, courseId } = await params;

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.tenantId !== tenant.id) notFound();

    const createModuleWithIds = createModule.bind(null, tenant.id, course.id);

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nuevo Módulo para: {course.title}</h1>

            <form action={async (formData: FormData) => {
                'use server';
                await createModuleWithIds(formData);
            }} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Título del Módulo
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="Módulo 1: Introducción"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit">Crear Módulo</Button>
                </div>
            </form>
        </div>
    );
}
