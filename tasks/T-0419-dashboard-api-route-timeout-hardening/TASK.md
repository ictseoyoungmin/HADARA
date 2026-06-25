# T-0419 Dashboard API Route Timeout Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0419 |
| Title | Dashboard API Route Timeout Hardening |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Fix the dashboard API route timeout that blocked the 0.3.4 RC publish helper full test run. | Keep the route change narrow and preserve read-only dashboard behavior. |

## Scope

| In Scope | Reason |
|---|---|
| `/api/status` dashboard route latency | Avoid performing operational debt scans on the status route because dashboard clients fetch debt separately. |
| `/api/dashboard/bootstrap` default tier | Make the default bootstrap route use the fast core projection; keep full bootstrap available through explicit `tier=full`. |
| Dashboard route regression test expectations | Align tests with the new default bootstrap tier and pending debt summary behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Dashboard productization or UI redesign | The issue is a publish-blocking latency regression, not a new dashboard feature. |
| Operational debt read-model semantics | Existing debt endpoints remain available for explicit reads. |
| Release publish mutation | T-0418 remains the approval-gated publish capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
