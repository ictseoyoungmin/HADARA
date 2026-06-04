# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused release dry-run tests | Run advisory read-model focused tests. | Yes | Passed | `docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0250 && npm run test:focused -- tests/unit/release-dry-run.test.ts tests/unit/schema-runtime.test.ts'` passed 2 files / 29 tests. |
| npm run check | Run the full repository check in Docker. | Yes | Passed | `docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0250 && npm run check'` passed 92 files / 624 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI release dry-run smoke | Yes | Confirms `providerAdvisories` through compiled CLI output. | Passed | `node dist/cli/main.js release dry-run --json --project /mnt/f/NowWorking/HADARA-dev` emitted Python advisory `smokeEvidence: missing`, `blocking:false`, with release readiness still ready. |
| Security smoke | No | No secrets/token/publish behavior added. | Not Run | TBD |
| Integration smoke | No | No provider or registry integration added. | Not Run | TBD |
