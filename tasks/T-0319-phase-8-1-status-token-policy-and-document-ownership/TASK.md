# T-0319 Phase 8.1 Status Token Policy and Document Ownership

## Metadata

| Field | Value |
|---|---|
| ID | T-0319 |
| Title | Phase 8.1 Status Token Policy and Document Ownership |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Publish canonical status-token and document ownership guidance for Phase 8. | Define persistent `TaskStatus`, derived `CloseState`, docs registry `DocStatus`, evidence outcomes, and write ownership before later validators consume them. |

## Scope

| In Scope | Reason |
|---|---|
| Update current workflow guidance with TaskStatus and CloseState separation. | Later handoff/projection work needs stable vocabulary. |
| Document DocStatus and EvidenceOutcome token families. | Docs registry and evidence validators already use these families; workers need a single policy reference. |
| Document document ownership and write-boundary rules. | Phase 8 projection must know which documents are command-owned, human-owned, mixed, or task-dependent. |
| Update generated workflow guidance if templates need the same policy. | New projects should not learn ambiguous status language. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement state projection or validators. | Phase 8.4/8.5. |
| Change task-local handoff scaffold shape. | Phase 8.2. |
| Resolve installed-package recycle findings. | Phase 8.3. |
| Publish or release `0.3.1-rc.1`. | Separate release-readiness capsule after rc1 implementation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-15 | Draft | Initial task scaffold for Phase 8.1 status token policy. | T-0319 |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
