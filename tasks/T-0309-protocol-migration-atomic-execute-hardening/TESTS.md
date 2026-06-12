# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/protocol-migration.test.ts tests/unit/docs-mark.test.ts` in Docker | Verify no-write conflicts, rollback, and atomic registry write behavior. | Yes | Passed | `ev:T-0309:59a8a94ad9e64595b2e71f50` |
| `npm run build` in Docker with workspace `dist` refresh | Rebuild CLI after source changes. | Yes | Passed | `ev:T-0309:59a8a94ad9e64595b2e71f50` |
| Built CLI migration/docs mark smoke | Verify real CLI paths still execute after hardening. | Yes | Passed | `ev:T-0309:59a8a94ad9e64595b2e71f50` |
| `git diff --check` | Check whitespace before close. | Yes | Passed | `ev:T-0309:59a8a94ad9e64595b2e71f50` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permissions/secrets boundary changes. | Not Run | TBD |
| Integration smoke | No | Release readiness is shifted to T-0310. | Not Run | TBD |
