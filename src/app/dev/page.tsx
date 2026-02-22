import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DevPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-foreground relative overflow-hidden">
            {/* Background elements are handled in globals.css, ensuring consistency */}

            <div className="max-w-5xl w-full space-y-12 text-center relative z-10">
                <div className="space-y-4 animate-fade-in-up">
                    <h1 className="text-7xl font-extrabold tracking-tight pb-2">
                        <span className="text-gradient">Manay Academy</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Plataforma Integral de Gestión y Aprendizaje
                    </p>
                    <div className="inline-flex items-center px-4 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        Environment: Development
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 px-4">
                    {/* Admin Section */}
                    <div className="glass-card hover:border-violet-500/50 transition-all duration-300 p-8 rounded-3xl flex flex-col items-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🛠️</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-foreground">Administración</h2>
                        <p className="text-muted-foreground mb-8 flex-1 text-lg">
                            Gestiona tenants, CRM, campañas y contenido educativo.
                        </p>
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                            <Link href="http://demo.localhost:3000/admin/contacts" className="w-full">
                                <Button className="w-full h-12 text-lg bg-white/5 hover:bg-white/10 border-white/10" variant="secondary">
                                    CRM (Contactos)
                                </Button>
                            </Link>
                            <Link href="http://demo.localhost:3000/admin/campaigns" className="w-full">
                                <Button className="w-full h-12 text-lg bg-white/5 hover:bg-white/10 border-white/10" variant="secondary">
                                    Email Marketing
                                </Button>
                            </Link>
                            <Link href="http://demo.localhost:3000/admin/courses" className="w-full">
                                <Button className="w-full h-12 text-lg bg-white/5 hover:bg-white/10 border-white/10" variant="secondary">
                                    Cursos (Admin)
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Student Section */}
                    <div className="glass-card hover:border-fuchsia-500/50 transition-all duration-300 p-8 rounded-3xl flex flex-col items-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/25 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-foreground">Estudiantes</h2>
                        <p className="text-muted-foreground mb-8 flex-1 text-lg">
                            Experiencia de aprendizaje inmersiva para tus alumnos.
                        </p>
                        <div className="flex flex-col gap-4 w-full max-w-sm mt-auto">
                            <Link href="http://demo.localhost:3000/courses" className="w-full">
                                <Button className="w-full h-12 text-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-90 border-0">
                                    Ver Catálogo
                                </Button>
                            </Link>
                            <Link href="http://demo.localhost:3000/" className="w-full">
                                <Button className="w-full h-12 text-lg bg-white/5 hover:bg-white/10 border-white/10" variant="secondary">
                                    Home Tenant
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-sm text-muted-foreground/50 font-mono">
                    v0.2.0-beta • Manay Academy
                </div>
            </div>
        </div>
    );
}
