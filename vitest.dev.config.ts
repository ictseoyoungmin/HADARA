import { defineConfig } from 'vitest/config';
import { hadaraDevOnlyTestGlobs, sharedVitestNodeConfig } from './vitest.shared';

export default defineConfig({
  test: {
    include: hadaraDevOnlyTestGlobs,
    ...sharedVitestNodeConfig
  }
});
