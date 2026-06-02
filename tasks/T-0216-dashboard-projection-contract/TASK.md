# T-0216 Dashboard Projection Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0216 |
| Title | Dashboard Projection Contract |
| Status | Draft |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Define the Phase 5.7 dashboard projection contract before storage, routes, or frontend changes. | Contract-first slice for `hadara.dashboard.core.v1` and projection metadata. |

## Scope

| In Scope | Reason |
|---|---|
| Define `hadara.dashboard.core.v1` shape and schema fixture. | Later routes need a stable contract. |
| Define freshness/completeness/refresh metadata enums. | UI must distinguish fresh, stale, missing, refreshing, and degraded states. |
| Document bootstrap compatibility. | Existing `/api/dashboard/bootstrap` must remain additive during transition. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Local projection storage implementation. | T-0217. |
| New dashboard routes. | T-0218 and later. |
| Frontend migration. | T-0222. |

## Status

Draft

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for Phase 5.7 projection contract. | Task created by HADARA CLI. |
