
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('--- Listing Tenants ---');
    try {
        const tenants = await prisma.tenant.findMany();
        console.log(JSON.stringify(tenants, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
    console.log('-----------------------');
}

main();
