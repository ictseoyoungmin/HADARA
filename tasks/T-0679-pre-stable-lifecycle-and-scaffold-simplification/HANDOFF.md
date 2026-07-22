# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0679 |
| Title | Pre-stable lifecycle and scaffold simplification |
| Status | Done |
| Created | 2026-07-22T08:17 |
| Updated | 2026-07-22T08:47 |
## Last Completed

| Item | Evidence |
|---|---|
| Registered the pre-stable simplification design and implemented one adaptive `task status` evaluator, a deprecated delegating `status` alias, compact default selection output, and terminal successful close. | Full Docker source check passed 166 files / 1239 tests (`ev:T-0679:5b4cbb05bead4af995c259d6`); focused status/close/schema coverage passed (`ev:T-0679:a82d6e47c7d24155b19feb50`). |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Demote `current.json` from public authority and move routing ownership to inspectable Markdown/Task Capsule sources. | actionable | yes | This capsule consolidates the command evaluator first; state ownership is the next coherent write boundary. | `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md`; `docs/PROJECT_STATE.md`; `docs/AGENT_HANDOFF.md`; `src/services/project-current-state.ts`; `src/task/task-selection.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not run `task status` merely to reconfirm a successful `task close`. | Adds a redundant lifecycle step and can reopen routing ambiguity after terminal close. | Treat the close report as terminal and create the explicitly handed-off capsule directly. |
