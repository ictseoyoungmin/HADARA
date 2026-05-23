# Risks

| Risk | Mitigation |
|---|---|
| Dashboard treats incomplete state as fully healthy. | Emit warning issues while preserving `ok: true` for readable degraded snapshots. |
| Dynamic task status keys make UI rendering unstable. | Keep stable aggregate count keys and expose raw counts separately. |
| Phase parsing remains too project-specific. | Prefer explicit `Phase:` and simple current-phase lines before compatibility mapping. |
| MCP status is mistaken for live process state. | Document it as configured snapshot state only. |
