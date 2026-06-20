# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js init register-doc ... --json` | Preview SOP registration for the new spec. | Yes | Passed | `ev:T-0392:46f350146736461ea9712b18` |
| `node dist/cli/main.js init register-doc ... --execute --json` | Register spec in SOP Required Reading. | Yes | Passed | `ev:T-0392:46f350146736461ea9712b18` |
| `git diff --check` | Verify whitespace cleanliness for docs-only changes. | Yes | Passed | `ev:T-0392:46f350146736461ea9712b18` |
| `timeout 300 docker exec hadara-dev ... npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/init-followup.test.ts tests/unit/docs-required-reading.test.ts` | Verify docs registry and required-reading references remain coherent. | Yes | Passed: 2 files / 6 tests. | `ev:T-0392:46f350146736461ea9712b18` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No runtime security boundary changes in this docs-only capsule. | Not Run | N/A |
| Full Docker sync-build | No | This capsule is docs/spec/registry only; follow-up command capsules will run full build. | Not Run | N/A |
