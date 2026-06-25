# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task finalize` treats close-source drift as audit repair required and routes to `task close-repair-plan`. | Met | `src/task/task-finalize.ts`, `tests/unit/task-finalize.test.ts` |
| AC-2 | `task lifecycle` treats close-source drift as `repair-required` instead of `closed-valid`. | Met | `src/task/task-lifecycle.ts`, `tests/unit/task-lifecycle.test.ts` |
| AC-3 | Focused validation and built CLI smokes are recorded. | Met | `ev:T-0412:32fdb139512446aaa3806924`, `ev:T-0412:d5c2e7a5d463479c95fe684a` |
| AC-4 | Handoff/state docs are updated. | Met | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md` |
