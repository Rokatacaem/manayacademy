
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="glass-card p-12 rounded-2xl text-center max-w-lg w-full relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 blur-3xl -translate-x-10 -translate-y-10 rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/20 blur-3xl translate-x-10 translate-y-10 rounded-full"></div>

                <h2 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-4">404</h2>
                <h3 className="text-2xl font-semibold text-foreground mb-6">Página No Encontrada</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                    Parece que te has perdido en el espacio. La página que buscas no existe o ha sido movida.
                </p>
                <Link href="/" className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg shadow-violet-500/25">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    )
}
