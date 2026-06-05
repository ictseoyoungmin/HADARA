# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and inspect task finish atomic write path. | Done | Required docs and `src/task/task-finish.ts` read. |
| 2 | Add shared EOF normalization for task finish text writes. | Done | `nextWriteContent()` now normalizes generated text documents before hash/write use. |
| 3 | Add regression coverage. | Done | `tests/unit/task-finish.test.ts` checks no trailing blank EOF after execute. |
| 4 | Run validation. | Done | Focused Docker wrapper passed; Docker sync-build passed 100 files / 673 tests; built task finish smoke passed. |
| 5 | Attach evidence and update handoff. | Done | `ev:T-0267:223330c2b282401a8c713525`; shared docs updated. |
