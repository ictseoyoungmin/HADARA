# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-close-repair-plan.ts` | Added | Read-only repair classification report and text formatter. | Done |
| `src/cli/task.ts` | Updated | Added `task close-repair-plan` CLI route. | Done |
| `src/schemas/task-close-repair-plan.schema.json` | Added | JSON schema fixture for `hadara.task.closeRepairPlan.v1`. | Done |
| `src/core/schema.ts` | Updated | Registered the new schema fixture at runtime. | Done |
| `src/schemas/schema-index.json` | Updated | Added schema index metadata. | Done |
| `src/services/capability-registry.ts` | Updated | Registered command capability metadata. | Done |
| `tests/unit/task-close-repair-plan.test.ts` | Added | Covers repair classifications and CLI JSON smoke. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Includes the new schema id in fixture validation. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Updated | Documents lifecycle loop placement and command semantics. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Documents the new CLI JSON report. | Done |
| `docs/COMMAND_SURFACE.md` | Updated | Adds the command to lifecycle discovery docs. | Done |
| `docs/SCHEMAS.md` | Updated | Records schema layer status and new schema id. | Done |
| `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` | Updated | Shared state/handoff updates before close. | Done |
