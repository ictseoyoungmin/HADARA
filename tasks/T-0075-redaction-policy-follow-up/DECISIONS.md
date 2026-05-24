# Decisions

| Decision | Reason |
|---|---|
| Keep `containsSecret()` as an any-finding compatibility wrapper. | Existing evidence/audit callers and tests depend on the boolean scan behavior. |
| Add `hasBlockingRedactionFinding(report, minimumSeverity = 'high')` for public artifact policy. | Policy decisions should be able to ignore future lower-severity diagnostics without weakening high-risk blocking. |
| Document per-pattern count semantics instead of deduplicating spans now. | T-0075 is a small follow-up; span-level dedup can be a later slice if read-model consumers need it. |
| Use `hadara.active.run.read` and `hadara.active.run.resume` as future MCP tool names. | Existing MCP tool names use dot-separated noun/action segments, while schema versions already use snake_case. |
| Keep MCP `hadara.context.export` as memory-mode in planning docs. | Future MCP context export must not imply writing `.hadara/context/HADARA_CONTEXT.md`. |

Record task-local design decisions here.
