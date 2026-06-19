# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Host `npm test -- --run ...` | Initial focused host attempt. | No | Failed: host `vitest` is not installed. | `ev:T-0386:4413cd420e354248bb671461` |
| Docker temp-copy focused tests | Validate parser, harness, and protocol-consistency changes. | Yes | Passed: 3 files / 50 tests. | `ev:T-0386:4413cd420e354248bb671461` |
| `npm run dev:docker-sync-build` | Full Docker build/test and dist refresh. | Yes | Passed: 138 files / 906 tests; `distLooksStale:false`. | `ev:T-0386:4413cd420e354248bb671461` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| JSON `dev docker-check --focused` wrapper | Diagnostic attempt. | No | Failed at temp-workspace with raw logs omitted; direct Docker temp-copy validation passed afterward. | `ev:T-0386:4413cd420e354248bb671461` |
| Security smoke | No | Security boundary changes are routed to T-0387. | Not Run | `ev:T-0386:4413cd420e354248bb671461` |
| Integration smoke | No | Lifecycle validation behavior is covered by focused/full test suites. | Not Run | `ev:T-0386:4413cd420e354248bb671461` |
