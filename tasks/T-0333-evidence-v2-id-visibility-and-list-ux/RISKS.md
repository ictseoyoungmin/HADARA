# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Additive evidence list fields could break strict equality tests or read consumers. | Medium | Medium | Updated schema/tests and task-read/MCP/TUI adjacency; full Docker sync-build passed. | Mitigated |
| `EVIDENCE.md` or rebuild scope creep could exceed T-0333. | Medium | Low | No rebuild command added; no broad evidence migration; `EVIDENCE.md` was only appended by evidence writer. | Mitigated |
| Evidence append commands were accidentally started in parallel for one evidence batch. | Low | Low | All appends returned `ok:true`; a corrective serialized evidence record resolved/superseded the affected records; evidence lint returned 0 issues. | Mitigated |
