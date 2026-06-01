# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/evidence-normalizer.test.ts tests/unit/evidence-semantics.test.ts | Validate v1 evidence normalization and semantic classifier/analyzer. | Yes | Passed: 2 files / 15 tests | T-0186 focused test evidence |
| npm run dev:docker-sync-build | Full Docker check, build, dist refresh, and runtime smoke. | Yes | Passed: 77 files / 536 tests; version smoke ok:true | T-0186 Docker sync-build evidence |
| hadara task ready/close/audit-close --task T-0186 | Verify done readiness, append close evidence, and audit closure. | Yes | Passed: ready ok:true, close execute ok:true, audit-close ok:true | T-0186 close evidence |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Writer migration smoke | No | Evidence v2 writer and migration are out of scope. | Not Run | Not applicable |
