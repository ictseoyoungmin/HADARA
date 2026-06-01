# Dashboard Production Readiness Review

Phase 5.5 readiness status: complete through T-0204.

This review covers the local HADARA Dashboard as a read-only operator console. It is not a release execution surface, remediation surface, provider surface, MCP write surface, or persisted project-state store.

## Route Inventory

| Route | Purpose | Mutation? | Notes |
|---|---|---:|---|
| `GET /dashboard/` | Serve static dashboard shell. | No | Same response body for local operator UI. |
| `GET /fixtures/hadara.ops.status.sample.json` | Serve static fallback fixture. | No | Marked as non-live sample data. |
| `GET /api/status` | Live operations status read model. | No | Source fallback baseline. |
| `GET /api/dashboard/bootstrap` | First-paint aggregate read. | No | Supports `selectedTaskId` and `cache=bypass`. |
| `GET /api/dashboard/task-detail?taskId=T-XXXX` | Selected-task aggregate detail. | No | Requires `taskId`; supports `cache=bypass`. |
| `GET /api/dashboard/cache/status` | Process-memory cache metadata. | No | Metadata only; no cached report bodies. |
| `GET /api/timeline` | Dashboard timeline aggregate. | No | Supports optional `taskId`. |
| `GET /api/tasks` | Task list read model. | No | Legacy/local read route retained. |
| `GET /api/active-run` | Active-run projection. | No | Read-only projection. |
| `GET /api/debt` | Operational debt report. | No | Read-only report. |
| `GET /api/task-workbench?taskId=T-XXXX` | Task workbench read model. | No | Legacy/local read route retained. |
| `GET /api/evidence-lint?taskId=T-XXXX` | Evidence lint read model. | No | Read-only semantic diagnostics. |
| `GET /api/evidence?taskId=T-XXXX` | Sanitized evidence list. | No | Private evidence paths stripped by service. |

All served routes are GET/HEAD-only through the dashboard helper and return safe failures for unsafe methods, unknown routes, traversal-like paths, and missing task ids.

## Schema Inventory

| Schema | File | Coverage |
|---|---|---|
| `hadara.dashboard.bootstrap.v1` | `src/schemas/dashboard-bootstrap.schema.json` | Schema fixture registration and bootstrap tests. |
| `hadara.dashboard.task_detail.v1` | `src/schemas/dashboard-task-detail.schema.json` | Schema fixture registration and task-detail tests. |
| `hadara.dashboard.timeline.v1` | `src/schemas/dashboard-timeline.schema.json` | Schema fixture registration and timeline tests. |

`hadara.dashboard.cache_status.v1` is currently a served metadata report without a registered schema file. It exposes cache keys and timestamps only, not cached values.

## Boundary Audit

| Boundary | Status | Evidence |
|---|---|---|
| Read-only dashboard actions | Pass | Refresh/polling call read-only fetch paths; copy command UI remains non-executing. |
| No shell execution | Pass | No `child_process`, `exec`, or `spawn` dashboard code path. |
| No provider calls | Pass | Dashboard routes compose local read models only. |
| No MCP writes | Pass | Dashboard does not call MCP write tools. |
| No task/evidence/handoff/release mutation | Pass | Dashboard API helper exposes read reports and safe errors only. |
| No browser project-state persistence | Pass | No `localStorage`, `sessionStorage`, IndexedDB, or cookies for project state. |
| No default streaming | Pass | No SSE, WebSocket, or telemetry streaming. |
| Process-memory cache only | Pass | Cache is an in-process `Map`, not `.hadara/local`, database, file watcher, committed cache, or evidence source; aggregate cache keys are isolated by a redacted `sha256:<12hex>` project fingerprint. |
| Private/raw path exposure | Pass with compatibility note | Aggregate reports include `source.projectRootRedacted: true` and `source.project.fingerprint`; legacy `source.projectRoot` remains only for v1 compatibility and should not be displayed by new browser consumers. |
| Responsive layout baseline | Pass | Static dashboard keeps responsive operator grid and inspector media queries. |
| Performance evidence posture | Pass | `docs/DASHBOARD_PERFORMANCE_BUDGET.md` records advisory targets and evidence guidance without brittle timing assertions. |

## Residual Risks

| Risk | Status | Follow-up |
|---|---|---|
| Static tests cannot fully prove browser interaction timing. | Accepted | Add Playwright smoke only if future visual/runtime regressions appear. |
| `hadara.dashboard.cache_status.v1` is not schema-registered. | Accepted | Register it later if an external consumer needs strict schema validation. |
| Legacy aggregate `source.projectRoot` remains in v1. | Transitional | Prefer `source.project.fingerprint` now and remove raw path exposure in a future v2 contract. |
| Dashboard remains a local operator console, not a multi-agent live trace system. | Intentional | Keep live stream/provider/MCP write surfaces out of dashboard scope. |

## Final Readiness Conclusion

Phase 5.5 is ready as a local, read-only, production-grade operator console baseline. The dashboard now uses aggregate read models, project-isolated route-level process-memory cache metadata, redacted project source references, degraded load provenance, optional memory-only polling, and documented performance/readiness boundaries while preserving HADARA governance constraints.
