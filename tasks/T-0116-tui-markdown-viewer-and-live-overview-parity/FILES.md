# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/markdown.ts` | Modify | Port mockup Markdown rendering semantics for tables/headings/lists. |
| `src/tui/read-model.ts` | Modify | Keep Overview latest-two task document summaries inside the internal TUI read model. |
| `src/tui/snapshot.ts` | Modify | Render Overview summaries and Detail documents from the updated internal model. |
| `src/tui/terminal.ts` | Modify | Add mockup-style asynchronous loading pulse support. |
| `src/tui/read-model-worker.ts` | Add | Load production TUI read models off the terminal thread when built worker files are available. |
| `src/cli/tui.ts` | Modify | Enable async loading for the real interactive CLI path while preserving injected test determinism. |
| `tests/unit/tui-markdown.test.ts` | Modify | Cover mockup-style table and Markdown viewer output. |
| `tests/unit/tui-read-model.test.ts` | Modify | Cover latest-two Overview read-model behavior. |
| `tests/unit/tui-snapshot.test.ts` | Modify | Cover rendered Overview/Detail parity. |
| `tests/unit/tui-terminal.test.ts` | Modify | Cover asynchronous loading pulse behavior. |
