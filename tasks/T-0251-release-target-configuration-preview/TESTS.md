# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused release dry-run tests | Run target configuration preview focused tests. | Yes | Passed | `docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0251 && npm run test:focused -- tests/unit/release-dry-run.test.ts tests/unit/schema-runtime.test.ts'` passed 2 files / 30 tests. |
| npm run check | Run full repository check in Docker. | Yes | Passed | `docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0251 && npm run check'` passed 92 files / 625 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI release dry-run smoke | Yes | Confirms target configuration through compiled CLI output. | Passed | `node dist/cli/main.js release dry-run --json --project /mnt/f/NowWorking/HADARA-dev` emitted `releaseTargetConfiguration.source: default`, `effectivePrimaryTarget: npm-package`, `autoPromotion:false`, Python preview, and Docker deferred. |
| Security smoke | No | No secrets/token/publish behavior added. | Not Run | TBD |
| Integration smoke | No | No provider/registry integration added. | Not Run | TBD |
