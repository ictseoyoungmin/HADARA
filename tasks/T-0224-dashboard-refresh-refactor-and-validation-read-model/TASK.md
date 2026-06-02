# T-0224 Dashboard Refresh Refactor and Validation Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0224 |
| Title | Dashboard Refresh Refactor and Validation Read Model |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Correct dashboard validation read models and refactor explicit dashboard refresh stages. | Fix stale `T-0096` validation fallback, add a strict refresh refactor spec, and remove avoidable broad synchronous scans from manual dashboard projection refresh. |

## Scope

| In Scope | Reason |
|---|---|
| Validation Baseline extraction | Dashboard core and Operations Status must parse table-first `docs/AGENT_HANDOFF.md` validation rows before falling back to history. |
| Refresh refactor spec | A concrete spec must define stage boundaries, broad-scan rules, and non-goals under `docs/specs/dashboard/`. |
| Manual refresh stage refactor | `/api/dashboard/refresh` should use async task projection refresh, core-fed timeline refresh, and fast static debt aggregate projection. |
| Regression tests | Unit tests must cover table-first validation extraction and refresh stage behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full operational-debt deep scan refactor | Dashboard debt projection only needs aggregate counts; full capsule-size/premature-acceptance scans remain in operational-debt/release surfaces. |
| Worker thread or queue system | Existing single-process local dashboard server remains sufficient for this slice. |
| Browser mutation behavior | Dashboard remains read-only and memory-only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | `hadara task create` output. |
| 2026-06-02 | Done | Validation extraction and refresh refactor implemented and validated. | T-0224 evidence and close audit. |
