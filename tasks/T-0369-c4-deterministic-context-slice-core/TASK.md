# T-0369 C4 Deterministic Context Slice Core

## Metadata

| Field | Value |
|---|---|
| ID | T-0369 |
| Title | C4 Deterministic Context Slice Core |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add the C4 deterministic context slice core read surface. | Implement safe source-addressed original-text slicing for explicit range, tail, keyword window, and managed-section strategies without broad discovery or file mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Context slice contract/schema | Add `hadara.contextSlice.v1` runtime/schema types for original text slices. |
| Safe file reader | Enforce project-root containment, ignored local/dependency boundaries, binary rejection, source hashing, and line/byte budgets. |
| Core strategies | Implement explicit range, tail window, keyword window with overlap merge, and managed-section slicing. |
| Public CLI | Add read-only `hadara context slice` options for the implemented strategies and command registry metadata. |
| Tests and docs | Add unit/CLI coverage and update state docs before close. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Symbol slicing | Requires additional C2 symbol body/range lookup and belongs to a follow-up C4 capsule. |
| Context pack candidate slicing | Requires candidate id lookup from C3 output and belongs to a follow-up integration capsule. |
| Persistent slice cache | Slices read exact source text and are not cached by default. |
| Summarization or proof claims | C4 returns original text only and does not establish correctness/proof by itself. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-19 | In Progress | Scoped C4 core slice implementation after C6.5 hot-path completion. | TASK/PLAN/CONTEXT/ACCEPTANCE/FILES updates |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
