# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep full Markdown table rendering visually compatible while fixing parser correctness. | Accepted | Detail viewer should preserve table structure, but table cell splitting must respect inline code spans and escaped pipes. | `src/tui/markdown.ts` tests |
| D-2 | Summarize table preview rows by preferred semantic columns such as Summary, Goal, and Step. | Accepted | Overview cards need concise text and should not show header/delimiter rows. | `markdownPreview()` regression |
| D-3 | Reuse shared handoff section parsing for fast TUI status. | Accepted | Avoid reintroducing table parser drift between status/dashboard/TUI surfaces. | `src/tui/read-model.ts` |
| D-4 | Allow Markdown table columns to grow beyond the old fixed 28-character cap when terminal width permits. | Accepted | Detail panels should show more of long evidence cells on wide terminals while still clipping rows to the panel width. | Focused visible-width regression |
