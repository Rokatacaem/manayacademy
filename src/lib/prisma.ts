import { PrismaClient } from '../generated/prisma-client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// In Vercel, POSTGRES_PRISMA_URL is used for the connection pool
console.log('Initializing Prisma Client.')

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
