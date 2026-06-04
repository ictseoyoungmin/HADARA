# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | Session required reading and T-0249 handoff reviewed. |
| 2 | Add provider advisory report/schema. | Done | `release-dry-run` service/schema edits. |
| 3 | Add evidence state tests. | Done | Unit tests cover missing, present, stale, and non-blocking behavior. |
| 4 | Run validation. | Done | Docker focused tests passed 2 files / 29 tests; Docker `npm run check` passed 92 files / 624 tests; built CLI smoke passed. |
| 5 | Attach evidence. | Done | `ev:T-0250:d85f51ce078c4cb591c151b4` recorded validation summary. |
| 6 | Finish, close, audit-close, and update handoff. | Done | `task ready` ok; `task close --execute` ok; `task audit-close` verdict `closed-valid`. |
