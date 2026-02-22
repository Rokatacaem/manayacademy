
import 'dotenv/config';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Listing Tenants ---');
    const tenants = await prisma.tenant.findMany();
    console.log(JSON.stringify(tenants, null, 2));
    console.log('-----------------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
