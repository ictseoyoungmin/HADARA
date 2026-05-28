# Tests

## Required

- Docker temp-copy focused release-gate regression: `npx vitest run tests/unit/operational-debt.test.ts`
- Docker temp-copy full check: `npm run check`
- Docker built CLI strict release-gate smoke: `node dist/cli/main.js release gate --mode strict --json --project <temp-copy>`
- Docker built CLI done validation: `node dist/cli/main.js harness validate --task T-0130 --level done --json --project /workspace`

## Optional

- Confirm `INSTALL_MATRIX_SMOKE_PLAN` appears as a passed strict release-gate check.
