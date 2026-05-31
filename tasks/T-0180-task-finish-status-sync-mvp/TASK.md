# T-0180 Task Finish Status Sync MVP

## Metadata

| Field | Value |
|---|---|
| ID | T-0180 |
| Title | Task Finish Status Sync MVP |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add bounded task finish/status sync. | Provide a dry-run-first `hadara task finish` command that can safely sync `TASK.md` and `docs/TASK_BOARD.md` status/path bookkeeping without broad project-doc mutation. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara task finish --task <id> --json` dry-run report. | Operators can preview completion bookkeeping before writes. |
| `hadara task finish --task <id> --execute --json` bounded execute. | Only `TASK.md` status and `docs/TASK_BOARD.md` row status/path are auto-written. |
| Schema and CLI contract registration. | Future operator surfaces can rely on the report envelope. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic Development Slices, Project State, Handoff, or evidence writes. | These remain advisory/manual until a later capsule expands the finish boundary. |
| Running validation or close evidence from `task finish`. | Validation and close evidence remain owned by harness/task close commands. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task Capsule created. |
| 2026-05-31 | Active | Implementing bounded finish/status sync MVP. | `src/task/task-finish.ts`, `tests/unit/task-finish.test.ts`. |
| 2026-05-31 | Done | Bounded finish command, schema, docs, tests, and built CLI smoke completed. | T-0180 evidence records. |
