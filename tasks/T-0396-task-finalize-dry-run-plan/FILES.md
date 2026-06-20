# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-finalize.ts` | Added | Read-only finalize plan report builder and formatter. | Done |
| `src/cli/task.ts` | Updated | Added `hadara task finalize` CLI routing and execute-refusal path. | Done |
| `src/schemas/task-finalize.schema.json` | Added | Schema fixture for `hadara.task.finalize.v1`. | Done |
| `src/core/schema.ts` | Updated | Registered the finalize schema. | Done |
| `src/schemas/schema-index.json` | Updated | Published the schema id/path in the schema index. | Done |
| `src/services/capability-registry.ts` | Updated | Added command registry metadata for `task.finalize`. | Done |
| `tests/unit/task-finalize.test.ts` | Added | Covered dry-run planning, execute refusal, schema validity, and CLI behavior. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Added finalize schema fixture expectation. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Updated | Documented finalize as a read-only lifecycle convenience report. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Added JSON contract notes for `hadara.task.finalize.v1`. | Done |
| `docs/COMMAND_SURFACE.md` | Updated | Added command surface entry. | Done |
| `docs/SCHEMAS.md` | Updated | Added schema documentation entry. | Done |
| `tasks/T-0396-task-finalize-dry-run-plan/` | Added/updated | Capsule plan, evidence, acceptance, and handoff. | Done |
