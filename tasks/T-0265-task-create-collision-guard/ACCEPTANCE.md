# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Simulated create directory collision retries to a new task id. | Done | Regression test covers first-candidate mkdir race retry to T-0002. |
| AC-2 | Retry exhaustion returns explicit issue instead of throwing or silently duplicating. | Done | Regression test covers `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED`. |
| AC-3 | Task Board ID collision is skipped even when no capsule dir exists. | Done | Regression test covers Task Board T-0001 collision skip to T-0002. |
| AC-4 | Template behavior and schema validity are preserved. | Done | Existing template tests remain covered; no-template report schema edge fixed; built task-create smoke passed. |
| AC-5 | Evidence is attached and handoff is updated. | Done | Evidence attached; shared handoff now points to T-0266. |
