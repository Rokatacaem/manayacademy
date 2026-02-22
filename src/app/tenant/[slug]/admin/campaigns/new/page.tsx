import { createCampaign } from "@/actions/campaigns";
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import RichEditor from '@/components/RichEditor';
import Link from 'next/link';

export default async function NewCampaignPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({ where: { slug } });

    if (!tenant) notFound();

    const createCampaignWithTenant = createCampaign.bind(null, tenant.id);

    return (
        <div style={{ maxWidth: '900px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ fontSize: '0.7rem', color: '#7c9082', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px' }}>
                        Marketing
                    </p>
                    <h1 style={{ fontSize: '2rem', color: '#2c3e50', margin: '0', fontWeight: '400' }}>
                        Nueva Campaña
                    </h1>
                </div>
                <Link href="/admin/campaigns" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', fontWeight: '600' }}>
                    ← Volver
                </Link>
            </div>

            <form action={createCampaignWithTenant}>
                {/* Subject */}
                <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>
                        Asunto del Correo *
                    </label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        placeholder="¡Te tenemos noticias especiales!"
                        style={{ width: '100%', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '1.1rem', background: '#f8fafc', boxSizing: 'border-box', color: '#2c3e50' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                        💡 Un buen asunto define si abren o no tu correo. Sé directo y atractivo.
                    </p>
                </div>

                {/* Rich Content Editor */}
                <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>
                        Contenido del Mensaje
                    </label>
                    <RichEditor name="content" />
                    <div style={{ marginTop: '16px', padding: '16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                        <p style={{ fontSize: '0.75rem', color: '#166534', margin: '0', fontWeight: '500' }}>
                            ✨ <strong>Tip de Alto Impacto:</strong> Usa encabezados grandes, colores de tu marca (Verde #7c9082 y Crema #d6d2c4), imágenes inspiradoras y un llamado a la acción claro para maximizar la tasa de apertura.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                    <Link href="/admin/campaigns" style={{ padding: '16px 30px', border: '1px solid #e2e8f0', borderRadius: '12px', textDecoration: 'none', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>
                        Cancelar
                    </Link>
                    <button type="submit" style={{ padding: '16px 40px', background: '#7c9082', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 4px 15px rgba(124,144,130,0.3)' }}>
                        Guardar Borrador
                    </button>
                </div>
            </form>
        </div>
    )
}
