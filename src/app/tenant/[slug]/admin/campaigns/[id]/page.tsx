import { prisma } from '@/lib/prisma';
import { updateCampaign, deleteCampaign, sendCampaign, duplicateCampaign } from '@/actions/campaigns';
import { notFound } from 'next/navigation';
import TestEmailPanel from '@/components/TestEmailPanel';
import RichEditor from '@/components/RichEditor';
import Link from 'next/link';

export default async function CampaignIdPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
    const { slug, id } = await params;

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.tenantId !== tenant.id) notFound();

    const tags = await prisma.tag.findMany({
        where: { tenantId: tenant.id },
        orderBy: { name: 'asc' }
    });

    const isSent = campaign.status === 'SENT';
    let stats: { sent?: number, errors?: number, total?: number } | null = null;
    if (campaign.stats) {
        try {
            stats = typeof campaign.stats === 'string' ? JSON.parse(campaign.stats) : campaign.stats;
        } catch (e) {
            console.error('Error parsing campaign stats:', e);
        }
    }

    const updateCampaignAction = updateCampaign.bind(null, tenant.id, campaign.id);
    const deleteCampaignAction = deleteCampaign.bind(null, tenant.id, campaign.id);
    const sendCampaignAction = sendCampaign.bind(null, tenant.id, campaign.id);
    const duplicateCampaignAction = duplicateCampaign.bind(null, tenant.id, campaign.id);

    const onUpdate = async (formData: FormData) => { 'use server'; await updateCampaignAction(formData); }
    const onDelete = async (formData: FormData) => { 'use server'; await deleteCampaignAction(formData); }
    const onSend = async (formData: FormData) => { 'use server'; await sendCampaignAction(formData); }
    const onDuplicate = async () => { 'use server'; await duplicateCampaignAction(); }

    const statusColor = isSent ? '#166534' : '#92400e'
    const statusBg = isSent ? '#f0fdf4' : '#fffbeb'
    const statusBorder = isSent ? '#bbf7d0' : '#fde68a'

    return (
        <div style={{ maxWidth: '1100px' }}>
            {/* Header */}
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ fontSize: '0.7rem', color: '#7c9082', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px' }}>Marketing</p>
                    <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: '0 0 12px', fontWeight: '400' }}>
                        {isSent ? 'Informe de Campaña' : 'Editar Campaña'}
                    </h1>
                    <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', background: statusBg, color: statusColor, border: `1px solid ${statusBorder}` }}>
                        {isSent ? '✅ Enviada' : '📝 Borrador'}
                    </span>
                </div>
                <Link href="/admin/campaigns" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', fontWeight: '600' }}>
                    ← Volver a campañas
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
                {/* Main Content */}
                <div>
                    <form action={onUpdate}>
                        <fieldset disabled={isSent} style={{ border: 'none', padding: 0, margin: 0 }}>
                            {/* Subject */}
                            <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '12px' }}>
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    defaultValue={campaign.subject}
                                    style={{ width: '100%', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '1.1rem', background: '#f8fafc', boxSizing: 'border-box', color: '#2c3e50' }}
                                />
                            </div>

                            {/* Content Editor */}
                            <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '16px' }}>
                                    Contenido del Mensaje
                                </label>
                                {isSent ? (
                                    <div
                                        style={{ padding: '20px', background: '#faf9f6', borderRadius: '12px', border: '1px solid #f1f5f9', minHeight: '200px' }}
                                        dangerouslySetInnerHTML={{ __html: campaign.content || '' }}
                                    />
                                ) : (
                                    <RichEditor name="content" initialValue={campaign.content || ''} />
                                )}
                            </div>

                            {!isSent && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" style={{ padding: '14px 32px', background: '#5e6f63', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                        Guardar Cambios
                                    </button>
                                </div>
                            )}
                        </fieldset>
                    </form>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Test Send Panel */}
                    <TestEmailPanel
                        tenantId={tenant.id}
                        campaignId={campaign.id}
                        defaultEmail="info@manayacademy.com"
                    />

                    {/* Send Campaign or Stats */}
                    {!isSent ? (
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #2c3e50, #1a252f)', padding: '20px 24px' }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3em' }}>Envío masivo</p>
                                <h3 style={{ margin: '4px 0 0', color: 'white', fontSize: '1rem', fontWeight: '600' }}>🚀 Lanzar Campaña</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
                                    ⚠️ Una vez enviada, <strong>no podrás editar</strong> esta campaña. Asegúrate de haberla probado antes.
                                </p>
                                <form action={onSend}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>
                                        Destinatarios
                                    </label>
                                    <select name="targetType" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '16px', background: '#f8fafc', fontSize: '0.85rem', color: '#2c3e50' }}>
                                        <option value="all">Todos los Contactos Activos</option>
                                        <option value="tags">Filtrar por Etiquetas</option>
                                    </select>

                                    {tags.length > 0 && (
                                        <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 10px', fontWeight: '600' }}>Selecciona etiquetas:</p>
                                            {tags.map(tag => (
                                                <label key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '0.85rem', color: '#2c3e50', cursor: 'pointer' }}>
                                                    <input type="checkbox" name="tags" value={tag.id} />
                                                    {tag.name}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    <button type="submit" style={{ width: '100%', padding: '16px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                        Enviar Ahora 🚀
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '24px' }}>
                            <h3 style={{ margin: '0 0 20px', fontSize: '1rem', color: '#2c3e50' }}>📊 Resultados</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#f0fdf4', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#166534' }}>✅ Enviados</span>
                                    <strong style={{ color: '#166534' }}>{stats?.sent ?? 0}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#fef2f2', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>❌ Errores</span>
                                    <strong style={{ color: '#991b1b' }}>{stats?.errors ?? 0}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#2c3e50' }}>👥 Total</span>
                                    <strong>{stats?.total ?? 0}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Duplicate */}
                    <form action={onDuplicate}>
                        <button type="submit" style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem', marginBottom: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            📄 Duplicar campaña
                        </button>
                    </form>

                    {/* Delete */}
                    <form action={onDelete}>
                        <button type="submit" style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}>
                            🗑️ Eliminar campaña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
