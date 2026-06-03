# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and inspect TUI snapshot/markdown preview code. | Done | PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, IMPLEMENTATION_SOP; `src/tui/snapshot.ts`, `src/tui/markdown.ts`, `src/tui/read-model.ts`. |
| 2 | Make Markdown preview table-aware. | Done | `parseMarkdown()` skips table header/separator rows and summarizes data cells. |
| 3 | Make Evidence/fast handoff preview table-aware. | Done | `evidenceFromMarkdown()` handles multi-column tables; fast TUI status uses shared handoff parser. |
| 4 | Add focused regression tests. | Done | `tui-markdown`, `tui-snapshot`, `tui-read-model`, `status-json` passed 34 tests. |
| 5 | Run full validation, built snapshot smoke, attach evidence, and close. | Done | Full validation, built snapshot smoke, ready, close, and audit-close passed. |
| 6 | Fix Detail Markdown table cells that contain inline-code pipes. | Done | `tableCells()` ignores code-span and escaped pipes; focused tests passed 35 tests. |
| 7 | Re-run full validation and built Detail smoke. | Done | Docker sync-build passed 91 files / 598 tests; built Detail TESTS.md snapshot showed no bogus pipe-created columns. |
