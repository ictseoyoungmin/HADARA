# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs, C1 state projection spec, and existing state projection service/tests. | Done | Read PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, C1 spec, worker plan, Work Item F, `src/services/state-projection.ts`, and context graph schema/tests. |
| 2 | Document T-0350 scope and file plan. | Done | TASK.md, CONTEXT.md, FILES.md updated before implementation. |
| 3 | Add state-source extraction and compact context state projection diagnostics. | Done | `src/context/state-projection.ts`; `src/context/document-extractors.ts`; focused tests. |
| 4 | Run focused Docker tests, full Docker check, build, dist refresh, and diff check. | Done | `ev:T-0350:b540a670f64b48babe233d22`. |
| 5 | Record evidence and update capsule/shared close-source docs. | Done | `ev:T-0350:b540a670f64b48babe233d22`; close-source docs updated. |
| 6 | Finish, ready, close, audit-close, and commit T-0350. | Pending | TBD |
