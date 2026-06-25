import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true,
    environment: 'node',
    testTimeout: Number(process.env.HADARA_VITEST_TEST_TIMEOUT_MS ?? 30_000),
    hookTimeout: Number(process.env.HADARA_VITEST_HOOK_TIMEOUT_MS ?? 30_000)
  }
});
