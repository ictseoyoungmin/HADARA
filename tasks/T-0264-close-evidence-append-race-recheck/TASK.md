# T-0264 Close Evidence Append Race Recheck

## Metadata

| Field | Value |
|---|---|
| ID | T-0264 |
| Title | Close Evidence Append Race Recheck |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Recheck close evidence idempotency immediately before append. | Prevent two same-hash close execute attempts from appending duplicate close proofs when they share an old dry-run plan. |

## Scope

| In Scope | Reason |
|---|---|
| Re-read task evidence immediately before close evidence append. | Detect same-key evidence written after the original close plan was created. |
| No-op same idempotency key found during execute recheck. | Reduces duplicate close proof records under parallel local agents. |
| Preserve changed-proof supersedes behavior. | Existing close/audit semantics must remain intact for real source/report changes. |
| Focused close/audit tests and docs/schema updates. | External agents need stable command semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No hidden task completion execution | Template boundary. |
| No shared-doc writes outside bounded workflow commands | Template boundary. |
| No evidence append outside explicit evidence/close commands | Template boundary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-05T08:20:00.000Z | In Progress | Started Phase 6.1 close evidence append race recheck implementation. | T-0264 capsule created after T-0263 commit. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
