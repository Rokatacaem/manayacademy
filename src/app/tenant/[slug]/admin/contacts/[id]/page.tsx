
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { updateContact, deleteContact } from '@/actions/contacts';
import { notFound } from 'next/navigation';

export default async function EditContactPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
    const { slug, id } = await params;

    // Fetch tenant to verify ownership and getting ready for binding
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    const contact = await prisma.contact.findUnique({
        where: { id },
        include: { tags: true }
    });

    // Security check: Ensure contact belongs to the current tenant
    if (!contact || contact.tenantId !== tenant.id) {
        notFound();
    }

    const tagsString = contact.tags.map(t => t.name).join(', ');

    // Bind tenantId to actions
    const updateContactWithTenant = updateContact.bind(null, tenant.id, contact.id);
    const deleteContactWithTenant = deleteContact.bind(null, tenant.id, contact.id);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Editar Contacto</h1>
            </div>

            <form action={updateContactWithTenant} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            defaultValue={contact.firstName || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            defaultValue={contact.lastName || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        defaultValue={contact.email}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Estado
                    </label>
                    <select
                        name="status"
                        id="status"
                        defaultValue={contact.status}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="UNSUBSCRIBED">Desuscrito</option>
                        <option value="BOUNCED">Rebotado</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Etiquetas (separadas por coma)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        defaultValue={tagsString}
                        placeholder="vip, nuevo, marzo2026"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div className="pt-4 flex justify-end items-center">
                    <Button type="submit">Actualizar Contacto</Button>
                </div>
            </form>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-zinc-800">
                <form action={deleteContactWithTenant}>
                    <Button type="submit" variant="destructive">
                        Eliminar Contacto
                    </Button>
                </form>
            </div>
        </div>
    );
}
