# T-0274 Lifecycle Status Clarity and Performance Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0274 |
| Title | Lifecycle Status Clarity and Performance Hardening |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Harden lifecycle status clarity and reduce mounted-workspace single-task command overhead. | Close the remaining T-0271 findings needed before 0.2.0-rc.1. |

## Scope

| In Scope | Reason |
|---|---|
| Direct single-task capsule lookup. | `task finish`, `task status`, `task read`, `evidence list`, and `evidence lint` should not read unrelated task capsule documents. |
| Workbench readiness clarity. | `task status` must separate current done-level readiness from previously valid close proof state. |
| Docker wrapper failure diagnostics. | JSON reports must keep raw logs private while exposing failed step and exit code. |
| Legacy dashboard projection compatibility. | Dashboard task-detail projections must continue satisfying the shared workbench schema. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full scheduler or multi-agent runtime. | This task only hardens CLI/read-model behavior discovered during npm-installed toy-project recycle. |
| Raw Docker subprocess log exposure in JSON. | Privacy boundary remains unchanged; diagnostics are redacted and bounded. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-06 | Done | Finished task capsule. | `hadara task finish --execute` |
