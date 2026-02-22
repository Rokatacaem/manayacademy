
import { Button } from "@/components/ui/Button"
import { createContact } from "@/actions/contacts"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function NewContactPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({ where: { slug } });

    if (!tenant) notFound();

    const createContactWithTenant = createContact.bind(null, tenant.id);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nuevo Contacto</h1>

            <form action={createContactWithTenant} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
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
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Etiquetas (separadas por coma)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        placeholder="vip, nuevo, marzo2026"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-transparent border"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit">Guardar Contacto</Button>
                </div>
            </form>
        </div>
    )
}
