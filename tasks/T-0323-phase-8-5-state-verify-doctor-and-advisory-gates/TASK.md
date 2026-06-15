# T-0323 Phase 8.5 State Verify Doctor and Advisory Gates

## Metadata

| Field | Value |
|---|---|
| ID | T-0323 |
| Title | Phase 8.5 State Verify Doctor and Advisory Gates |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Expose the Phase 8.4 state projection through common read-only/advisory worker surfaces. | Add `state verify`, compact status/protocol summaries, and CI advisory integration without strict state-drift blocking. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara state verify [--json]` over `hadara.stateProjection.v1`. | Gives workers a direct detailed projection surface. |
| Add compact state consistency summaries to `hadara status --json` and `hadara protocol doctor --scope all --json`. | Makes state drift visible before close without hidden writes. |
| Add state consistency warnings to `hadara ci gate --mode advisory|strict --json`. | CI sees state drift, but strict mode remains conservative. |
| Register the new command and update command-surface lifecycle docs. | Keeps registry-backed help and docs aligned. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic state repair. | Future dry-run-first remediation task. |
| Strict CI blocking for historical state drift. | Rollout remains advisory in `0.3.1-rc.1`. |
| Release publish gate changes. | Release readiness remains a later capsule decision. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
