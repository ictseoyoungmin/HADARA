# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara.dashboard.core.v1` shape is documented with projection freshness/completeness metadata. | Done | `src/schemas/dashboard-core.schema.json`; `docs/DASHBOARD_READ_MODEL_CONTRACT.md`. |
| AC-2 | Existing `/api/dashboard/bootstrap` compatibility posture is documented as additive/transition-safe. | Done | `docs/DASHBOARD_READ_MODEL_CONTRACT.md`. |
| AC-3 | Validation covers schema fixture or contract expectations. | Done | Focused schema tests and full Docker validation passed. |
| AC-4 | No projection store, route implementation, frontend migration, shell/provider/MCP writes, or browser storage is added. | Done | Files list limited to schema/docs/tests/runtime schema loader. |
| AC-5 | Evidence is attached and handoff points to T-0217. | Done | `evidence.jsonl`; `docs/AGENT_HANDOFF.md`; `HANDOFF.md`. |
