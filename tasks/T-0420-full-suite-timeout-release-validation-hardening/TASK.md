# T-0420 Full Suite Timeout Release Validation Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0420 |
| Title | Full Suite Timeout Release Validation Hardening |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Make the 0.3.4 RC full-suite release validation pass after the timeout failures reported from the publish clone. | Fix the real dashboard bootstrap default mismatch and make the test harness tolerate known child-process/git/filesystem contention without false 5s failures. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard bootstrap default path | Make the service default match the intended first-paint `core` contract, not only the CLI route wrapper. |
| Vitest timeout policy | Raise default per-test and hook timeout from Vitest's 5s default to a controlled 30s release-validation budget with env overrides. |
| Regression validation | Re-run the failed test set and full suite from the Docker ext4 validation copy. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publish mutation | T-0418 remains the approval-gated npm publish capsule. |
| Dashboard productization | No UI redesign, streaming, workerization, or new dashboard surface. |
| Broad performance rewrite | This is a release-validation hardening fix, not a full mounted-filesystem performance project. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
