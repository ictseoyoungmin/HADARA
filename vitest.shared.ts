export const hadaraDevOnlyTestGlobs = [
  'tests/unit/clean-checkout-smoke.test.ts',
  'tests/unit/dev-docker-check.test.ts',
  'tests/unit/dev-docker-script.test.ts',
  'tests/unit/feature-smoke.test.ts',
  'tests/unit/manual-publish-script.test.ts',
  'tests/unit/operational-debt.test.ts',
  'tests/unit/package-recycle.test.ts',
  'tests/unit/package-smoke-dry-run.test.ts',
  'tests/unit/package-smoke-schema.test.ts',
  'tests/unit/release-*.test.ts'
];

export const sharedVitestNodeConfig = {
  globals: true,
  environment: 'node' as const,
  testTimeout: Number(process.env.HADARA_VITEST_TEST_TIMEOUT_MS ?? 30_000),
  hookTimeout: Number(process.env.HADARA_VITEST_HOOK_TIMEOUT_MS ?? 30_000)
};
