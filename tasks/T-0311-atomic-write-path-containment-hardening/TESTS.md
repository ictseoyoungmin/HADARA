# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused tests for `tests/unit/core-fs.test.ts`, `tests/unit/protocol-migration.test.ts`, and `tests/unit/docs-mark.test.ts` | Verify helper containment plus current atomic write callers. | Yes | Passed | 3 files / 14 tests passed; evidence `command:T-0311:focused-tests`. |
| Docker sync-build | Rebuild TypeScript, run full check, and refresh workspace `dist` after core changes. | Yes | Passed | 118 files / 762 tests passed; workspace `dist` refreshed; evidence `command:T-0311:docker-sync-build`. |
| git diff --check | Catch whitespace issues in code/docs changes. | Yes | Passed | Evidence `command:T-0311:diff-check`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Path containment rejection smoke | Yes | This task changes a write-boundary security guard. | Passed | `tests/unit/core-fs.test.ts` rejects parent traversal and absolute paths before temp creation. |
| Release readiness full suite | No | T-0310 already ran full rc.2 readiness; this capsule is a focused post-readiness hardening follow-up with no version/publish change. | Not Run | T-0310 evidence baseline remains current for release readiness. |
