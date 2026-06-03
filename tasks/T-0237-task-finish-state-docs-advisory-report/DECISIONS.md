# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `stateDocs` to `hadara.task.finish.v1` instead of auto-writing broad docs. | Accepted | Finish must remain bounded while giving operators actionable freshness data. | Focused tests. |
| D-2 | Use task-id mention as a conservative freshness signal. | Accepted | It is cheap, deterministic, and avoids trying to generate prose. | Focused tests. |
| D-3 | Keep `stateDocs` advisory, not blocking. | Accepted | Broad docs can require human judgment and should not block bounded finish sync. | Existing finish semantics. |
