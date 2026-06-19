# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | No | Not Run: docs-only readiness cleanup; no runtime/source changes. | `ev:T-0385:502833bf598b4d31b22d27db` |
| npm run check | Run the full repository check when available. | No | Not Run: docs-only readiness cleanup; T-0384 is the latest full Docker baseline. | `ev:T-0385:502833bf598b4d31b22d27db` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Stale readiness phrase check | Yes | Proves completed cleanup is no longer described as future work. | Passed: no matches for completed-cleanup future-work phrases. | `ev:T-0385:502833bf598b4d31b22d27db` |
| Completion audit docs explain | Yes | Proves the registered audit doc is still discoverable. | Passed: `docs explain` returned `ok:true`. | `ev:T-0385:502833bf598b4d31b22d27db` |
| `git diff --check` | Yes | Proves whitespace/patch formatting is clean. | Passed. | `ev:T-0385:502833bf598b4d31b22d27db` |
| Security smoke | No | Security boundary implementation changes are routed to T-0387. | Not Run | `ev:T-0385:502833bf598b4d31b22d27db` |
| Integration smoke | No | Runtime integration changes were not made in T-0385. | Not Run | `ev:T-0385:502833bf598b4d31b22d27db` |
