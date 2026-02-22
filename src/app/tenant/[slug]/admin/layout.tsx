import Link from 'next/link';
import { signOut } from '@/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#faf9f6' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '32px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.6rem', color: '#7c9082', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3em', margin: '0 0 8px' }}>
                        Centro de Bienestar
                    </p>
                    <h2 style={{ margin: '0', fontSize: '1.1rem', color: '#2c3e50', fontWeight: '600' }}>
                        Manay Academy
                    </h2>
                </div>

                <nav style={{ padding: '24px 12px', flex: 1 }}>
                    <Link href="/admin" style={navLinkStyle}>
                        📊 Resumen
                    </Link>

                    <p style={navCategoryStyle}>CRM</p>
                    <Link href="/admin/contacts" style={navLinkStyle}>
                        👥 Contactos
                    </Link>
                    <Link href="/admin/tags" style={navLinkStyle}>
                        🏷️ Etiquetas
                    </Link>

                    <p style={navCategoryStyle}>Marketing</p>
                    <Link href="/admin/campaigns" style={navLinkStyle}>
                        📧 Campañas
                    </Link>

                    <p style={navCategoryStyle}>Academia</p>
                    <Link href="/admin/courses" style={navLinkStyle}>
                        🎓 Cursos
                    </Link>
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
                    <form action={async () => {
                        'use server'
                        const { signOut: serverSignOut } = await import('@/auth')
                        await serverSignOut({ redirectTo: '/login' })
                    }}>
                        <button type="submit" style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Cerrar Sesión
                        </button>
                    </form>
                    <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '0.65rem', color: '#94a3b8', textDecoration: 'none' }}>
                        ← Ver web pública
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}

const navLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '0.875rem',
    color: '#2c3e50',
    textDecoration: 'none',
    marginBottom: '4px',
    fontWeight: '500',
}

const navCategoryStyle: React.CSSProperties = {
    padding: '16px 16px 6px',
    fontSize: '0.6rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    margin: '0',
}
