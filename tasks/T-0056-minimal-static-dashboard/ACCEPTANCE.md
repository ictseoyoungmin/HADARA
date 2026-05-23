# Acceptance Criteria

- [x] `docs/design/dashboard/index.html` exists.
- [x] Dashboard loads `docs/design/fixtures/hadara.ops.status.sample.json` or an inline fallback.
- [x] Dashboard renders health, task counts, validation, handoff, MCP guard, and issues.
- [x] Fixture declares that it is static sample data, not live data.
- [x] No backend, live CLI execution, MCP connection, file write, React/Vite, or build step is added.
- [x] Static smoke tests cover fixture shape and dashboard boundaries.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
