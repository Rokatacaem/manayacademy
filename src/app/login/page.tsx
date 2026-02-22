'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import Link from "next/link";

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

    return (
        <div className="center-container">
            <div className="premium-card">
                <header style={{ marginBottom: '50px' }}>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>
                        Espacio de Gestión
                    </p>
                    <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', margin: '0' }}>
                        Acceso
                    </h2>
                    <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '25px auto', opacity: '0.2' }}></div>
                </header>

                <form action={dispatch}>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="info@manayacademy.com"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button disabled={isPending} type="submit" className="btn-primary">
                            {isPending ? 'VALIDANDO...' : 'ENTRAR'}
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="msg-container msg-error">
                            {errorMessage}
                        </div>
                    )}
                </form>

                <footer style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
                    <Link href="/" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 'bold' }}>
                        ← Regresar a la web
                    </Link>
                </footer>
            </div>
        </div>
    )
}
