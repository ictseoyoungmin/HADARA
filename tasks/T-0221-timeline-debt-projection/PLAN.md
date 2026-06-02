# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS required reading plus T-0221 task, Phase 5.7 spec, timeline/debt services, and projection routes reviewed. |
| 2 | Add timeline/debt projection service. | Done | Added `src/services/dashboard-heavy-projection.ts`. |
| 3 | Integrate refresh and routes. | Done | Background refresh writes timeline/debt projections; `/api/dashboard/timeline` and `/api/dashboard/debt` read projection-first. |
| 4 | Add focused coverage. | Done | Added `tests/unit/dashboard-heavy-projection.test.ts`. |
| 5 | Run validation and attach evidence. | Done | `git diff --check` passed; host Vitest unavailable; Docker validation still blocked by approval usage limit; evidence attached. |
| 6 | Update handoff and close capsule. | Done | Task handoff updated; finish/close/audit commands pending after status updates. |
