import { PrismaClient } from '../generated/prisma-client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

console.log('Initializing Prisma Client. DB URL:', process.env.DATABASE_URL)
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
