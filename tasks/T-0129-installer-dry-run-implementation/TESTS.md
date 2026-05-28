# Tests

## Required

- Docker focused installer dry-run regression: `npx vitest run tests/unit/install-plan.test.ts tests/unit/schema-runtime.test.ts tests/unit/tools-list.test.ts`
- Docker full check: `npm run check`
- Docker built CLI smoke: `node dist/cli/main.js install plan --platform posix --source dist-release/hadara-0.1.0-rc.0.tgz --json`
- Docker built CLI execute-disabled smoke: `node dist/cli/main.js install plan --mode execute --json`
- Docker built CLI done validation: `node dist/cli/main.js harness validate --task T-0129 --level done --json --project /workspace`

## Optional

- Confirm no installer scripts, portable launchers, install directories, package artifacts, or PATH/profile mutations were created.
