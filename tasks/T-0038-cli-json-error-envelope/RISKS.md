# Risks

| Risk | Mitigation |
|---|---|
| Exit code policy could drift. | Centralize mapping and add focused tests. |
| Command-specific success envelopes could change. | Only touch catch-path error handling. |
