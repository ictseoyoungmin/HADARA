# T-0172 Workbench Suggested Action Engine

## Metadata

| Field | Value |
|---|---|
| ID | T-0172 |
| Title | Workbench Suggested Action Engine |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Centralize workbench next-action generation. | Add a reusable action builder that maps issue codes and close state into stable worker-facing actions. |

## Scope

| In Scope | Reason |
|---|---|
| Workbench next-action service. | Normalize command/review/edit/remediation/audit actions with priority, source issue codes, and dry-run/execute pairing. |
| Workbench integration. | Route `task status` nextActions through the new service. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New writes or automation. | Suggested actions remain recommendations only. |
| Shell execution evidence capture. | Deferred to later Phase 3 design work. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task created through HADARA CLI. |
| 2026-05-31 | Done | Suggested action engine implemented and focused tests passed. | `tests/unit/workbench-next-actions.test.ts`, `tests/unit/task-workbench.test.ts`. |
