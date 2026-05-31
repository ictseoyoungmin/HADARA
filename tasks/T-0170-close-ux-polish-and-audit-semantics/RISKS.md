# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Hash naming confusion | Consumers may interpret diagnostic report hashes as raw file-state hashes. | Medium | Add `validatedBeforeCloseEvidenceReportHash`, `validatedBeforeCloseEvidenceSourceHash`, and keep deprecated alias for compatibility. | Mitigated |
| Immediate post-close drift | Including evidence files in source hash would drift as soon as close evidence is appended. | Medium | Source hash covers close-relevant task/docs files but excludes `EVIDENCE.md` and `evidence.jsonl`. | Mitigated |
| Audit becomes write-like | Audit could accidentally re-close or append evidence. | Low | `task audit-close` only builds a report from current files and close records. | Mitigated |
| Additive schema churn | New fields could break strict consumers if treated as required release gates. | Low | Schemas remain fixture-level/additive and retain old hash alias. | Mitigated |
