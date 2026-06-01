# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| UI invents proof semantics independent of shared analyzer. | Dashboard could disagree with evidence lint/harness. | Medium | Use evidence lint `summary.semantics` and `TASK_DONE_*` issue codes only. | Mitigated |
| Private-only proof appears as a blocker. | Operator may misread auditability warning as task failure. | Medium | Priority and UI text render private-only as auditability warning. | Mitigated |
| Legacy generated ids are treated as durable. | UI state could break after evidence reorder/migration. | Medium | Do not persist selected evidence id; display durability caveat. | Mitigated |
