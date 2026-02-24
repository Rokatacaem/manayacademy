import { PrismaClient } from '../generated/prisma-client'

const prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Prisma Client Extension for Tenant Isolation
// This allows us to create a scoped prisma client that automatically appends tenantId to queries
export const getTenantPrisma = (tenantId: string) => {
    return prismaClient.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // List of models that HAVE a tenantId field and should be filtered
                    const tenantModels = [
                        'Contact', 'Tag', 'Campaign', 'Course',
                        'Module', 'Lesson', 'Enrollment', 'EmailLog', 'User'
                    ];

                    if (tenantModels.includes(model)) {
                        if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                            // Automatically add tenantId filter to read operations
                            args = args || {};
                            (args as any).where = { ...(args as any).where, tenantId };
                        } else if (['create', 'createMany'].includes(operation)) {
                            // Automatically add tenantId to create operations
                            if (operation === 'create') {
                                (args as any).data = { ...(args as any).data, tenantId };
                            } else {
                                if (Array.isArray((args as any).data)) {
                                    (args as any).data = (args as any).data.map((item: any) => ({ ...item, tenantId }));
                                }
                            }
                        } else if (['update', 'updateMany', 'upsert', 'delete', 'deleteMany'].includes(operation)) {
                            // Automatically add tenantId to write operations
                            (args as any).where = { ...(args as any).where, tenantId };
                        }
                    }

                    return query(args);
                },
            },
        },
    });
};

const globalForPrisma = globalThis as unknown as { prisma: typeof prismaClient }

export const prisma = globalForPrisma.prisma || prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
