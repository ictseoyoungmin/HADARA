# T-0324 Phase 8.6 rc1 Review and Hardening Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0324 |
| Title | Phase 8.6 rc1 Review and Hardening Cleanup |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Review Phase 8 rc1 implementation and correct bounded hardening findings before release-readiness planning. | Focus on state-governance behavior that affects HADARA-dev dogfooding and operator trust. |

## Scope

| In Scope | Reason |
|---|---|
| Self-review Phase 8 state projection/verify behavior on the current repo. | T-0323 intentionally made state checks advisory; T-0324 should inspect actionable warnings before rc1 readiness. |
| Harden Task Capsule discovery for empty local task-like directories. | A local empty `tasks/T-0073-*` directory without `TASK.md` was being projected as real task drift. |
| Add focused regression coverage and rerun full Docker validation. | The fix changes a shared task discovery helper used by state projection and task read surfaces. |
| Refresh close-source capsule and shared state docs. | Phase 8 rc1 implementation should close with coherent handoff and next-step state. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `0.3.1-rc1` version bump, release artifact refresh, npm publish, or installed-package recycle. | This capsule is self-review/hardening cleanup, not a release-readiness or publish capsule. |
| Broad historical Task Board remediation or hand-created T-0073 row. | T-0073 is not a tracked capsule; adding a fake row would encode local garbage as project state. |
| Strict release blocking based on advisory state projection. | T-0323 intentionally kept state consistency warnings advisory until a later policy decision. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
