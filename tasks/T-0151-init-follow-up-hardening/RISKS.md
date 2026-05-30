# Risks

| Risk | Mitigation |
|---|---|
| `upgrade` is mistaken for arbitrary full-document migration. | Report summary says it creates missing docs and updates known generated profile metadata only. |
| `enable-integration` is mistaken for runtime enablement. | Reports and generated integration docs say it registers guidance only. |
| User-supplied Required Reading values break SOP Markdown tables. | Reject `|` and newline table-cell values with `INIT_INVALID_TABLE_CELL`. |
| Unsafe register-doc paths escape the project or corrupt table rows. | Reject absolute, parent-segment, newline, or table-delimiter paths with `INIT_INVALID_REGISTER_DOC_PATH`. |
| Integration enable partially writes docs when one file commit fails. | Write temp files first, commit with rename, and roll back committed files on failure with `INIT_ATOMIC_WRITE_FAILED`. |
