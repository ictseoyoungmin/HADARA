# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/task/task-close.ts | Modify | Add source/report hash split, execute nextActions polish, append result metadata, and audit-close report builder. | Done |
| src/cli/task.ts | Modify | Route `task audit-close` and keep task close execute behavior. | Done |
| src/cli/main.ts | Modify | Add audit-close help text. | Done |
| src/core/schema.ts | Modify | Register audit-close schema. | Done |
| src/schemas/task-close.schema.json | Modify | Document additive close hash/source/append result fields. | Done |
| src/schemas/task-audit-close.schema.json | Add | Fixture-level schema for read-only close audit reports. | Done |
| src/schemas/schema-index.json | Modify | Register `hadara.task.audit_close.v1`. | Done |
| tests/unit/task-close.test.ts | Modify | Cover source hash, execute nextActions, append result paths, audit success, and drift warning. | Done |
| tests/unit/schema-fixtures.test.ts | Modify | Include audit-close schema in registry expectations. | Done |
| docs/SCHEMAS.md | Modify | Document audit-close schema and close schema polish. | Done |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Modify | Record T-0170 as close UX/audit semantic polish. | Done |
| docs/TASK_BOARD.md | Modify | Mark T-0170 Done. | Done |
| docs/PROJECT_STATE.md | Modify | Record latest completed T-0170 state. | Done |
| docs/DEVELOPMENT_SLICES.md | Modify | Add T-0170 slice completion. | Done |
| docs/AGENT_HANDOFF.md | Modify | Carry forward current state and validation evidence. | Done |
