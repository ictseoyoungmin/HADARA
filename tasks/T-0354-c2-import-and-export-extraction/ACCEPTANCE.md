# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Supported TS/JS import patterns are extracted from code index files. | Done | Focused code-index tests; `ev:T-0354:9093ae17f3c64a54b46b319c`. |
| AC-2 | Relative imports resolve to project-relative indexed file paths where possible. | Done | Focused tests cover `.ts`, `.js`, and re-export resolution. |
| AC-3 | Unresolved relative imports add warning issues without failing the report. | Done | Focused tests and built internal smoke with 58 warnings but `ok:true`. |
| AC-4 | Basic exported names are extracted into `CodeFileNode.exports`. | Done | Focused tests cover function, async function, class, interface, type, const, and export-list aliases. |
| AC-5 | Resolved relative imports emit `IMPORTS` edges with explainable source metadata. | Done | Focused tests assert edge source path/line/extractor metadata. |
| AC-6 | No symbol nodes, command hints, test relation edges, graph integration, public CLI, cache writes, or source mutation are added. | Done | `symbols` remain empty and no command registry/CLI changes were made. |
| AC-7 | Focused/full Docker validation evidence is attached and shared docs point to the next C2 symbol extraction capsule. | Done | `ev:T-0354:9093ae17f3c64a54b46b319c`; shared docs updated before close. |
