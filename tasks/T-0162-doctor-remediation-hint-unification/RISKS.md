# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Users may confuse hints with automatic writes. | Could imply doctor mutates files. | Medium | Hints use dry-run commands and `executeRequires: --execute`; doctor code remains read-only. | Mitigated |
| New hint fields could surprise strict consumers. | External agents may not know `suggestedFix`. | Low | Schema is fixture-level with `additionalProperties: true`; remediations array remains stable. | Mitigated |
| Ambiguous issue-to-fix mapping. | Wrong remediation command could be suggested. | Medium | Only existing allowlisted fixes with clear task/profile/path context receive hints. | Mitigated |
