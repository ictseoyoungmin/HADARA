# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-capsule.ts` | Modify | Generate the 0.4 four-file Task Capsule by default. | Done |
| `src/task/task-templates.ts` | Modify | Keep template TASK.md content aligned with the 0.4 section contract without adding sidecar files. | Done |
| `src/task/task-finish.ts` | Modify | Let finish update Identity table status when no legacy Status section exists. | Done |
| `src/harness/validate.ts` | Modify | Validate the new required file set and TASK.md embedded acceptance/status shape. | Done |
| `src/services/task-read-model.ts` | Modify | Return the 0.4 task file set from task read surfaces. | Done |
| `src/services/state-projection.ts` | Modify | Read task status from Identity tables. | Done |
| `src/services/protocol-consistency.ts` | Modify | Align required task files and legacy sidecar placeholder compatibility. | Done |
| `src/cli/init.ts` | Modify | Align generated Required Reading wording with 0.4 Task Capsule docs. | Done |
| `tests/unit/task-capsule.test.ts`, `tests/unit/task-create.test.ts`, `tests/unit/task-ready.test.ts`, `tests/unit/task-close.test.ts`, `tests/unit/mcp-tools.test.ts` | Modify | Cover new create path and updated read/validation expectations. | Done |
| `dist/` | Modify | Refresh built CLI from Docker build output. | Done |
