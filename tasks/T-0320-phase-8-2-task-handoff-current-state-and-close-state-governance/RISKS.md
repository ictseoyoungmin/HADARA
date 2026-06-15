# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| New handoff validation breaks legacy fixtures that use `Status | Done`. | Existing tests and historical capsules could fail unnecessarily. | Medium | Preserve exact legacy TaskStatus compatibility and only reject stale mixed phrases or invalid explicit CloseState values. | Mitigated: legacy `Status | Done` fixtures still pass focused and full Docker validation. |
| PLAN `In Progress` detection is too broad. | Valid in-progress subnotes could block closure. | Low | Limit detection to Markdown plan table rows whose Status column is exactly `In Progress`. | Mitigated: regression covers exact Status-column detection; no full-suite fallout remained. |
| New CloseState row is mistaken for audit proof. | Operators may think scaffold `not-closed` is authoritative proof. | Low | Keep docs/policy clear that CloseState is derived from close/audit; scaffold starts as `not-closed` only. | Mitigated: validator checks token shape only; close proof remains evidence/audit-owned. |
