# Decisions

| Decision | Rationale |
|---|---|
| Keep `execution.projectMutation:false` as a compatibility alias. | Existing consumers may already read it; the clarified fields distinguish source and output mutation without breaking the report. |
| Defer actor CLI plumbing, close append race recheck, task create collision guard, and handoff fragment polish to Phase 6.1. | Each touches a different workflow surface and needs its own focused validation. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
