# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/release-dry-run.test.ts tests/unit/release-artifact.test.ts tests/unit/package-smoke-dry-run.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/operational-debt.test.ts tests/unit/evidence-json.test.ts tests/unit/evidence-list.test.ts` | Focused release/evidence compatibility suite. | Yes | Passed: 7 files / 73 tests. | Docker `/tmp/hadara` validation. |
| `npm run build` | TypeScript build. | Yes | Passed. | Docker `/tmp/hadara` validation. |
| `npm run dev:docker-sync-build` | Full reproducible check and `/workspace/dist` refresh. | Yes | Passed: 91 files / 600 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | Host-side Docker sync-build. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host direct test run | No | Host `node_modules` remains non-baseline local state. | Not Run | Docker validation used instead. |
| Release execution smoke | No | This capsule changes evidence attachment/read compatibility, not release execution semantics. | Not Run | Existing unit coverage and full suite used. |
