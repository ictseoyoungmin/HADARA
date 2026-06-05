# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/task/task-complete-flow.ts | Add | Build read-only completion-flow reports over existing lifecycle read models. | Done |
| src/cli/task.ts | Update | Route `hadara task complete` and command-specific execute rejection. | Done |
| src/cli/main.ts | Update | Add help text for `task complete`. | Done |
| src/schemas/task-complete-flow.schema.json | Add | Register the complete-flow JSON schema fixture. | Done |
| src/schemas/schema-index.json | Update | Include `hadara.task.complete_flow.v1`. | Done |
| src/core/schema.ts | Update | Load the new schema in runtime validation helpers. | Done |
| tests/unit/task-complete-flow.test.ts | Add | Cover read-only behavior, stage selection, shared-doc guidance, execute rejection, complete state, and CLI routing. | Done |
| tests/unit/schema-fixtures.test.ts | Update | Keep expected schema index IDs aligned. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Update | Document read-only workflow compression semantics and no execute mode. | Done |
| docs/CLI_JSON_CONTRACT.md | Update | Document `hadara.task.complete_flow.v1` command contract. | Done |
| docs/SCHEMAS.md | Update | Document the new schema fixture. | Done |
| docs/DEVELOPMENT_SLICES.md | Update | Mark T-0255 slice complete with validation evidence. | Done |
| docs/PROJECT_STATE.md | Update | Advance current project state through T-0255. | Done |
| docs/AGENT_HANDOFF.md | Update | Advance handoff to T-0256. | Done |
| tasks/T-0255-task-complete-flow-dry-run/* | Update | Record capsule scope, acceptance, tests, risks, decisions, evidence, and handoff. | Done |
