# T-0359 C2 Code Index Budget Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0359 |
| Title | C2 Code Index Budget Hardening |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Harden C2 code index budget/degraded behavior before C3. | Add explicit file/byte/single-file budgets so code indexing cannot silently scan or read beyond the spec limits. |

## Scope

| In Scope | Reason |
|---|---|
| Code index budget metadata and enforcement. | Required by the C2 development plan and C6 performance/degraded-mode spec before context packs depend on code-aware graph output. |
| Focused tests and docs updates for budget behavior. | Proves the hardening is deterministic and visible to consumers. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Persistent cache read/write implementation. | This capsule only adds budget hardening; source manifest/cache invalidation remains C6 scope. |
| Dedicated `hadara code` public commands. | C2 chose additive `context graph --include-code`; dedicated code commands remain deferred. |
| Multi-language semantic parsing. | C2 first implementation is TypeScript/JavaScript-focused and deterministic. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | task create |
| 2026-06-18 | In Progress | Started C2 budget hardening implementation. | Active session |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
