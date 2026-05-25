# Risks

| Risk | Mitigation |
|---|---|
| Audit JSONL consumers may rely on existing snake_case fields. | Preserve existing fields and add structured event data alongside them. |
| Structured events could leak secrets through summaries or payloads. | Normalize through existing redaction before writing JSONL. |
| Scope could drift into dashboard or provider logging. | Keep this slice to core event/audit helpers and schema tests only. |
