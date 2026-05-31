# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Schema too strict for additive protocol report evolution. | Future report fields could fail contract tests unnecessarily. | Medium | Keep `additionalProperties: true` and require only stable contract fields. | Mitigated |
| Remediation action hash/existence fields are omitted on skipped actions. | A schema requiring them globally would reject valid skip reports. | Medium | Model hash/existence fields as optional action fields and test planned actions explicitly. | Mitigated |
| Contract work accidentally changes protocol behavior. | Could alter Phase 2 doctor/remediation semantics. | Low | Limit source changes to schema registration and tests; no report builder behavior edits. | Mitigated |
