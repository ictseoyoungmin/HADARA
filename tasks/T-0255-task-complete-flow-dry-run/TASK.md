# T-0255 Task Complete Flow Dry-Run

## Metadata

| Field | Value |
|---|---|
| ID | T-0255 |
| Title | Task Complete Flow Dry-Run |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only task completion flow orchestration. | `hadara task complete --task <id> --json` reports the current lifecycle stage and one primary next action without applying any writes. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.task.complete_flow.v1` report builder. | Provides actor, stage, lifecycle steps, conflicts, shared-doc state counts, issues, and next action guidance. |
| CLI `task complete` route. | Exposes the read-only report and rejects `--execute` with the same schema. |
| Schema, docs, and focused tests. | Keeps external contract and operator workflow docs aligned. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `task complete --execute`. | Explicitly unsupported in this capsule; no lifecycle command execution is added. |
| Hidden broad-doc writes or evidence append. | The command only reports state; operators still run finish/close/evidence commands deliberately. |
| Multi-agent scheduler/runtime. | Phase 6 metadata supports future agents, but this capsule adds no scheduler or worker dispatch. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T04:24:00.000Z | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-05T04:37:00.000Z | Done | Implemented and validated read-only task complete flow. | Docker sync-build and built CLI smoke evidence. |
