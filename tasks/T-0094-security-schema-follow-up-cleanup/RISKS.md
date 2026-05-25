# Risks

| Risk | Mitigation |
|---|---|
| Blocking external private source paths surprises callers that relied on absolute paths. | Keep evidence collection itself successful, but skip raw copy/manifest unless the source resolves inside the project; document the policy. |
| Active-run developer/schema bugs are hidden as local-state corruption. | Use a separate `ACTIVE_RUN_REPORT_SCHEMA_INVALID` warning code for report assertion failures. |
| New schemas imply broad enforcement. | Keep fixtures registered as `fixture`; runtime enforcement remains narrow. |
