import { Button } from "@/components/ui/Button";
import { createCourse } from "@/actions/courses";

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface NewCoursePageProps {
    params: Promise<{ slug: string }>;
}

export default async function NewCoursePage({ params }: NewCoursePageProps) {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    const createCourseWithTenant = createCourse.bind(null, tenant.id);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nuevo Curso</h1>

            <form action={async (formData: FormData) => {
                'use server';
                await createCourseWithTenant(formData);
            }} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Título del Curso
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="Curso de TypeScript Avanzado"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Slug (URL)
                    </label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        placeholder="curso-typescript-avanzado"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Descripción Corta
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Precio (USD)
                        </label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            min="0"
                            step="0.01"
                            defaultValue="0"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Imagen URL (Cover)
                        </label>
                        <input
                            type="text"
                            name="image"
                            id="image"
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit">Crear Curso</Button>
                </div>
            </form>
        </div>
    )
}
