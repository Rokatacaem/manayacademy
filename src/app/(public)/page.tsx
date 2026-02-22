'use client'

import { useState, useActionState } from "react";
import { registerPublicLead } from "@/actions/contacts";
import Link from "next/link";

export default function Home() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');

        const form = e.currentTarget;
        const formData = new FormData(form);

        if (formData.get('phone_check')) {
            setStatus('success');
            return;
        }

        const mappedData = new FormData();
        mappedData.append('firstName', formData.get('nombre') as string);
        mappedData.append('email', formData.get('correo') as string);

        const result = await registerPublicLead(mappedData);

        if (result?.success) {
            setStatus('success');
            form.reset();
        } else {
            setStatus('error');
        }
    }

    return (
        <main className="center-container">
            <div className="premium-card">
                <header style={{ marginBottom: '50px' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '15px' }}>
                        Centro de Bienestar Integral
                    </p>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', margin: '0' }}>
                        Ana Katherine Zepeda
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', fontStyle: 'italic', marginTop: '10px' }}>
                        Psicóloga – Maestra de Yoga – Meditación – Crioterapia
                    </p>
                    <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '30px auto', opacity: '0.2' }}></div>
                </header>

                <section style={{ marginBottom: '50px', color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: '300' }}>
                    <p>Navegando todo sobre salud mental, física y espiritual.</p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginTop: '15px' }}>
                        <strong>Desde 2009 a la fecha</strong>, convencida de que menos es más.
                    </p>
                </section>

                <section style={{ background: 'var(--accent)', padding: '35px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '40px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: 'var(--primary-dark)', textAlign: 'center', letterSpacing: '0.05em' }}>
                        REGÍSTRATE HOY Y RECIBE:
                    </h3>
                    <ul className="wellness-list">
                        <li>Audio para aprender a meditar.</li>
                        <li>Datos prácticos de salud.</li>
                        <li>Reflexiones para personas que buscan algo mejor en la vida.</li>
                        <li>Acceso anticipado a lanzamientos y regalos.</li>
                    </ul>
                </section>

                <section>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '25px' }}>Te leo</p>

                    {status === 'success' ? (
                        <div className="msg-container msg-success">
                            ¡Gracias por conectar! Ya estás en mi lista especial.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="phone_check" className="hp-field" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

                            <div className="input-group">
                                <label className="input-label">Tu nombre</label>
                                <input type="text" name="nombre" placeholder="¿Cómo te llamas?" required disabled={status === 'loading'} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Tu correo electrónico</label>
                                <input type="email" name="correo" placeholder="ejemplo@correo.com" required disabled={status === 'loading'} />
                            </div>

                            <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                                {status === 'loading' ? 'CONECTANDO...' : 'REGISTRARME'}
                            </button>

                            {status === 'error' && (
                                <div className="msg-container msg-error">
                                    Lo siento, algo falló. ¿Podrías intentar de nuevo?
                                </div>
                            )}
                        </form>
                    )}

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '25px' }}>
                        Acepto la política de privacidad
                    </p>

                    <footer style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
                        <Link href="/login" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 'bold' }}>
                            Acceso Alumnos / Admin
                        </Link>
                    </footer>
                </section>
            </div>
        </main>
    );
}
