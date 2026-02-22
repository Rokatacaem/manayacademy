import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { createTag, deleteTag } from '@/actions/tags';
import { notFound } from 'next/navigation';

export default async function TagsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({ where: { slug } });

    if (!tenant) notFound();

    const tags = await prisma.tag.findMany({
        where: { tenantId: tenant.id },
        orderBy: { name: 'asc' },
        include: { _count: { select: { contacts: true } } }
    });

    const createTagWithTenant = createTag.bind(null, tenant.id);
    const deleteTagWithTenant = deleteTag.bind(null, tenant.id);

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold tracking-tight">Gestión de Etiquetas</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Tag Form */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800 sticky top-6">
                        <h2 className="text-lg font-medium mb-4">Nueva Etiqueta</h2>
                        <form action={createTagWithTenant} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    placeholder="Ej. Cliente VIP"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Crear Etiqueta
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Tags List */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-zinc-950 shadow sm:rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Contactos
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-950 divide-y divide-gray-200 dark:divide-zinc-800">
                                {tags.map((tag) => (
                                    <tr key={tag.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {tag.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {tag._count.contacts}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <form action={deleteTag.bind(null, tenant.id, tag.id)}>
                                                <button type="submit" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                    Eliminar
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {tags.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No hay etiquetas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
