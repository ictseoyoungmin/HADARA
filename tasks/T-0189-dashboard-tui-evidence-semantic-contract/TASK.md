# T-0189 Dashboard/TUI Evidence Semantic Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0189 |
| Title | Dashboard/TUI Evidence Semantic Contract |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Dashboard/TUI evidence semantic contract | Define the read-only selected-task evidence semantic contract so Dashboard and TUI consumers use shared semantic read models instead of parsing raw evidence meaning. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard selected-task semantic guidance | Future Dashboard panels need proof badges without raw evidence parsing. |
| Workbench/TUI semantic consumer contract | TUI and selected-task consumers need stable proof status derivation and additive field posture. |
| Contract docs regression test | Prevent accidental removal of proof status and no-raw-parsing guidance. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Dashboard UI rendering | This slice is contract-only. |
| TUI rendering changes | This slice is contract-only. |
| New API route or MCP tool | Read-only surface expansion is a separate implementation slice. |
| Evidence v2 writer/migration | Planned for T-0190. |
| Release strict gate enforcement | Planned for T-0191. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-01 | In Progress | Defining Dashboard/TUI evidence semantic contract after protocol/harness gates. | docs/DEVELOPMENT_SLICES.md |
| 2026-06-01 | Done | Dashboard/TUI evidence semantic contract documented and Docker validation passed. | T-0189 evidence records. |
