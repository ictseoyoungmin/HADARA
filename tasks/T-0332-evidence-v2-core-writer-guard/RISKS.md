# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| CLI-only validation can be bypassed by future direct writer callers. | Split-brain evidence could still enter canonical JSONL. | Medium | Validate at `appendEvidenceRecord()` before artifact, Markdown, or JSONL writes. | Mitigated |
| Duplicate validator logic can drift between CLI and writer. | CLI and internal services could disagree on accepted records. | Medium | Export one writer-level validator and call it from CLI. | Mitigated |
| Changing writer errors could break JSON collect reports. | Existing JSON consumers might see uncaught errors. | Low | Catch `EvidenceResultOutcomeMismatchError` in collect report creation. | Mitigated |
