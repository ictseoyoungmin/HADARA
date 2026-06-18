# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep Task Board and Task Capsule extractors source-specific but graph-builder independent. | Accepted | C1 plan separates source extraction from graph report/task context assembly; this keeps validation narrow. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| D-2 | Emit duplicate `task:T-XXXX` node ids from separate extractors for now. | Accepted | Both sources describe the same canonical task entity; merge precedence should be an explicit graph builder decision rather than hidden in extractors. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| D-3 | Use line-aware local Task Board parsing for source refs. | Accepted | The shared Markdown row helper does not retain source line numbers, and C1 requires source-addressed output. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
