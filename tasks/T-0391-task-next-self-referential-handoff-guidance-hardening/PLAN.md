# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and dogfood the session-start/task-next flow. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/TASK_BOARD.md`; observed `task next` self-referential createCommand. |
| 2 | Implement the smallest useful slice. | Done | `src/task/task-next.ts`, `tests/unit/task-next.test.ts`. |
| 3 | Run focused validation. | Done | `ev:T-0391:cc9957fe4c954754bee38b41`. |
| 4 | Attach evidence. | Done | `ev:T-0391:cc9957fe4c954754bee38b41`. |
| 5 | Update handoff, shared docs, and findings before close. | Done | Capsule docs, `FINDINGS.md`, and shared docs. |
