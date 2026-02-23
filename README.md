This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel (Producción)

Este proyecto está configurado para desplegarse en **Vercel** usando **Vercel Postgres** (PostgreSQL).

### Configuración de Base de Datos

1. Crea un proyecto en el Dashboard de Vercel.
2. En la pestaña `Storage`, crea una instancia de **Vercel Postgres**.
3. Asegúrate de que las variables de entorno `POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING` estén vinculadas al proyecto.

### Configuración DNS (Importante)

Para mantener los servicios de correo en Wirenet Chile:

1. **NO cambies los Nameservers**.
2. Registro A: `@` -> `76.76.21.21`
3. Registro CNAME: `www` -> `cname.vercel-dns.com`
4. Registro CNAME: `*` -> `cname.vercel-dns.com` (para multi-tenant)

### Comandos de Producción

```bash
# Sincronizar esquema con PostgreSQL
npx prisma db push

# Poblar base de datos inicial
npm run db:seed
```
