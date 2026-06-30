import { cleanupTestSchemas } from './vitest-database';

export default async function globalSetup() {
  await cleanupTestSchemas();

  return async () => {
    await cleanupTestSchemas();
  };
}
