# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara.task.workbench.v1` schema fixture is registered. | Met | `src/schemas/task-workbench.schema.json`, schema index, runtime loader. |
| AC-2 | Workbench report validates against schema. | Met | `tests/unit/task-workbench.test.ts`. |
| AC-3 | Schema fixture index remains aligned. | Met | `tests/unit/schema-fixtures.test.ts`. |
| AC-4 | Optional undefined action fields are omitted before validation. | Met | `workbench-next-actions` service strips undefined optional fields. |
| AC-5 | Evidence is attached. | Met | `EVIDENCE.md` and `evidence.jsonl` contain focused/full/smoke command-log evidence. |
| AC-6 | Handoff is updated. | Met | Task and project handoffs updated. |
