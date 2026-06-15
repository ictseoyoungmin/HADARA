# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/task-capsule.test.ts tests/harness/task-capsule.test.ts tests/harness/harness-validate.test.ts tests/unit/state-projection.test.ts tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/protocol-consistency.test.ts` | Focused regression coverage for scaffold, validation, state projection, generated docs, and workflow docs. | Yes | Passed: 7 files / 83 tests in Docker temp copy. | `command:T-0325:focused-docker` |
| `npm run dev:docker-sync-build` | Full Docker validation and dist refresh for HADARA-dev CLI changes. | Yes | Passed: build plus 119 files / 778 tests; `distLooksStale:false`. | `command:T-0325:full-docker-sync-build` |
| Built CLI smokes | Confirm generated handoffs omit `CloseState`, current state projection is clean after lifecycle, and lifecycle commands work. | Yes | Passed: disposable task create generated no HANDOFF `CloseState` row and draft harness validation returned `ok:true`. | `command:T-0325:built-smokes` |
| `git diff --check` | Whitespace sanity check. | Yes | Passed. | `command:T-0325:diff-check` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permissions, secrets, storage, or execution-boundary changes. | Not Run | Not applicable |
| Integration smoke | No | No external service integration change; built CLI smokes cover local lifecycle/read-model behavior. | Not Run | Not applicable |
