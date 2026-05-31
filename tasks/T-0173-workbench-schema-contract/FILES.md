# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/schemas/task-workbench.schema.json` | Add | Fixture-level workbench report schema. | Done |
| `src/schemas/schema-index.json` | Update | Register `hadara.task.workbench.v1`. | Done |
| `src/core/schema.ts` | Update | Load workbench schema through runtime validation helper. | Done |
| `tests/unit/schema-fixtures.test.ts` | Update | Expect the new schema fixture. | Done |
| `tests/unit/task-workbench.test.ts` | Update | Validate generated workbench report against schema. | Done |
| `src/services/workbench-next-actions.ts` | Update | Omit undefined optional action fields for raw-object validation. | Done |
| `docs/SCHEMAS.md` | Update | Document workbench schema fixture. | Done |
| `tasks/T-0173-workbench-schema-contract/*` | Update | Maintain capsule records, evidence, and handoff. | Done |
