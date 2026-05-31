# T-0181 Task Next Recommendation

## Metadata

| Field | Value |
|---|---|
| ID | T-0181 |
| Title | Task Next Recommendation |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only next-task recommendation. | Provide `hadara task next --json` so agents can choose the next Phase/Slice task from tracked docs without manually re-parsing every state file. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara task next --json` report. | Read-only recommendation from Development Slices, Task Board, and handoff state. |
| `hadara.task.next.v1` schema. | Keeps the recommendation surface contract-visible for future UI/MCP consumers. |
| Focused tests for source priority and missing capsule guidance. | Prevents recommendations from silently drifting away from tracked docs. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Creating the recommended task automatically. | The command is read-only and emits `createCommand` guidance instead. |
| Inferring task completion. | Completion remains owned by task status/finish/close flows. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task Capsule created. |
| 2026-05-31 | Done | Read-only task next report, schema, docs, tests, and validation completed. | T-0181 evidence records. |
