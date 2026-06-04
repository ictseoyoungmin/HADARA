# T-0242 Release Package Readiness Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0242 |
| Title | Release Package Readiness Hardening |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Make release dry-run output more operationally useful before the next release/package pass. | Preserve read-only behavior while exposing readiness blockers, next actions, and stage timing diagnostics. |

## Scope

| In Scope | Reason |
|---|---|
| Add `readiness` summary to `hadara.releaseDryRun.v1`. | Operators need a compact status, blocker count, and concrete next command when release readiness is stale. |
| Add `diagnostics.stageTimings` and `slowStageWarnings` to release dry-run reports. | The current `/mnt/f` workspace can spend double-digit seconds in release readiness; the report should identify the slow stage. |
| Extend schema and unit coverage for the new release dry-run contract. | Consumers need a stable JSON shape for readiness and diagnostics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publishing, GitHub Release creation, Docker image build, or installer execution. | This capsule hardens read-only planning only. |
| Refreshing release artifact/package smoke evidence. | The report now points to that next action, but executing release artifacts remains operator-selected. |
| Dashboard or TUI work. | UI work is paused unless an operator blocker appears. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-04 | In Progress | Scope fixed to release dry-run readiness and timing diagnostics. | Capsule update |
| 2026-06-04 | Done | Release dry-run now reports readiness next actions and stage timing diagnostics while preserving read-only release behavior. | Docker check/sync-build and built CLI release dry-run smoke evidence. |
