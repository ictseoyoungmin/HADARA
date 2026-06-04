# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Report guidance is too prose-heavy for consumers. | Dashboard/TUI/workbench consumers may still need to infer close semantics. | Medium | Added concise structured `lifecycle` and `auditVerdict` fields with enum-like values. | Mitigated |
| Additive fields accidentally imply new close preconditions. | Operators could treat audit as a prerequisite to append close evidence. | Medium | Dry-run/execute/audit phases are explicit; existing `ok` behavior is unchanged. | Mitigated |
| Write boundary expands during hardening. | Close/audit commands could mutate broad docs unintentionally. | Low | Implementation adds report metadata only; execute still calls the existing close evidence append path. | Mitigated |
