# T-0334 Evidence Rebuild Boundary Design Only

## Metadata

| Field | Value |
|---|---|
| ID | T-0334 |
| Title | Evidence Rebuild Boundary Design Only |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Document the future evidence rebuild boundary without implementing preview or execute behavior. | Keep 0.3.2 scope limited to explicit design guidance. |

## Scope

| In Scope | Reason |
|---|---|
| Explain that `evidence.jsonl` is the canonical append-only evidence source. | Prevent rebuild designs from treating rendered Markdown as authority. |
| Explain that `EVIDENCE.md` is a non-canonical human summary. | Prevent incorrect regeneration or drift assumptions. |
| Define why `wouldChange` remains ambiguous until drift classes are specified. | Avoid unsafe preview semantics. |
| Document future dry-run-first and before-hash requirements. | Align any later rebuild command with existing HADARA guarded-write policy. |
| Confirm no rebuild command behavior is added in 0.3.2. | Avoid scope creep. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `hadara evidence rebuild --json` or `--execute`. | Not implemented in 0.3.2. |
| Rewriting `EVIDENCE.md`. | No managed rebuild model exists yet. |
| Rewriting `evidence.jsonl`. | The JSONL source remains canonical and append-only except explicit migration flows. |
| Historical evidence migration. | Operator-selected migration remains separate. |
| Runtime code path for rebuild preview or execute. | This task is design-only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | `task create` |
| 2026-06-17 | In Progress | Started T-0334 design-only documentation slice. | Required reading and T-0334 capsule spec |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
