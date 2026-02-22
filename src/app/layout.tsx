import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ana Katherine Zepeda - Psicóloga y Maestra de Yoga',
  description: 'Navegando todo sobre salud mental, física y espiritual con Ana Katherine Zepeda Pallacán.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
