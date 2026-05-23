# Risks

| Risk | Mitigation |
|---|---|
| Stricter validation may reveal older manual evidence drift. | Migrate known recent timestamp-only records and keep regression tests explicit. |
| Manual evidence records may diverge again. | Document that manual records must follow `EvidenceIndexRecord` and validator rules. |
