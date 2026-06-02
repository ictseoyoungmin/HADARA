# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS required reading plus T-0222 task, frontend model/app, Phase 5.7 route context reviewed. |
| 2 | Switch frontend data layer to core-first. | Done | `dashboard/src/model.ts` loads `/api/dashboard/core` before bootstrap/status fallback. |
| 3 | Add independent heavy backfills. | Done | Debt and timeline use `/api/dashboard/debt` and `/api/dashboard/timeline`; app merges timeline after core. |
| 4 | Update tests/docs. | Done | `tests/unit/dashboard-static.test.ts`, dashboard contract, and test strategy updated. |
| 5 | Run validation and attach evidence. | Done | `git diff --check` passed; host build/test blocked by missing deps; Docker validation blocked by approval usage limit; evidence attached. |
| 6 | Update handoff and close capsule. | Done | Task handoff updated; finish/close/audit commands pending after status updates. |
