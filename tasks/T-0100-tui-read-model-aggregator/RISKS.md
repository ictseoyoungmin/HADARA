# Risks

| Risk | Mitigation |
|---|---|
| Aggregator becomes a new source of truth. | Compose existing read models and keep the TUI aggregate internal/presentation-oriented. |
| Aggregator accidentally writes through helper services. | Use read services plus write-preflight preview only and test filesystem state before/after aggregation. |
| Selecting a task from active-run state fails when the active task is stale. | Fall back to latest task when active-run points to a missing task and surface underlying active-run issues. |
| TUI aggregate schema is mistaken for a public contract. | Do not register a JSON schema in this capsule; document it as internal. |
