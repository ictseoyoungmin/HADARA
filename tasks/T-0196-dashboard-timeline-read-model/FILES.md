# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-timeline.ts` | Add | Deterministic read-only timeline report builder. | Done |
| `src/cli/dashboard.ts` | Modify | Add `/api/timeline` route. | Done |
| `src/schemas/dashboard-timeline.schema.json` | Add | Register fixture-level timeline schema. | Done |
| `src/core/schema.ts` | Modify | Load timeline schema. | Done |
| `src/schemas/schema-index.json` | Modify | Register timeline schema id. | Done |
| `docs/design/dashboard/index.html` | Modify | Bind Workstream to `/api/timeline` events. | Done |
| `tests/unit/dashboard-timeline.test.ts` | Add | Test report determinism, schema validity, read-only events, and safe metadata. | Done |
| `tests/unit/dashboard-static.test.ts` | Modify | Assert `/api/timeline` route and dashboard consumption. | Done |
| `tests/unit/schema-fixtures.test.ts` | Modify | Include timeline schema in schema index allowlist. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Update | Record timeline read model route/contract. | Done |
| `docs/PROJECT_STATE.md` | Update | Record timeline read model capability. | Done |
| `docs/AGENT_HANDOFF.md` | Update | Record latest task and validation baseline. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark T-0196 completion evidence. | Done |
| `docs/TASK_BOARD.md` | Update | Finish command should update the T-0196 row. | Done |
