# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Existing historical evidence remains v1. | Consumers could drift if they assume one persisted version. | Medium | Readers/lint/harness/semantic consumers accept mixed v1/v2 records; no mass migration was attempted. | Mitigated for core read paths. |
| Release/package-specific evidence helpers still have legacy/custom writer paths. | Future release readiness work may need explicit v2 compatibility review outside the canonical writer. | Medium | Documented as the next compatibility capsule; full release-focused tests still passed. | Deferred. |
| `EVIDENCE.md` does not expose persisted v2 ids. | Operators cannot see durable ids in the human table without reading JSONL. | Medium | Keep Markdown stable in this MVP; plan any table/frame rewrite as a separate dry-run-first capsule. | Deferred. |
| v2 ids are durable after persistence, not deterministic rewrite ids. | Rewriting a record could create a different id unless migration preserves it. | Low | Persist ids at write time and preserve them through read models; migration remains hash-guarded future work. | Accepted. |
| Private evidence path leakage through v2 artifact fields. | Public committed records could expose machine-local paths. | Low | Writer/list sanitization keeps private artifacts out of public `artifacts`; tests cover private v2 behavior. | Mitigated. |
