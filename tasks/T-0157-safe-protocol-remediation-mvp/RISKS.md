# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Remediation writes more than intended. | High | Medium | Restrict `--fix` to four allowlisted operations with exact paths and no deletes. | Mitigated |
| Dry-run accidentally mutates files. | High | Low | Unit-test dry-run no-write behavior for each fix. | Mitigated |
| Markdown insertion damages existing prose. | Medium | Medium | Insert table frames additively after title/metadata and preserve existing content. | Mitigated |
