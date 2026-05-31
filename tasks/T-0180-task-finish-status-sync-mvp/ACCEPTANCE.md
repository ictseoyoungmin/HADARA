# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task finish --task <id> --json` returns a dry-run `hadara.task.finish.v1` report. | Done | `tests/unit/task-finish.test.ts`; built CLI dry-run smoke evidence. |
| AC-2 | `--execute` only updates `TASK.md` status and the matching `docs/TASK_BOARD.md` row status/path. | Done | `tests/unit/task-finish.test.ts`. |
| AC-3 | Broader docs and evidence writes are advisory-only. | Done | `docs/CLI_JSON_CONTRACT.md`; task finish report advisories. |
| AC-4 | Duplicate Task Board rows block execute instead of guessing. | Done | `tests/unit/task-finish.test.ts`. |
| AC-5 | Schema registry/runtime validation covers the new report. | Done | `src/schemas/task-finish.schema.json`; `tests/unit/schema-fixtures.test.ts`. |
| AC-6 | Evidence is attached and handoff is updated. | Done | T-0180 evidence records and HANDOFF.md. |
