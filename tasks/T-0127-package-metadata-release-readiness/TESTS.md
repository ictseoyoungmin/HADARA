# Tests

## Required

- Docker focused regression: `npx vitest run tests/unit/operational-debt.test.ts`
- Docker full check: `npm run check`
- Docker built CLI smoke: `node dist/cli/main.js release gate --mode strict --json --project /workspace`
- Docker built CLI done validation: `node dist/cli/main.js harness validate --task T-0127 --level done --json --project /workspace`

## Optional

- `git check-ignore -v docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` if the local-only supporting plan policy is touched.
