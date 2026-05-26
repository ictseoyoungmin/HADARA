# Risks

| Risk | Mitigation |
|---|---|
| Done-level validation becomes too broad by validating all historical rows. | Check only the Task Capsule being validated in this slice. |
| Existing completed fixture tests fail because Task Board status remains Draft. | Update done-level fixture setup to mark Task Board rows Done. |
| Markdown parsing becomes brittle. | Parse only standard Task Board data rows that start with `| T-#### |`. |
