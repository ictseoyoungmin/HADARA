# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Suggested actions imply unsafe execution. | Agents may run write commands blindly. | Medium | Keep actions descriptive, preserve `required`, `priority`, and dry-run/execute pairing. | Mitigated |
| Action mappings drift from issue codes. | Workbench guidance becomes less useful. | Medium | Unit tests cover current Phase 3 mappings. | Mitigated |
| Action schema churn. | Future consumers may need adjustments. | Medium | Schema registration remains a follow-up after this shape lands. | Accepted |
