# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/task-finish.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/harness/harness-validate.test.ts tests/unit/task-workflow-docs.test.ts` | Focused task lifecycle finish/ready/close coverage. | Yes | Passed: 5 files / 40 tests. | Docker `/tmp/hadara` validation. |
| `npm run build` | TypeScript build. | Yes | Passed. | Docker sync-build. |
| `npm run dev:docker-sync-build` | Full reproducible check and `/workspace/dist` refresh. | Yes | Passed: 92 files / 607 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | Host-side Docker sync-build. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI finish JSON smoke | Yes | Proves refreshed built CLI exposes `stateDocs` in `task finish --json`. | Passed: before docs update T-0237 returned `stateDocsPending: 3`; after docs update it returned `ok:true`, `plannedWrites: 0`, `stateDocsPending: 0`, all state docs current. | `node dist/cli/main.js task finish --task T-0237 --json`. |
