import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await auth();
    const tenantId = (session?.user as any)?.tenantId;

    const [contactCount, courseCount] = await Promise.all([
        prisma.contact.count({ where: { tenantId } }),
        prisma.course.count({ where: { tenantId } }),
    ]);

    const recentContacts = await prisma.contact.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
    });

    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '0.7rem', color: '#7c9082', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px' }}>
                    Centro de Bienestar Integral
                </p>
                <h1 style={{ fontSize: '2rem', color: '#2c3e50', margin: '0', fontWeight: '400' }}>
                    Panel de Control
                </h1>
                <p style={{ color: '#64748b', marginTop: '8px' }}>
                    Bienvenida, {session?.user?.name ?? 'Ana'}
                </p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div style={{ background: 'white', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderTop: '4px solid #7c9082' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 12px' }}>Total Contactos</p>
                    <p style={{ fontSize: '3rem', fontWeight: '300', color: '#2c3e50', margin: '0', lineHeight: '1' }}>{contactCount}</p>
                </div>
                <div style={{ background: 'white', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderTop: '4px solid #d6d2c4' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 12px' }}>Cursos Activos</p>
                    <p style={{ fontSize: '3rem', fontWeight: '300', color: '#2c3e50', margin: '0', lineHeight: '1' }}>{courseCount}</p>
                </div>
            </div>

            {/* Recent Contacts */}
            <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Últimos Contactos</h2>
                    <Link href="/admin/contacts" style={{ fontSize: '0.75rem', color: '#7c9082', textDecoration: 'none', fontWeight: '600' }}>
                        Ver todos →
                    </Link>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#faf9f6' }}>
                            <th style={{ padding: '12px 32px', textAlign: 'left', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Nombre</th>
                            <th style={{ padding: '12px 32px', textAlign: 'left', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Email</th>
                            <th style={{ padding: '12px 32px', textAlign: 'left', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentContacts.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Aún no hay contactos registrados
                                </td>
                            </tr>
                        ) : recentContacts.map((c, i) => (
                            <tr key={c.id} style={{ borderTop: '1px solid #f8f9fa' }}>
                                <td style={{ padding: '16px 32px', fontSize: '0.9rem', color: '#2c3e50', fontWeight: '500' }}>
                                    {c.firstName} {c.lastName ?? ''}
                                </td>
                                <td style={{ padding: '16px 32px', fontSize: '0.85rem', color: '#64748b' }}>{c.email}</td>
                                <td style={{ padding: '16px 32px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    {new Date(c.createdAt).toLocaleDateString('es-CL')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
