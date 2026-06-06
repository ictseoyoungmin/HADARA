# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0271 findings. | Complete | AGENTS-provided context plus active T-0271/T-0274 state. |
| 2 | Replace broad single-task task capsule scans with direct lookup. | Complete | `findTaskCapsule()` and focused regression in task finish tests. |
| 3 | Add explicit current-readiness vs close-proof-valid state to workbench reports. | Complete | `state.readiness` schema and task-workbench tests. |
| 4 | Improve dev Docker wrapper diagnostics without exposing raw logs. | Complete | `exitCode` and `debugHint` on failed Docker step issues. |
| 5 | Validate focused surfaces, build, and built CLI smoke. | Complete | TESTS.md and EVIDENCE.md. |
