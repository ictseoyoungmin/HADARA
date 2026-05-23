# Decisions

| Decision | Rationale |
|---|---|
| Use `writeAuditEvent` for MCP evidence attach attempts. | It already writes private JSONL audit records and redacts payloads. |
| Treat report-level `ok: false` as a failed write attempt. | Boundary, redaction, and missing-task failures should be visible in operations audit. |
