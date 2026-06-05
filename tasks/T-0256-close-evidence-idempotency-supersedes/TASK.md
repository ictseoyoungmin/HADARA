# T-0256 Close Evidence Idempotency / Supersedes

## Metadata

| Field | Value |
|---|---|
| ID | T-0256 |
| Title | Close Evidence Idempotency / Supersedes |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Make repeated close/audit runs safer. | Same task/source/report close evidence no-ops instead of appending uncontrolled duplicates; changed close proofs append with supersedes metadata. |

## Scope

| In Scope | Reason |
|---|---|
| Close evidence write idempotency metadata. | `hadara.task.close.v1` exposes idempotency key, duplicate status, action, and superseded ids. |
| Evidence v2 close-proof metadata. | Close evidence records can carry close-proof, idempotency, supersedes tags, actor, and idempotencyKey metadata. |
| Audit close evidence selection. | `hadara.task.audit_close.v1` reports latest non-superseded proof id, superseded ids, duplicate count, and idempotency verdict. |
| Tests, schemas, and docs. | Preserve additive contracts and verify no readiness gate bypass. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New evidence schema version. | Existing v2 records remain compatible; optional metadata is additive. |
| Rewriting historical close evidence. | Historical records are read through compatibility fallbacks; no migration is performed. |
| Broad close source hash redesign. | Existing close source-hash inputs remain unchanged. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T04:48:00.000Z | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-05T05:02:00.000Z | Done | Implemented close evidence idempotency/supersedes and audit metadata. | Docker sync-build and built CLI smoke evidence. |
