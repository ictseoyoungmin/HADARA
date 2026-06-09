# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` in `/tmp/hadara-t0286-validate` | Type-check source. | Yes | Passed | Evidence recorded. |
| `npm run test:focused -- tests/unit/ci-gate.test.ts tests/unit/proof-status.test.ts tests/unit/protocol-consistency.test.ts` in `/tmp/hadara-t0286-validate` | Run focused CI/proof/protocol regressions. | Yes | Passed | 3 files / 26 tests. |
| `node dist/cli/main.js ci gate --mode advisory --task T-0285 --json` | Built CLI CI gate smoke. | Yes | Passed | Returned advisory stale-proof warning. |
| `git diff --check` | Whitespace sanity check. | Yes | Passed | Evidence recorded. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
