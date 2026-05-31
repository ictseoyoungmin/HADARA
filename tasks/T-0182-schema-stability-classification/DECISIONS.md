# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Start field classification with documentation metadata, not enforcement. | Accepted | Current schemas remain fixture-level and additive. | `docs/SCHEMAS.md`. |
| D-2 | Mark `state.closed` as compatibility alias for `state.closedValid`. | Accepted | T-0177 introduced clearer close-state fields while keeping old consumer compatibility. | `src/schemas/task-workbench.schema.json`. |
| D-3 | Treat `generatedAt` as experimental for workbench consumers. | Accepted | Useful display/debug field, but not an identity/order contract. | `docs/SCHEMAS.md`. |
