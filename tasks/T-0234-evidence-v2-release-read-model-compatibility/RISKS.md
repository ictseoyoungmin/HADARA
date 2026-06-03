# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Canonical writer artifact directory option could be misused outside release helpers. | Public artifacts might be placed in unexpected directories. | Low | Option is internal and sanitized with `safeFilePart`; existing default kind-based directory remains unchanged. | Mitigated. |
| Release reader accepts malformed v2 records too loosely. | Strict gate could consider incomplete evidence. | Low | Reader requires v2 id/fingerprint, legacy kind/result, valid visibility, linked artifact existence/schema/source checks, and release proof semantics. | Mitigated. |
| Historical evidence remains v1. | Migration still needed for durable ids on old records. | High | v1 remains supported; migration preview remains next capsule. | Accepted. |
| `EVIDENCE.md` still does not show v2 ids. | Human table remains less useful for exact persisted-id references. | Medium | Keep Markdown frame work deferred until migration/read compatibility is stable. | Deferred. |
