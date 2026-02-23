'use client'

import { useActionState } from 'react'
import { sendTestEmail } from '@/actions/campaigns'

interface TestEmailPanelProps {
    tenantId: string
    campaignId: string
    defaultEmail?: string
}

type ActionState = {
    success?: string;
    error?: string;
};

const initialState: ActionState = {};

export default function TestEmailPanel({ tenantId, campaignId, defaultEmail = '' }: TestEmailPanelProps) {
    const boundAction = sendTestEmail.bind(null, tenantId, campaignId)
    const [state, dispatch, isPending] = useActionState<ActionState, FormData>(
        async (prevState: ActionState, formData: FormData) => {
            return await boundAction(formData);
        },
        initialState
    )

    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            border: '2px solid #7c9082',
        }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #7c9082, #5e6f63)', padding: '20px 24px' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                    Verificación
                </p>
                <h3 style={{ margin: '4px 0 0', color: 'white', fontSize: '1rem', fontWeight: '600' }}>
                    🧪 Envío de Prueba
                </h3>
            </div>

            <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                    Envía esta campaña a tu propia bandeja antes del envío masivo. El asunto aparecerá con el prefijo <strong>[PRUEBA]</strong>.
                </p>

                <form action={dispatch}>
                    <label style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>
                        Correo(s) de prueba
                    </label>
                    <input
                        type="text"
                        name="testEmails"
                        defaultValue={defaultEmail}
                        placeholder="info@manayacademy.com, rodrigo@ejemplo.com"
                        required
                        disabled={isPending}
                        style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.85rem', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '8px', color: '#2c3e50' }}
                    />
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 16px' }}>
                        Separa múltiples correos con comas
                    </p>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: isPending ? '#a3b1a8' : '#7c9082',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isPending ? 'not-allowed' : 'pointer',
                            fontWeight: '700',
                            fontSize: '0.78rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isPending ? 'Enviando...' : '📨 Enviar Prueba'}
                    </button>
                </form>

                {/* Feedback Messages */}
                {state?.success && (
                    <div style={{ marginTop: '16px', padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#166534', fontWeight: '500' }}>{state.success}</p>
                    </div>
                )}
                {state?.error && (
                    <div style={{ marginTop: '16px', padding: '14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#991b1b', fontWeight: '500' }}>⚠️ {state.error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
