# Risks

| Risk | Mitigation |
|---|---|
| Upgrade/registration commands overwrite user-edited docs. | Keep dry-run as default and execute only missing-file/table-row writes. |
| Optional integration enable looks like a default init behavior. | Keep it behind explicit `init enable-integration --integration ... --execute`. |
| Lazy store change breaks audit expectations. | Keep init scaffold writes project-bound and validate no local portable store is created by init. |
| Doctor/migration guard becomes destructive. | Implement as read-only report only. |
