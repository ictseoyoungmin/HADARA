# T-0167 Task Close Execute MVP

## Metadata

| Field | Value |
|---|---|
| ID | T-0167 |
| Title | Task Close Execute MVP |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Enable close evidence append. | `task close --execute` writes only canonical close audit evidence after blockers pass. |

## Scope

| In Scope | Reason |
|---|---|
| Enable execute mode for `task close`. | Completes the close MVP after T-0166 plan report. |
| Append close evidence through canonical writer. | Avoids hand-editing JSONL and preserves evidence enum checks. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Update status, Task Board, Project State, or handoff automatically. | Broad writes remain future opt-in work. |
| Execute shell commands or capture stdout/stderr. | Deferred to later evidence UX work. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T06:30:07.394Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T06:30:07.394Z | Done | Task close execute MVP implemented and validated. | Focused Docker checks passed. |
