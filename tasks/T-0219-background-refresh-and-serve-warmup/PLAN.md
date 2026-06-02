# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS required reading plus T-0219 task, Phase 5.7 spec, dashboard route, core, and projection store context reviewed. |
| 2 | Add background refresh service. | Done | Added `src/services/dashboard-refresh.ts` with refresh state, warmup trigger, coalescing, and metadata report. |
| 3 | Bind serve warmup and routes. | Done | `src/cli/dashboard.ts` triggers serve-start warmup and exposes `/api/dashboard/projection/status` and `/api/dashboard/refresh`. |
| 4 | Add focused coverage. | Done | Added `tests/unit/dashboard-refresh.test.ts` for warmup, coalescing, and metadata-only status. |
| 5 | Run validation and attach evidence. | Done | `git diff --check` passed; host Vitest unavailable; Docker validation still blocked by approval usage limit; evidence attached. |
| 6 | Update handoff and close capsule. | Done | Task handoff updated; finish/close/audit commands pending after status updates. |
