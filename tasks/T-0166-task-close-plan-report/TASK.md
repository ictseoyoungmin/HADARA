# T-0166 Task Close Plan Report

## Metadata

| Field | Value |
|---|---|
| ID | T-0166 |
| Title | Task Close Plan Report |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only task close plan reports. | Show validation, evidence lint, protocol doctor, close evidence plan, and nextActions without writing. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara task close --task <id> --json`. | Provides close readiness planning before execute exists. |
| Add `hadara.task.close.v1` fixture schema. | External agents need stable report shape. |
| Include loop-boundary close evidence metadata. | Prevents validation/evidence fixed-point confusion. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Append close evidence. | Reserved for T-0167. |
| Update task status or project docs. | Broad writes remain out of scope. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T06:25:14.088Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T06:25:14.088Z | Done | Read-only task close plan report implemented and validated. | Focused Docker checks passed. |
