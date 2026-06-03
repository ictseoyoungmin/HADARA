# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task finish --execute` appends a `Done` row to `TASK.md` Status History when finishing a capsule. | Done | `tests/unit/task-finish.test.ts`. |
| AC-2 | `task finish --execute` also repairs Status History when `## Status` is already Done but history is not. | Done | `tests/unit/task-finish.test.ts`. |
| AC-3 | Done-level harness validation fails with a stable issue code when Status History does not end with Done. | Done | `tests/harness/harness-validate.test.ts`. |
| AC-4 | Shared Markdown section reading only matches real heading lines and is used by task/protocol/read-model section readers. | Done | `tests/unit/markdown-table.test.ts`; source search found no remaining `indexOf(heading)` readers outside the common helper. |
| AC-5 | Focused tests cover finish sync, harness validation, and shared section extraction behavior. | Done | Focused Docker tests passed 7 files / 74 tests. |
| AC-6 | Evidence is attached and handoff is updated. | Done | Additional evidence attached; close/audit-close refreshed after shared section reader consolidation. |
