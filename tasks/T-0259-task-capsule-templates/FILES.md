# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/task/task-templates.ts | Added | Define supported template ids, expected evidence, out-of-scope boundaries, and file defaults. | Done |
| src/task/task-create.ts | Added | Build schema-valid task create reports and unknown-template failures. | Done |
| src/task/task-capsule.ts | Updated | Apply template file defaults during capsule creation. | Done |
| src/cli/task.ts | Updated | Route `task create --from/--title --json` through the report builder. | Done |
| src/cli/main.ts | Updated | Document template-aware task create usage. | Done |
| src/schemas/task-create.schema.json | Added | Register `hadara.task.create.v1`. | Done |
| src/core/schema.ts | Updated | Load the new schema fixture. | Done |
| src/schemas/schema-index.json | Updated | Add registry metadata. | Done |
| tests/unit/task-create.test.ts | Added | Cover release/lifecycle templates, unknown-template refusal, CLI JSON route, and schema validation. | Done |
| tests/unit/task-json.test.ts | Updated | Cover title extraction with `--from` and `--title`. | Done |
| tests/unit/schema-fixtures.test.ts | Updated | Include the new schema id. | Done |
| docs/CLI_JSON_CONTRACT.md | Updated | Document task-create JSON and template semantics. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Updated | Document template non-overlap rules. | Done |
| docs/SCHEMAS.md | Updated | Document schema fixture. | Done |
| docs/DEVELOPMENT_SLICES.md | Updated | Mark T-0259 complete. | Done |
| docs/PROJECT_STATE.md | Updated | Advance project state through T-0259. | Done |
| docs/AGENT_HANDOFF.md | Updated | Record T-0259 latest and T-0260 next. | Done |
