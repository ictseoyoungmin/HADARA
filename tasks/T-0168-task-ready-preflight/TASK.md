# T-0168 Task Ready Preflight

## Metadata

| Field | Value |
|---|---|
| ID | T-0168 |
| Title | Task Ready Preflight |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only task readiness preflight. | Provide a friendly blocker summary before close without appending evidence. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara task ready --task <id> --level done --json`. | Agents need a pre-close readiness surface. |
| Register `hadara.task.ready.v1`. | Keep CLI JSON surface documented. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Append close evidence. | Belongs to `task close --execute`. |
| Update status or project docs. | Out of scope for read-only readiness. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T06:35:48.185Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T06:35:48.185Z | Done | Task ready preflight implemented and validated. | Focused Docker checks passed. |
