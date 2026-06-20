# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-lifecycle.ts` | Added | Read-only lifecycle phase/check/repair/next-action report builder. | Done |
| `src/schemas/task-lifecycle.schema.json` | Added | Fixture schema for `hadara.task.lifecycle.v1`. | Done |
| `src/core/schema.ts` | Updated | Register lifecycle schema fixture. | Done |
| `src/schemas/schema-index.json` | Updated | Add lifecycle schema to schema index. | Done |
| `src/cli/task.ts` | Updated | Add `hadara task lifecycle --task T --json` route. | Done |
| `src/services/capability-registry.ts` | Updated | Register `task.lifecycle` command metadata. | Done |
| `docs/SCHEMAS.md` | Updated | Document lifecycle schema. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Document lifecycle JSON contract. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Updated | Document workflow placement and command semantics. | Done |
| `docs/COMMAND_SURFACE.md` | Updated | List lifecycle command surface. | Done |
| `tests/unit/task-lifecycle.test.ts` | Added | Service/CLI/schema/read-only coverage for the new command. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Add explicit lifecycle schema id expectation. | Done |
| `tasks/T-0393-task-lifecycle-read-model/*` | Updated | Capsule docs/evidence/handoff for closure. | Done |
