# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm ci --ignore-scripts` in `/tmp/hadara-t0287-validate` | Install dependencies in disposable copy. | Yes | Passed | T-0287 command evidence |
| `npm run build` in `/tmp/hadara-t0287-validate` | Build rc3 source. | Yes | Passed | T-0287 command evidence |
| `npm run test:focused -- tests/unit/init.test.ts tests/unit/package-smoke-dry-run.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/release-dry-run.test.ts tests/unit/release-artifact.test.ts tests/unit/proof-status.test.ts tests/unit/ci-gate.test.ts` | Cover rc3 docs/readiness/package/proof/CI surfaces. | Yes | Passed, 7 files / 69 tests | T-0287 command evidence |
| `npm run check` in `/tmp/hadara-t0287-validate` | Full repository check. | Yes | Passed, 102 files / 690 tests | T-0287 command evidence |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Package smoke | Yes | Verify package contents and installed CLI behavior. | Passed | package-smoke artifact |
| Clean-checkout smoke | Yes | Verify disposable clean checkout build/check/built CLI release gate. | Passed | clean-checkout-smoke artifact |
| Fresh init/recycle smoke | Yes | Verify installed-package recycle workflow against built CLI. | Passed | T-0287 command evidence |
| Release artifact | Yes | Refresh rc3 release artifact evidence. | Passed | release-artifact artifact |
| Release dry-run | Yes | Identify publish-readiness blockers. | Passed | readiness ready, blockers 0 |
| Release publish dry-run | Yes | Confirm approval/token/no-mutation boundary. | Passed | ok:true; warnings for absent tokens only |
