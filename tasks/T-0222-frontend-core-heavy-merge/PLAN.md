# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS required reading plus T-0222 task, frontend model/app, Phase 5.7 route context reviewed. |
| 2 | Switch frontend data layer to core-first. | Done | `dashboard/src/model.ts` loads `/api/dashboard/core` before bootstrap/status fallback. |
| 3 | Add independent heavy backfills. | Done | Debt and timeline use `/api/dashboard/debt` and `/api/dashboard/timeline`; app merges timeline after core. |
| 4 | Update tests/docs. | Done | `tests/unit/dashboard-static.test.ts`, dashboard contract, and test strategy updated. |
| 5 | Run validation and attach evidence. | Done | Docker dashboard build rebuilt served HTML; Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; `git diff --check` passed; evidence and close audit attached. |
| 6 | Update handoff and close capsule. | Done | Task handoff updated; finish/close/audit commands pending after status updates. |
