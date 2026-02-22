
'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] px-6 py-12">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Acceso Plataforma
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">Introduce tus credenciales para continuar</p>
                </div>

                <form action={dispatch} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                            Correo Electrónico
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="tu@correo.com"
                                required
                                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                            Contraseña
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                required
                                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <Button disabled={isPending} type="submit" className="w-full bg-slate-800 hover:bg-slate-900 py-3 text-white font-bold rounded-md transition-all">
                            {isPending ? 'Iniciando sesión...' : 'Entrar'}
                        </Button>
                    </div>

                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-center">
                            <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
