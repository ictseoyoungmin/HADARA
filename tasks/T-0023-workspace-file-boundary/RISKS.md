# Risks

| Risk | Mitigation |
|---|---|
| Existing workflows may rely on absolute project-internal paths. | Allow absolute paths when their realpath remains inside the project root. |
| Missing files may be reported differently. | Preserve existing not-found issue codes where commands already had them. |
| Symlink handling may differ by platform. | Use Node `realpathSync.native` and keep tests conditional on symlink support only through normal temp dirs. |
