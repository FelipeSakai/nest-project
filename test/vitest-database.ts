import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import { Client } from 'pg';

const TEST_SCHEMA_PREFIX = 'test_';

function getBaseDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return new URL(process.env.DATABASE_URL);
}

function getWorkerSchema() {
  const workerId = process.env.VITEST_WORKER_ID ?? randomUUID();

  return `${TEST_SCHEMA_PREFIX}${workerId}`;
}

function getDatabaseUrlForSchema(schema: string) {
  const url = getBaseDatabaseUrl();
  url.searchParams.set('schema', schema);

  return url.toString();
}

function getAdminDatabaseUrl() {
  const url = getBaseDatabaseUrl();
  url.searchParams.delete('schema');

  return url.toString();
}

async function createSchema(schema: string) {
  const client = new Client({ connectionString: getAdminDatabaseUrl() });

  await client.connect();
  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
  await client.end();
}

async function dropAllTestSchemas() {
  const client = new Client({ connectionString: getAdminDatabaseUrl() });

  await client.connect();

  const result = await client.query<{ schema_name: string }>(
    `
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name LIKE '${TEST_SCHEMA_PREFIX}%'
    `,
  );

  for (const row of result.rows) {
    await client.query(`DROP SCHEMA IF EXISTS "${row.schema_name}" CASCADE;`);
  }

  await client.end();
}

type TestDatabaseState = {
  schema: string;
  databaseUrl: string;
  ready: Promise<void>;
};

const globalForTest = globalThis as typeof globalThis & {
  __testDatabaseState__?: TestDatabaseState;
  __testDatabaseUrl__?: string;
};

export function getTestDatabaseUrl() {
  return globalForTest.__testDatabaseUrl__ ?? process.env.DATABASE_URL;
}

export async function setupTestDatabase() {
  if (!globalForTest.__testDatabaseState__) {
    const schema = getWorkerSchema();
    const databaseUrl = getDatabaseUrlForSchema(schema);

    globalForTest.__testDatabaseUrl__ = databaseUrl;

    const ready = (async () => {
      await createSchema(schema);
      execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
      });
    })();

    globalForTest.__testDatabaseState__ = {
      schema,
      databaseUrl,
      ready,
    };
  }

  await globalForTest.__testDatabaseState__.ready;
}

export async function cleanupTestSchemas() {
  await dropAllTestSchemas();
}
