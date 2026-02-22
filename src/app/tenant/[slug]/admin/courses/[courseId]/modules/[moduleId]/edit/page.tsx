import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { updateModule, deleteModule } from '@/actions/modules';
import { notFound } from 'next/navigation';

export default async function EditModulePage({ params }: { params: Promise<{ slug: string, courseId: string, moduleId: string }> }) {
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

    const updateModuleAction = updateModule.bind(null, tenant.id, courseId, moduleId);
    const deleteModuleAction = deleteModule.bind(null, tenant.id, courseId, moduleId);

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Editar Módulo: {moduleData.title}</h1>

            <form action={updateModuleAction} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Título del Módulo
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={moduleData.title}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit">Guardar Cambios</Button>
                </div>
            </form>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-900">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300 mb-2">Zona de Peligro</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mb-4">Eliminar este módulo borrará todas sus lecciones asociadas.</p>
                <form action={deleteModuleAction}>
                    <Button type="submit" variant="destructive" className="w-full">Eliminar Módulo</Button>
                </form>
            </div>
        </div>
    );
}
