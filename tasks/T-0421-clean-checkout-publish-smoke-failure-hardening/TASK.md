# T-0421 Clean Checkout Publish Smoke Failure Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0421 |
| Title | Clean Checkout Publish Smoke Failure Hardening |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Unblock the 0.3.4 RC publish helper clean-checkout smoke by removing the remaining dashboard API route timeout source. | Keep the release mutation itself in T-0418. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard legacy `/api/debt` route latency hardening. | The T-0418 helper reached clean-checkout smoke and failed around dashboard API test cost before publish could proceed. |
| Focused dashboard and clean-checkout validation evidence. | Prove the expensive route no longer blocks `npm run check` in clean-checkout validation. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish / GitHub Release mutation. | Remains approval-gated under T-0418. |
| Broad dashboard product redesign. | This is a release-blocking hotfix only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25 | In Progress | Release helper clean-checkout smoke exposed another dashboard API route bottleneck; hotfix capsule opened. | T-0418 operator log |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
