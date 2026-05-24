# Risks

| Risk | Mitigation |
|---|---|
| Malformed `evidence.jsonl` could break future dashboard/MCP readers. | Treat parse failures as warning issues and continue returning valid records. |
| Private evidence could expose sensitive artifact contents. | Return metadata only from existing index records; do not read private artifact files. |
| Drifted evidence index records could carry extra sensitive fields or stale private paths. | Normalize every parsed record before output, strip unknown fields, strip private `evidencePath`, and redact summaries defensively. |
| Drifted evidence index records could reference a different task id. | Drop mismatched records and return `EVIDENCE_RECORD_TASK_MISMATCH` warnings. |
| CLI and MCP behavior could drift. | Route both through the shared read model and add MCP/CLI tests. |
| Evidence list could grow without bounds. | Support a conservative `limit` option with a default. |
