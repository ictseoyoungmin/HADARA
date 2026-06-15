# T-0322 Phase 8.4 State Consistency Projection Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0322 |
| Title | Phase 8.4 State Consistency Projection Read Model |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only state consistency projection report for core HADARA state artifacts. | The first report should correlate Task Board rows, Task Capsule status/plan/handoff/close evidence, Project State, Agent Handoff, Development Slices, docs registry, and release readiness presence without adding repair or CI behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Implement `hadara.stateProjection.v1` service/read model. | Phase 8.4 is the read-only projection capsule. |
| Extract source values from Task Board, Task Capsules, Project State, Agent Handoff, Development Slices, docs registry, release readiness, and evidence. | Projection must show source paths and extracted values. |
| Emit high-value drift issues with path and fixHint. | Workers need actionable diagnostics before future advisory integration. |
| Add schema fixture and focused tests. | Future CLI/doctor/CI consumers need a stable report shape. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic repair or remediation. | Future dry-run-first work only. |
| CLI/doctor/CI exposure. | Phase 8.5 owns operator/advisory integration. |
| Strict release/publish gates. | Release readiness is separate and publish is approval-gated. |
| Historical migration. | Broad cleanup needs its own capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-15 | Draft | Initial task scaffold. | `task create` |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
