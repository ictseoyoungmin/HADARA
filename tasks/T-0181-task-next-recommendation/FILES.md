# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/task/task-next.ts | Added | Build read-only next-task recommendation report and text formatter. | Done |
| src/cli/task.ts | Updated | Add `task next` route. | Done |
| src/cli/main.ts | Updated | Add help entry. | Done |
| src/schemas/task-next.schema.json | Added | Register `hadara.task.next.v1` fixture. | Done |
| src/schemas/schema-index.json | Updated | Include task next schema. | Done |
| src/core/schema.ts | Updated | Register runtime schema loader entry. | Done |
| tests/unit/task-next.test.ts | Added | Cover slice priority, missing capsule createCommand, Task Board fallback, and CLI JSON. | Done |
| tests/unit/schema-fixtures.test.ts | Updated | Expect task next schema id. | Done |
| docs/CLI_JSON_CONTRACT.md | Updated | Document read-only task next semantics. | Done |
| docs/SCHEMAS.md | Updated | Document `hadara.task.next.v1`. | Done |
| docs/PROJECT_STATE.md | Updated | Record T-0181 completion and next task state. | Done |
| docs/AGENT_HANDOFF.md | Updated | Carry forward latest task and validation baseline. | Done |
| docs/DEVELOPMENT_SLICES.md | Updated | Mark T-0181 done and T-0182 next. | Done |
