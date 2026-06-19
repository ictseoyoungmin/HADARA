# T-0372 C4 Context Slice Boundary and Proof Drift Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0372 |
| Title | C4 Context Slice Boundary and Proof Drift Hardening |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Enforce C4 context-slice output boundaries and prevent acceptance drift from surviving Done-level validation. | Fix byte-budget enforcement, block raw `.hadara/local` slice reads, repair T-0370 AC-6 drift, and add validation coverage so the same drift is caught before close. |

## Scope

| In Scope | Reason |
|---|---|
| Context slice byte budget enforcement. | C4 slices must be bounded by both line count and payload bytes before C5 consumes them. |
| Context slice local-state boundary. | `.hadara/local` is derived local/cache/private state, not canonical source text. |
| Acceptance drift hardening. | Done/closed tasks must not keep `ACCEPTANCE.md` rows marked `In Progress`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| C6 graph/cache performance implementation. | This task only fixes C4 slice safety and proof drift; measured ext4/mounted C6 baselines are split into the next capsule. |
| New local-cache raw-slice override flag. | No current need for `--allow-local-cache`; default deny is safer. |
| Broad historical capsule cleanup. | Only T-0370's reported drift is repaired. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | `task create` |
| 2026-06-19 | In Progress | Started C4 slice boundary and proof drift hardening. | User request and required-reading review. |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
