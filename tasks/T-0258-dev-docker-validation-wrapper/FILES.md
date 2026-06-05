# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/dev/docker-check.ts | Added | Implement Docker temp-copy validation report service with focused/full modes, explicit dist sync, privacy metadata, and evidence summary. | Done |
| src/cli/dev.ts | Added | Route `hadara dev docker-check` JSON/text output. | Done |
| src/cli/main.ts | Updated | Add help and lazy dispatch for `dev` commands. | Done |
| src/schemas/dev-docker-check.schema.json | Added | Register `hadara.dev.docker_check.v1` fixture. | Done |
| src/core/schema.ts | Updated | Load the new schema fixture. | Done |
| src/schemas/schema-index.json | Updated | Add registry metadata for the new schema. | Done |
| tests/unit/dev-docker-check.test.ts | Added | Cover focused sync, full default, failure privacy, and schema validation with a fake runner. | Done |
| tests/unit/schema-fixtures.test.ts | Updated | Include the new schema id. | Done |
| docs/CLI_JSON_CONTRACT.md | Updated | Document command JSON semantics. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Updated | Document wrapper semantics and non-overlap rules. | Done |
| docs/SCHEMAS.md | Updated | Document schema fixture. | Done |
| docs/TEST_STRATEGY.md | Updated | Add wrapper guidance for Docker validation. | Done |
| docs/IMPLEMENTATION_SOP.md | Updated | Add wrapper guidance in reusable Docker workflow. | Done |
| docs/DEVELOPMENT_SLICES.md | Updated | Mark T-0258 complete. | Done |
| docs/PROJECT_STATE.md | Updated | Advance project state through T-0258. | Done |
| docs/AGENT_HANDOFF.md | Updated | Record T-0258 latest and T-0259 next. | Done |
