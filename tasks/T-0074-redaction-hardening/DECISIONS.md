# Decisions

| Decision | Reason |
|---|---|
| Keep `redactSecrets()` and `containsSecret()` as compatibility wrappers over the new report model. | Existing evidence and audit paths already depend on these APIs. |
| Store redaction metadata in code rather than adding schema files or CLI commands in this slice. | The backlog requested the smallest useful registry/report hardening before broader schema and security CLI work. |
| Treat any default finding as a public artifact rejection signal. | Public Task Capsule artifacts are committed project state, so high-risk token families should stay out of public evidence. |
