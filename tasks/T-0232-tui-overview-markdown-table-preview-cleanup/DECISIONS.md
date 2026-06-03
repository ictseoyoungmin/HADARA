# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep full Markdown table rendering unchanged and change preview extraction only. | Accepted | Detail viewer should preserve table structure; the issue is concise Overview preview text. | `src/tui/markdown.ts` tests |
| D-2 | Summarize table preview rows by preferred semantic columns such as Summary, Goal, and Step. | Accepted | Overview cards need concise text and should not show header/delimiter rows. | `markdownPreview()` regression |
| D-3 | Reuse shared handoff section parsing for fast TUI status. | Accepted | Avoid reintroducing table parser drift between status/dashboard/TUI surfaces. | `src/tui/read-model.ts` |
