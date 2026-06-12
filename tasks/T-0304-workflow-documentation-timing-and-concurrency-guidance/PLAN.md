# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0304 rc.2 plan section. | Done | AGENTS/SOP/workflow docs and rc.2 plan reviewed. |
| 2 | Update root workflow docs with timing/concurrency guidance. | Done | AGENTS, IMPLEMENTATION_SOP, and TASK_WORKFLOW_COMMANDS updated. |
| 3 | Update generated init templates with the same guidance. | Done | `src/cli/init.ts` updated. |
| 4 | Add focused regression expectations. | Done | `tests/unit/init.test.ts` and `tests/unit/task-workflow-docs.test.ts` updated. |
| 5 | Run validation and built smoke. | Done | Docker focused tests passed 2 files / 24 tests; build/dist sync passed; built fresh-init smoke passed. |
| 6 | Attach evidence and close the capsule. | Done | Evidence recorded; finish executed; ready/close/audit pending after final shared-doc updates. |
