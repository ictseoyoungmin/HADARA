# Decisions

Record task-local design decisions here.

- Added a lightweight runtime schema validator in `src/core/schema.ts` instead of introducing a new dependency. The current fixtures use a small JSON Schema subset, and dependency-free validation keeps the bootstrap surface compact.
- Kept `schema-index.json` statuses as `fixture`; T-0092 uses the fixtures at runtime for active-run reports only and does not turn the registry into a broad release gate.
- Validated active-run projection/resume at the shared service boundary so CLI, MCP, and Operations Status consumers share the same checked read models.
