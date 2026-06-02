# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS required reading plus T-0220 task, Phase 5.7 spec, projection store/core/refresh context reviewed. |
| 2 | Add incremental task projection service. | Done | Added `src/services/dashboard-task-projection.ts` with task/evidence signals, changed/reused ids, and local projection index writes. |
| 3 | Integrate refresh/core. | Done | Background refresh now refreshes task projection before core; core prefers task projection summaries when present. |
| 4 | Add focused coverage. | Done | Added `tests/unit/dashboard-task-projection.test.ts` for unchanged reuse, changed-task reread, and redacted storage. |
| 5 | Run validation and attach evidence. | Done | `git diff --check` passed; host Vitest unavailable; Docker validation still blocked by approval usage limit; evidence attached. |
| 6 | Update handoff and close capsule. | Done | Task handoff updated; finish/close/audit commands pending after status updates. |
