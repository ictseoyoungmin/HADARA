# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run test:focused -- tests/unit/context-graph-document-extractors.test.ts tests/unit/context-graph-evidence-extractors.test.ts tests/unit/context-graph-registry-extractors.test.ts tests/unit/context-graph-task-extractors.test.ts tests/unit/context-graph-extractor-contract.test.ts tests/unit/context-graph-schema.test.ts'` | Run focused context graph extractor/schema regressions in the Docker validation copy. | Yes | Passed: 6 files / 20 tests. | `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build'` | Build the Docker validation copy before refreshing workspace `dist`. | Yes | Passed. | `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run check'` | Run the full repository check in Docker. | Yes | Passed: 125 files / 811 tests. | `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Workspace dist refresh | Yes | CLI source changed, so Docker build output must refresh `/workspace/dist`. | Passed: `/tmp/hadara/dist` copied to `/workspace/dist`. | `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |
| Built CLI version smoke | Yes | Confirm refreshed workspace `dist` is executable and not stale. | Passed: `node dist/cli/main.js version --json` returned `ok:true` and `build.distLooksStale:false`. | `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |
| `git diff --check` | Yes | Catch whitespace errors before close. | Passed. | `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |
| Security smoke | No | Document extraction is read-only and does not change secrets, permissions, MCP, storage, or execution boundaries. | Not Run | Not required. |
| Integration smoke | No | No public CLI/read surface or graph builder integration was added in this capsule. | Not Run | Not required. |
