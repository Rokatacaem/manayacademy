import { Button } from "@/components/ui/Button"
import { importContacts } from "@/actions/import"

export default function ImportContactsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Importar Contactos (CSV)</h1>

            <div className="bg-blue-50 dark:bg-zinc-900/50 p-4 rounded-md border border-blue-200 dark:border-blue-900">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Formato Requerido</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    El archivo CSV debe tener las siguientes cabeceras (headers):
                </p>
                <code className="block mt-2 text-xs bg-white dark:bg-zinc-950 p-2 rounded border border-blue-100 dark:border-blue-900 font-mono">
                    email, firstName, lastName, tags
                </code>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                    * Las etiquetas deben estar separadas por pipes (|) o comas si están entre comillas.
                </p>
            </div>

            <form action={importContacts} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Archivo CSV
                    </label>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept=".csv"
                        required
                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100
                            dark:file:bg-zinc-800 dark:file:text-indigo-400
                        "
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit">Importar Contactos</Button>
                </div>
            </form>
        </div>
    )
}
