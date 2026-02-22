
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
const prisma = new PrismaClient()
async function main() {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: 'demo' }
    })
    console.log('Tenant check:', tenant)
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
