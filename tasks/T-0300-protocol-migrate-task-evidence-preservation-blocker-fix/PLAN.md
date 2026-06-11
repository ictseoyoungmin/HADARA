# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and reviewer feedback. | Done | Read project state/handoff/task workflow docs and attached feedback. |
| 2 | Fix task-scoped migration evidence planning. | Done | Existing `evidence.jsonl` now reports skipped and is preserved; missing index is still created. |
| 3 | Fix `task finish` managed Status History insertion. | Done | Done rows are inserted before the managed end marker; T-0299/T-0300 malformed rows repaired. |
| 4 | Add regression coverage. | Done | Protocol migration and task finish tests cover both data-preservation bugs. |
| 5 | Run validation and attach evidence. | Done | Combined focused tests passed 2 files / 15 tests; build passed; built CLI task-finish smoke passed; evidence attached. |
| 6 | Finish/close capsule and commit. | Done | Finish/ready/close/audit refreshed after close-source changes; commit pending. |
