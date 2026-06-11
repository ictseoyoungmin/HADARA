# T-0295 Phase 7.5 Docs Cleanup Operations

## Metadata

| Field | Value |
|---|---|
| ID | T-0295 |
| Title | Phase 7.5 Docs Cleanup Operations |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Implement Phase 7.5 docs cleanup operations. | Add dry-run/execute registry status marking, dry-run archive planning, effective required-reading reports, docs doctor cleanup warnings, schemas, and focused tests. |

## Scope

| In Scope | Reason |
|---|---|
| `docs mark` | Registry-only document status transition planning and hash-guarded execute. |
| `docs archive` dry-run | Candidate planning without moving/deleting files. |
| `docs required-reading` | Effective default required reading excluding historical/superseded/archived docs. |
| Docs doctor cleanup additions | Detect stale required reading and missing superseded targets. |
| Schemas/tests | New JSON contracts must be registered and validated. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Delete or move documents | Phase 7.5 must preserve files by default. |
| Rewrite target document bodies | Status lives in registry. |
| Auto-prune Required Reading | Separate managed patch command is required for edits. |
| Supersede canonical docs without review flag | Canonical status needs explicit review. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-11 | Implementation in progress. | Scope prepared from Phase 7.5 spec. | `TASK.md`, `PLAN.md` |
| 2026-06-11 | Done | Docs cleanup operations, schemas, tests, built CLI smoke, and standard wrapper validation completed. | `EVIDENCE.md` |
<!-- hadara:managed:end task-status-history -->
