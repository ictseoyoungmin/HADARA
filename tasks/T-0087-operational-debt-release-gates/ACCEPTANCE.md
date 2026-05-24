# Acceptance Criteria

- [x] `hadara debt list --json` returns `hadara.operational_debt.v1`.
- [x] `hadara debt show <id> --json` returns one debt record or a structured not-found issue.
- [x] MCP exposes read-only `hadara.debt.list` and `hadara.debt.show` with JSON text payloads.
- [x] `hadara ops status --json` includes operational debt aggregate counts.
- [x] A read-only release-gate report warns on open high-severity operational debt without release execution.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
