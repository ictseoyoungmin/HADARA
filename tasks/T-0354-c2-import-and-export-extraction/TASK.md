# T-0354 C2 Import and Export Extraction

## Metadata

| Field | Value |
|---|---|
| ID | T-0354 |
| Title | C2 Import and Export Extraction |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add deterministic import/export extraction to the C2 code index. | Populate file-level `imports`/`exports`, resolve relative imports where possible, emit `IMPORTS` edges for resolved project files, and warn instead of failing on unresolved relative imports. |

## Scope

| In Scope | Reason |
|---|---|
| Import specifier extraction for supported TS/JS patterns | Implements the next C2 worker-plan capsule over T-0353 discovery. |
| Relative import resolution with warnings for unresolved relative imports | Matches C2 spec degradation semantics. |
| Exported name extraction for basic function/class/interface/type/const and export-list patterns | Populates file-level export names before separate symbol node extraction. |
| Code index report edge/summary updates for resolved import relations | Makes extraction visible without graph integration. |
| Focused tests for imports, exports, resolved edges, and unresolved warnings | Keeps the slice verifiable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| CodeSymbolNode extraction | Next C2 capsule. |
| Command implementation/test hints | Later C2 capsule after symbol extraction. |
| Test relation edges | Later C2 capsule after imports and command hints exist. |
| Context graph integration or `--include-code` CLI surface | Final C2 integration step. |
| Cache persistence or source mutation | Context routing remains read-only and non-authoritative. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18T10:53:33.808Z | Done | Added C2 import/export extraction, relative resolution, resolved import edges, unresolved warnings, and validation. | ev:T-0354:9093ae17f3c64a54b46b319c |
<!-- hadara:managed:end task-status-history -->
