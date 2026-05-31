# T-0182 Schema Stability Classification

## Metadata

| Field | Value |
|---|---|
| ID | T-0182 |
| Title | Schema Stability Classification |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Document schema field stability classes. | Clarify stable, additive, compatibility alias, deprecated, and experimental field guidance before more dashboard/TUI/MCP consumers depend on schemas. |

## Scope

| In Scope | Reason |
|---|---|
| Schema field stability documentation. | Consumers need guidance beyond fixture-level `additionalProperties`. |
| Task workbench compatibility alias annotation. | `state.closed` should be clearly marked as legacy-compatible while `state.closedValid` and `state.closeState` are preferred. |
| Regression test for docs/schema alignment. | Prevents the classification table and schema annotation from drifting silently. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Converting schemas into strict release gates. | This capsule documents classification only. |
| Refactoring every schema fixture. | Classification starts with the active workbench consumer hotspot. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task Capsule created. |
| 2026-05-31 | Done | Schema field classes documented and workbench compatibility alias annotated. | T-0182 evidence records. |
