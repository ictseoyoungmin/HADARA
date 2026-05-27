# Risks

| Risk | Mitigation |
|---|---|
| Async loading could make existing injected-stream CLI tests nondeterministic. | Keep async loading enabled only for the real interactive CLI path when no test input is injected; cover async pulse behavior in terminal unit tests. |
| Overview document summaries could tempt renderer-side file reads. | Keep file access in `createTaskReadReport()` and pass document text through the internal TUI read model. |
| Markdown table rendering could exceed terminal width with wide characters. | Reuse visible-width helpers and keep focused Markdown/snapshot width regressions. |
