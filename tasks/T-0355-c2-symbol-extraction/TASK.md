# T-0355 C2 Symbol Extraction

## Metadata

| Field | Value |
|---|---|
| ID | T-0355 |
| Title | C2 Symbol Extraction |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add exported symbol nodes and symbol relation edges to the C2 code index. | Convert exported declarations/list entries into `CodeSymbolNode` records and add source-addressed `DEFINES_SYMBOL`/`EXPORTS` edges without adding command/test/graph/CLI integration yet. |

## Scope

| In Scope | Reason |
|---|---|
| Exported declaration symbol extraction | Implements the next C2 worker-plan capsule after import/export extraction. |
| `CodeSymbolNode` generation with kind, path, exported, and line metadata | Fills the `symbols` array in `hadara.codeIndex.v1`. |
| `DEFINES_SYMBOL` and `EXPORTS` code index edges | Makes symbol relationships explicit inside the code index. |
| Focused tests for symbol nodes and schema-valid reports | Keeps the slice verifiable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Non-exported/local symbol indexing | Not required by the initial C2 spec. |
| Command implementation/test hints | Next C2 capsule. |
| Test relation edges | Later C2 capsule. |
| Context graph integration or public CLI | Final C2 integration step. |
| Parser-backed deep semantic analysis | Explicit C2 non-goal for first implementation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18T11:04:40.685Z | Done | Exported symbol extraction, symbol nodes, and symbol relation edges are implemented and validated. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
<!-- hadara:managed:end task-status-history -->
