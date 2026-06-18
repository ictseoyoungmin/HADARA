# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/context-state-projection.test.ts tests/unit/context-graph-document-extractors.test.ts tests/unit/context-graph-extractor-contract.test.ts tests/unit/context-graph-schema.test.ts tests/unit/state-projection.test.ts` | Focused C1 compact projection, state-source extraction, schema, and existing Phase 8 projection compatibility. | Yes | Passed: 5 files / 19 tests. | `ev:T-0350:b540a670f64b48babe233d22` |
| Docker `npm run build` | TypeScript build and `dist` generation in the Docker validation copy. | Yes | Passed. | `ev:T-0350:b540a670f64b48babe233d22` |
| Docker `npm run check` | Full repository check. | Yes | Passed: 127 files / 818 tests. | `ev:T-0350:b540a670f64b48babe233d22` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Workspace dist refresh | Yes | CLI source changed, so Docker build output must refresh `/workspace/dist`. | Passed: `/tmp/hadara/dist` copied to `/workspace/dist`. | `ev:T-0350:b540a670f64b48babe233d22` |
| Built CLI version smoke | Yes | Confirm refreshed workspace `dist` is executable and not stale. | Passed: `node dist/cli/main.js version --json` returned `ok:true` and `build.distLooksStale:false`. | `ev:T-0350:b540a670f64b48babe233d22` |
| `git diff --check` | Yes | Catch whitespace errors before close. | Passed. | `ev:T-0350:b540a670f64b48babe233d22` |
