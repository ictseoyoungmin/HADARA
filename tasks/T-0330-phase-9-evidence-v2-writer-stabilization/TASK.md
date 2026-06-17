# T-0330 Phase 9 Evidence v2 Writer Stabilization

## Metadata

| Field | Value |
|---|---|
| ID | T-0330 |
| Title | Phase 9 Evidence v2 Writer Stabilization |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Stabilize Evidence v2 writer semantics for new command evidence. | Add explicit v2 category/outcome and resolution marker inputs while preserving append-only evidence and mixed v1/v2 compatibility. |

## Scope

| In Scope | Reason |
|---|---|
| `evidence add-command` category/outcome metadata. | Operators need to write durable v2 evidence without relying only on summary heuristics. |
| Explicit `resolves:` and `supersedes:` marker inputs. | Failed-evidence resolution should prefer exact durable evidence ids over prose inference. |
| Evidence semantic resolution precedence. | Same-category fallback should remain legacy compatibility behavior, not preferred v2 behavior. |
| Focused tests and docs updates. | External agents need stable command and JSON expectations. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad historical evidence migration. | Existing migration remains operator-selected one task at a time. |
| Automatic `EVIDENCE.md` rebuild or frame rewrite. | Markdown remains a human summary view in this slice. |
| MCP write expansion or shell-executing evidence capture. | Evidence attach/from-command boundaries are separate work. |
| Release gate behavior changes. | This slice stabilizes writer semantics only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | task create |
| 2026-06-17 | In Progress | Started Phase 9 Evidence v2 writer stabilization. | Required reading and T-0330 scope review. |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
