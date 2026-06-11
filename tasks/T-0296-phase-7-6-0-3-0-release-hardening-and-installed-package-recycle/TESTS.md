# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec -w /workspace hadara-dev node node_modules/vitest/vitest.mjs run tests/unit/init.test.ts tests/unit/runtime-version.test.ts tests/unit/release-dry-run.test.ts tests/unit/release-publish.test.ts tests/unit/package-smoke-dry-run.test.ts tests/unit/clean-checkout-smoke.test.ts` | Focused README/version/release smoke tests. | Yes | Passed | 6 files / 61 tests |
| `docker exec -w /workspace hadara-dev node node_modules/vitest/vitest.mjs run tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts` | Focused README workflow contract regression after README rewrite. | Yes | Passed | 2 files / 24 tests |
| `bash scripts/dev-docker-sync-build.sh` | Docker `npm ci`, `npm run check`, dist refresh, and built CLI version smoke. | Yes | Passed | 115 files / 741 tests; evidence `command:T-0296:docker-sync-build` |
| `env npm_config_cache=/tmp/hadara-npm-cache node dist/cli/main.js package smoke --execute --task T-0296 --attach-evidence --json` | Package tarball/install/core feature smoke with public evidence. | Yes | Passed | package smoke evidence artifact |
| `docker exec -w /workspace -e npm_config_cache=/tmp/hadara-npm-cache hadara-dev node dist/cli/main.js smoke clean-checkout --execute --task T-0296 --attach-evidence --json` | Clean checkout smoke in validated Docker environment. | Yes | Passed | clean-checkout smoke evidence artifact |
| Installed package recycle from `/tmp/hadara-0296-recycle-Az0Gx2/hadara-0.3.0-rc.0.tgz` | Validate installed CLI help, fresh init profiles, lifecycle, docs registry, managed patch, and docs cleanup. | Yes | Passed | evidence `command:T-0296:installed-package-recycle` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host `package smoke --execute` without npm cache override | No | Initial environment probe exposed read-only npm home cache. | Failed as expected | Followed by passed `/tmp` npm cache run. |
| Host `smoke clean-checkout --execute` | No | Initial environment probe exposed registry DNS `EAI_AGAIN`/npm exit-handler issue. | Failed as expected | Followed by passed Docker clean-checkout run. |
| `release artifact`, `release dry-run`, `release publish --mode dry-run` | Yes | Release readiness proof requires clean worktree. | Pending | Run after clean commit. |
