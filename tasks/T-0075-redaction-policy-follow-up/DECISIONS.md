# Decisions

| Decision | Reason |
|---|---|
| Keep `containsSecret()` as an any-finding compatibility wrapper. | Existing evidence/audit callers and tests depend on the boolean scan behavior. |
| Add `hasBlockingRedactionFinding(report, minimumSeverity = 'high')` for public artifact policy. | Policy decisions should be able to ignore future lower-severity diagnostics without weakening high-risk blocking. |
| Attach the internal `RedactionReport` to `EvidenceArtifactPolicyError` for blocking secret findings. | Operators and future diagnostics need to know which detector blocked an artifact without re-scanning. |
| Keep user-facing evidence collect issues limited to stable code/message for now. | Raw reports can include sensitive context in future detectors; safe exposure should be a deliberate reduced summary shape. |
| Treat non-blocking findings as diagnostics only. | HADARA evidence keeps a block-or-copy integrity model; automatic artifact rewriting would need a future sanitizing mode. |
| Document per-pattern count semantics instead of deduplicating spans now. | T-0075 is a small follow-up; span-level dedup can be a later slice if read-model consumers need it. |
| Use `hadara.active.run.read` and `hadara.active.run.resume` as future MCP tool names. | Existing MCP tool names use dot-separated noun/action segments, while schema versions already use snake_case. |
| Keep MCP `hadara.context.export` as memory-mode in planning docs. | Future MCP context export must not imply writing `.hadara/context/HADARA_CONTEXT.md`. |

Record task-local design decisions here.
