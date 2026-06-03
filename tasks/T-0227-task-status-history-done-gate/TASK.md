# T-0227 Task Status History Done Gate

## Metadata

| Field | Value |
|---|---|
| ID | T-0227 |
| Title | Task Status History Done Gate |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Close the done-level Status History gap. | `task finish --execute` must append a Done Status History row, and done-level harness validation must reject capsules whose Status History does not end in Done. |

## Scope

| In Scope | Reason |
|---|---|
| `task finish` bounded TASK.md sync. | Finish should update metadata status, `## Status`, and append Status History in one bounded TASK.md write. |
| Done-level harness validation. | Readiness must fail when the final Status History row is missing or not Done. |
| Shared Markdown section reader consolidation. | Prevent inline ``## Status`` text from being treated as a heading across task/protocol/read-model section readers. |
| Regression tests and current capsule repair. | T-0226 exposed the gap and should be aligned with the new rule. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad Task Capsule history migration. | Only the known current gap is repaired; historical cleanup belongs in a separate migration/remediation task. |
| Status History schema redesign. | This task preserves the existing Markdown table format. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to Status History finish sync and done-level validation. | Task capsule update |
| 2026-06-03 | Done | Finished task capsule. | `hadara task finish --execute` |
