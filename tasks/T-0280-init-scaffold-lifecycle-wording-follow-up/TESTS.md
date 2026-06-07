# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused init/workflow tests: `npm run test:focused -- tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts` | Verify generated init docs, root workflow docs, and README/SOP expectations. | Yes | Passed | 2 files / 24 tests passed in `hadara-dev` `/tmp/hadara`. |
| Built CLI init profile smoke in `hadara-dev` `/tmp` folders | Verify fresh `basic`, `standard`, and `governed` scaffolds contain current lifecycle wording/order and pass `init doctor`. | Yes | Passed | `basic ok`, `standard ok`, and `governed ok` from `/tmp/hadara/dist/cli/main.js`. |
| `git diff --check` | Catch whitespace issues in patched docs/source. | Yes | Passed | No output; exit 0. |
| Docker full check / sync build | Strongest routine Node validation and refreshed workspace `dist` when feasible. | Yes | Passed | 100 files / 681 tests passed; `/workspace/dist` refreshed. |
| Workspace built CLI basic init smoke | Verify synced `/workspace/dist` contains the new init template. | Yes | Passed | `workspace-dist-basic-init-ok`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary or secret-handling behavior changes. | Not Run | Out of scope. |
| Integration smoke | No | No integration runtime surface changes. | Not Run | Out of scope. |
| Registry publish | No | This task only records the user-reported PyPI state and docs alignment; no publish mutation is requested. | Not Run | Out of scope. |
