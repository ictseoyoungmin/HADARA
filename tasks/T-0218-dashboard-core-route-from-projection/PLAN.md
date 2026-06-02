# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS required reading plus T-0218 task, dashboard contract, projection store, route, and test patterns reviewed. |
| 2 | Implement `/api/dashboard/core`. | Done | Added `src/services/dashboard-core.ts` and route binding in `src/cli/dashboard.ts`. |
| 3 | Prove request-path shape. | Done | Added `tests/unit/dashboard-core-route.test.ts` with task-capsule filesystem read spies. |
| 4 | Update contract/test docs. | Done | Updated `docs/DASHBOARD_READ_MODEL_CONTRACT.md` and `docs/TEST_STRATEGY.md`. |
| 5 | Run validation and attach evidence. | Done | Follow-up Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; `git diff --check` passed; evidence and close audit attached. |
| 6 | Update handoff and close capsule. | Done | Task handoff updated; finish/close/audit commands pending after status updates. |
