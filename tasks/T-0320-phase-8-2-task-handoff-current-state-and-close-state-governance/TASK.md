# T-0320 Phase 8.2 Task Handoff Current-State and Close-State Governance

## Metadata

| Field | Value |
|---|---|
| ID | T-0320 |
| Title | Phase 8.2 Task Handoff Current-State and Close-State Governance |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Separate task-local handoff TaskStatus from CloseState and add done-level drift checks. | Phase 8.2 should stop ambiguous `Status` prose such as `Done pending lifecycle close` from passing closure. |

## Scope

| In Scope | Reason |
|---|---|
| Update new Task Capsule HANDOFF scaffold to prefer `TaskStatus` and `CloseState`. | New capsules should encode lifecycle status and close proof state separately. |
| Add done-level validation for stale pending-close handoff wording. | Prevent ad hoc status phrases from being treated as valid TaskStatus. |
| Add done-level validation for Done tasks whose PLAN rows remain `In Progress`. | Catches the T-0316/T-0317 class of state drift before close. |
| Add focused regression tests. | Keep the new validator behavior stable and fixture-compatible. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad historical migration of existing capsules. | Future dry-run-first task if needed. |
| `audit-close` Markdown writes. | Audit remains read-only. |
| Broad NLP linting over arbitrary prose. | Keep validation high-confidence to avoid noisy false positives. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-15 | Draft | Initial task scaffold. | `task create` |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
