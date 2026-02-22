
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function ContactsPage() {
    const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        include: { tags: true },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Contactos</h1>
                <div className="flex gap-2">
                    <Link href="/admin/contacts/import">
                        <Button variant="secondary">Importar CSV</Button>
                    </Link>
                    <Link href="/admin/contacts/new">
                        <Button>+ Nuevo Contacto</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 shadow sm:rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email / Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Etiquetas
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Fecha Registro
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Editar</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-gray-200 dark:divide-zinc-800">
                        {contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {contact.firstName} {contact.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {contact.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contact.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-1 flex-wrap">
                                        {contact.tags.map(tag => (
                                            <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {contact.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/contacts/${contact.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay contactos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
