# Risks

| Risk | Mitigation |
|---|---|
| Audit logs accidentally become committed evidence. | Use the existing portable audit directory under `.hadara/local/portable/data/audit` by default. |
| Audit payload leaks artifact content or secrets. | Log metadata only and use the existing audit redaction writer. |
| Failed writes go untracked. | Wrap evidence attach so both success and command-report failure paths are audited. |
