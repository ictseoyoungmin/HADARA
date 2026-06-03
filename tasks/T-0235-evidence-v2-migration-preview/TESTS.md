# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/evidence-migration.test.ts tests/unit/schema-fixtures.test.ts tests/unit/evidence-json.test.ts tests/unit/evidence-list.test.ts tests/unit/evidence-normalizer.test.ts tests/unit/evidence-lint.test.ts tests/harness/harness-validate.test.ts` | Focused migration/evidence compatibility suite. | Yes | Passed: 7 files / 64 tests. | Docker `/tmp/hadara` validation. |
| `npm run build` | TypeScript build. | Yes | Passed. | Docker `/tmp/hadara` validation. |
| `npm run dev:docker-sync-build` | Full reproducible check and `/workspace/dist` refresh. | Yes | Passed: 92 files / 603 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | Host-side Docker sync-build. |
| `node dist/cli/main.js task ready --task T-0235 --level done --json` | Done-level readiness gate. | Yes | Passed: `ok:true`, blockers 0, warnings 0. | Built CLI close loop. |
| `node dist/cli/main.js task close --task T-0235 --execute --json` and `node dist/cli/main.js task audit-close --task T-0235 --json` | Close evidence append and read-only audit. | Yes | Passed: close evidence appended; audit-close `ok:true`, blockers 0, warnings 0. | Built CLI close loop. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI migration preview smoke | Yes | Proves the built command works on real historical v1 evidence. | Passed: T-0015 returned plannedTransforms 5, skippedRecords 0, beforeHash present. | `node dist/cli/main.js evidence migrate --task T-0015 --to v2 --json`. |
| Execute migration smoke | No | Execute mode is intentionally out of scope. | Not Run | Tests verify execute is rejected without writes. |
