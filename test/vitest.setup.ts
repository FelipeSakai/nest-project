import { execSync } from 'child_process';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

let prisma: PrismaClient;
let schema: string | null;

function generateUniqueDatabaseURL(schemaId: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schemaId);

    return url.toString();
}

beforeAll(async () => {
    const databaseURL = generateUniqueDatabaseURL(`test_${Date.now()}`);
    const adminURL = new URL(databaseURL);
    adminURL.searchParams.delete('schema');

    process.env.DATABASE_URL = databaseURL;
    schema = new URL(databaseURL).searchParams.get('schema');

    const client = new Client({ connectionString: adminURL.toString() });
    await client.connect();
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
    await client.end();

    execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
        stdio: 'inherit',
    });

    const adapter = new PrismaPg({ connectionString: databaseURL });

    prisma = new PrismaClient({ adapter, log: ['warn', 'error'] });
});

afterAll(async () => {
    if (!prisma || !schema) {
        return;
    }

    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
    await prisma.$disconnect();
});
