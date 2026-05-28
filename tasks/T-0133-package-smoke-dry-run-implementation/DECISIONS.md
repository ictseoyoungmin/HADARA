# Decisions

- Implement package smoke as a shared service report builder plus focused CLI handler, following the `install plan` pattern.
- Treat `hadara package smoke` as dry-run by default in T-0133; no execution mode is enabled.
- Keep all execution markers false in dry-run output, including feature-smoke execution, because T-0133 previews an installed-command smoke that does not yet run.
- Redact absolute source/workspace paths in public JSON and include only reduced artifact metadata.
