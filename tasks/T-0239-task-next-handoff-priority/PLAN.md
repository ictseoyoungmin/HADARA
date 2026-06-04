# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and existing `task next` implementation. | Done | PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, IMPLEMENTATION_SOP, DEVELOPMENT_SLICES, and task-next source/tests reviewed. |
| 2 | Write and register task-next handoff-priority refactor spec. | Done | `docs/specs/HADARA_Task_Next_Handoff_Priority_Refactor.md` added and SOP Required Reading updated. |
| 3 | Implement additive handoff-first recommendation policy. | Done | `src/task/task-next.ts` adds handoff primary recommendations and backlog rows. |
| 4 | Run focused and full Docker validation. | Done | Focused Docker suite passed 3 files / 9 tests; Docker sync-build passed 92 files / 608 tests. |
| 5 | Attach evidence, finish, close, audit, and update handoff. | Done | Evidence and handoff are current; final finish/close/audit workflow is the remaining command loop. |
