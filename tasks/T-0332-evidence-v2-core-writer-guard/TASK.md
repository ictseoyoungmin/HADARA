# T-0332 Evidence v2 Core Writer Guard

## Metadata

| Field | Value |
|---|---|
| ID | T-0332 |
| Title | Evidence v2 Core Writer Guard |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Add a core evidence writer fail-closed guard for result/outcome compatibility. | T-0331 guarded the CLI path; this task makes the writer itself reject split-brain result/outcome records before artifact, Markdown, or JSONL writes. |

## Scope

| In Scope | Reason |
|---|---|
| Core `appendEvidenceWithResult()` / collect writer mismatch guard. | Future internal services, MCP/tool paths, or direct writer callers must not bypass CLI-only validation. |
| Reuse one validator between CLI and writer. | Keep the public CLI behavior and the core writer final defense consistent. |
| Focused regression tests and Work Item B review. | Prove direct writer calls fail and assess remaining B-spec gaps. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad evidence migration or Markdown rebuild implementation. | Work Item B lists rebuild as a future candidate; this task is a bounded hardening follow-up. |
| New MCP evidence attach behavior. | The task only hardens the existing writer API used by current/future callers. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | `task create` |
| 2026-06-17 | In Progress | Started core writer guard follow-up after T-0331 review feedback. | User review request |
| 2026-06-17 | Done | Core writer result/outcome guard, CLI reuse, collect report error handling, regression tests, focused/full validation, dist refresh, and built CLI smoke are complete. | T-0332 validation evidence |
<!-- hadara:managed:end task-status-history -->
