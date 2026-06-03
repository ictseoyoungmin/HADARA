# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/tui/markdown.ts` | Updated | Skip table headers in previews and summarize table data rows; support multi-column evidence tables; keep code-span/escaped pipes inside table cells and allocate wider cells when space allows. | Done |
| `src/tui/read-model.ts` | Updated | Use shared table-aware handoff parser in fast TUI status extraction. | Done |
| `tests/unit/tui-markdown.test.ts` | Updated | Cover table data-row previews, evidence table fallback, and inline-code pipe cells. | Done |
| `tests/unit/tui-snapshot.test.ts` | Updated | Cover Overview cards not showing Markdown table headers. | Done |
| `tasks/T-0232-tui-overview-markdown-table-preview-cleanup/*` | Updated | Record scope, validation, risks, evidence, and handoff. | Done |
| `docs/TASK_BOARD.md`, `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/AGENT_HANDOFF.md` | Updated | Reflect T-0232 lifecycle and TUI preview/detail table cleanup. | Done |
