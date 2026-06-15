# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/harness/harness-validate.test.ts tests/unit/task-ready.test.ts tests/unit/task-capsule.test.ts tests/unit/task-create.test.ts tests/unit/dashboard-bootstrap.test.ts` | Run focused regression coverage for handoff scaffold, done-level validation, ready propagation, task creation, and selected-task proof compatibility. | Yes | Passed in Docker temp copy: 5 files / 40 tests. | `command:T-0320:docker-focused` |
| `npm run dev:docker-sync-build` | Run the full Docker-backed repository check and refresh workspace `dist`. | Yes | Passed: 118 files / 769 tests; built CLI reported `distLooksStale:false`. | `command:T-0320:docker-full-sync-build` |
| `git diff --check` | Check whitespace and patch hygiene. | Yes | Passed. | `command:T-0320:repo-docs-harness-checks` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Docs doctor / required-reading | Yes | This capsule changes task workflow state semantics and shared docs. | Passed with existing docs doctor warnings only; required-reading `ok:true`. | `command:T-0320:repo-docs-harness-checks` |
| T-0320 draft harness validate | Yes | Confirm the active capsule frame is valid before lifecycle close. | Passed. | `command:T-0320:repo-docs-harness-checks` |
