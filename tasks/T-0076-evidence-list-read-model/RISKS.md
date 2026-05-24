# Risks

| Risk | Mitigation |
|---|---|
| Malformed `evidence.jsonl` could break future dashboard/MCP readers. | Treat parse failures as warning issues and continue returning valid records. |
| Private evidence could expose sensitive artifact contents. | Return metadata only from existing index records; do not read private artifact files. |
| CLI and MCP behavior could drift. | Route both through the shared read model and add MCP/CLI tests. |
| Evidence list could grow without bounds. | Support a conservative `limit` option with a default. |
