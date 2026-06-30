import { beforeAll } from 'vitest';
import { setupTestDatabase } from './vitest-database';

beforeAll(async () => {
    await setupTestDatabase();
});
