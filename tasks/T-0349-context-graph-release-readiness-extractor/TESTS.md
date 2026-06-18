# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/context-graph-release-extractors.test.ts tests/unit/context-graph-extractor-contract.test.ts tests/unit/context-graph-schema.test.ts` | First focused release extractor/contract/schema validation. | Yes | Passed: 3 files / 11 tests. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |
| Docker `npm run test:focused -- tests/unit/context-graph-release-extractors.test.ts tests/unit/context-graph-document-extractors.test.ts tests/unit/context-graph-evidence-extractors.test.ts tests/unit/context-graph-registry-extractors.test.ts tests/unit/context-graph-task-extractors.test.ts tests/unit/context-graph-extractor-contract.test.ts tests/unit/context-graph-schema.test.ts` | Full focused context graph extractor regression set. | Yes | Passed: 7 files / 23 tests. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |
| Docker `npm run build` | TypeScript build and `dist` generation in the Docker validation copy. | Yes | Passed. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |
| Docker `npm run check` | Full repository check. | Yes | Passed: 126 files / 814 tests. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Workspace dist refresh | Yes | CLI source changed, so Docker build output must refresh `/workspace/dist`. | Passed: `/tmp/hadara/dist` copied to `/workspace/dist`. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |
| Built CLI version smoke | Yes | Confirm refreshed workspace `dist` is executable and not stale. | Passed: `node dist/cli/main.js version --json` returned `ok:true` and `build.distLooksStale:false`. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |
| `git diff --check` | Yes | Catch whitespace errors before close. | Passed. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e` |
