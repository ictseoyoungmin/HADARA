# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and inspect finish/harness code. | Done | Session required reading plus source inspection. |
| 2 | Make `task finish` append a Done Status History row. | Done | `src/task/task-finish.ts`. |
| 3 | Make done-level harness require Status History to end with Done. | Done | `src/harness/validate.ts`. |
| 4 | Consolidate Markdown section reading on heading-line matching. | Done | `src/services/markdown-table.ts` and call-site replacements. |
| 5 | Add focused regression tests. | Done | Focused Docker tests passed. |
| 6 | Run validation, attach evidence, close/audit, and update handoff. | Done | Shared section reader validation evidence attached; close/audit refreshed. |
