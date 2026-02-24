import { PrismaClient } from '../src/generated/prisma-client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    // Apuntamos al nuevo dump SQL
    const filePath = 'c:\\Users\\rokat\\Downloads\\manayaca_Clientes.sql';

    if (!fs.existsSync(filePath)) {
        console.error(`Error: El archivo ${filePath} no existe.`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Buscar los valores dentro de los INSERT INTO `prospectos`
    // El formato es (id, 'nombre', 'correo', 'fecha', enviado)
    const rugbyRegex = /\(([^,]+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([^)]+)\)/g;
    const matches = [...content.matchAll(rugbyRegex)];

    const legacyContacts = matches.map(match => ({
        id: match[1],
        nombre: match[2],
        correo: match[3].trim().toLowerCase(),
    })).filter(c => c.correo && c.correo.includes('@'));

    console.log(`Detectados ${legacyContacts.length} contactos en el archivo SQL.`);

    const tenant = await prisma.tenant.findFirst({
        where: { slug: 'demo' }
    });

    if (!tenant) {
        console.error('Error: No se encontró el tenant principal "demo".');
        process.exit(1);
    }

    let successCount = 0;
    let skipCount = 0;

    for (const legacy of legacyContacts) {
        try {
            await prisma.contact.upsert({
                where: {
                    tenantId_email: {
                        tenantId: tenant.id,
                        email: legacy.correo
                    }
                },
                update: {
                    firstName: legacy.nombre || undefined,
                },
                create: {
                    email: legacy.correo,
                    firstName: legacy.nombre || 'Sin nombre',
                    status: 'ACTIVE',
                    source: 'Legacy Migration (SQL)',
                    tenantId: tenant.id
                }
            });
            successCount++;
        } catch (error) {
            console.error(`Error migrando a ${legacy.correo}:`, error);
            skipCount++;
        }
    }

    console.log('--- Resumen de Migración SQL ---');
    console.log(`Leídos del SQL: ${legacyContacts.length}`);
    console.log(`Upsert exitosos: ${successCount}`);
    console.log(`Errores: ${skipCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
